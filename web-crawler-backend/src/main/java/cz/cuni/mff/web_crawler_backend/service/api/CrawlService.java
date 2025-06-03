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

    /**
     * Get all nodes crawled by the system
     *
     * @return List of all crawled webpages
     */
    public List<CrawlResult> getAllCrawlResults() {
        return resultRepository.findAll();
    }

    /**
     * Get all nodes crawled by the system in one execution
     *
     * @param executionId
     *            ID of execution under which were nodes crawled
     * @return List of all nodes crawled by the system in one execution
     */
    public List<CrawlResult> getCrawlResultsById(Long executionId) {
        return resultRepository.findByExecutionId(executionId);
    }

    /**
     * Get all links between nodes crawled by the system
     *
     * @return List of all node links
     */
    public List<CrawlLink> getAllCrawlLinks() {
        return linkRepository.findAll();
    }

    /**
     * Get all links between nodes crawled by the system in one execution
     *
     * @param executionId
     *            ID of execution under which were links between nodes crawled
     * @return List of all node links crawled by the system in one execution
     */
    public List<CrawlLink> getCrawlLinksById(Long executionId) {
        return linkRepository.findByExecutionId(executionId);
    }

    /**
     * Delete all crawled data under one execution
     *
     * @param executionId
     *            ID of execution under which to delete all data
     */
    public void deleteAllCrawlDataByExecutionId(Long executionId) {
        linkRepository.deleteByExecutionId(executionId);
        resultRepository.deleteByExecutionId(executionId);
    }
}
