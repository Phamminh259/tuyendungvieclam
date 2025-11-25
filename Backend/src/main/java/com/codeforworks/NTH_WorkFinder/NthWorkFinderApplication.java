package com.codeforworks.NTH_WorkFinder;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NthWorkFinderApplication {

	public static void main(String[] args) {
		// Load file .env từ thư mục gốc
		Dotenv dotenv = Dotenv.configure()
				.directory("./") // Đảm bảo file .env nằm ở thư mục gốc dự án
				.ignoreIfMissing() // Không lỗi nếu file .env không tồn tại
				.load();

		// Đặt các biến từ .env vào System properties
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(NthWorkFinderApplication.class, args);
	}

}
