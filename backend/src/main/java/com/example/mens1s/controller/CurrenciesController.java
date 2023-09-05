package com.example.mens1s.controller;

import com.example.mens1s.model.Currencies;
import com.example.mens1s.model.Transaction;
import com.example.mens1s.service.CurrenciesServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/currencies")
public class CurrenciesController {
    private CurrenciesServices currenciesServices;

    public CurrenciesController(CurrenciesServices currenciesServices) {
        this.currenciesServices = currenciesServices;
    }

    @GetMapping
    public ResponseEntity<String> getCurrencies(){

        Currencies currencies = currenciesServices.findByCurrenciesId((long)1);

        if(currencies != null)
            return new ResponseEntity<>(currencies.toString(), HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
