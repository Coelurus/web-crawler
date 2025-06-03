package cz.cuni.mff.web_crawler_backend.controller.graphql;

import cz.cuni.mff.web_crawler_backend.controller.api.model.NodeDTO;
import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.mapper.NodeMapper;
import java.util.List;

import cz.cuni.mff.web_crawler_backend.service.api.CrawlService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebGraphQLController {

    private final WebsiteRecordRepository websiteRecordRepository;
    private final NodeMapper nodeMapper;
    private final CrawlService crawlService;

    public WebGraphQLController(WebsiteRecordRepository websiteRecordRepository,
            NodeMapper nodeMapper, CrawlService crawlService) {
        this.nodeMapper = nodeMapper;
        this.websiteRecordRepository = websiteRecordRepository;
        this.crawlService = crawlService;
    }

    @QueryMapping
    public List<WebsiteRecord> websites() {
        return websiteRecordRepository.findAll();
    }

    @QueryMapping
    public List<NodeDTO> nodes(@Argument List<Long> webPages) {
        List<WebsiteRecord> roots = websiteRecordRepository.findAllById(webPages);
        List<CrawlResult> results = roots.stream()
                .map(result -> crawlService.getCrawlResultsById(result.getExecutions().getLast().getId()))
                .flatMap(List::stream).toList();
        return results.stream().map(nodeMapper::mapToNodeDTO).toList();
    }
}
