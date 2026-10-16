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
public class LoanService {

    private final LoanRepository loanRepository;
    private final CustomerRepository customerRepository;
    private final LogInService logInService;
    private final LoanPaymentCalculationService loanPaymentCalculationService;


    @Transactional
    public Loan create(Loan loan) {
        //Checks to see if the customer already exists. If a customer is not returned a new customer is created.
        Customer customer = customerRepository
                .findByFirstNameAndLastName(loan.getCustomerFirstName(), loan.getCustomerLastName())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setFirstName(loan.getCustomerFirstName());
                    newCustomer.setLastName(loan.getCustomerLastName());
                    newCustomer.setEmail(loan.getCustomerEmail());
                    newCustomer.setPhoneNumber(loan.getCustomerPhoneNumber());
                    Customer savedCustomer = customerRepository.save(newCustomer);
                    logInService.createCustomerCredentials(savedCustomer);
                    return savedCustomer;
                });
        loan.setCustomerId(customer.getId());

        // If loan is new remaining balance is equivalent to original amount.
        if (loan.getRemainingBalance() == null) {
            loan.setRemainingBalance(loan.getOriginalAmount() - loan.getStartingPayment()); // If loan starting payment is above 0 it should be deducted from current loan
        }
        if (loan.getPaymentFrequency() != null){
            loanPaymentCalculationService.calculatePayoffDateAndTotal(loan, loan.getPaymentFrequency());
        }


        return loanRepository.save(loan);
    }

    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long id){
        return loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    //Changes the scheduled payment amount in a loan
    @Transactional
    public Loan update(Long id,Loan updates){
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        loan.setPaymentFrequency(updates.getPaymentFrequency());
        if (loan.getMonthsToEndDate() == 0){
            loan.setMonthsToEndDate(12);
        }

        if (loan.getScheduledPaymentAmount() != null){
            loanPaymentCalculationService.calculatePayoffDateAndTotal(loan, loan.getPaymentFrequency());
        }
        // Scheduled Payment Amount set in LoanPaymentCalcService

        return loanRepository.save(loan);
    }
}