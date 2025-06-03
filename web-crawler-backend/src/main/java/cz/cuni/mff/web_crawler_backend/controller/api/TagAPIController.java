package cz.cuni.mff.web_crawler_backend.controller.api;

import cz.cuni.mff.web_crawler_backend.service.api.TagService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TagAPIController {

    private final TagService tagService;

    @Autowired
    public TagAPIController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * Get all tags saved in system
     *
     * @return All tags
     */
    @GetMapping(value = "/tags")
    public ResponseEntity<List<String>> getTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }
}
