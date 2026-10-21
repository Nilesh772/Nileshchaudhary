# Full Stack Web Development - Practical Lab Manual & Solutions

This repository contains complete, production-ready, clean, single-file implementations for all **7 Full Stack Web Development Practicals** (React.js, Express.js REST APIs, MongoDB Atlas) along with a consolidated **Microsoft Word Documentation File** (`All_Practicals_Documentation.docx`).

---

## 📋 Practicals Overview

| Practical No. | Practical Title | Technology | File Name |
| :---: | :--- | :--- | :--- |
| **1** | Build a React application using Functional Components, JSX and Component Reusability concepts. | React.js | [`Practical-1.jsx`](./Practical-1.jsx) |
| **2** | Develop a React application implementing Props, State Management and Event Handling. | React.js | [`Practical-2.jsx`](./Practical-2.jsx) |
| **3** | Create a Student Management System using React Forms, Controlled Components and Validation. | React.js | [`Practical-3.jsx`](./Practical-3.jsx) |
| **4** | Develop a Single Page Application (SPA) using React Router for navigation between multiple pages. | React Router / React.js | [`Practical-4.jsx`](./Practical-4.jsx) |
| **5** | Create a backend server using Express.js implementing routing and CRUD operation. | Express.js / Node.js | [`Practical-5.js`](./Practical-5.js) |
| **6** | Build RESTful APIs for Student Records Management using Express.js and Postman testing. | Express.js / REST / Postman | [`Practical-6.js`](./Practical-6.js) |
| **7** | Develop an Employee Management API integrating Express.js with MongoDB Atlas. | Express.js / Mongoose / MongoDB Atlas | [`Practical-7.js`](./Practical-7.js) |

---

## 📄 Consolidated Word Document
- **Word File**: [`All_Practicals_Documentation.docx`](./All_Practicals_Documentation.docx)
  - Contains Cover Page, Index Table, Aims, Theoretical Background, Full Source Code, Execution Steps, and Lab Viva Questions & Answers for all 7 Practicals.
  - Ready for immediate college/university submission or printing.

---

## 🚀 How to Run the Practicals

### 1. React Practicals (1 to 4)
Each React practical is written as a self-contained modern component (`.jsx`).
You can import any of them directly into your React application (Vite / Create React App / Next.js):

```jsx
import Practical1 from './Practical-1';
import Practical2 from './Practical-2';
import Practical3 from './Practical-3';
import Practical4 from './Practical-4';

export default function App() {
  return <Practical1 />; // Or Practical2, Practical3, Practical4
}
```

---

### 2. Backend Express.js Practicals (5 to 7)

First install the server dependencies (one time):
```bash
npm install
```

#### Run Practical 5 (Express CRUD Server):
```bash
npm run start:p5
# or: node Practical-5.js
```
- Server starts at: `http://localhost:5000`
- API endpoint: `http://localhost:5000/api/products`

#### Run Practical 6 (Student Records RESTful API):
```bash
npm run start:p6
# or: node Practical-6.js
```
- Server starts at: `http://localhost:5001`
- API endpoint: `http://localhost:5001/api/v1/students`
- Postman Collection: Import [`Practical-6-Postman-Collection.json`](./Practical-6-Postman-Collection.json) into Postman to test all routes with 1 click.

#### Run Practical 7 (Employee API with MongoDB Atlas):
```bash
npm run start:p7
# or: node Practical-7.js
```
- Server starts at: `http://localhost:5002`
- API endpoint: `http://localhost:5002/api/employees`
- MongoDB Atlas Connection: Configure your connection string in `.env` (refer to `.env.example`).
  - *Note: If MongoDB Atlas is not yet configured, the server automatically activates a resilient in-memory mode so you can test all CRUD operations without crashes!*

---

## 📤 How to Git Push

To commit and push all files to your GitHub repository:
```bash
git add .
git commit -m "Add all 7 practicals full code and documentation docx file"
git push origin main
```
