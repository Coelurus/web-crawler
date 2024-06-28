package cz.cuni.mff.web_crawler_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "cz.cuni.mff.web_crawler_backend.database.repository")
@EntityScan(basePackages = "cz.cuni.mff.web_crawler_backend.database.model")
public class WebCrawlerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebCrawlerBackendApplication.class, args);
	}

}
