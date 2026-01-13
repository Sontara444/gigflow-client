# GigFlow Frontend

Premium React application built with Vite and Tailwind CSS.

## 🚀 Setup

1.  **Install**: `npm install`
2.  **Configure**: Create `.env` using keys from `.env.example`.
3.  **Run**: `npm run dev`

## ✨ Premium UI/UX Features

### 1. "Cosmic Glass" Design System
*   **Visuals**: Deep dark mode (`#0B0F19`) with animated **Gradient Orbs** and **Grid Patterns**.
*   **Components**: Custom inputs, buttons, and cards using **Glassmorphism** (`bg-white/5 backdrop-blur-xl`).

### 2. Global Notification Context
*   We avoid prop-drilling by managing Socket.io connections in `NotificationContext.jsx`.
*   Automatically connects/disconnects sockets on login/logout.
*   Merges **Offline (API)** and **Online (Socket)** notifications seamlessly.

### 3. Responsive Mobile Menu
*   A fully custom implementation in `Navbar.jsx`.
*   No external libraries used for the hamburger menu or overlay.
*   Smooth `framer-motion` style transitions (using Tailwind classes).

### 4. Real-Time Chat System 💬
*   **Live Messaging**: Instant communication powered by Socket.io.
*   **Smart Notifications**:
    *   **Red Dot Badge**: Real-time unread indicators on the Navbar.
    *   **Toast Popups**: Non-intrusive alerts for new messages while browsing.
*   **Read Receipts**: WhatsApp-style **Double Ticks** (Gray = Delivered, Indigo = Read).
*   **Project Context**: Auto-detects and displays the **Related Gig** in the chat header for context-aware conversations.

## 📁 Key Structure
*   `src/context`: Auth & Notification state logic.
*   `src/pages`: Home (Bento Grid), Dashboard (Rich Stats), GigDetails.
