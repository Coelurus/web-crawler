package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.PeriodicityTime;
import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.PeriodicityTimeRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.TagRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import cz.cuni.mff.web_crawler_backend.error.exception.FieldValidationException;
import cz.cuni.mff.web_crawler_backend.error.exception.InternalServerException;
import cz.cuni.mff.web_crawler_backend.error.exception.NotFoundException;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WebsiteRecordService {

    private final WebsiteRecordRepository websiteRecordRepository;
    private final TagRepository tagRepository;
    private final PeriodicityTimeRepository periodicityTimeRepository;
    private final ExecutionService executionService;
    private final CrawlService crawlService;
    private final CrawlResultRepository crawlResultRepository;
    private final ExecutionRepository executionRepository;

    @Autowired
    public WebsiteRecordService(WebsiteRecordRepository websiteRecordRepository, TagRepository tagRepository,
            PeriodicityTimeRepository periodicityTimeRepository, ExecutionService executionService,
            CrawlService crawlService, CrawlResultRepository crawlResultRepository,
            ExecutionRepository executionRepository) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.tagRepository = tagRepository;
        this.periodicityTimeRepository = periodicityTimeRepository;
        this.executionService = executionService;
        this.crawlService = crawlService;
        this.crawlResultRepository = crawlResultRepository;
        this.executionRepository = executionRepository;
    }

    /**
     * Get all records from db
     *
     * @return ok response status and list of all records
     */
    public List<WebsiteRecord> getRecords() {
        return websiteRecordRepository.findAll();
    }

    /**
     * Create new record and save it to db
     *
     * @param label
     *            User given label to new record
     * @param url
     *            Url where to start crawling
     * @param boundaryRegExp
     *            Regexp used to match links
     * @param periodicity
     *            How often should the website be crawled
     * @param active
     *            Whether crawling should happen every period
     * @param tags
     *            User given tags to this record
     * @return Ok response with newly created object
     * @throws FieldValidationException
     *             when user given invalid input for any field
     */
    public WebsiteRecord addRecord(String label, String url, String boundaryRegExp, String periodicity, Boolean active,
            String tags) {

        if (label == null || label.isBlank()) {
            throw new FieldValidationException("label");
        }

        if (url == null) {
            throw new FieldValidationException("url");
        }

        if (boundaryRegExp == null) {
            throw new FieldValidationException("boundaryRegExp");
        } else {
            try {
                Pattern.compile(boundaryRegExp);
            } catch (PatternSyntaxException e) {
                throw new FieldValidationException("boundaryRegExp");
            }
        }

        PeriodicityTime periodicityTime = new PeriodicityTime(periodicity);
        periodicityTimeRepository.save(periodicityTime);
        try {

            WebsiteRecord wr = websiteRecordRepository
                    .save(new WebsiteRecord(label, url, boundaryRegExp, periodicityTime, active));

            if (tags != null) {
                for (Object tag : new JSONArray(tags)) {
                    tagRepository.save(new Tag((String) tag, wr.getId()));
                }
            }

            if (Boolean.TRUE.equals(active)) {
                executionService.startExecution(wr.getId());
            }
            return wr;

        } catch (Exception e) {
            throw new InternalServerException(e.getMessage());
        }
    }

    /**
     * Get record from db by its id
     *
     * @param id
     *            ID of record to be found
     * @return Found record
     * @throws NotFoundException
     *             when record with no such id exists
     */
    public WebsiteRecord getRecord(Long id) {
        WebsiteRecord wr = websiteRecordRepository.findById(id).orElse(null);
        if (wr == null) {
            throw new NotFoundException("WebsiteRecord");
        }
        return wr;
    }

    /**
     * Update existing record by id
     *
     * @param id
     *            ID of record to update
     * @return ok response with updated object
     */
    public WebsiteRecord updateRecord(Long id, String label, String url, String boundaryRegExp, String periodicity,
            String tags, Boolean active) {
        WebsiteRecord wr = websiteRecordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("WebsiteRecord"));

        boolean deleteData = false;
        boolean periodicityChanged = false;

        if (label != null) {
            wr.setLabel(label);
        }

        if (url != null && !url.equals(wr.getUrl())) {
            deleteData = true;
            wr.setUrl(url);
        }

        if (boundaryRegExp != null && !boundaryRegExp.equals(wr.getBoundaryRegExp())) {
            deleteData = true;
            wr.setBoundaryRegExp(boundaryRegExp);
        }

        if (periodicity != null && !periodicity.equals(wr.getPeriodicity().toString())) {
            periodicityChanged = true;
            wr.setPeriodicity(new PeriodicityTime(periodicity));
        }

        List<String> tagsNames = List.of();
        if (tags != null) {
            tagsNames = new JSONArray(tags).toList().stream().map(Object::toString).toList();
            for (String tag : tagsNames) {
                if (tagRepository.findByNameAndWrId(tag, wr.getId()).isPresent()) {
                    continue;
                }
                tagRepository.save(new Tag(tag, wr.getId()));
            }
        }

        for (Tag savedTag : tagRepository.findByWrId(wr.getId())) {
            if (!tagsNames.contains(savedTag.getName())) {
                tagRepository.delete(savedTag);
            }
        }

        if (active != null) {
            // Incoming activation
            if (active && !wr.isActive()) {
                executionService.startExecution(wr.getId());

            }
            // Was active
            else if (Boolean.FALSE.equals(active) && wr.isActive()) {
                executionService.deactivateExecution(wr.getId());
            }
            wr.setActive(active);
        }
        if (periodicityChanged) {
            executionService.startExecution(wr.getId());
        }

        if (deleteData) {
            deleteAssociatedData(id);
            wr.setCrawledData(null);
        }

        websiteRecordRepository.save(wr);
        return wr;
    }

    /**
     * Delete record from db and all associated executions and crawl data
     *
     * @param id
     *            ID of record to delete
     */
    public void deleteRecord(Long id) {
        executionService.deactivateExecution(id);
        deleteAssociatedData(id);
        websiteRecordRepository.deleteById(id);
    }

    /**
     * Delete all executions, crawl data and links that was created because of this
     * website record
     *
     * @param id
     *            ID of website record whose data to delete
     */
    private void deleteAssociatedData(Long id) {
        WebsiteRecord toDelete = websiteRecordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("WebsiteRecord"));
        CrawlResult root = toDelete.getCrawledData();
        if (root != null) {
            crawlService.deleteAllCrawlDataByExecutionId(root.getExecutionId());
        }
        executionService.deleteExecutionsByWebsiteId(id);
    }

    /**
     * Set new crawl root for website record
     *
     * @param root
     *            New CrawlResult to set as root for website record
     * @param id
     *            ID of website record whose crawl result to set
     */
    public void updateCrawledData(CrawlResult root, Long id) {
        websiteRecordRepository.updateCrawledData(root, id);
    }

    public List<WebsiteRecord> getRecordsCrawlingUrl(String url) {
        return crawlResultRepository.findCrawlResultsByUrl(url).stream().map(CrawlResult::getExecutionId).distinct()
                .map(e -> executionRepository.findById(e).orElse(null)).filter(Objects::nonNull)
                .map(Execution::getWebsite).toList();
    }
}
