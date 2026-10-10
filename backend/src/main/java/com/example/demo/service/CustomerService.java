package com.example.demo.service;

import com.example.demo.domain.Customer;
import com.example.demo.domain.Loan;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.LoanRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final LoanRepository loanRepository;
    private final LogInService logInService;

    //Creates a new customer record
    @Transactional
    public Customer create(Customer customer) {
        Customer savedCustomer = customerRepository.save(customer);
        logInService.createCustomerCredentials(savedCustomer);
        return savedCustomer;
    }

    //returns the customer record based off of the customerID
    public Customer getCustomerById(Long id){
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    //Updates any fields in the customer record that were changed.
    @Transactional
    public Customer update(Long id, Customer updates) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (updates.getFirstName() != null) {
            customer.setFirstName(updates.getFirstName());
        }
        if (updates.getLastName() != null) {
            customer.setLastName(updates.getLastName());
        }
        if (updates.getEmail() != null) {
            customer.setEmail(updates.getEmail());
        }
        if (updates.getPhoneNumber() != null) {
            customer.setPhoneNumber(updates.getPhoneNumber());
        }
        if (updates.getBankName() != null) {
            customer.setBankName(updates.getBankName());
        }
        if (updates.getBankRoutingNumber() != null) {
            customer.setBankRoutingNumber(updates.getBankRoutingNumber());
        }
        if (updates.getBankAccountNumber() != null) {
            customer.setBankAccountNumber(updates.getBankAccountNumber());
        }

        return customerRepository.save(customer);
    }

    //returns a list of loans associated with a customer
    public List<Loan> getLoansByCustomerId(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        return loanRepository.findByCustomerId(customerId);
    }

}
