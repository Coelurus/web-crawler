package cz.cuni.mff.web_crawler_backend.controller.api;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.service.api.WebsiteRecordService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(websiteRecordService.getRecords());
    }

    /**
     * Creates new Website record and returns it.
     *
     * @param label
     *            Name of the record
     * @param url
     *            Url where to start search
     * @param boundaryRegExp
     *            Regex to match url by.
     * @param periodicity
     *            How often it should repeat
     * @param active
     *            Is it active?
     * @param tags
     *            User given tags
     * @return Response body with Website Record object
     */
    @PostMapping(value = "/websites")
    public ResponseEntity<WebsiteRecord> addRecord(@RequestParam(name = "label") String label,
            @RequestParam(name = "url") String url, @RequestParam(name = "boundaryRegExp") String boundaryRegExp,
            @RequestParam(name = "periodicity") String periodicity, @RequestParam(name = "active") Boolean active,
            @RequestParam(name = "tags", required = false) String tags) {
        return ResponseEntity.ok(websiteRecordService.addRecord(label, url, boundaryRegExp, periodicity, active, tags));
    }

    /**
     * Return a website record by id
     *
     * @param id
     *            of website record to find
     * @return Website record found by id
     */
    @GetMapping(value = "/websites/{id}")
    public ResponseEntity<WebsiteRecord> getRecord(@PathVariable Long id) {
        return ResponseEntity.ok(websiteRecordService.getRecord(id));
    }

    /**
     * Update a website record by ID
     *
     * @param id
     *            Website record ID
     * @return Updated record
     */
    @PutMapping(value = "/websites/{id}")
    public ResponseEntity<WebsiteRecord> updateRecord(@PathVariable Long id, @RequestParam(name = "label") String label,
            @RequestParam(name = "url") String url, @RequestParam(name = "boundaryRegExp") String boundaryRegExp,
            @RequestParam(name = "periodicity") String periodicity, @RequestParam(name = "tags") String tags,
            @RequestParam(name = "active") Boolean active) {
        WebsiteRecord updated = websiteRecordService.updateRecord(id, label, url, boundaryRegExp, periodicity, tags,
                active);
        return ResponseEntity.ok(updated);
    }

    /**
     * Remove a website record by ID and all associated executions
     *
     * @param id
     *            Website record ID.
     * @return Status 200
     */
    @DeleteMapping(value = "/websites/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        websiteRecordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all Website Records crawling given url
     * @param query URL of page to find related website records
     * @return List of all website records that crawled given url
     */
    @GetMapping(value = "/websites/url")
    public ResponseEntity<List<WebsiteRecord>> getRecordsCrawlingUrl(@RequestParam String query) {
        return ResponseEntity.ok(websiteRecordService.getRecordsCrawlingUrl(query));
    }
}
