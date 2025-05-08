package cz.cuni.mff.web_crawler_backend.database.repository;

import cz.cuni.mff.web_crawler_backend.database.model.CrawlResult;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrawlResultRepository extends JpaRepository<CrawlResult, Long> {
    boolean existsByUrlAndExecutionId(String url, Long executionId);

    CrawlResult findByUrlAndExecutionId(String url, Long executionId);

    List<CrawlResult> findByExecutionId(Long executionId);

    @Transactional
    @Modifying
    @Query("update CrawlResult cr set cr.state = ?1 where cr.id = ?2")
    void updateState(String state, Long id);

    @Transactional
    @Modifying
    void deleteByExecutionId(Long executionId);

    List<CrawlResult> findAllByExecutionIdIn(List<Long> executionIds);

}
