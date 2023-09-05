package com.example.mens1s.controller;


import com.example.mens1s.model.Transaction;
import com.example.mens1s.model.User;
import com.example.mens1s.repository.UserRepository;
import com.example.mens1s.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private TransactionService transactionService;
    private UserRepository userRepository;

    @Autowired
    public TransactionController(TransactionService transactionService, UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/buy")
    public ResponseEntity<String> createTransaction(@RequestBody Transaction transaction){
        Long userId = transaction.getUser().getId();
        User user = userRepository.findById(userId).orElse(null);

        if(user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        // if money not enough
        if(Double.parseDouble(user.getBalance()) < Double.parseDouble(transaction.getVolume_of_dolar()))
            return new ResponseEntity<>("Not enough money", HttpStatus.BAD_REQUEST);

        // if success
        transaction.setUser(user);

        // update balances
        double newBalance = Double.parseDouble(user.getBalance()) - Double.parseDouble(transaction.getVolume_of_dolar());
        user.setBalance(String.valueOf(newBalance));

        // update wallet's balances
        Map<String, Double> walletBalances = user.getWallet().getBalances();
        walletBalances.put("dollar", newBalance);

        // already have or not
        if(user.getWallet().getBalances().containsKey(transaction.getCoin_name())){

            walletBalances.put(transaction.getCoin_name(), user.getWallet().getBalances().get(transaction.getCoin_name())
                    + Double.parseDouble(transaction.getVolume_of_coin()));
        }else{
            walletBalances.put(transaction.getCoin_name(), Double.parseDouble(transaction.getVolume_of_coin()));
        }

        //save the balance
        user.getWallet().setBalances(walletBalances);

        user.getTransactions().add(transaction);
        transactionService.saveTransaction(transaction);

        return new ResponseEntity<>("Transaction created successfully", HttpStatus.CREATED);
    }


    @PostMapping("/sell")
    public ResponseEntity<String> sellTransaction(@RequestBody Transaction transaction) {
        Long userId = transaction.getUser().getId();
        User user = userRepository.findById(userId).orElse(null);

        if(user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        // if does not have stock
        if(!user.getWallet().getBalances().containsKey(transaction.getCoin_name()))
            return new ResponseEntity<>("You do not have this stock", HttpStatus.BAD_REQUEST);

        // if stock not enough
        if(user.getWallet().getBalances().get(transaction.getCoin_name()) < Double.parseDouble(transaction.getVolume_of_coin()))
            return new ResponseEntity<>("Not enough stock", HttpStatus.BAD_REQUEST);

        // if success
        transaction.setUser(user);

        // update balances
        double newBalance = Double.parseDouble(user.getBalance()) + Double.parseDouble(transaction.getVolume_of_dolar());
        user.setBalance(String.valueOf(newBalance));

        // update wallet's balances
        Map<String, Double> walletBalances = user.getWallet().getBalances();
        walletBalances.put("dollar", newBalance);

        walletBalances.put(transaction.getCoin_name(), user.getWallet().getBalances().get(transaction.getCoin_name()) - Double.parseDouble(transaction.getVolume_of_coin()));

        // save the balance
        user.getWallet().setBalances(walletBalances);

        user.getTransactions().add(transaction);
        transactionService.saveTransaction(transaction);

        return new ResponseEntity<>("Transaction created successfully", HttpStatus.CREATED);
    }


    @GetMapping("/{transactionId}")
    public ResponseEntity<String> getTransactionByTransactionId(@PathVariable Long transactionId){

        Transaction transaction = transactionService.findByTransactionId(transactionId);

        if(transaction != null)
            return new ResponseEntity<>(transaction.toString(), HttpStatus.OK);


        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
