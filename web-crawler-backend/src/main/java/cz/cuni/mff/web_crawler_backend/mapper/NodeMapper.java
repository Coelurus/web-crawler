package cz.cuni.mff.web_crawler_backend.mapper;

import cz.cuni.mff.web_crawler_backend.controller.api.model.NodeDTO;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlLink;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlLinkRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import java.util.List;

import cz.cuni.mff.web_crawler_backend.error.exception.InternalServerException;
import org.springframework.stereotype.Service;

@Service
public class NodeMapper {

    private final CrawlLinkRepository crawlLinkRepository;
    private final CrawlResultRepository crawlResultRepository;
    private final ExecutionRepository executionRepository;

    public NodeMapper(CrawlLinkRepository crawlLinkRepository, CrawlResultRepository crawlResultRepository,
            ExecutionRepository executionRepository) {
        this.crawlLinkRepository = crawlLinkRepository;
        this.crawlResultRepository = crawlResultRepository;
        this.executionRepository = executionRepository;
    }

    /**
     * Map CrawlResult to Node for GraphQl representation
     *
     * @param result
     *            CrawlResult to map
     * @return Mapped NodeDTO
     */
    public NodeDTO mapToNodeDTO(CrawlResult result) {
        if (result == null) {
            return null;
        }
        List<CrawlLink> links = crawlLinkRepository.findByFrom(result.getId());
        List<CrawlResult> linkedResults = crawlResultRepository
                .findAllById(links.stream().map(CrawlLink::getTo).toList());

        Execution owner = executionRepository.findById(result.getExecutionId()).orElseThrow(() -> new InternalServerException("GraphQL owner execution does not exist"));

        return new NodeDTO(result.getTitle(), result.getUrl(),
                result.getCrawlTime() == null ? null : result.getCrawlTime(),
                linkedResults.stream().map(CrawlResult::getUrl).toList(), owner.getWebsite());
    }
}
