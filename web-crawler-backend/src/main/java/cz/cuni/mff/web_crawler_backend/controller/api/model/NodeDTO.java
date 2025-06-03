package cz.cuni.mff.web_crawler_backend.controller.api.model;

import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import java.util.List;

public record NodeDTO(String title, String url, String crawlTime, List<String> links, WebsiteRecord owner) {
}
