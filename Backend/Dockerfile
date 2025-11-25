# Sử dụng Maven 21 build ứng dụng
FROM maven:3.9.9-eclipse-temurin-21 AS build
# Đặt thư mục làm việc trong container
WORKDIR /app
# Copy pom vào container
COPY pom.xml .
COPY src ./src
# Build project bằng Maven
RUN mvn clean package -DskipTests

# Run stage
# --- Image chạy ứng dụng ---
FROM eclipse-temurin:21-jdk AS runtime
# Đặt thư mục làm việc
WORKDIR /app
# Sao chép file JAR từ bước build vào container
COPY --from=build /app/target/NTH-WorkFinder-0.0.1-SNAPSHOT.jar .
# Mở cổng ứng dụng
EXPOSE 8080
# Lệnh chạy ứng dụng
ENTRYPOINT ["java","-jar","/app/NTH-WorkFinder-0.0.1-SNAPSHOT.jar"]