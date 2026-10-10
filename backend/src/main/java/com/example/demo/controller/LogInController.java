package com.example.demo.controller;

import com.example.demo.domain.LogIn;
import com.example.demo.service.LogInService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LogInController {
	private final LogInService logInService;

	@PostMapping("/api/login")
	public ResponseEntity<?> validate(@RequestBody LogIn user){

		LogIn userInfo = logInService.getCredentials(user.getUserName(), user.getPassword());

		if (userInfo == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(userInfo, HttpStatus.OK);
	}

	@PostMapping("/api/login/add")
	public ResponseEntity<?> addUser(@RequestBody LogIn user){

		return new ResponseEntity<>(logInService.create(user), HttpStatus.CREATED);
	}

}
