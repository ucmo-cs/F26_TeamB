package com.example.demo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor // Lombok Library
@NoArgsConstructor // Lombok Library
@Data // Lombok library (Creates dataset)
@Entity // From JPA
public class LogIn {

	@Id // From JPA
	@GeneratedValue(strategy = GenerationType.IDENTITY) // From JPA. Whenever adding new data it will automatically increase
	private Long id;
	private String firstName;
	private String lastName;
	private String userName;
	private String password;
	private String role; 
	private Long customerId;
}
