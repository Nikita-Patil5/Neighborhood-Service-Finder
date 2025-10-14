# 🏙️ Neighborhood Service Finder

A **full-stack web platform** built using **Spring Boot**, **React.js**, and **MySQL**, designed to connect customers with nearby service providers such as electricians, plumbers, cleaners, and more.  
This system offers secure authentication, booking management, email notification, user reviews, and an admin monitoring panel for a seamless and efficient service experience.

---

## 👩‍💻 Developed by
**👋 Hi, I'm [Nikita Patil](https://github.com/Nikita-Patil5)**  
A passionate Full-Stack Software Developer skilled in Java, Spring Boot, React.js, MySQL, and more.  
I love building innovative and scalable solutions that make real-world impact. 🚀  

---

## 🚀 Features

### 👤 User
- Register & login (JWT authentication)
- Browse available services
- Book a service (with confirmation via email)
- View & cancel bookings
- Leave,update and delete reviews for services

### 👨‍🔧 Provider
- Register as service provider
- Manage services (add/update/delete)
- View and manage bookings
- Provide contact details (phone, address) visible to customers

### 👨‍💼 Admin
- Manage users and service providers
- Manage all services
- Monitor bookings and reviews

---

## 🛠️ Tech Stack

### Backend (Java + Spring Boot)
- Spring Boot
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL
- RESTful APIs
- Lombok

### Frontend (React + Vite)
- React.js
- React Router DOM
- Axios
- Bootstrap / Custom CSS
- FontAwesome & React Icons

### Tools
- Git & GitHub
- Postman (API testing)
- npm / Node.js

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Nikita-Patil5/Neighborhood-Service-Finder.git
cd neighborhood-service-finder
2️⃣ Backend Setup
bash
cd backend
Update application.properties with your MySQL credentials:

properties
spring.datasource.url=jdbc:mysql://localhost:3306/neighborhood_service
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
Run backend:

bash
mvn spring-boot:run
Backend will start on http://localhost:8080

3️⃣ Frontend Setup
bash
cd frontend
npm install
npm run dev
Frontend will start on http://localhost:5173

🔗 API Endpoints (Sample)
Authentication
POST /api/auth/register → Register user

POST /api/auth/login → Login user

Services
GET /api/services → Get all services

POST /api/services → Add new service (Provider only)

Bookings
POST /api/bookings → Create booking

GET /api/bookings/my → Get logged-in user's bookings

PUT /api/bookings/{id}/cancel → Cancel booking

Reviews
POST /api/reviews → Add review

PUT /api/reviews/{id} → Update review

DELETE /api/reviews/{id} → Delete review

📂 Folder Structure
bash
neighborhood-service-finder/
├── backend/                # Spring Boot backend
│   ├── src/main/java/...   # Controllers, Services, Models, DTOs
│   └── src/main/resources/ # application.properties
│
├── frontend/               # React + Vite frontend
│   ├── src/api/            # Axios API methods
│   ├── src/components/     # Reusable components
│   ├── src/pages/          # User/Provider/Admin pages
│   └── App.jsx
│
└── README.md               # Project documentation

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.