package com.example.mens1s.service;

import com.example.mens1s.model.Currencies;
import com.example.mens1s.model.Transaction;
import com.example.mens1s.repository.CurrenciesRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class CurrenciesServices {
    public CurrenciesRepository currenciesRepository;

    public CurrenciesServices(CurrenciesRepository currenciesRepository) {
        this.currenciesRepository = currenciesRepository;
    }

    @Scheduled(cron = "*/300 * * * * *")
    public void updateDatabase() {
        Currencies currencies = currenciesRepository.findById(Long.parseLong("1")).get();

        String uri = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/category";
        List<NameValuePair> paratmers = new ArrayList<>();
        paratmers.add(new BasicNameValuePair("id","605e2ce9d41eae1066535f7c"));

        try {
            String result = makeAPICall(uri, paratmers);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(result);

            JsonNode dataNode = rootNode.path("data");

            JsonNode coinsNode = dataNode.get("coins");
            if (coinsNode.isArray()) {
                int top = 12;
                String newData = "{";
                for (JsonNode coinNode : coinsNode) {
                    String coinSymbol = coinNode.get("symbol").asText();
                    String coinPrice = coinNode.get("quote").get("USD").get("price").asText();

                    String[] price = coinPrice.split("\\.");

                    if(price.length > 1){
                        coinPrice = price[0] + "." + price[1].charAt(0) + price[1].charAt(1);
                    }
                    else{
                        coinPrice = price[0];
                    }
                    newData += "\"" + coinSymbol + "\":" + coinPrice + ",";
                    top--;
                    if(top == 0){
                        newData = newData.substring(0, newData.length() - 1);
                        break;
                    }
                }
                newData += "}";
                currencies.setDatas(newData);
                currenciesRepository.save(currencies);
            }

        } catch (IOException e) {
            System.out.println("Error: can not access content - " + e.toString());
        } catch (URISyntaxException e) {
            System.out.println("Error: Invalid URL " + e.toString());
        }

    }

    public static String makeAPICall(String uri, List<NameValuePair> parameters)
            throws URISyntaxException, IOException {
        String response_content = "";

        URIBuilder query = new URIBuilder(uri);
        query.addParameters(parameters);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet request = new HttpGet(query.build());

        request.setHeader(HttpHeaders.ACCEPT, "application/json");
        String apiKey = "4ecae7bd-8ad6-4c16-8d6d-fdd292a2b251";
        request.addHeader("X-CMC_PRO_API_KEY", apiKey);

        try (CloseableHttpResponse response = client.execute(request)) {
            HttpEntity entity = response.getEntity();
            response_content = EntityUtils.toString(entity);
            EntityUtils.consume(entity);
        }

        return response_content;
    }
    public Currencies findByCurrenciesId(Long currenyId){
        return currenciesRepository.findById(currenyId).orElse(null);
    }
}
