package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.PeriodicityTime;
import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.PeriodicityTimeRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.TagRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.exception.FieldValidationException;
import cz.cuni.mff.web_crawler_backend.exception.InternalServerException;
import cz.cuni.mff.web_crawler_backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class WebsiteRecordController {

    private final WebsiteRecordRepository websiteRecordRepository;
    private final TagRepository tagRepository;
    private final PeriodicityTimeRepository periodicityTimeRepository;

    @Autowired
    public WebsiteRecordController(WebsiteRecordRepository websiteRecordRepository,
                                   TagRepository tagRepository,
                                   PeriodicityTimeRepository periodicityTimeRepository) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.tagRepository = tagRepository;
        this.periodicityTimeRepository = periodicityTimeRepository;

    }

    /**
     * Get all website records saved in database
     *
     * @return List of dictionaries where each is a website record
     */
    @GetMapping(value = "/websites")
    ResponseEntity<List<WebsiteRecord>> getRecords() {
        return new ResponseEntity<>(websiteRecordRepository.findAll(), HttpStatus.OK);
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
    ResponseEntity<WebsiteRecord> addRecord(@RequestParam String label,
                                            @RequestParam String url,
                                            @RequestParam String boundaryRegExp,
                                            @RequestParam String periodicity,
                                            @RequestParam Boolean active,
                                            @RequestParam(required = false) List<String> tags) throws MethodArgumentNotValidException {

        if (label == null || label.isBlank()) {
            throw new FieldValidationException("FIELD_INVALID", "label");
        }

        if (url == null) {
            throw new FieldValidationException("FIELD_INVALID", "url");
        }

        if (boundaryRegExp == null) {
            throw new FieldValidationException("FIELD_INVALID", "boundaryRegExp");
        }

        PeriodicityTime periodicityTime = new PeriodicityTime(periodicity);
        periodicityTimeRepository.save(periodicityTime);
        try {

            WebsiteRecord wr = websiteRecordRepository.save(new WebsiteRecord(label, url, boundaryRegExp, periodicityTime, active));

            if (tags != null) {
                for (String tag : tags) {
                    tagRepository.save(new Tag(tag, wr.getId()));
                }
            }
            return ResponseEntity.ok(wr);
        } catch (Exception e) {
            throw new InternalServerException("INTERNAL_SERVER_ERROR", e.getMessage());
        }
    }

    /**
     * Return a website record by id
     *
     * @param id of website record to find
     * @return Website record found by id
     */
    @GetMapping(value = "/websites/{id}")
    ResponseEntity<WebsiteRecord> getRecord(@PathVariable int id) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("NOT_FOUND", "WebsiteRecord");
        }
        return ResponseEntity.ok(wr);
    }

    /**
     * Update a website record by ID
     *
     * @param id     Website record ID
     * @param record New website record to substitute the old one
     * @return Updated record
     */
    @PutMapping(value = "/websites/{id}")
    ResponseEntity<WebsiteRecord> updateRecord(@PathVariable int id, @RequestBody WebsiteRecord record) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("NOT_FOUND", "WebsiteRecord");
        }
        wr.setLabel(record.getLabel());
        wr.setUrl(record.getUrl());
        wr.setBoundaryRegExp(record.getBoundaryRegExp());
        wr.setPeriodicity(record.getPeriodicity());
        wr.setActive(record.isActive());
        wr.setTags(record.getTags());
        // Delete previously crawled data since it is outdated
        wr.setCrawledData(null);
        return ResponseEntity.ok(wr);
    }

    /**
     * Remove a website record by ID and all associated executions
     *
     * @param id Website record ID.
     * @return Status 200
     */
    @DeleteMapping(value = "/websites/{id}")
    ResponseEntity<Void> deleteRecord(@PathVariable int id) {
        websiteRecordRepository.findById(id).ifPresent(websiteRecordRepository::delete);
        return ResponseEntity.noContent().build();
    }
}
