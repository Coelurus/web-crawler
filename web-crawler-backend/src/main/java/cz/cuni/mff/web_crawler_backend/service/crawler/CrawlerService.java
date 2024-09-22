package cz.cuni.mff.web_crawler_backend.service.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CrawlerService {

    private final CrawlResultRepository crawlResultRepository;
    private final CrawlLinkRepository crawlLinkRepository;

    @Autowired
    public CrawlerService(CrawlResultRepository crawlResultRepository,
                          CrawlLinkRepository crawlLinkRepository) {
        this.crawlResultRepository = crawlResultRepository;
        this.crawlLinkRepository = crawlLinkRepository;
    }

    public void crawl(List<CrawlResult> queue, String regexp, Long executionId) {
        while (!queue.isEmpty()) {
            CrawlResult crawlResult = queue.removeFirst();

            Pattern pattern = Pattern.compile(regexp);

            LocalDateTime startTime = LocalDateTime.now();
            crawlResult.setExecutionId(executionId);

            try {
                Document doc = Jsoup.connect(crawlResult.getUrl()).get();
                String title = doc.title();

                if (title.length() > 255) {
                    System.out.println("STOP");
                }

                if (title.isEmpty()) {
                    crawlResult.setTitle(crawlResult.getUrl());
                } else {
                    crawlResult.setTitle(doc.title());
                }
                doc.select("a").forEach(resolveLink(queue, executionId, pattern, crawlResult));
                crawlResult.setSearched();

            } catch (IOException e) {
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
            // Processing only absolute paths
            if (!href.startsWith("#")) {

                Matcher matcher = pattern.matcher(href);

                if (!crawlResultRepository.existsByUrlAndExecutionId(href, executionId)) {

                    CrawlResult son = new CrawlResult(href, "TO BE MATCHED", executionId);
                    if (matcher.find()) {
                        son.setState("TO BE SEARCHED");
                        queue.add(son);
                    } else {
                        son.setState("NOT MATCHED");
                        son.setTitle("NOT MATCHED");
                    }

                    crawlResultRepository.save(son);
                    crawlLinkRepository.save(new CrawlLink(crawlResult.getId(), son.getId()));
                } else {
                    CrawlResult target = crawlResultRepository.findByUrlAndExecutionId(href, executionId);
                    crawlLinkRepository.save(new CrawlLink(crawlResult.getId(), target.getId()));
                }
            }
        };
    }
}
