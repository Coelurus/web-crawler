package cz.cuni.mff.web_crawler_backend.database.repository;


import cz.cuni.mff.web_crawler_backend.database.model.Execution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutionRepository extends JpaRepository<Execution, Long> {
    Execution findById(long id);
}
