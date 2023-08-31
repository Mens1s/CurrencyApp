package com.example.mens1s.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private String id;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="user_id")
    @JsonBackReference
    private User user;

    @Column(name="volume_of_coin")
    private String volume_of_coin;
    @Column(name="coin_name")
    private String coin_name;
    @Column(name="volume_of_dolar")
    private String volume_of_dolar;

    @Column(name="transaction_number")
    private String transactionNumber;

    /*
    {
   "volume_of_coin": "10",
   "coin_name": "Bitcoin",
   "volume_of_dolar": "5000",
   "transaction_number": "123456",
   "user": {
       "id": 1
   }
     }
     */

}
