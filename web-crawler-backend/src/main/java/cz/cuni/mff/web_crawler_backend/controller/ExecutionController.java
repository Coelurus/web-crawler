package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class ExecutionController {

    ExecutionRepository executionRepository;
    WebsiteRecordRepository websiteRecordRepository;

    @Autowired
    public ExecutionController(ExecutionRepository executionRepository,
                               WebsiteRecordRepository websiteRecordRepository) {
        this.executionRepository = executionRepository;
        this.websiteRecordRepository = websiteRecordRepository;
    }

    @GetMapping(value = "/executions")
    List<Execution> getExecutions(){
        return executionRepository.findAll();
    }

    @GetMapping(value = "/executions/{id}")
    Execution getExecution(@PathVariable int id){
        return executionRepository.findById(id);
    }

    @PostMapping(value = "/execute/{wr_id}")
    Execution startExecution(@PathVariable int wr_id){
        Execution execution = new Execution(websiteRecordRepository.findById(wr_id));
        return executionRepository.save(execution);
    }


}
