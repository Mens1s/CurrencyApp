package com.example.mens1s.service;

import com.example.mens1s.model.Wallet;
import com.example.mens1s.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {
    @Autowired
    private WalletRepository walletRepository;

    @Transactional
    public Wallet saveWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }
}
