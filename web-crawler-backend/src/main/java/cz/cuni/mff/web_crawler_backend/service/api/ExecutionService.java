package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import cz.cuni.mff.web_crawler_backend.service.crawler.CrawlerService;
import cz.cuni.mff.web_crawler_backend.service.crawler.SchedulingConfig;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExecutionService {
    private final ExecutionRepository executionRepository;
    private final WebsiteRecordRepository websiteRecordRepository;
    private final SchedulingConfig schedulingConfig;
    private final CrawlerService crawlerService;

    @Autowired
    public ExecutionService(ExecutionRepository executionRepository, WebsiteRecordRepository websiteRecordRepository,
            SchedulingConfig schedulingConfig, CrawlerService crawlerService) {
        this.executionRepository = executionRepository;
        this.websiteRecordRepository = websiteRecordRepository;
        this.schedulingConfig = schedulingConfig;
        this.crawlerService = crawlerService;
    }

    /**
     * Returns all execution from database possibly filtered by ID of website record
     * that executed them
     *
     * @param websiteId
     *            Optional parameter defining with which websiteId should be
     *            execution returned
     * @return list of executions
     */
    public List<Execution> getExecutions(Long websiteId) {
        if (websiteId != null) {
            return executionRepository.findByWebsiteId(websiteId);
        }
        return executionRepository.findAll();
    }

    /**
     * Get an execution by id
     *
     * @param id
     *            ID of execution to be found
     * @return Found execution
     * @throws NotFoundException
     *             when no execution has parameter id
     */
    public Execution getExecution(Long id) {
        Execution ex = executionRepository.findById(id).orElse(null);
        if (ex == null) {
            throw new NotFoundException("Execution");
        }
        return ex;
    }

    /**
     * Trigger new execution for a given website record
     *
     * @param wrId
     *            ID of website record to execute
     * @throws NotFoundException
     *             when no website record has parameter id
     */
    public void startExecution(Long wrId) {
        WebsiteRecord wr = websiteRecordRepository.findById(wrId)
                .orElseThrow(() -> new NotFoundException("WebsiteRecord"));
        deactivateExecution(wrId);
        if (!schedulingConfig.isScheduled(wrId)) {
            websiteRecordRepository.setActivity(true, wrId);
            schedulingConfig.scheduleCrawlingTask(wr);
        }
    }

    /**
     * Deactivate running execution and future periodical executions for a given
     * website record if it is scheduled
     *
     * @param wrId
     *            ID of website record to stop executions on
     * @return ok status
     * @throws NotFoundException
     *             when no website record has parameter id
     */
    public void deactivateExecution(Long wrId) {
        schedulingConfig.cancelCrawlingTask(wrId);
        websiteRecordRepository.setActivity(false, wrId);
        crawlerService.stopExecution(wrId);
    }

    /**
     * Delete all executions from database that were executed from concrete website
     * record
     *
     * @param websiteId
     *            ID of website by which to delete all executions
     */
    public void deleteExecutionsByWebsiteId(Long websiteId) {
        executionRepository.deleteByWebsiteId(websiteId);
    }
}
