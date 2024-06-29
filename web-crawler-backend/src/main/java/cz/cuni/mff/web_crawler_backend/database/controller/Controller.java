package cz.cuni.mff.web_crawler_backend.database.controller;

import cz.cuni.mff.web_crawler_backend.database.model.Tag;
import cz.cuni.mff.web_crawler_backend.database.model.WebsiteRecord;
import cz.cuni.mff.web_crawler_backend.database.repository.TagRepository;
import cz.cuni.mff.web_crawler_backend.database.repository.WebsiteRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    WebsiteRecordRepository wrRepo;

    @Autowired
    TagRepository tagRepo;

    /* TODO: use this?...when frontend used...needs json type
    @PostMapping("/record")
    public void addRecord(@RequestBody WebsiteRecord wr){
        wrRepo.save(wr);
    }
     */

    @PostMapping("/record")
    public void addRecord(@RequestParam("url") String url,
                          @RequestParam("regex") String regex,
                          @RequestParam("periodicity") String periodicity,
                          @RequestParam("label") String label){
        WebsiteRecord wr = new WebsiteRecord(url, regex, periodicity, label);
        wrRepo.save(wr);
    }

    @GetMapping("/record")
    public List<WebsiteRecord> getRecords(){
        return wrRepo.findAll();
    }

    // TODO: get rid of? mainly for testing purposes when creating tags with form
    @PostMapping("/tag")
    public void addTag(
            @RequestParam("name") String name,
            @RequestParam("wr_id") Long wrId) {
        Tag tag = new Tag(name, wrId);
        tagRepo.save(tag);
    }

    /*
    // TODO: use this?...when frontend used...needs json type
    @PostMapping("/tag")
    public void addTag(@RequestBody Tag tag){
        tagRepo.save(tag);
    }

     */

    @GetMapping("/tag")
    public List<Tag> getTags(){
        return tagRepo.findAll();
    }
}
