# PVJewelleryShop – Architecture & Specification

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                 │
│  Vite/CRA · React Router · Redux Toolkit · Tailwind/Chakra              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node + Express)                         │
│  MVC: routes → controllers → services → models · Mongoose · JWT         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ MongoDB Atlas   │    │ Cloudinary/S3    │    │ Stripe/Razorpay  │
│ (Hosted DB)     │    │ (Product images) │    │ (Payments)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Frontend**: React (Vite or CRA), React Router, Redux Toolkit (or React Query), Tailwind or Chakra UI.
- **Backend**: Express MVC (routes → controllers → services → models), Mongoose, JWT (access + refresh), bcrypt, RBAC.
- **DB**: MongoDB Atlas.
- **Storage**: Cloudinary (or S3) for product images.
- **Payments**: Stripe or Razorpay (configurable by region).
- **Email**: Nodemailer + provider (order confirmations, password reset).
- **Config**: dotenv + config module.

---

## 2. Data Models (MongoDB / Mongoose)

### 2.1 User

| Field           | Type     | Notes                                      |
|-----------------|----------|--------------------------------------------|
| email           | String   | unique, required, lowercase                |
| passwordHash    | String   | required (bcrypt)                          |
| firstName       | String   |                                            |
| lastName        | String   |                                            |
| role            | Enum     | `user` \| `admin`                          |
| emailVerified   | Boolean  | default false                              |
| emailVerifyToken | String  | optional, for verification link            |
| resetPasswordToken | String | optional, for reset link                   |
| resetPasswordExpires | Date  | optional                                   |
| addresses       | [Address]| subdoc array                               |
| wishlist        | [ObjectId] | ref Product                             |
| createdAt       | Date     |                                            |
| updatedAt       | Date     |                                            |

### 2.2 Address (embedded in User or Order)

| Field    | Type   | Notes        |
|----------|--------|--------------|
| label    | String | e.g. Home    |
| line1    | String |              |
| line2    | String | optional     |
| city     | String |              |
| state    | String |              |
| zip      | String |              |
| country  | String |              |
| phone    | String |              |

### 2.3 Product (Diamonds + Jewellery)

| Field        | Type     | Notes                                      |
|--------------|----------|--------------------------------------------|
| name         | String   | required                                   |
| slug         | String   | unique, indexed                            |
| description  | String   |                                            |
| type         | Enum     | `diamond` \| `jewellery`                   |
| category     | ObjectId | ref Category                               |
| collection   | ObjectId | ref Collection (optional)                  |
| images       | [String] | Cloudinary URLs                            |
| price        | Number   | required                                   |
| compareAtPrice | Number | optional (strikethrough)                    |
| sku          | String   | optional, unique                           |
| stock        | Number   | default 0                                  |
| isActive     | Boolean  | default true                               |
| **4Cs (diamond)** |        |                                            |
| cut          | String   | e.g. Round, Princess                       |
| color        | String   | e.g. D, E, F                               |
| clarity      | String   | e.g. FL, IF, VVS1                          |
| carat        | Number   |                                            |
| shape        | String   | Round, Oval, etc.                          |
| metal        | String   | Gold, Platinum, etc.                       |
| certifications | [String] | e.g. GIA, IGI                             |
| specs        | Mixed    | flexible key-value for other attributes    |
| createdAt    | Date     |                                            |
| updatedAt    | Date     |                                            |

### 2.4 Category

| Field   | Type   | Notes           |
|---------|--------|-----------------|
| name    | String | required        |
| slug    | String | unique          |
| parent  | ObjectId | ref Category (optional) |
| order   | Number | for sort        |

### 2.5 Collection

| Field   | Type   | Notes    |
|---------|--------|----------|
| name    | String | required |
| slug    | String | unique   |
| image   | String | URL      |
| order   | Number |          |

### 2.6 Order

| Field        | Type     | Notes                                |
|--------------|----------|--------------------------------------|
| orderNumber  | String   | unique, e.g. PV-2024-00001            |
| user         | ObjectId | ref User                             |
| items        | [OrderItem] | subdoc array                     |
| subtotal     | Number   |                                      |
| shippingCost | Number   |                                      |
| discount     | Number   | from coupon                          |
| total        | Number   |                                      |
| coupon       | ObjectId | ref Coupon (optional)                |
| status       | Enum     | Pending, Processing, Shipped, Delivered, Cancelled, Refunded |
| paymentId    | String   | Stripe/Razorpay id                   |
| paymentStatus| String   | paid, failed, refunded               |
| shippingAddress | Address | subdoc                            |
| trackingNumber | String  | optional                             |
| createdAt    | Date     |                                      |
| updatedAt    | Date     |                                      |

