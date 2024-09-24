package cz.cuni.mff.web_crawler_backend.service.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.repository.CrawlResultRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import static java.util.concurrent.TimeUnit.SECONDS;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    private WebsiteRecordRepository websiteRecordRepository;
    private CrawlerService crawlerService;
    private final CrawlResultRepository crawlResultRepository;
    private ExecutionRepository executionRepository;
    private ThreadPoolTaskScheduler taskScheduler;
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @Autowired
    public SchedulingConfig(WebsiteRecordRepository websiteRecordRepository,
                            CrawlerService crawlerService,
                            ExecutionRepository executionRepository,
                            ThreadPoolTaskScheduler taskScheduler,
                            CrawlResultRepository crawlResultRepository) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.crawlerService = crawlerService;
        this.executionRepository = executionRepository;
        this.taskScheduler = taskScheduler;
        this.crawlResultRepository = crawlResultRepository;
    }

    public void scheduleCrawlingTask(Execution execution) {
        List<CrawlResult> queue = new ArrayList<>();

        CrawlResult root = new CrawlResult(execution.getWebsite().getUrl(), "TO BE SEARCHED", execution.getId());
        queue.addLast(root);
        crawlResultRepository.save(root);
        websiteRecordRepository.updateCrawledData(root, execution.getWebsite().getId());

        Duration period = Duration.ofSeconds(execution.getWebsite().getPeriodicity().getTimeInSeconds() * 1000);
        String regexp = execution.getWebsite().getBoundaryRegExp();

        Runnable crawlingTask = () -> crawlerService.crawl(queue, regexp, execution);
        ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleWithFixedDelay(crawlingTask, period);

        scheduledTasks.put(execution.getId(), scheduledFuture);
    }


    public void cancelCrawlingTask(Long taskId) {
        ScheduledFuture<?> scheduledTask = scheduledTasks.get(taskId);
        if (scheduledTask != null) {
            scheduledTask.cancel(false);
            scheduledTasks.remove(taskId);
        }
    }

}
/*


    @PostConstruct
    public void scheduleExistingTasks() {
        List<WebsiteRecord> tasks = wrRepo.findAll();
        for (WebsiteRecord task : tasks) {
            scheduleCrawlingTask(task);
        }
    }



 */