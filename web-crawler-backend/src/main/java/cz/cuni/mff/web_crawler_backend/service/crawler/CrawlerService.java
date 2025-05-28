package cz.cuni.mff.web_crawler_backend.service.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import cz.cuni.mff.web_crawler_backend.service.api.CrawlService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class CrawlerService {

    private final CrawlResultRepository crawlResultRepository;
    private final CrawlLinkRepository crawlLinkRepository;
    private final ExecutionRepository executionRepository;
    private final WebsiteRecordRepository websiteRecordRepository;
    private final CrawlService crawlService;
    private final ExecutorService executorService;
    private final Map<Long, AtomicBoolean> stopFlags = new ConcurrentHashMap<>();

    private final int MAX_CONCURRENT_REQUESTS = 16;

    @Autowired
    public CrawlerService(CrawlResultRepository crawlResultRepository,
                          CrawlLinkRepository crawlLinkRepository,
                          ExecutionRepository executionRepository,
                          WebsiteRecordRepository websiteRecordRepository,
                          CrawlService crawlService) {
        this.crawlResultRepository = crawlResultRepository;
        this.crawlLinkRepository = crawlLinkRepository;
        this.executionRepository = executionRepository;
        this.websiteRecordRepository = websiteRecordRepository;
        this.crawlService = crawlService;
        this.executorService = Executors.newFixedThreadPool(MAX_CONCURRENT_REQUESTS);
    }

    /**
     * Stop execution of a crawler by setting stop flag to true
     *
     * @param websiteRecordId ID of website record whose execution that should be stopped
     */
    public void stopExecution(Long websiteRecordId) {
        stopFlags.computeIfAbsent(websiteRecordId, id -> new AtomicBoolean(false)).set(true);
    }

    /**
     * Go through page and find all links. Save them. And go through them. Rinse and repeat
     *
     * @param websiteRecordId ID of website record which is used to invoke the execution
     */
    public void startNewExecution(Long websiteRecordId) {
        WebsiteRecord websiteRecord =
                websiteRecordRepository.findById(websiteRecordId).orElseThrow(() -> new NotFoundException("Website record"));
        // Create new execution
        Execution execution = new Execution(websiteRecord);
        executionRepository.save(execution);

        // Initialize stop flag for this execution
        stopFlags.put(websiteRecordId, new AtomicBoolean(false));

        // Create and add first website to crawl queue
        List<CrawlResult> queue = new ArrayList<>();
        CrawlResult root = new CrawlResult(websiteRecord.getUrl(), "TO BE SEARCHED", execution.getId());
        queue.addLast(root);

        // Delete old crawl results and links
        if (websiteRecord.getCrawledData() != null) {
            websiteRecordRepository.updateCrawledData(null, websiteRecord.getId());
            crawlService.deleteAllCrawlDataByExecutionId(websiteRecord.getCrawledData().getExecutionId());
        }


        // Save this new crawl data and update wr record
        crawlResultRepository.save(root);
        websiteRecordRepository.updateCrawledData(root, websiteRecord.getId());

        // Start crawling
        executionRepository.updateStatusAndTime("STARTED", null, execution.getId());
        try {
            goThroughCrawlQueue(queue, websiteRecord.getBoundaryRegExp(), execution);
            executionRepository.updateStatusAndTime("FINISHED", ZonedDateTime.now(), execution.getId());
        } catch (Exception e) {
            executionRepository.updateStatusAndTime("FAILED", ZonedDateTime.now(), execution.getId());
        }
        if (stopFlags.getOrDefault(execution.getWebsite().getId(), new AtomicBoolean(false)).get()) {
            stopFlags.remove(websiteRecordId);
            executionRepository.updateStatusAndTime("STOPPED", ZonedDateTime.now(), execution.getId());
        }

    }

    /**
     * Goes through queue of queued crawl requests and controls resolving situations
     *
     * @param queue     Queue of pages that have to be crawled
     * @param regexp    Regular expression by which page links are matched
     * @param execution Execution object that has invoked this crawling
     */
    private void goThroughCrawlQueue(List<CrawlResult> queue, String regexp, Execution execution) {
        Pattern pattern = Pattern.compile(regexp);
        ConcurrentLinkedQueue<CrawlResult> concurrentQueue = new ConcurrentLinkedQueue<>(queue);
        AtomicInteger activeTasks = new AtomicInteger(concurrentQueue.size());
        List<Future<?>> futures = new ArrayList<>();

        while (!concurrentQueue.isEmpty() || activeTasks.get() > 0) {
            if (stopFlags.getOrDefault(execution.getWebsite().getId(), new AtomicBoolean(false)).get()) {
                return;
            }

            CrawlResult crawlResult = concurrentQueue.poll();
            if (crawlResult == null) {
                if (activeTasks.get() > 0) {
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Crawling interrupted", e);
                    }
                    continue;
                }
                break;
            }

            Future<?> future = executorService.submit(() -> {
                try {
                    processCrawlResult(crawlResult, pattern, execution, concurrentQueue, activeTasks);
                } finally {
                    activeTasks.decrementAndGet();
                }
            });
            futures.add(future);
        }

        try {
            for (Future<?> future : futures) {
                future.get();
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Crawling interrupted", e);
        }
    }

    private void processCrawlResult(CrawlResult crawlResult, Pattern pattern, Execution execution,
                                    ConcurrentLinkedQueue<CrawlResult> queue, AtomicInteger activeTasks) {
        LocalDateTime startTime = LocalDateTime.now();
        crawlResult.setExecutionId(execution.getId());

        try {
            readDataFromPage(queue, execution, crawlResult, pattern, activeTasks);
            executionRepository.updateCrawledCount(execution.getId());
        } catch (IOException | IllegalArgumentException e) {
            crawlResult.setTitle("INACCESSIBLE");
            crawlResult.setState("INACCESSIBLE");
        }

        LocalDateTime endTime = LocalDateTime.now();
        Long duration = ChronoUnit.MILLIS.between(startTime, endTime);
        String durationString = String.format("%02d:%02d:%02d.%03d",
                duration / 3_600_000,
                (duration % 3_600_000) / 60_000,
                (duration % 60_000) / 1_000,
                duration % 1_000);

        crawlResult.setCrawlTime(durationString);
        crawlResultRepository.save(crawlResult);
    }

    private void readDataFromPage(ConcurrentLinkedQueue<CrawlResult> queue, Execution execution,
                                  CrawlResult crawlResult, Pattern pattern, AtomicInteger activeTasks) throws IOException {
        Document doc = Jsoup.connect(crawlResult.getUrl()).get();
        String title = doc.title();

        if (title.length() > 255) {
            crawlResult.setTitle(title.substring(0, 252) + "...");
        } else if (title.isEmpty()) {
            crawlResult.setTitle(crawlResult.getUrl());
        } else {
            crawlResult.setTitle(doc.title());
        }
        doc.select("a").forEach(resolveLink(queue, execution.getId(), pattern, crawlResult, activeTasks));
        crawlResult.setSearched();
    }

    private Consumer<Element> resolveLink(ConcurrentLinkedQueue<CrawlResult> queue, Long executionId,
                                          Pattern pattern, CrawlResult crawlResult, AtomicInteger activeTasks) {
        return a -> {
            String href = a.attr("abs:href");
            if (!href.startsWith("#")) {
                href = stripHref(href);
                Matcher matcher = pattern.matcher(href);

                if (href.length() > 255) {
                    CrawlResult son = new CrawlResult(href.substring(0, 252) + "...",
                            "URL TOO LONG", executionId);
                    crawlResultRepository.save(son);
                    crawlLinkRepository.save(new CrawlLink(crawlResult.getId(), son.getId(), executionId));
                    return;
                }

                if (!crawlResultRepository.existsByUrlAndExecutionId(href, executionId)) {
                    resolveNewNode(queue, executionId, crawlResult, href, matcher, activeTasks);
                } else {
                    resolveExistingNode(executionId, crawlResult, href);
                }
            }
        };
    }

    /**
     * Resolve behaviour when is found link to found page
     *
     * @param executionId ID of execution object that has invoked this crawling
     * @param crawlResult Object for saving data about crawl at current page
     * @param href        Address of a page found on current page
     */
    private void resolveExistingNode(Long executionId, CrawlResult crawlResult, String href) {
        CrawlResult target = crawlResultRepository.findByUrlAndExecutionId(href, executionId);
        if (!crawlLinkRepository.existsByFromAndTo(crawlResult.getId(), target.getId()) &&
                !Objects.equals(crawlResult.getId(), target.getId())) {
            crawlLinkRepository.save(new CrawlLink(crawlResult.getId(), target.getId(), executionId));
        }
    }

    /**
     * Resolve behaviour when is found link to page that is not stored in db yet.
     *
     * @param queue       Queue of all pages that have to be crawled
     * @param executionId ID of execution object that has invoked this crawling
     * @param crawlResult Object for saving data about crawl at current page
     * @param href        Address of a page found on current page
     * @param matcher     Object processing matching patterns to strings
     */
    private void resolveNewNode(ConcurrentLinkedQueue<CrawlResult> queue, Long executionId,
                                CrawlResult crawlResult, String href, Matcher matcher, AtomicInteger activeTasks) {
        CrawlResult son = new CrawlResult(href, "TO BE MATCHED", executionId);
        if (matcher.find()) {
            son.setState("TO BE SEARCHED");
            queue.add(son);
            activeTasks.incrementAndGet();
        } else {
            son.setState("NOT MATCHED");
            son.setTitle("NOT MATCHED");
        }

        crawlResultRepository.save(son);
        crawlLinkRepository.save(new CrawlLink(crawlResult.getId(), son.getId(), executionId));
    }

    /**
     * Get href and get rid of in page '#' tags and of query parameters behind `?`
     *
     * @param href Link to be stripped
     * @return Stripped link without target destination and path parameters
     */
    private static String stripHref(String href) {
        // Get rid of inner page pointer
        int targetIdx = href.indexOf("#");
        if (targetIdx != -1) {
            href = href.substring(0, targetIdx);
        }

        // Get rid of query parameters??
        int paramIdx = href.indexOf("?");
        if (paramIdx != -1) {
            href = href.substring(0, paramIdx);
        }
        return href;
    }
}
