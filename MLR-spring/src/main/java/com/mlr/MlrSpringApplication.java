package com.mlr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling 
public class MlrSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MlrSpringApplication.class, args);
	}

}