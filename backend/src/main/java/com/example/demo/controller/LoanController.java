package com.example.demo.controller;

import com.example.demo.domain.Loan;
import com.example.demo.service.LoanService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")     //Vite dev server. This supposedly allows the dev server to call backend.
@AllArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // GET http://localhost:8081/api/admin Get All Loans for Admin view.
    @GetMapping("/admin")
    public List<Loan> getLoans() {
        return loanService.findAll();
    }

    // POST http://localhost:8081/api/loan Loan creation.
    @PostMapping("/loan")
    public ResponseEntity<Loan> create(@RequestBody Loan loan) {
        return new ResponseEntity<>(loanService.create(loan), HttpStatus.CREATED);
    }

    // Patch http://localhost:8081/api/loans/{id}
    // Updates the payment information in the loan
    @PatchMapping("/loans/{id}")
    public ResponseEntity<Loan> update(@PathVariable Long id, @RequestBody Loan loan){
        return ResponseEntity.ok(loanService.update(id, loan));
    }

    // Get http://localhost:8081/api/loans/{id}
    // Returns a loan based on the loan id
    @GetMapping("/loans/{id}")
    public Loan getLoan(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

}