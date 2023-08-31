package com.example.mens1s.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Remove @ElementCollection and related annotations
    @Column(name = "balances", columnDefinition = "JSON") // Use columnDefinition for JSON type
    private String balancesJson;

    @JsonIgnore
    @OneToOne(mappedBy = "wallet")
    private User user;

    // Getter and Setter for id, user, balancesJson...

    // Additional methods if needed

    // Convert Map<String, Double> to JSON string and vice versa
    @Transient // Not persisted in the database
    public Map<String, Double> getBalances() {
        return new Gson().fromJson(balancesJson, new TypeToken<HashMap<String, Double>>() {}.getType());
    }

    public void setBalances(Map<String, Double> balances) {
        this.balancesJson = new Gson().toJson(balances);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBalancesJson() {
        return balancesJson;
    }

    public void setBalancesJson(String balancesJson) {
        this.balancesJson = balancesJson;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}