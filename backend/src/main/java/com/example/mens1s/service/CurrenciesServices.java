package com.example.mens1s.service;

import com.example.mens1s.model.Currencies;
import com.example.mens1s.model.Transaction;
import com.example.mens1s.repository.CurrenciesRepository;
import org.springframework.stereotype.Service;

@Service
public class CurrenciesServices {
    public CurrenciesRepository currenciesRepository;

    public CurrenciesServices(CurrenciesRepository currenciesRepository) {
        this.currenciesRepository = currenciesRepository;
    }

    public Currencies findByCurrenciesId(Long currenyId){
        return currenciesRepository.findById(currenyId).orElse(null);
    }
}
