# 🛒 Greencart – Online Grocery Delivery Website

Greencart is a **full-stack grocery delivery e-commerce web application** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It offers a smooth shopping experience for users, a seller dashboard for managing products, and **secure online payments via eSewa**.

---

## 🚀 Features

### 👤 User Features
- Browse grocery products by category
- View product details with images and pricing
- Add items to cart and manage quantities
- Select delivery address
- Secure checkout using **eSewa payment gateway**
- Responsive and user-friendly UI

### 🧑‍💼 Seller/Admin Features
- Seller dashboard
- Add, update, and delete products
- Manage product listings easily

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Payment Gateway
- **eSewa (Nepal Online Payment System)**

---

## 📂 Project Structure

Greencart-grocery--web/
├── frontend/ # React frontend
├── backend/ # Node.js & Express backend
├── .gitignore
├── README.md
└── package.json


---

## ⚙️ Installation & Setup

###  Clone the repository
git clone https://github.com/Sanik1100/Greencart-grocery--web.git
cd Greencart-grocery--web

### Backend Setup
cd backend
npm install

###  Create a .env file inside backend/
PORT=5000
MONGO_URI=your_mongodb_connection_string
ESEWA_MERCHANT_CODE=your_esewa_merchant_code

###  Run backend:
npm start

###  Frontend Setup
cd frontend
npm install
npm run dev

### 🚀 payment_integration:
  gateway: eSewa
  flow:
    - Redirects users to eSewa after checkout
    - Processes payment securely
    - Returns users to the app based on payment status

### 🚀 learning_purpose:
 🚀 topics:
    - MERN stack development
    - Full-stack project structure
    - Payment gateway integration
    - State management and API handling

🚀credits:
  source: YouTube tutorial
  link: https://youtu.be/PaQX0pktLnw?si=qXcpcCB2cKJc_lCV
  note: Customized by replacing Stripe with the eSewa payment gateway




