package cz.cuni.mff.web_crawler_backend.controller;

import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.service.api.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TagAPIController {

    private final TagService tagService;

    @Autowired
    public TagAPIController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping(value = "/tags")
    public ResponseEntity<List<String>> getTags() {
        return tagService.getAllTags();
    }
}
