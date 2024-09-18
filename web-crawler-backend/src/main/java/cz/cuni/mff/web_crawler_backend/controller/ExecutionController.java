package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.crawler.SchedulingConfig;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
public class ExecutionController {

    ExecutionRepository executionRepository;
    WebsiteRecordRepository websiteRecordRepository;
    private SchedulingConfig schedulingConfig;

    @Autowired
    public ExecutionController(ExecutionRepository executionRepository,
                               WebsiteRecordRepository websiteRecordRepository,
                               SchedulingConfig schedulingConfig) {
        this.executionRepository = executionRepository;
        this.websiteRecordRepository = websiteRecordRepository;
        this.schedulingConfig = schedulingConfig;
    }


    /**
     * Returns all executions stored in database
     *
     * @param websiteId Optional parameter. When set method returns only executions whose website has this id
     * @return List of executions
     */
    @GetMapping(value = "/executions")
    ResponseEntity<List<Execution>> getExecutions(@RequestParam(name = "websiteId", required = false) Long websiteId) {
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
    @GetMapping(value = "/executions/{id}")
    ResponseEntity<Execution> getExecution(@PathVariable int id) {
        Execution ex = executionRepository.findById(id).orElse(null);
        if (ex == null) {
            throw new NotFoundException("NOT_FOUND", "Execution");
        }
        return ResponseEntity.ok(ex);
    }

    /**
     * Manually trigger a new execution for a given website record
     *
     * @param wr_id ID of website record to execute
     * @return new execution object
     * @throws NotFoundException when no website record has parameter id
     */
    @PostMapping(value = "/execute/{wr_id}")
    ResponseEntity<Execution> startExecution(@PathVariable int wr_id) {
        WebsiteRecord wr = websiteRecordRepository.findById(wr_id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("NOT_FOUND", "WebsiteRecord");
        }
        Execution ex = executionRepository.save(new Execution(wr));
        schedulingConfig.scheduleCrawlingTask(ex);
        return ResponseEntity.ok(ex);
    }


}
