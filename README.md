# 🌸 Bridal Orna — Wedding Dupatta Business App

A full-stack web application for managing a bridal dupatta business.
Supports **Admin**, **Shop (bulk buyer)**, and **Customer** roles.

---

## 📁 Project Structure

```
bridal-orna/
├── backend/                  ← Node.js + Express API
│   ├── models/
│   │   ├── User.js           ← User schema (admin/shop/customer)
│   │   ├── Product.js        ← Product schema with dual pricing
│   │   └── Order.js          ← Order schema with items & custom design
│   ├── routes/
│   │   ├── auth.js           ← Register, Login, Profile
│   │   ├── products.js       ← CRUD for products
│   │   ├── orders.js         ← Place order, My orders
│   │   └── admin.js          ← Admin dashboard, all orders
│   ├── middleware/
│   │   ├── auth.js           ← JWT protect + adminOnly middleware
│   │   └── upload.js         ← Multer file upload config
│   ├── scripts/
│   │   └── createAdmin.js    ← Run once to create admin account
│   ├── uploads/              ← Auto-created on first upload
│   │   ├── products/
│   │   └── designs/
│   ├── server.js             ← Main Express entry point
│   ├── .env.example          ← Copy to .env and fill in values
│   └── package.json
│
└── frontend/                 ← React App
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js    ← Global auth state (login/logout)
    │   ├── components/
    │   │   ├── Navbar.js         ← Top navigation bar
    │   │   ├── Footer.js         ← Footer with WhatsApp link
    │   │   ├── ProductCard.js    ← Product grid card
    │   │   ├── WhatsAppButton.js ← Floating WhatsApp button
    │   │   ├── OrderStatusBadge.js
    │   │   └── LoadingSpinner.js
    │   ├── pages/
    │   │   ├── HomePage.js       ← Landing page
    │   │   ├── ProductsPage.js   ← Browse + search products
    │   │   ├── ProductDetailPage.js ← Single product + booking
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js   ← Choose shop or customer role
    │   │   ├── BookingPage.js    ← Place order + custom design
    │   │   ├── MyOrdersPage.js   ← User's booking history
    │   │   └── admin/
    │   │       ├── AdminDashboard.js  ← Stats overview
    │   │       ├── AdminProducts.js   ← Add/edit/delete products
    │   │       └── AdminOrders.js     ← View & update all orders
    │   ├── App.js              ← Routes
    │   ├── index.js
    │   └── index.css           ← Global styles (luxury bridal theme)
    ├── .env.example
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure these are installed on your computer:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| MongoDB | v6 or higher | https://www.mongodb.com/try/download/community |
| npm | comes with Node.js | — |

---

## 🚀 Step-by-Step Setup

### Step 1: Clone / Download the project

```bash
# If using git:
git clone <your-repo-url>
cd bridal-orna

# Or just unzip the downloaded folder
```

---

### Step 2: Set up the Backend

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# Copy the example env file and edit it
cp .env.example .env
```

Now open `backend/.env` in any text editor and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bridal-orna
JWT_SECRET=some_long_random_secret_string_change_this
ADMIN_EMAIL=admin@yourbusiness.com
ADMIN_PASSWORD=yourStrongPassword123
WHATSAPP_NUMBER=919876543210
```

> **Important:** Change `JWT_SECRET` to any long random string.
> Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your real credentials.
> `WHATSAPP_NUMBER` must include country code. Bangladesh: `880XXXXXXXXXX`, India: `91XXXXXXXXXX`

---

### Step 3: Start MongoDB

```bash
# On Windows (if installed as a service, it may already be running)
# Or start manually:
mongod

# On Mac/Linux:
mongod --dbpath /data/db
```

---

### Step 4: Create the Admin Account

```bash
# Still inside the backend/ folder
node scripts/createAdmin.js
```

You should see:
```
✅ Connected to MongoDB
🎉 Admin account created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Email   : admin@yourbusiness.com
  Password: yourStrongPassword123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 5: Start the Backend Server

```bash
# Development mode (auto-restarts on file changes):
npm run dev

# Or production mode:
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 6: Set up the Frontend

Open a **new terminal window** and:

```bash
# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install

# Copy and edit the env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_WHATSAPP_NUMBER=919876543210
```

---

### Step 7: Start the Frontend

```bash
npm start
```

The browser will open automatically at **http://localhost:3000** 🎉

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | (what you set in .env) | (what you set in .env) |
| Shop | Register a new shop account | — |
| Customer | Register a new customer account | — |

---

## 📱 Features Overview

### For Customers:
- Browse all products with images, prices, and stock status
- Search by name or category
- View "Out of Stock" and "Only X left" badges
- Register as individual customer or shop
- Book products with quantity selector
- Request custom design with image upload
- View order history with status tracking
- WhatsApp button to contact admin directly

### For Shops (Bulk Buyers):
- Everything customers have, PLUS:
- See lower bulk prices automatically after login
- Pricing clearly labeled as "Shop Price"

### For Admin:
- Dashboard with order stats, revenue, low stock alerts
- Add products with multiple image upload
- Set dual pricing (customer price + shop price)
- Edit and delete products
- View all orders with full customer details
- Filter orders by customer type (shop vs individual)
- Filter orders by status
- Update order status: Pending → In Progress → Delivered
- Click WhatsApp on any order to contact customer directly

---

## 🛣️ API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin only |
| PUT | `/api/products/:id` | Admin only |
| DELETE | `/api/products/:id` | Admin only |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Logged-in users |
| GET | `/api/orders/my` | Logged-in users |
| GET | `/api/orders/:id` | Owner or Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/dashboard` | Admin only |
| GET | `/api/admin/orders` | Admin only |
| PUT | `/api/admin/orders/:id/status` | Admin only |
| GET | `/api/admin/users` | Admin only |

---

## 💡 Common Issues & Fixes

**Problem:** `EADDRINUSE: address already in use :::5000`
**Fix:** Another app is using port 5000. Change `PORT=5001` in backend `.env`.

**Problem:** `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`
**Fix:** MongoDB is not running. Start it with `mongod` command.

**Problem:** Images not showing
**Fix:** Make sure backend server is running on port 5000. Frontend uses `http://localhost:5000` as the image base URL.

**Problem:** Login says "Invalid email or password"
**Fix:** Make sure you ran `node scripts/createAdmin.js` first for admin. For shop/customer, register first.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Pure CSS with CSS Variables (no framework needed) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer (local storage) |
| HTTP Client | Axios |

---

## 🚢 Deploying to Production

### Backend (e.g., Railway, Render, or VPS):
1. Set all `.env` variables in your hosting dashboard
2. Change `MONGO_URI` to your MongoDB Atlas connection string
3. Run `npm start`

### Frontend (e.g., Vercel, Netlify):
1. Change the proxy/API base URL in frontend code to your backend URL
2. Set `REACT_APP_WHATSAPP_NUMBER` in your hosting environment variables
3. Run `npm run build` and deploy the `build/` folder

---

## 📞 Need Help?

Contact via WhatsApp or open an issue. Happy selling! 🌸
