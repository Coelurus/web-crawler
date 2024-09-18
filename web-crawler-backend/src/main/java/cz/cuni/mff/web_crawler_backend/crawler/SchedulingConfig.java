package cz.cuni.mff.web_crawler_backend.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.ExecutionRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    private WebsiteRecordRepository websiteRecordRepository;
    private CrawlerService crawlerService;
    private ExecutionRepository executionRepository;
    private ThreadPoolTaskScheduler taskScheduler;
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @Autowired
    public SchedulingConfig(WebsiteRecordRepository websiteRecordRepository,
                            CrawlerService crawlerService,
                            ExecutionRepository executionRepository,
                            ThreadPoolTaskScheduler taskScheduler) {
        this.websiteRecordRepository = websiteRecordRepository;
        this.crawlerService = crawlerService;
        this.executionRepository = executionRepository;
        this.taskScheduler = taskScheduler;
    }

    public void scheduleCrawlingTask(Execution execution) {
        System.out.println("Scheduling crawling");

        Runnable crawlingTask = () -> crawlerService.crawl(
                execution.getWebsite().getUrl(), execution.getWebsite().getBoundaryRegExp());

        ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleAtFixedRate(
                crawlingTask,
                execution.getWebsite().getPeriodicity().getTimeInSeconds() * 1000
        );

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