package com.example.mens1s.controller;

import com.example.mens1s.model.User;
import com.example.mens1s.model.Wallet;
import com.example.mens1s.repository.WalletRepository;
import com.example.mens1s.service.UserService;
import com.example.mens1s.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService;
    private WalletService walletService;

    @Autowired
    public UserController(UserService userService, WalletService walletService) {
        this.userService = userService;
        this.walletService = walletService;
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        Wallet wallet = new Wallet();
        wallet.setBalances(new HashMap<>());
        user.setWallet(wallet);

        userService.saveUser(user);
        wallet.setUser(user);
        walletService.saveWallet(wallet);

        return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username){

        User user = userService.findByUsername(username);

        if(user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
