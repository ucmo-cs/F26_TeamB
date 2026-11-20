package com.example.demo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @NotBlank(message = "First name is required")
    @Pattern (regexp = "^[a-zA-Z]{1,50}$", message = "First name must contain only [1-50] letters")
    private String firstName;
    
    @NotBlank (message = "Last name is required")
    @Pattern (regexp = "^[a-zA-Z]{1,50}$", message = "Last name must contain only [1-50] letters")
    private String lastName;

    
    private String email;
    private String phoneNumber;

    // Bank details for automatic payments (null until the customer enters them)
    private String bankName;
    private Integer bankRoutingNumber;
    private Integer bankAccountNumber;
}