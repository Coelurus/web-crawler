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
import cz.cuni.mff.web_crawler_backend.service.api.WebsiteRecordService;
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
import java.util.Objects;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CrawlerService {

    private final CrawlResultRepository crawlResultRepository;
    private final CrawlLinkRepository crawlLinkRepository;
    private final ExecutionRepository executionRepository;
    private final WebsiteRecordRepository websiteRecordRepository;
    private final CrawlService crawlService;

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

    }

    /**
     * Goes through queue of queued crawl requests and controls resolving situations
     *
     * @param queue     Queue of pages that have to be crawled
     * @param regexp    Regular expression by which page links are matched
     * @param execution Execution object that has invoked this crawling
     */
    private void goThroughCrawlQueue(List<CrawlResult> queue, String regexp, Execution execution) {
        while (!queue.isEmpty()) {
            CrawlResult crawlResult = queue.removeFirst();

            Pattern pattern = Pattern.compile(regexp);

            LocalDateTime startTime = LocalDateTime.now();
            crawlResult.setExecutionId(execution.getId());

            try {
                readDataFromPage(queue, execution, crawlResult, pattern);
                executionRepository.updateCrawledCount(execution.getId());
            } catch (IOException | IllegalArgumentException e) {
                crawlResult.setTitle("INACCESSIBLE");
                crawlResult.setState("INACCESSIBLE");
            }


            LocalDateTime endTime = LocalDateTime.now();
            Long duration = ChronoUnit.MICROS.between(startTime, endTime);
            crawlResult.setCrawlTime(duration);

            crawlResultRepository.save(crawlResult);
        }
    }

    /**
     * Load web page, parse it and collect important data
     *
     * @param queue       Queue of pages that have to be crawled
     * @param execution   Execution object that has invoked this crawling
     * @param crawlResult Information about progress of crawling this page
     * @param pattern     Pattern by which page links are matched
     * @throws IOException When page cannot be accessed
     */
    private void readDataFromPage(List<CrawlResult> queue, Execution execution, CrawlResult crawlResult, Pattern pattern) throws IOException {
        Document doc = Jsoup.connect(crawlResult.getUrl()).get();
        String title = doc.title();

        if (title.length() > 255) {
            crawlResult.setTitle(title.substring(0, 252) + "...");
        } else if (title.isEmpty()) {
            crawlResult.setTitle(crawlResult.getUrl());
        } else {
            crawlResult.setTitle(doc.title());
        }
        doc.select("a").forEach(resolveLink(queue, execution.getId(), pattern, crawlResult));
        crawlResult.setSearched();
    }

    /**
     * Take care of link from anchor tag found at current page
     *
     * @param queue       Queue of all pages that have to be crawled
     * @param executionId ID of execution under which this crawling is happening
     * @param pattern     Regexp pattern used to match link
     * @param crawlResult Object for saving data about crawl at current page
     * @return Consumer function for resolving links
     */
    private Consumer<Element> resolveLink(List<CrawlResult> queue, Long executionId,
                                          Pattern pattern, CrawlResult crawlResult) {
        return a -> {
            String href = a.attr("abs:href");
            // Skip anchors to another part of same page
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

                    resolveNewNode(queue, executionId, crawlResult, href, matcher);
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
    private void resolveNewNode(List<CrawlResult> queue, Long executionId, CrawlResult crawlResult, String href, Matcher matcher) {
        CrawlResult son = new CrawlResult(href, "TO BE MATCHED", executionId);
        if (matcher.find()) {
            son.setState("TO BE SEARCHED");
            queue.add(son);
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
