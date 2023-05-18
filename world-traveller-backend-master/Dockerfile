FROM openjdk:17-alpine AS builder

COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x gradlew

RUN ./gradlew assemble

FROM openjdk:17-alpine

COPY --from=builder build/libs/*.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-DB_SCHEMA=${DB_SCHEMA} -DB_USERNAME:${DB_USERNAME} -DB_PASSWORD=${DB_PASSWORD} -DB_URL=${DB_URL} -CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS} -JWT_ISSUER=${JWT_ISSUER} -JWT_SECRET=${JWT_SECRET}", "/app.jar"]
