package com.example.mens1s.service;

import com.example.mens1s.model.Transaction;
import com.example.mens1s.repository.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction findByTransactionId(Long transactionId){
        return transactionRepository.findById(transactionId).orElse(null);
    }
    public void saveTransaction(Transaction transaction){
        transactionRepository.save(transaction);
    }
}
