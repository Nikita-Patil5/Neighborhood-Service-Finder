# Match JAVA_VERSION to <java.version> in your pom.xml (build with --build-arg JAVA_VERSION=25 if needed)
ARG JAVA_VERSION=21

FROM maven:3.9-eclipse-temurin-${JAVA_VERSION} AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package -DskipTests

FROM eclipse-temurin:${JAVA_VERSION}-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
