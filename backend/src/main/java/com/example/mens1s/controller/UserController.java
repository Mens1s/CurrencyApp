package com.example.mens1s.controller;

import com.example.mens1s.model.User;
import com.example.mens1s.model.Wallet;
import com.example.mens1s.repository.WalletRepository;
import com.example.mens1s.request.LoginRequest;
import com.example.mens1s.service.UserService;
import com.example.mens1s.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin("http://localhost:4200")
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

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {

        // check if username already exists
        if(userService.findByUsername(user.getUsername()) != null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Wallet wallet = new Wallet();
        Map<String, Double> initialBalance = new HashMap<>();
        initialBalance.put("dollar", 10000.0);
        wallet.setBalances(initialBalance);


        user.setWallet(wallet);
        user.setBalance("10000.0");

        userService.saveUser(user);
        wallet.setUser(user);
        walletService.saveWallet(wallet);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User userFromDb = userService.findByUsername(username);

        if(userFromDb != null && userFromDb.getPassword().equals(password))
            return new ResponseEntity<>(userFromDb, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username){

        User user = userService.findByUsername(username);

        if(user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
