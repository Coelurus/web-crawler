package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrawlService {
    private final CrawlLinkRepository linkRepository;
    private final CrawlResultRepository resultRepository;

    @Autowired
    public CrawlService(CrawlLinkRepository linkRepository, CrawlResultRepository resultRepository) {
        this.linkRepository = linkRepository;
        this.resultRepository = resultRepository;
    }

    public ResponseEntity<List<CrawlResult>> getAllCrawlResults() {
        List<CrawlResult> results = resultRepository.findAll();
        return ResponseEntity.ok(results);
    }

    public ResponseEntity<List<CrawlResult>> getCrawlResultsById(Long executionId) {
        List<CrawlResult> results = resultRepository.findByExecutionId(executionId);
        return ResponseEntity.ok(results);
    }

    public ResponseEntity<List<CrawlLink>> getAllCrawlLinks() {
        List<CrawlLink> links = linkRepository.findAll();
        return ResponseEntity.ok(links);
    }

    public ResponseEntity<List<CrawlLink>> getCrawlLinksById(Long executionId) {
        List<CrawlLink> links = linkRepository.findByExecutionId(executionId);
        return ResponseEntity.ok(links);
    }

    public void deleteAllCrawlDataByExecutionId(Long executionId) {
        linkRepository.deleteByExecutionId(executionId);
        resultRepository.deleteByExecutionId(executionId);
    }
}
