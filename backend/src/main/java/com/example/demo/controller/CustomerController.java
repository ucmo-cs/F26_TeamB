package com.example.demo.controller;

import com.example.demo.domain.Customer;
import com.example.demo.domain.Loan;
import com.example.demo.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
    private final CustomerService customerService;

    //Creates a new customer
    @PostMapping ("/api/customer")
    public ResponseEntity<Customer>  create(@RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.create(customer), HttpStatus.CREATED);
    }

    //Get a customer record based on the id
    @GetMapping ("/api/customer/{id}")
    public Customer getCustomer(@PathVariable Long id){
        return customerService.getCustomerById(id);
    }

    //Update customer information
    @PatchMapping ("/api/customer/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer){
        return ResponseEntity.ok(customerService.update(id, customer));
    }

    //Get loan record based on customer id
    @GetMapping("/api/customer/{id}/loans")
    public List<Loan> getLoans(@PathVariable Long id) {
        return customerService.getLoansByCustomerId(id);
    }
}
