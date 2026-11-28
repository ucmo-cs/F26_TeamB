package com.example.demo.repository;

import com.example.demo.domain.LogIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogInRepository extends JpaRepository<LogIn,Long>{
	LogIn findByUserNameAndPassword(String userName, String password);
	LogIn findByCustomerId(Long customerId);
}
