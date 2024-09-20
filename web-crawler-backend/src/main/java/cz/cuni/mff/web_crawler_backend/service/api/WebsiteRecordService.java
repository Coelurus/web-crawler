package cz.cuni.mff.web_crawler_backend.service.api;

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

    @Autowired
    public WebsiteRecordService(WebsiteRecordRepository websiteRecordRepository,
                                TagRepository tagRepository,
                                PeriodicityTimeRepository periodicityTimeRepository) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.tagRepository = tagRepository;
        this.periodicityTimeRepository = periodicityTimeRepository;
    }

    public ResponseEntity<List<WebsiteRecord>> getRecords() {
        return new ResponseEntity<>(websiteRecordRepository.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<WebsiteRecord> addRecord(String label, String url, String boundaryRegExp,
                                                   String periodicity, Boolean active, List<String> tags) {

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

    public ResponseEntity<WebsiteRecord> getRecord(int id) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("NOT_FOUND", "WebsiteRecord");
        }
        return ResponseEntity.ok(wr);
    }

    public ResponseEntity<WebsiteRecord> updateRecord(int id, WebsiteRecord wrRecord) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("NOT_FOUND", "WebsiteRecord");
        }
        wr.setLabel(wrRecord.getLabel());
        wr.setUrl(wrRecord.getUrl());
        wr.setBoundaryRegExp(wrRecord.getBoundaryRegExp());
        wr.setPeriodicity(wrRecord.getPeriodicity());
        wr.setActive(wrRecord.isActive());
        wr.setTags(wrRecord.getTags());
        // Delete previously crawled data since it is outdated
        wr.setCrawledData(null);
        return ResponseEntity.ok(wr);
    }

    public ResponseEntity<Void> deleteRecord(int id) {
        websiteRecordRepository.findById(id).ifPresent(websiteRecordRepository::delete);
        return ResponseEntity.noContent().build();
    }
}
