package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrawlService {
    private final CrawlLinkRepository linkRepository;
    private final CrawlResultRepository resultRepository;

    @Autowired
    public CrawlService(CrawlLinkRepository linkRepository, CrawlResultRepository resultRepository) {
        this.linkRepository = linkRepository;
        this.resultRepository = resultRepository;
    }

    public List<CrawlResult> getAllCrawlResults() {
        return resultRepository.findAll();
    }

    public List<CrawlResult> getCrawlResultsById(Long executionId) {
        return resultRepository.findByExecutionId(executionId);
    }

    public List<CrawlLink> getAllCrawlLinks() {
        return linkRepository.findAll();
    }

    public List<CrawlLink> getCrawlLinksById(Long executionId) {
        return linkRepository.findByExecutionId(executionId);
    }

    public void deleteAllCrawlDataByExecutionId(Long executionId) {
        linkRepository.deleteByExecutionId(executionId);
        resultRepository.deleteByExecutionId(executionId);
    }
}
