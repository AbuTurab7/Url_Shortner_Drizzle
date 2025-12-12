# Url_Shortner_Drizzle

A modern **URL Shortener Web Application** built with Drizzle ORM and a web framework (Node.js/Express). 
This project allows users to shorten long URLs into compact, shareable links and automatically redirects users from the short URL to the original link.

---

## Features

- Shorten long URLs into short, shareable links  
- Redirect users from short URLs to original URLs  
- Simple, intuitive API for creating and retrieving links  
- Optional analytics or click tracking  
- Persistent storage using Drizzle ORM

---

## Tech Stack

**Backend**  
- Drizzle ORM (for database modeling and queries)  
- Node.js / Express.js   
**Frontend **  
- EJS  
---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbuTurab7/Url_Shortner_Drizzle.git
cd Url_Shortner_Drizzle
```

## 🗄️ Backend Setup ### 
1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
```bash
DATABASE_URL=your_database_connection_string
PORT=4000
```

### 3. Run Migrations
```bash
npx drizzle-kit migrate dev
```
### 4. Start Backend Server
```bash
npm run dev
```


### Usage
1. Send a POST request to /api/shorten with the long URL
2. Receive the shortened URL
3. Navigate to the short URL to be redirected

### Author
Abu Turab
GitHub: [Abuturab7](https://github.com/AbuTurab7)

