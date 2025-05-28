package cz.cuni.mff.web_crawler_backend.mapper;

import cz.cuni.mff.web_crawler_backend.controller.api.model.NodeDTO;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NodeMapper {

    private final CrawlLinkRepository crawlLinkRepository;
    private final CrawlResultRepository crawlResultRepository;
    private final WebsiteRecordRepository websiteRecordRepository;
    private final ExecutionRepository executionRepository;

    public NodeMapper(CrawlLinkRepository crawlLinkRepository, CrawlResultRepository crawlResultRepository,
            WebsiteRecordRepository websiteRecordRepository, ExecutionRepository executionRepository) {
        this.crawlLinkRepository = crawlLinkRepository;
        this.crawlResultRepository = crawlResultRepository;
        this.websiteRecordRepository = websiteRecordRepository;
        this.executionRepository = executionRepository;
    }

    public NodeDTO mapToNodeDTO(CrawlResult result) {
        if (result == null) {
            return null;
        }
        List<CrawlLink> links = crawlLinkRepository.findByFrom(result.getId());
        List<CrawlResult> linkedResults = crawlResultRepository
                .findAllById(links.stream().map(CrawlLink::getTo).toList());

        Execution owner = executionRepository.findById(result.getExecutionId()).orElse(null);

        return new NodeDTO(result.getTitle(), result.getUrl(),
                result.getCrawlTime() == null ? null : result.getCrawlTime().toString(),
                linkedResults.stream().map(this::mapToNodeDTO).toList(), owner.getWebsite());
    }
}
