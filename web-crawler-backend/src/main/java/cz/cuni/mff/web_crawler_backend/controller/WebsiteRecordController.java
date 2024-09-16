package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WebsiteRecordController {

    private WebsiteRecordRepository websiteRecordRepository;

    @Autowired
    public WebsiteRecordController(WebsiteRecordRepository websiteRecordRepository) {
        this.websiteRecordRepository = websiteRecordRepository;
    }

    @GetMapping(value = "/websites")
    List<WebsiteRecord> getRecords() {
        return websiteRecordRepository.findAll();
    }

    @PostMapping(value = "/websites")
    WebsiteRecord addRecord(@RequestBody WebsiteRecord record) {
        return websiteRecordRepository.save(record);
    }

    @GetMapping(value = "/websites/{id}")
    WebsiteRecord getRecord(@PathVariable int id) {
        return websiteRecordRepository.findById(id);
    }

    @PutMapping(value = "/websites/{id}")
    WebsiteRecord updateRecord(@PathVariable int id, @RequestBody WebsiteRecord record) {
        return websiteRecordRepository.findById(id).update(record);
    }

    @DeleteMapping(value = "/websites/{id}")
    void deleteRecord(@PathVariable int id) {
        websiteRecordRepository.delete(websiteRecordRepository.findById(id));
    }
}
