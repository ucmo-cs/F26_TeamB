package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Contact details (admin enters on loan creation, customer can edit)
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    // Bank details for automatic payments (null until the customer enters them)
    private String bankName;
    private Integer bankRoutingNumber;
    private Integer bankAccountNumber;
}