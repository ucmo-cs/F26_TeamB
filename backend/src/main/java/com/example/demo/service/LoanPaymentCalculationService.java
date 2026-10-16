package com.example.demo.service;

import com.example.demo.domain.Loan;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class LoanPaymentCalculationService {
    public void calculatePayoffDateAndTotal(Loan loan, String paymentFrequency){
        int recurring;        // This is the number of payments per year
        if(paymentFrequency.equals("Monthly")){
            recurring = 12;
        }
        else if(paymentFrequency.equals("Bi-weekly")){
            recurring = 26;
        }
        else{   // Defaults to Weekly should not correct string for payment frequency be provided
            recurring = 52; // Weekly
        }

        Long remainingBalance = loan.getRemainingBalance();
        LocalDate currentDate = loan.getLoanDate();
        Long paymentAmount = loan.getScheduledPaymentAmount();
        double interest = loan.getInterestRate();
        LocalDate payoffDate = loan.getLoanEndDate();
        long totalPlusInterest = 0;

        int totalPayments = (int) Math.ceil(loan.getMonthsToEndDate() * recurring / 12.0);
        // Amoritization formula (partial). 1 Problem. It is not setup for years. Instead of recurring it needs to be total number of payments.
        double periodicInterest = interest / recurring; // This adjusts interest so that payment amount is geared for 1 year.
        paymentAmount = (long) Math.ceil(remainingBalance * ((periodicInterest * Math.pow(1 + periodicInterest, totalPayments)) / (Math.pow(1 + periodicInterest, totalPayments) - 1)));
        loan.setMinimumScheduledPaymentAmount(paymentAmount);

        if (paymentAmount > loan.getScheduledPaymentAmount()){
            loan.setScheduledPaymentAmount(paymentAmount);
        }
        else{
            paymentAmount = loan.getScheduledPaymentAmount(); // This gets the greater set payment amount
            loan.setScheduledPaymentAmount(paymentAmount);
        }

        while(true) {
            if(remainingBalance <= 0){
                totalPlusInterest += remainingBalance; // if remaining balance a negative remove from total amount paid since not paid
                // Rounding has to be earlier Math.round(totalPlusInterest); // Round it so that it is a dollar.
                loan.setLoanEndDate(currentDate); // Set loan end date to be the current date
                loan.setTotalAndInterest(totalPlusInterest);
                break;
            }

            if (recurring == 12) {
                currentDate = currentDate.plusMonths(1);
            } else if (recurring == 26) {
                currentDate = currentDate.plusWeeks(2);
            } else {
                currentDate = currentDate.plusWeeks(1);
            }
            remainingBalance += Math.round(remainingBalance * (interest / recurring)); // annual interest so only a twelfth of interest is applied in a month
            remainingBalance -= paymentAmount;
            totalPlusInterest += paymentAmount;
        }
    }
}
