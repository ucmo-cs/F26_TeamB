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
        loan.setMonthsToEndDate(checkTerm(loan.getMonthsToEndDate()));
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

    public long getMinimumPayment(Long id, String paymentFrequency) {
        Loan loan = getLoanById(id);
        Loan copy = new Loan();
        copy.setRemainingBalance(loan.getRemainingBalance());
        copy.setLoanDate(loan.getLoanDate());
        copy.setInterestRate(loan.getInterestRate());
        copy.setMonthsToEndDate(loan.getMonthsToEndDate());
        // Huge planned payment so the calculator's payoff loop ends after one step;
        // the minimum is worked out before that loop, so it isn't affected.
        copy.setScheduledPaymentAmount(Long.MAX_VALUE);
        loanPaymentCalculationService.calculatePayoffDateAndTotal(copy, paymentFrequency);
        return copy.getMinimumScheduledPaymentAmount();
    }

    //Changes the scheduled payment amount in a loan
    @Transactional
    public Loan update(Long id,Loan updates){
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        loan.setPaymentFrequency(updates.getPaymentFrequency());
        if (updates.getMonthsToEndDate() != null) {
            loan.setMonthsToEndDate(checkTerm(updates.getMonthsToEndDate()));
        } else if (loan.getMonthsToEndDate() == null || loan.getMonthsToEndDate() == 0) {
            loan.setMonthsToEndDate(12);
        }
        if (updates.getScheduledPaymentAmount() != null) {
            loan.setScheduledPaymentAmount(updates.getScheduledPaymentAmount());
        }

        if (loan.getScheduledPaymentAmount() != null){
            loanPaymentCalculationService.calculatePayoffDateAndTotal(loan, loan.getPaymentFrequency());
        }
        // Scheduled Payment Amount set in LoanPaymentCalcService

        return loanRepository.save(loan);
    }
    private int checkTerm(Integer months) {
        if (months == null || months == 0) {
            return 12;
        }
        if (months < 12 || months > 60) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "monthsToEndDate must be between 12 and 60");
        }
        return months;
    }

}
