package com.example.demo.config;

import com.example.demo.domain.LogIn;
import com.example.demo.repository.LogInRepository;
import com.example.demo.domain.Loan;
import com.example.demo.repository.LoanRepository;
import com.example.demo.domain.Customer;
import com.example.demo.repository.CustomerRepository;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner{

	private final LogInRepository loginRepo;
	private final LoanRepository loanRepo;
	private final CustomerRepository customerRepo;

	public DataLoader(LogInRepository logInRepository, LoanRepository loanRepository, CustomerRepository customerRepository){
		this.loginRepo = logInRepository;
		this.loanRepo = loanRepository;
		this.customerRepo = customerRepository;
	}

	@Override
	public void run(String... args) throws Exception {
		LogIn admin = new LogIn(null, "Larry", "James", "admin", "admin", "admin", null);
		LogIn customer = new LogIn(null, "John", "Smith", "customer", "customer", "customer",1L);
		Customer myCustomer = new Customer(null, "John","Smith", "johnsmith@example.com", "123-456-7890", "Big Bank", 123456789, 12345);
		loginRepo.save(admin);
		loginRepo.save(customer);
		myCustomer = customerRepo.save(myCustomer);

		Loan loan = new Loan(null, "John", "Smith", "johnsmith@example.com","123-456-7890" ,LocalDate.parse("2023-01-01"), LocalDate.parse("2024-01-01"), 12, 10000, 5000L, 500L, 500L, 0.05, 10500,"Monthly", myCustomer.getId());
		
		loanRepo.save(loan);


	}
}