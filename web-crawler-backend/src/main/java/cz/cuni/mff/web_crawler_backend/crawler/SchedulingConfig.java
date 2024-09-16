package cz.cuni.mff.web_crawler_backend.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
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

public class SchedulingConfig{}
/*
@Configuration
@EnableScheduling
public class SchedulingConfig {
    @Autowired
    private WebsiteRecordRepository wrRepo;

    @Autowired
    private CrawlerService crawlerService;

    private ThreadPoolTaskScheduler taskScheduler;
    private ScheduledTaskRegistrar taskRegistrar;
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @PostConstruct
    public void scheduleExistingTasks() {
        List<WebsiteRecord> tasks = wrRepo.findAll();
        for (WebsiteRecord task : tasks) {
            scheduleCrawlingTask(task);
        }
    }

    public void scheduleCrawlingTask(WebsiteRecord task) {
        Runnable crawlingTask = () -> crawlerService.crawl(task.getUrl(), task.getRegex());
        ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleAtFixedRate(
                crawlingTask,
                task.getIntervalSeconds() * 1000
        );

        // Save the scheduled task for potential future cancellation
        scheduledTasks.put(task.getId(), scheduledFuture);
    }

    public void cancelCrawlingTask(Long taskId) {
        ScheduledFuture<?> scheduledTask = scheduledTasks.get(taskId);
        if (scheduledTask != null) {
            scheduledTask.cancel(false);
            scheduledTasks.remove(taskId);
        }
    }

    @Autowired
    public void configureTaskScheduler(ThreadPoolTaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

}


 */