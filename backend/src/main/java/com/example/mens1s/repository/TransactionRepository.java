package com.example.mens1s.repository;

import com.example.mens1s.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findByTransactionNumber(String transactionNumber);
}
