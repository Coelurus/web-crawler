package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.PeriodicityTime;
import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.PeriodicityTimeRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.TagRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.error.exception.FieldValidationException;
import cz.cuni.mff.web_crawler_backend.error.exception.InternalServerException;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class WebsiteRecordService {

    private final WebsiteRecordRepository websiteRecordRepository;
    private final TagRepository tagRepository;
    private final PeriodicityTimeRepository periodicityTimeRepository;
    private final ExecutionService executionService;
    private final CrawlService crawlService;

    @Autowired
    public WebsiteRecordService(WebsiteRecordRepository websiteRecordRepository,
                                TagRepository tagRepository,
                                PeriodicityTimeRepository periodicityTimeRepository,
                                ExecutionService executionService,
                                CrawlService crawlService) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.tagRepository = tagRepository;
        this.periodicityTimeRepository = periodicityTimeRepository;
        this.executionService = executionService;
        this.crawlService = crawlService;
    }

    /**
     * Get all records from db
     *
     * @return ok response status and list of all records
     */
    public ResponseEntity<List<WebsiteRecord>> getRecords() {
        return new ResponseEntity<>(websiteRecordRepository.findAll(), HttpStatus.OK);
    }

    /**
     * Create new record and save it to db
     *
     * @param label          User given label to new record
     * @param url            Url where to start crawling
     * @param boundaryRegExp Regexp used to match links
     * @param periodicity    How often should the website be crawled
     * @param active         Whether crawling should happen every period
     * @param tags           User given tags to this record
     * @return Ok response with newly created object
     * @throws FieldValidationException when user given invalid input for any field
     */
    public ResponseEntity<WebsiteRecord> addRecord(String label, String url, String boundaryRegExp,
                                                   String periodicity, Boolean active, List<String> tags) {

        if (label == null || label.isBlank()) {
            throw new FieldValidationException("label");
        }

        if (url == null) {
            throw new FieldValidationException("url");
        }

        if (boundaryRegExp == null) {
            throw new FieldValidationException("boundaryRegExp");
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

            if (Boolean.TRUE.equals(active)) {
                executionService.startExecution(wr.getId());
            }
            return ResponseEntity.ok(wr);

        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }

    }

    /**
     * Get record from db by its id
     *
     * @param id ID of record to be found
     * @return Found record
     * @throws NotFoundException when record with no such id exists
     */
    public ResponseEntity<WebsiteRecord> getRecord(Long id) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("WebsiteRecord");
        }
        return ResponseEntity.ok(wr);
    }

    /**
     * Update existing record by id
     *
     * @param id       ID of record to update
     * @param wrRecord new website record to replace the old one
     * @return ok response with updated object
     */
    public ResponseEntity<WebsiteRecord> updateRecord(Long id, WebsiteRecord wrRecord) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("WebsiteRecord");
        }
        wr.setLabel(wrRecord.getLabel());
        wr.setUrl(wrRecord.getUrl());
        wr.setBoundaryRegExp(wrRecord.getBoundaryRegExp());
        wr.setPeriodicity(wrRecord.getPeriodicity());
        wr.setActive(wrRecord.isActive());
        wr.setTags(wrRecord.getTags());
        // Delete previously crawled data since it is outdated
        wr.setCrawledData(null);
        websiteRecordRepository.save(wr);
        return ResponseEntity.ok(wr);
    }

    /**
     * Delete record from db and all associated executions and crawl data
     *
     * @param id ID of record to delete
     */
    public ResponseEntity<Void> deleteRecord(Long id) {
        WebsiteRecord toDelete = websiteRecordRepository.findById(id).orElse(null);
        if (toDelete != null) {
            CrawlResult root = toDelete.getCrawledData();
            if (root != null) {
                crawlService.deleteAllCrawlDataByExecutionId(root.getExecutionId());
            }
        }

        executionService.deleteExecutionsByWebsiteId(id);
        websiteRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