### 2.7 OrderItem

| Field    | Type     | Notes      |
|----------|----------|------------|
| product  | ObjectId | ref Product |
| name     | String   | snapshot   |
| price    | Number   | snapshot   |
| quantity | Number   |            |
| image    | String   | snapshot   |

### 2.8 Coupon

| Field       | Type   | Notes                          |
|-------------|--------|--------------------------------|
| code        | String | unique, uppercase              |
| type        | Enum   | `percent` \| `fixed`           |
| value       | Number | percent (0–100) or fixed amount |
| minOrder    | Number | optional                       |
| maxUses     | Number | optional                       |
| usedCount   | Number | default 0                      |
| validFrom   | Date   | optional                       |
| validTo     | Date   | optional                       |
| isActive    | Boolean| default true                   |

### 2.9 Review

| Field   | Type     | Notes                    |
|---------|----------|--------------------------|
| product | ObjectId | ref Product              |
| user    | ObjectId | ref User                 |
| rating  | Number   | 1–5                      |
| title   | String   | optional                 |
| body    | String   |                          |
| status  | Enum     | pending, approved, rejected |
| createdAt | Date   |                          |

### 2.10 Banner / Homepage Content

| Field   | Type   | Notes         |
|---------|--------|---------------|
| title   | String |               |
| image   | String | URL           |
| link    | String | optional      |
| order   | Number |               |
| isActive| Boolean| default true  |

---

## 3. API Design (Endpoints)

Base: `GET /api/health`  
Prefix: `/api` for all below.

### 3.1 Auth

| Method | Endpoint | Description        | Access   |
|--------|----------|--------------------|----------|
| POST   | /auth/register | Register          | Public   |
| POST   | /auth/login    | Login, returns access + refresh | Public |
| POST   | /auth/refresh  | New access token  | Refresh token in body |
| POST   | /auth/logout   | Invalidate refresh| User     |
| POST   | /auth/verify-email | Verify with token | Public |
| POST   | /auth/forgot-password | Send reset email | Public |
| POST   | /auth/reset-password  | Reset with token | Public |

### 3.2 Users (profile)

| Method | Endpoint | Description     | Access |
|--------|----------|-----------------|--------|
| GET    | /users/me      | Current user    | User   |
| PATCH  | /users/me      | Update profile  | User   |
| GET    | /users/me/addresses | List addresses | User |
| POST   | /users/me/addresses | Add address  | User   |
| PATCH  | /users/me/addresses/:id | Update | User |
| DELETE | /users/me/addresses/:id | Delete | User |
| GET    | /users/me/wishlist    | Wishlist ids   | User   |
| POST   | /users/me/wishlist/:productId | Toggle wishlist | User |

### 3.3 Products

| Method | Endpoint | Description        | Access |
|--------|----------|--------------------|--------|
| GET    | /products | List (filters, sort, pagination) | Public |
| GET    | /products/:slug | Single product by slug | Public |
| GET    | /products/categories | Categories tree | Public |
| GET    | /products/collections | Collections list | Public |

Query params for GET /products:  
`page`, `limit`, `sort` (priceAsc, priceDesc, newest), `search`, `category`, `type`, `minPrice`, `maxPrice`, `cut`, `color`, `clarity`, `caratMin`, `caratMax`, `shape`, `metal`, `inStock` (boolean).

### 3.4 Cart (optional server-side; or frontend-only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /cart    | Get cart    | User   |
| PUT    | /cart    | Set cart items | User |
| POST   | /cart/coupon | Apply coupon | User |
| DELETE | /cart/coupon | Remove coupon | User |

### 3.5 Orders

| Method | Endpoint | Description     | Access |
|--------|----------|-----------------|--------|
| POST   | /orders  | Create order (checkout) | User |
| GET    | /orders  | My orders       | User   |
| GET    | /orders/:id | Order detail | User (own) |

### 3.6 Reviews

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /products/:slug/reviews | List reviews (approved) | Public |
| POST   | /products/:slug/reviews | Add review | User   |
| PATCH  | /reviews/:id | Edit own review | User |
| DELETE | /reviews/:id | Delete own review | User |

### 3.7 Admin – Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/dashboard/stats | Sales, orders, inventory, top products | Admin |

### 3.8 Admin – Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/products | List (paginated) | Admin |
| POST   | /admin/products | Create product | Admin |
| GET    | /admin/products/:id | Single | Admin |
| PUT    | /admin/products/:id | Update | Admin |
| DELETE | /admin/products/:id | Delete / soft-delete | Admin |
| POST   | /admin/products/bulk-upload | CSV upload | Admin |

