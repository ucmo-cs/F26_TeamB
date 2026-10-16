package com.example.demo.service;

import com.example.demo.domain.Customer;
import com.example.demo.domain.LogIn;
import com.example.demo.repository.LogInRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Locale;

@Service
@AllArgsConstructor
public class LogInService {
	private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	private static final String NUMBERS = "0123456789";
	private static final String SPECIAL_CHARACTERS = "!@#$*";
	private static final String PASSWORD_CHARACTERS = LETTERS + NUMBERS + SPECIAL_CHARACTERS;
	private static final SecureRandom RANDOM = new SecureRandom();

	private final LogInRepository logInRepository;

	@Transactional
	public LogIn create(LogIn registeredUser){
		return logInRepository.save(registeredUser);
	}

	@Transactional
	public LogIn createCustomerCredentials(Customer customer) {
		if (customer.getId() == null
				|| customer.getFirstName() == null || customer.getFirstName().isBlank()
				|| customer.getLastName() == null || customer.getLastName().isBlank()) {
			throw new IllegalArgumentException("Customer ID, first name, and last name are required");
		}

		String firstName = customer.getFirstName().trim();
		String lastName = customer.getLastName().trim();
		LogIn credentials = new LogIn();
		credentials.setFirstName(firstName);
		credentials.setLastName(lastName);
		credentials.setUserName(
				firstName.substring(0, 1).toLowerCase(Locale.ROOT)
						+ lastName.toLowerCase(Locale.ROOT)
						+ customer.getId());
		credentials.setPassword(generatePassword(customer));
		credentials.setRole("customer");
		credentials.setCustomerId(customer.getId());
		return logInRepository.save(credentials);
	}

	@Transactional
	public LogIn getCredentials(String userName, String password){
		return logInRepository.findByUserNameAndPassword(userName, password);
	}

	private String generatePassword(Customer customer) {
		char firstName = customer.getFirstName().charAt(0);
		char lastName = customer.getLastName().charAt(0);
		long id = customer.getId();

		return "" + firstName + lastName + id + "00";
	}
	/*

	private String generatePassword() {
		char[] password = new char[12];
		password[0] = LETTERS.charAt(RANDOM.nextInt(LETTERS.length()));
		password[1] = NUMBERS.charAt(RANDOM.nextInt(NUMBERS.length()));
		password[2] = SPECIAL_CHARACTERS.charAt(RANDOM.nextInt(SPECIAL_CHARACTERS.length()));



		for (int i = 3; i < password.length; i++) {
			password[i] = PASSWORD_CHARACTERS.charAt(RANDOM.nextInt(PASSWORD_CHARACTERS.length()));
		}

		for (int i = password.length - 1; i > 0; i--) {
			int swapIndex = RANDOM.nextInt(i + 1);
			char current = password[i];
			password[i] = password[swapIndex];
			password[swapIndex] = current;
		}

		return new String(password);
	}
	 */
}
