package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.service.api.CrawlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CrawlAPIController {
    private final CrawlService crawlService;

    @Autowired
    public CrawlAPIController(CrawlService crawlService) {
        this.crawlService = crawlService;
    }

    @GetMapping("/crawl/data")
    public ResponseEntity<List<CrawlResult>> getAllCrawlResults() {
        return crawlService.getAllCrawlResults();
    }


    @GetMapping("/crawl/data/{execution_id}")
    public ResponseEntity<List<CrawlResult>> getCrawlResultsById(@PathVariable(name = "execution_id") Long executionId) {
        return crawlService.getCrawlResultsById(executionId);
    }

    @GetMapping("/crawl/link")
    public ResponseEntity<List<CrawlLink>> getAllCrawlLinks() {
        return crawlService.getAllCrawlLinks();
    }


    @GetMapping("/crawl/link/{execution_id}")
    public ResponseEntity<List<CrawlLink>> getCrawlLinksById(@PathVariable(name = "execution_id") Long executionId) {
        return crawlService.getCrawlLinksById(executionId);
    }

}
