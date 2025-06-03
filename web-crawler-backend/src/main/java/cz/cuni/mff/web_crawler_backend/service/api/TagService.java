package cz.cuni.mff.web_crawler_backend.service.api;

import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.database.repository.TagRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Get all tags assigned to website records
     *
     * @return Distinct list of all tags assigned to some website record
     */
    public List<String> getAllTags() {
        return tagRepository.findAll().stream().map(Tag::getName).distinct().toList();
    }
}
