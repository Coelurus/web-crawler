package cz.cuni.mff.web_crawler_backend.service.crawler;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    private final CrawlerService crawlerService;
    private final ThreadPoolTaskScheduler taskScheduler;
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @Autowired
    public SchedulingConfig(CrawlerService crawlerService, ThreadPoolTaskScheduler taskScheduler) {
        this.crawlerService = crawlerService;
        this.taskScheduler = taskScheduler;
    }

    /**
     * Plan crawling calendar on given website record
     *
     * @param websiteRecord
     *            Information about how, where, when and what should be crawled
     */
    public void scheduleCrawlingTask(WebsiteRecord websiteRecord) {
        Duration period = Duration.ofSeconds(websiteRecord.getPeriodicity().getTimeInSeconds());

        Runnable startNewExecutionTask = () -> crawlerService.startNewExecution(websiteRecord.getId());
        ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleWithFixedDelay(startNewExecutionTask, period);

        scheduledTasks.put(websiteRecord.getId(), scheduledFuture);
    }

    /**
     * Check whether website record crawling is scheduled
     *
     * @param websiteRecordId
     *            ID of website record to check
     * @return True if website record crawling is scheduled False otherwise
     */
    public boolean isScheduled(Long websiteRecordId) {
        return scheduledTasks.containsKey(websiteRecordId);
    }

    /**
     * Cancel planned tasks
     *
     * @param taskId
     *            ID of task = ID of website record on which executions are
     *            happening
     */
    public void cancelCrawlingTask(Long taskId) {
        ScheduledFuture<?> scheduledTask = scheduledTasks.get(taskId);
        if (scheduledTask != null) {
            scheduledTask.cancel(false);
            scheduledTasks.remove(taskId);
        }
    }
}
