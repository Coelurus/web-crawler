package cz.cuni.mff.web_crawler_backend.controller.api;

import cz.cuni.mff.web_crawler_backend.service.api.ExecutionService;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
public class ExecutionAPIController {

    private final ExecutionService executionService;

    @Autowired
    public ExecutionAPIController(ExecutionService executionService) {
        this.executionService = executionService;
    }


    /**
     * Returns all executions stored in database
     *
     * @param websiteId Optional parameter. When set method returns only executions whose website has this id
     * @return List of executions
     */
    @GetMapping(value = "/executions")
    public ResponseEntity<List<Execution>> getExecutions(@RequestParam(name = "websiteId", required = false) Long websiteId) {
        return executionService.getExecutions(websiteId);
    }

    /**
     * Get an execution by id
     *
     * @param id ID of execution to be found
     * @return Found execution
     * @throws NotFoundException when no execution has parameter id
     */
    @GetMapping(value = "/executions/{id}")
    public ResponseEntity<Execution> getExecution(@PathVariable Long id) {
        return executionService.getExecution(id);
    }

    /**
     * Manually trigger a new execution for a given website record
     *
     * @param wrId ID of website record to execute
     * @return new execution object
     * @throws NotFoundException when no website record has parameter id
     */
    @PostMapping(value = "/execute/{wr_id}")
    public ResponseEntity<Void> startExecution(@PathVariable(name = "wr_id") Long wrId) {
        return executionService.startExecution(wrId);
    }

    /**
     * Deactivate periodical executions for a given website record
     *
     * @param wrId ID of website record to stop executions on
     * @return new execution object
     * @throws NotFoundException when no website record has parameter id
     */
    @PostMapping(value = "/deactivate/{wr_id}")
    public ResponseEntity<Void> deactivateExecution(@PathVariable(name = "wr_id") Long wrId) {
        return executionService.deactivateExecution(wrId);
    }


}
