package cz.cuni.mff.web_crawler_backend.controller.api;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.service.api.CrawlService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CrawlAPIController {
    private final CrawlService crawlService;

    @Autowired
    public CrawlAPIController(CrawlService crawlService) {
        this.crawlService = crawlService;
    }

    /**
     * Get all pages found during crawling
     *
     * @return List of all pages
     */
    @GetMapping("/crawl/data")
    public ResponseEntity<List<CrawlResult>> getAllCrawlResults() {
        return ResponseEntity.ok(crawlService.getAllCrawlResults());
    }

    /**
     * Get all pages found during crawling under execution
     *
     * @param executionId
     *            ID of execution under which crawling happened
     * @return List of all pages under execution with given ID
     */
    @GetMapping("/crawl/data/{execution_id}")
    public ResponseEntity<List<CrawlResult>> getCrawlResultsById(
            @PathVariable(name = "execution_id") Long executionId) {
        return ResponseEntity.ok(crawlService.getCrawlResultsById(executionId));
    }

    /**
     * Get all links between pages found during crawling
     *
     * @return List of all links
     */
    @GetMapping("/crawl/link")
    public ResponseEntity<List<CrawlLink>> getAllCrawlLinks() {
        return ResponseEntity.ok(crawlService.getAllCrawlLinks());
    }

    /**
     * Get all links between pages found during crawling under execution
     *
     * @param executionId
     *            ID of execution under which crawling happened
     * @return List of all links under execution
     */
    @GetMapping("/crawl/link/{execution_id}")
    public ResponseEntity<List<CrawlLink>> getCrawlLinksById(@PathVariable(name = "execution_id") Long executionId) {
        return ResponseEntity.ok(crawlService.getCrawlLinksById(executionId));
    }
}
