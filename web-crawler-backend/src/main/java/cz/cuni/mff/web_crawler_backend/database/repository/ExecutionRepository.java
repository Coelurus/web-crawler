package cz.cuni.mff.web_crawler_backend.database.repository;


import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExecutionRepository extends JpaRepository<Execution, Long> {
    Optional<Execution> findById(long id);

    List<Execution> findByWebsiteId(Long websiteId);
}
