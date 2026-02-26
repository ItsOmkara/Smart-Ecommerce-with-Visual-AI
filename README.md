# 🛒 VISOAI — Smart E-Commerce with Visual AI Search

> **AI-powered e-commerce platform** where you can upload any image and instantly find visually similar products using **CLIP + FAISS** technology.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-green?logo=springboot)
![Python](https://img.shields.io/badge/Python-FastAPI-blue?logo=python)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

---

## ✨ Features

- 📸 **Visual Search** — Upload any image and find similar products using OpenAI's CLIP model + FAISS vector search
- 🛍️ **Product Catalog** — Browse, search, and filter products across multiple categories
- 🔐 **JWT Authentication** — Secure user registration, login, and session management
- 🛒 **Shopping Cart** — Add to cart, update quantities, and remove items (synced with backend)
- 📦 **Checkout & Orders** — Address form, order placement, and order history stored in database
- 🎨 **Premium UI** — Dark glassmorphism design with liquid animations, smooth transitions, and Framer Motion
- 📱 **Responsive** — Fully responsive across desktop, tablet, and mobile

---

## 🏗️ Architecture

```
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   Next.js Frontend │────▶│  Spring Boot API   │────▶│     MySQL DB       │
│     (Port 3000)    │     │    (Port 8080)      │     │                    │
└────────┬───────────┘     └────────────────────┘     └────────────────────┘
         │
         │  Visual Search
         ▼
┌────────────────────┐
│  Python AI Service │
│  CLIP + FAISS      │
│    (Port 8001)     │
└────────────────────┘
```

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion | UI with visual search, product browsing, cart, checkout |
| **Backend** | Spring Boot 3.4, Java 17, Spring Security, JPA | REST APIs for products, auth, cart, orders |
| **AI Service** | Python, FastAPI, OpenAI CLIP (ViT-B/32), FAISS | Image embedding & similarity search |
| **Database** | MySQL 8.0 | Products, users, cart, orders, order items |

---

## 📁 Project Structure

```
Smart-Ecommerce-with-Visual-AI/
├── src/                        # Next.js Frontend
│   ├── app/                    # App router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── products/           # Product listing & detail
│   │   ├── search/             # Visual search page
│   │   ├── cart/               # Shopping cart & checkout
│   │   ├── login/              # Login page
│   │   └── signup/             # Registration page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Button, Input, Badge, etc.
│   │   ├── layout/             # Navbar, Footer
│   │   ├── product/            # Product card
│   │   └── cart/               # Cart sheet
│   └── lib/                    # Utilities & contexts
│       ├── api.ts              # API service layer
│       ├── auth-context.tsx    # Auth state management
│       ├── cart-context.tsx    # Cart state management
│       └── types.ts            # TypeScript interfaces
│
├── backend/                    # Spring Boot Backend
│   └── src/main/java/com/visualai/backend/
│       ├── controller/         # REST controllers
│       ├── entity/             # JPA entities
│       ├── repository/         # Spring Data repositories
│       ├── service/            # Business logic
│       └── config/             # Security & CORS config
│
├── ai-service/                 # Python AI Service
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Configuration
│   ├── models/
│   │   ├── clip_model.py       # CLIP model wrapper
│   │   └── faiss_index.py      # FAISS index management
│   ├── routes/
│   │   ├── search.py           # Visual search endpoint
│   │   └── index.py            # Index rebuild endpoint
│   ├── utils/
│   │   └── image_utils.py      # Image loading utilities
│   └── requirements.txt        # Python dependencies
│
├── package.json                # Frontend dependencies
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ (JDK)
- **Python** 3.9+
- **MySQL** 8.0+
- **Maven** (or use the included `mvnw` wrapper)

### 1. Clone the Repository

```bash
git clone https://github.com/ItsOmkara/Smart-Ecommerce-with-Visual-AI.git
cd Smart-Ecommerce-with-Visual-AI
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE visual_ecommerce_db;
```

> The tables are auto-created by Hibernate when the backend starts (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Or open the `backend/` folder in IntelliJ IDEA and run the application.

The backend will start on **http://localhost:8080**.

### 4. AI Service (Python)

```bash
cd ai-service
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

The AI service will start on **http://localhost:8001**.

> ⚠️ First startup downloads the CLIP model (~350MB). FAISS index is built automatically from database products.

### 5. Frontend (Next.js)

```bash
# From the project root
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user info |

### Products
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?category=` | Filter by category |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search?q=` | Text search |
| GET | `/api/products/:id/related` | Related products |

### Cart (requires auth)
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders (requires auth)
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/orders` | Place order (with shipping address) |
| GET | `/api/orders` | Order history |

### Visual Search (AI Service)
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/search/visual` | Upload image for visual search |
| POST | `/api/index/rebuild` | Rebuild FAISS index |

---

## 🧠 How Visual Search Works

1. **User uploads an image** on the search page
2. **CLIP (ViT-B/32)** encodes the image into a 512-dimensional embedding
3. **FAISS index** performs approximate nearest neighbor search against pre-computed product embeddings
4. **Top-K similar products** are returned with similarity scores
5. **Full product details** are fetched from the Spring Boot API

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS 3, Framer Motion, Radix UI |
| **Backend** | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA, Lombok |
| **AI/ML** | Python, FastAPI, OpenAI CLIP, FAISS, PyTorch, NumPy |
| **Database** | MySQL 8.0, Hibernate ORM |
| **Auth** | JWT (jjwt 0.12.6), Spring Security |

---

## 👤 Author

**Omkar Birajdar** — [@ItsOmkara](https://github.com/ItsOmkara)
