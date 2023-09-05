package com.example.mens1s.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties("transactions")
    private User user;

    @Column(name="volume_of_coin")
    private String volume_of_coin;
    @Column(name="coin_name")
    private String coin_name;
    @Column(name="volume_of_dolar")
    private String volume_of_dolar;

    @Column(name="type")
    private String type;

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
