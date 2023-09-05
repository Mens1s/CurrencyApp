package com.example.mens1s.repository;

import com.example.mens1s.model.Currencies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface CurrenciesRepository extends JpaRepository<Currencies, Long> {
}
