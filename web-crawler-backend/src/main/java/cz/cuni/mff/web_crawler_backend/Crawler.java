package cz.cuni.mff.web_crawler_backend;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class Crawler {

    @PostMapping("/crawl")
    public RedirectView findLinks(@RequestParam(name = "url") String url,
                                  @RequestParam(name = "regexp") String regexp,
                                  @RequestParam(name = "periodicity") String periodicity,
                                  @RequestParam(name = "label") String label) throws IOException {

        // get the regex pattern
        Pattern pattern = Pattern.compile(regexp);

        Document doc = Jsoup.connect(url).get();
        doc.select("a").forEach(a ->{
            System.out.println(a);
            String href = a.attr("href");
            System.out.println(href);
            Matcher matcher = pattern.matcher(href);
            if (matcher.find()) {
                System.out.println("MATCH!");
                //Database.insertRecord(new WebsiteRecord(href, regexp, periodicity, label, true, new String[]{"tag1, tag3"}));
            }
            else{
                System.out.println(":(");
            }
        });

        return new RedirectView("/records");
    }

    /*
    @GetMapping("/records")
    @ResponseBody
    public WebsiteRecord[] getRecords(){
        return Database.getRecords().toArray(new WebsiteRecord[0]);
    }

     */
}
