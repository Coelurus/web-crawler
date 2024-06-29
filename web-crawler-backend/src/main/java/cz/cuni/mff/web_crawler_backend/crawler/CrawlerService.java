package cz.cuni.mff.web_crawler_backend.crawler;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CrawlerService {


    public void crawl(String url, String regexp) {
        //TODO: redesign this thing and solve exceptions better

        // get the regex pattern
        Pattern pattern = Pattern.compile(regexp);

        try {
            Document doc = Jsoup.connect(url).get();
            doc.select("a").forEach(a ->{
                System.out.println(a);
                String href = a.attr("href");
                System.out.println(href);
                Matcher matcher = pattern.matcher(href);
                if (matcher.find()) {
                    System.out.println("MATCH!");
                }
                else{
                    System.out.println(":(");
                }
            });
        } catch (IOException e){
            System.out.println("Website can not be loaded");
        }

    }
}
