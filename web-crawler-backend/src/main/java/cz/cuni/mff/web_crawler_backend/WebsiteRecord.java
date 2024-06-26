package cz.cuni.mff.web_crawler_backend;

public class WebsiteRecord {
    /**
     * Where the crawler should start.
     */
    private final String URL;

    /**
     * When the crawler found a link, the link must match this expression in order to be followed. User is required to provide value for this.
     */
    private final String regExp;

    /**
     * (minute, hour, day) - how often should the site be crawled.
     */
    private final String periodicity;

    /**
     * User given label.
     */
    private final String label;

    /**
     * If inactive, the site is not crawled based on the Periodicity.
     */
    private final Boolean active;

    /**
     * User given strings.
     */
    private final String[] Tags;

    public WebsiteRecord(String URL, String regExp, String periodicity, String label, Boolean active, String[] tags) {
        this.URL = URL;
        this.regExp = regExp;
        this.periodicity = periodicity;
        this.label = label;
        this.active = active;
        Tags = tags;
    }

    public String getURL() {
        return URL;
    }

    public String getRegExp() {
        return regExp;
    }

    public String getPeriodicity() {
        return periodicity;
    }

    public String getLabel() {
        return label;
    }

    public Boolean getActive() {
        return active;
    }

    public String[] getTags() {
        return Tags;
    }
}
