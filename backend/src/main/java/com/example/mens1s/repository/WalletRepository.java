package com.example.mens1s.repository;

import com.example.mens1s.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface WalletRepository extends JpaRepository<Wallet, Long> {
}
