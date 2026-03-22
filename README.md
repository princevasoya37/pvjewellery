# PVJewelleryShop

E-commerce platform for diamonds and jewellery: user catalog, cart, checkout, and admin dashboard.

## Architecture

- **Frontend**: React (CRA), React Router, Redux Toolkit, Tailwind CSS, Axios.
- **Backend**: Node.js, Express, MVC (routes → controllers → services → models), Mongoose.
- **DB**: MongoDB (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for production).
- **Auth**: JWT (access + refresh), bcrypt, role-based access (user / admin).
- **Payments**: Stripe or Razorpay (integration placeholders; add keys in backend).
- **Images**: Cloudinary or S3 (placeholders in backend).

Full specification: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (data models, API, auth flow, frontend routes, security, testing, deployment, roadmap).

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm install
npm run dev
```

API runs at `http://localhost:5000`. Health: `GET http://localhost:5000/api/health`.

### Frontend

```bash
# From repo root
cp .env.example .env.local
# Optional: set REACT_APP_API_URL=http://localhost:5000/api (default)
npm install
npm start
```

App runs at `http://localhost:3000`.

### First admin user

Create a user via `POST /api/auth/register`, then set `role: 'admin'` in MongoDB:

```js
db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } })
```

## Project layout

```
jewl/
├── docs/
│   └── ARCHITECTURE.md    # Full spec: models, API, auth, routes, security, roadmap
├── backend/
│   ├── config/            # default.json, production.json
│   ├── src/
│   │   ├── config/        # db.js
│   │   ├── controllers/   # auth, product, admin
│   │   ├── middleware/    # auth (JWT, RBAC)
│   │   ├── models/        # User, Product, Category, Collection, Order, Coupon, Review, Banner
│   │   ├── routes/        # auth, products, admin
│   │   ├── services/      # authService, productService
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── public/
├── src/
│   ├── api/               # client, auth, products
│   ├── components/        # Layout, Header, Footer, PrivateRoute
│   ├── pages/             # Home, ProductList, ProductDetail, Login, Register, Cart, Checkout, Account, Admin
│   ├── store/             # authSlice, cartSlice, productsSlice
│   ├── App.js
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

## Implemented (Milestones 1–2 + base 3–5)

- **M1 Backend**: Express, MongoDB, User/Product/Category/Collection/Order/Coupon/Review/Banner models; `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, refresh, logout; `GET /products` (filters, pagination), `GET /products/:slug`, categories, collections.
- **M2 Frontend**: React Router, Redux Toolkit, Tailwind; Home, product listing with filters (4Cs, price, type, category, sort, search, pagination), product detail, add to cart.
- **M3 (base)**: Cart (local state), checkout page (address form; payment integration TODO).
- **M4 (base)**: Protected routes, account, order history (API stub), login/register/forgot-password pages.
- **M5 (base)**: Admin route, dashboard stats (orders/products/users count), RBAC.

## Next steps (see docs/ARCHITECTURE.md)

1. **Orders API**: `POST /orders`, `GET /orders`, order creation on payment success.
2. **Stripe/Razorpay**: Payment intent + webhook in backend; checkout flow in frontend.
3. **Admin**: Products CRUD, image upload (Cloudinary), orders management, users, coupons, reviews, banners.
4. **User**: Profile update, addresses CRUD, wishlist API, reviews on product page.
5. **Email**: Verification, password reset (Nodemailer + SMTP).
6. **Security**: Rate limit auth routes, CORS production URL, strong JWT secrets.
7. **Tests**: Jest + Supertest (backend), React Testing Library (frontend).
8. **Deploy**: Frontend (Vercel/Netlify), Backend (Railway/Render), MongoDB Atlas.

## Scripts

| Where    | Command     | Description        |
|----------|-------------|--------------------|
| Root     | `npm start` | Start React app    |
| Root     | `npm run build` | Build React app |
| Backend  | `npm run dev`   | Start API with watch |
| Backend  | `npm start`     | Start API          |

## Environment

- **Backend** (`backend/.env`): `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, optional Stripe/Razorpay, Cloudinary, SMTP.
- **Frontend** (`.env.local`): `REACT_APP_API_URL` (default `http://localhost:5000/api`).
