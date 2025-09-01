# 🏫 School Finder

A responsive web application built with **Next.js**, **Tailwind CSS**, and **MySQL**, designed to manage and display school listings. The project allows users to **add schools** via a form and **view them** in a searchable, card-style layout.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 13+, Tailwind CSS
- **Form Handling:** React Hook Form, Yup
- **Backend/API:** Next.js API Routes, Axios
- **Database:** MySQL
- **File Upload:** Cloudinary
- **Icons & UI:** React Icons, React Spinners, React Toastify

---

## 📁 Pages Overview

### 1. `/addSchool` – Add a New School  
- Form with validation using `react-hook-form` and `yup`  
- Inputs: name, address, city, state, contact number, email, image  
- Validates required fields, image size, email format, etc.  
- Dark mode support  
- Responsive layout (mobile & desktop)

### 2. `/showSchools` - Show list of Schools 
- Displays list of schools in a card layout  
- Search by name, address, or city  
- Lazy loading / infinite scroll  
- Delete functionality with confirmation  
- Responsive UI inspired by product listing pages  
- Dark mode supported

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MySQL Server
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/anshul-c0des/schools.git
cd schools
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup your MySQL database**
- Create a schools table with the following fields:
```bash
  CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  contact BIGINT,
  email_id TEXT,
  image TEXT
  );
```

4. **Configure environment variables**

- Create a .env.local file in the root directory:
```bash
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. **Run the development server**
```bash
npm run dev
```

---

## ✅ Features

- 🔒 Validated school data form

- 📷 Image preview before upload

- 🌒 Light/Dark theme toggle

- 🔍 Search functionality (live filtering)

- 📄 Paginated + infinite scroll display

- ❌ Delete school (with confirmation)

- ⚡ Smooth transitions and responsive design

---

## 🌐 Live Demo

🔗 **[View Deployed Project on Vercel]([https://schools-theta-mocha.vercel.app/])**  
