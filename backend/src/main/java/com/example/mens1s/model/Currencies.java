package com.example.mens1s.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Currencies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="datas")
    private String datas;
}
