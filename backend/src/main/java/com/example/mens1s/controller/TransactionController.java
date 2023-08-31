package com.example.mens1s.controller;


import com.example.mens1s.model.Transaction;
import com.example.mens1s.model.User;
import com.example.mens1s.repository.UserRepository;
import com.example.mens1s.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        user.setBalance(String.valueOf(Double.parseDouble(user.getBalance()) - Double.parseDouble(transaction.getVolume_of_dolar())));
        user.getWallet().getBalances().put("dolar", Double.parseDouble(user.getBalance()));

        user.getTransactions().add(transaction);
        transactionService.saveTransaction(transaction);

        return new ResponseEntity<>("Transaction created successfully", HttpStatus.CREATED);
    }

    /*
    @PostMapping("/sell")
    public ResponseEntity<String> sellTransaction(@RequestBody Transaction transaction) {
        Long userId = transaction.getUser().getId();
        User user = userRepository.findById(userId).orElse(null);

        if(user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        // if does not have stock

    }
    */

    @GetMapping("/{transactionNumber}")
    public ResponseEntity<String> getTransactionByTransactionNumber(@PathVariable String transactionNumber){

        Transaction transaction = transactionService.findByTransactionNumber(transactionNumber);

        if(transaction != null)
            return new ResponseEntity<>(transaction.toString(), HttpStatus.OK);


        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
