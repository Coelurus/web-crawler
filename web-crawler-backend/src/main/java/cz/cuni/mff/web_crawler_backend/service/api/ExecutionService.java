package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import cz.cuni.mff.web_crawler_backend.service.crawler.SchedulingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExecutionService {
    private final ExecutionRepository executionRepository;
    private final WebsiteRecordRepository websiteRecordRepository;
    private final SchedulingConfig schedulingConfig;

    @Autowired
    public ExecutionService(ExecutionRepository executionRepository,
                            WebsiteRecordRepository websiteRecordRepository,
                            SchedulingConfig schedulingConfig) {
        this.executionRepository = executionRepository;
        this.websiteRecordRepository = websiteRecordRepository;
        this.schedulingConfig = schedulingConfig;
    }

    /**
     * Returns all execution from database possibly filtered by ID of website record that executed them
     *
     * @param websiteId Optional parameter defining with which websiteId should be execution returned
     * @return list of executions
     */
    public ResponseEntity<List<Execution>> getExecutions(Long websiteId) {
        if (websiteId != null) {
            return ResponseEntity.ok(executionRepository.findByWebsiteId(websiteId));
        }
        return ResponseEntity.ok(executionRepository.findAll());
    }

    /**
     * Get an execution by id
     *
     * @param id ID of execution to be found
     * @return Found execution
     * @throws NotFoundException when no execution has parameter id
     */
    public ResponseEntity<Execution> getExecution(Long id) {
        Execution ex = executionRepository.findById(id).orElse(null);
        if (ex == null) {
            throw new NotFoundException("Execution");
        }
        return ResponseEntity.ok(ex);
    }

    /**
     * Trigger new execution for a given website record
     *
     * @param wrId ID of website record to execute
     * @return new execution object
     * @throws NotFoundException when no website record has parameter id
     */
    public ResponseEntity<Execution> startExecution(Long wrId) {
        WebsiteRecord wr = websiteRecordRepository.findById(wrId).orElse(null);
        if (wr == null) {
            throw new NotFoundException("WebsiteRecord");
        }
        Execution ex = executionRepository.save(new Execution(wr));
        schedulingConfig.scheduleCrawlingTask(ex);
        return ResponseEntity.ok(ex);
    }

    /**
     * Delete all executions from database that were executed from concrete website record
     *
     * @param websiteId ID of website by which to delete all executions
     */
    public void deleteExecutionsByWebsiteId(Long websiteId) {
        executionRepository.deleteByWebsiteId(websiteId);
    }

}
