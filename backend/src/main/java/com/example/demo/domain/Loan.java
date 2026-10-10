package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    // ID, autoincrements.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // Loan Variables
    private String customerFirstName;           // First name of the customer taking out the loan
    private String customerLastName;            // Last name of the customer taking out the loan
    private String customerEmail;
    private String customerPhoneNumber;

    private LocalDate loanDate;                 // date the loan was taken out
    private LocalDate loanEndDate;              // Date at which loan is completely paid off
    private int monthsToEndDate;                // Hello

    private long originalAmount;                // The original amount of money the loan was.
    private Long remainingBalance;              // amount still owed.
    private Long scheduledPaymentAmount;        // The amount you are paying per (Week/Biweekly/Monthly) (Amount you are paying per payment)
    private long startingPayment;               // This is the amount paid off. For sake of having partially paid loans. Only needs to work for Postman.

    private Double interestRate = 0.05;  // annual rate (Pretend percent).
    private long totalAndInterest;      // Total amount you will have paid with plan.

    private String paymentFrequency;

    private Long customerId;
}
