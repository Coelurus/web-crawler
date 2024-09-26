package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.service.api.WebsiteRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WebsiteRecordAPIController {

    private final WebsiteRecordService websiteRecordService;

    @Autowired
    public WebsiteRecordAPIController(WebsiteRecordService websiteRecordService) {
        this.websiteRecordService = websiteRecordService;
    }

    /**
     * Get all website records saved in database
     *
     * @return List of dictionaries where each is a website record
     */
    @GetMapping(value = "/websites")
    public ResponseEntity<List<WebsiteRecord>> getRecords() {
        return websiteRecordService.getRecords();
    }

    /**
     * Creates new Website record and returns it.
     *
     * @param label          Name of the record
     * @param url            Url where to start search
     * @param boundaryRegExp Regex to match url by.
     * @param periodicity    How often it should repeat
     * @param active         Is it active?
     * @param tags           User given tags
     * @return Response body with Website Record object
     */
    @PostMapping(value = "/websites")
    public ResponseEntity<WebsiteRecord> addRecord(@RequestParam String label,
                                                   @RequestParam String url,
                                                   @RequestParam String boundaryRegExp,
                                                   @RequestParam String periodicity,
                                                   @RequestParam Boolean active,
                                                   @RequestParam(required = false) List<String> tags) {
        return websiteRecordService.addRecord(label, url, boundaryRegExp, periodicity, active, tags);
    }

    /**
     * Return a website record by id
     *
     * @param id of website record to find
     * @return Website record found by id
     */
    @GetMapping(value = "/websites/{id}")
    public ResponseEntity<WebsiteRecord> getRecord(@PathVariable Long id) {
        return websiteRecordService.getRecord(id);
    }

    /**
     * Update a website record by ID
     *
     * @param id       Website record ID
     * @param wrRecord New website record to substitute the old one
     * @return Updated record
     */
    @PutMapping(value = "/websites/{id}")
    public ResponseEntity<WebsiteRecord> updateRecord(@PathVariable Long id, @RequestBody WebsiteRecord wrRecord) {
        return websiteRecordService.updateRecord(id, wrRecord);
    }

    /**
     * Remove a website record by ID and all associated executions
     *
     * @param id Website record ID.
     * @return Status 200
     */
    @DeleteMapping(value = "/websites/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        return websiteRecordService.deleteRecord(id);
    }
}