### 3.9 Admin – Categories / Collections

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/categories | List | Admin |
| POST   | /admin/categories | Create | Admin |
| PUT    | /admin/categories/:id | Update | Admin |
| DELETE | /admin/categories/:id | Delete | Admin |
| GET/POST/PUT/DELETE | /admin/collections | CRUD | Admin |

### 3.10 Admin – Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/orders | List orders (filters) | Admin |
| GET    | /admin/orders/:id | Order detail | Admin |
| PATCH  | /admin/orders/:id/status | Update status, tracking | Admin |
| POST   | /admin/orders/:id/refund | Process refund | Admin |

### 3.11 Admin – Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/users | List users | Admin |
| PATCH  | /admin/users/:id/role | Assign role | Admin |

### 3.12 Admin – Coupons

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET/POST/PUT/DELETE | /admin/coupons | CRUD | Admin |

### 3.13 Admin – Reviews

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET    | /admin/reviews | List (filter by status) | Admin |
| PATCH  | /admin/reviews/:id | Approve/reject | Admin |

### 3.14 Admin – Banners

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET/POST/PUT/DELETE | /admin/banners | CRUD | Admin |

---

## 4. Auth & Roles Flow

### 4.1 Registration

1. POST /auth/register with email, password, firstName, lastName.
2. Hash password (bcrypt), create user with `emailVerified: false`, generate `emailVerifyToken`, save.
3. Send verification email (link with token). Optionally send welcome email.
4. Respond with 201 and message “Check email to verify.”

### 4.2 Email verification

1. User clicks link: GET /verify-email?token=xxx → backend validates token, sets `emailVerified: true`, clears token.
2. Redirect to login or “Email verified” page.

### 4.3 Login

1. POST /auth/login with email, password.
2. Find user, compare password with bcrypt.
3. If valid: generate access token (short-lived, e.g. 15m) and refresh token (e.g. 7d), store refresh in DB or allow list.
4. Return `{ accessToken, refreshToken, expiresIn, user }`.

### 4.4 Refresh

1. POST /auth/refresh with `refreshToken` in body.
2. Verify refresh token, optionally check DB; issue new access token.

### 4.5 Protected routes

- Send `Authorization: Bearer <accessToken>`.
- Middleware: verify JWT, attach `req.user` (id, email, role).
- Role middleware: `requireRole('admin')` for admin routes.

### 4.6 Forgot / Reset password

1. POST /auth/forgot-password with email → generate reset token (expiry e.g. 1h), send email with link.
2. POST /auth/reset-password with token + newPassword → validate token, hash password, clear token.

### 4.7 RBAC

