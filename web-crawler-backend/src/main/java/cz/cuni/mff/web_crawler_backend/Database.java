package cz.cuni.mff.web_crawler_backend;

import java.util.ArrayList;
import java.util.List;

/**
 * Just a mock. Jsem linej zatim pouzit normalni TODO: predelat na pouzivani Postgres
 */
public class Database {
    private static final List<WebsiteRecord> records = new ArrayList<>();

    public static void insertRecord(WebsiteRecord record){
        records.add(record);
    }

    public static List<WebsiteRecord> getRecords(){
        return records;
    }
}