- **user**: own profile, addresses, wishlist, cart, orders, reviews.
- **admin**: all admin/* routes, dashboard, products, orders, users, coupons, reviews, banners.

---

## 5. Frontend Routes & State

### 5.1 Routes (React Router)

**Public**

- `/` – Home (banners, featured, categories)
- `/products` – Catalog (filters: 4Cs, metal, price, shape, availability; search, sort, pagination)
- `/products/:slug` – Product detail (images, specs, certifications, reviews)
- `/login`, `/register` – Auth
- `/forgot-password`, `/reset-password`, `/verify-email`
- `/cart` – Cart page (if applicable)

**Protected (user)**

- `/checkout` – Checkout (address, payment)
- `/account` – Profile
- `/account/orders` – Order history
- `/account/orders/:id` – Order detail & tracking
- `/account/addresses` – Addresses
- `/account/wishlist` – Wishlist

**Admin**

- `/admin` – Dashboard
- `/admin/products` – Products list
- `/admin/products/new` – Add product
- `/admin/products/:id/edit` – Edit product
- `/admin/orders` – Orders
- `/admin/users` – Users
- `/admin/coupons` – Coupons
- `/admin/reviews` – Reviews
- `/admin/banners` – Banners
- `/admin/categories` – Categories
- `/admin/collections` – Collections

### 5.2 State (Redux Toolkit suggested)

- **authSlice**: user, accessToken, refreshToken, isAuthenticated, loading.
- **productsSlice** (or React Query): list, filters, pagination, current product.
- **cartSlice**: items, coupon, totals (or from API).
- **wishlistSlice**: product ids (or from API).
- **ordersSlice**: my orders (or React Query).
- **uiSlice**: modals, sidebar, notifications.

Persistence: store tokens in httpOnly cookie (preferred) or localStorage; refresh on 401.

---

## 6. Core Workflows

### 6.1 Add to cart → Checkout

1. User adds item to cart (frontend state or POST /cart).
2. Cart page: show items, apply coupon (POST /cart/coupon or validate on frontend), show subtotal, shipping, discount, total.
3. Checkout: select/add shipping address, choose payment (Stripe/Razorpay).
4. Frontend creates payment intent (backend endpoint calls Stripe/Razorpay), user completes payment.
5. Backend webhook or callback: on success, create Order (status Pending → Processing), reduce stock, send order confirmation email.
6. Redirect to order confirmation page; clear cart.

### 6.2 Admin CRUD (Products)

1. List: GET /admin/products with pagination.
2. Create: form (name, type, category, 4Cs, price, images upload to Cloudinary), POST /admin/products.
3. Edit: GET /admin/products/:id, form prefill, PUT /admin/products/:id.
4. Delete: DELETE /admin/products/:id (or soft-delete with isActive).
5. Bulk: CSV upload → parse → validate → create/update products (POST /admin/products/bulk-upload).

### 6.3 Admin – Orders

1. List orders with filters (status, date).
2. Open order → update status (Pending → Processing → Shipped → Delivered), set tracking number.
3. Refund: trigger Stripe/Razorpay refund, set order status to Refunded.

### 6.4 Reviews

1. User submits review on product page (POST /products/:slug/reviews); status: pending.
2. Admin: GET /admin/reviews, approve/reject (PATCH).
3. Product page shows only approved reviews; average rating computed.

---

## 7. Security

- **Passwords**: bcrypt (salt rounds ≥ 10).
- **JWT**: short-lived access token; refresh token rotation; store refresh server-side or in httpOnly cookie.
- **Input**: validate and sanitize (express-validator); prevent NoSQL injection (Mongoose schema + validated inputs).
- **Rate limiting**: express-rate-limit on auth and public APIs.
- **CORS**: allow only frontend origin in production.
- **Helmet**: use Helmet for security headers.
- **Env**: never commit .env; use config module and NODE_ENV.
- **File upload**: validate type/size; upload to Cloudinary/S3, do not store on disk in app.
- **Admin**: all admin routes behind requireRole('admin').

---

## 8. Testing

- **Backend**: Jest + Supertest; unit tests for services (auth, cart, order); integration tests for API (register, login, products, orders).
- **Frontend**: React Testing Library + Jest; component tests for critical flows (login form, cart, checkout steps).
- **E2E** (optional): Playwright or Cypress for login → add to cart → checkout.

---

## 9. Deployment

- **Frontend**: Build (npm run build), deploy to Vercel/Netlify/static host; set API base URL via env.
- **Backend**: Node on Railway/Render/Fly.io or VPS; set NODE_ENV=production, MongoDB Atlas connection string, Stripe/Razorpay keys, Cloudinary, email provider.
- **DB**: MongoDB Atlas (cluster, IP allowlist or VPC peering).
- **Payments**: Stripe/Razorpay webhooks URL must be HTTPS and reachable.
- **Email**: Configure SMTP (SendGrid, Mailgun, etc.) in production.

---

## 10. Step-by-Step Roadmap

| Step | Task |
|------|------|
| M1.1 | Init Express, connect MongoDB, config (dotenv, config). |
| M1.2 | Models: User, Product, Category, Collection. |
| M1.3 | POST /auth/register, POST /auth/login (JWT access + refresh). |
| M1.4 | GET /products (filters, pagination), GET /products/:slug. |
| M2.1 | React app: Router, Redux/Query, Tailwind/Chakra. |
| M2.2 | Home, product listing, product detail page. |
| M2.3 | Filters (4Cs, price, etc.), search, sort, pagination. |
| M3.1 | Cart state (local or API), coupon apply, totals. |
| M3.2 | Checkout: address, Stripe/Razorpay integration (test keys). |
| M3.3 | Create order on payment success, confirmation page. |
| M4.1 | Protected routes; orders history, profile, addresses. |
| M4.2 | Reviews (submit, list on product page). |
| M4.3 | Email verification, forgot/reset password. |
| M5.1 | Admin auth + RBAC; admin layout. |
| M5.2 | Products CRUD, image upload (Cloudinary). |
| M5.3 | Orders management (status, tracking, refunds). |
| M5.4 | Dashboard (sales, orders, inventory, top products). |
| M5.5 | Users, coupons, reviews moderation, banners. |
| M6   | Security hardening, tests, deployment. |

---

This document is the single source of truth for **PVJewelleryShop** implementation. Implement milestones in order, adjusting only when necessary for dependencies.
