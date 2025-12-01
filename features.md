# LifeLink PWA - Feature Documentation

LifeLink is a progressive web application designed to bridge the gap between blood donors and those in need. This document outlines the comprehensive feature set implemented in the application.

## Prompt used to build the application:

I need you to build a comprehensive, mobile-first Progressive Web App (PWA) for a Blood Donation Platform called "LifeLink".

**Role:** Expert UI/UX Designer & React Developer.
**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide React (Icons), and Shadcn UI components.
**Design System:**
- Primary Color: "Life Red" (#E63946) - calm, not alarming.
- Background: Clean White (#FFFFFF) & Soft Gray (#F1F5F9).
- Typography: Inter or Geist Sans (Clean, modern, readable).
- Aesthetics: Rounded corners (xl), soft shadows, card-based layout, bottom navigation bar (Mobile PWA style).

**Core Architecture:**
Create a single-file React component (Simulated App) that manages state to switch between these 5 main views:
1. Home (Dashboard)
2. Requests (Live Feed)
3. Donate (Booking)
4. Hospital (Stock & Slot)
5. Profile (User & Gamification)

---

### **Detailed View Requirements:**

#### **1. Onboarding (Simulated State)**
- If the user is "New", show a clean multi-step form:
  - Step 1: Basic Info (Name, Age, Gender, Blood Type).
  - Step 2: **ABHA ID Integration** (Input field with "Verify" button).
  - Step 3: Location Permission (Mock toggle).
- **Action:** After completion, switch state to "Home".

#### **2. Home Dashboard (The "Hero" View)**
- **Header:** Welcome message + Notification Bell (with red dot badge).
- **Status Card (Dynamic):**
  - *State A (Eligible):* Large, pulsing "Donate Now" button (Soft Red gradient). Text: "You can save 3 lives today."
  - *State B (Waiting):* Circular Progress bar showing days left (e.g., "45 Days to go").
- **SOS Emergency Floating Button:** A sticky, high-contrast button at the bottom-right. Clicking it opens a **Sheet/Drawer** with:
  - Urgency Slider (Standard -> Critical).
  - Blood Type Selector.
  - "Request Ambulance" Toggle (Integration with StanPlus/112).
- **Quick Actions Grid:** Icons for "Blood Drives", "Health History", "Refer Friend", "My Team".

#### **3. Request Feed (Live Data)**
- **Filter Tabs:** "All", "Urgent", "Near Me", "My Type".
- **Request Cards:**
  - Left Border: Color-coded by urgency (Yellow = Standard, Red = Emergency).
  - Content: Blood Group Badge (A+), Units needed, Hospital Name, Distance (e.g., "2.3 km away").
  - **Actions:** "Accept Request" (Primary), "Share" (Secondary - WhatsApp icon).
  - **Logic:** Clicking "Accept" should change the card status to "Pledged" and show a "Navigate" button.

#### **4. The "Blood Journey" (Tracking)**
- Create a visual timeline component (Vertical steps):
  - Step 1: Request Accepted.
  - Step 2: Donor En Route (Map placeholder).
  - Step 3: Donation Verified (Show QR Code for scanning).
  - Step 4: Life Saved.

#### **5. Hospital & Booking View**
- **Inventory Dashboard:** A simple grid showing blood bags available (A+, B-, O+, etc.) with progress bars for "Stock Level".
- **Appointment Scheduler:**
  - Horizontal Date Picker (Mon, Tue, Wed...).
  - Time Slot Chips (10:00 AM, 11:00 AM...).
  - "Confirm Booking" button.

#### **6. Profile & Retention (Gamification)**
- **Header:** User Avatar, Name, and "Level 5 Donor" Badge.
- **Stats Row:** 3 Liters Donated | 12 Lives Saved | 500 Karma Points.
- **Health Passport Section:**
  - Mini graph (Sparkline) showing Hemoglobin levels over last 3 donations.
  - "Medication Reminder" Toggle (Daily utility feature).
- **Digital Card:** A toggle to "Show Donor Card" which flips to show a QR code ID.

---

### **Functional Instructions for AI:**
1.  **Mock Data:** Create a robust `const` object for mock requests, user stats, and hospital inventory so the UI looks populated.
2.  **State Management:** Use `useState` to handle navigation between the bottom tabs (Home, Requests, Donate, Profile).
3.  **Interactivity:**
    - Make the "Accept" button on requests functional (update local state).
    - Make the "SOS" button open a Dialog/Drawer.
    - Make the "Schedule" button show a success toast.
4.  **Layout:** Ensure the Bottom Navigation Bar is fixed at the bottom and visible on all screens except Onboarding.

**Output Goal:** A fully interactive, high-fidelity prototype that feels like a native app.

## 1. Onboarding Experience
The app begins with a user-friendly onboarding flow designed to capture essential information while building trust.
- **Profile Setup**: Collects basic details including Name, Age, Gender, and Blood Type.
- **ABHA Integration**: Simulates integration with the Ayushman Bharat Health Account (ABHA) for secure health record linking.
- **Permissions**: explanatory screens for requesting Location access to enable nearby request discovery.
- **Progress Tracking**: Visual stepper to guide users through the setup process.

## 2. Home Dashboard
The central hub of the application, designed for quick status checks and actions.
- **Dynamic Status Card**:
    - **Eligible**: A vibrant, animated card encouraging donation ("You can save 3 lives today").
    - **Recovery Mode**: For recent donors, displays a countdown to the next eligible donation date.
- **Impact Analytics**: Visualizes personal impact with stats for "Liters Donated" and "Lives Saved".
- **Quick Actions**: Grid layout for fast access to Donation Drives, History, Referrals, and Team management.
- **Health Tips**: Context-aware health advice (e.g., iron absorption tips) to maintain donor health.

## 3. SOS Emergency System
A critical feature for immediate crisis management, accessible via a floating action button.
- **One-Tap Access**: Persistent floating button available on the home screen.
- **Urgency Control**: Interactive slider to set urgency levels (Standard, Urgent, Critical) with changing visual indicators.
- **Request Configuration**: Dropdown to specify the required blood type.
- **Ambulance Integration**: Toggle switch to simultaneously request ambulance services.
- **Broadcast**: Simulates an immediate alert sent to all compatible donors in the vicinity.

## 4. Live Requests Feed
A real-time marketplace for blood donation needs.
- **Smart Filtering**: Tabbed interface to filter requests by "All", "Urgent", and "Near Me".
- **Request Cards**: Detailed cards displaying:
    - Blood Type & Units Needed
    - Hospital Name & Location
    - Distance & Posted Time
    - Visual urgency badges (pulsing red for critical needs)
- **Blood Journey**: A dedicated flow for accepted requests that tracks the entire donation lifecycle:
    1.  **Accepted**: User pledges to donate.
    2.  **En Route**: Navigation and travel tracking.
    3.  **Verification**: QR code scanning at the hospital.
    4.  **Completion**: Confirmation of successful donation.

## 5. Hospital & Donation Management
A comprehensive view for managing appointments and checking inventory.
- **Hospital Locator**: Searchable interface for finding nearby hospitals.
- **Real-time Inventory**: Visual stock levels for different blood types (Good, Adequate, Low, Critical) using progress bars and color coding.
- **Appointment Booking**:
    - **Calendar View**: Horizontal date picker for selecting donation days.
    - **Time Slots**: Grid selection for booking specific donation times.
- **Direct Communication**: One-tap access to call hospital blood banks directly.

## 6. Profile & Gamification
Designed to retain donors through rewards and health tracking.
- **Digital Donor ID**: An interactive "flip card" with a QR code and ABHA ID for instant verification at donation centers.
- **Gamification System**:
    - **Donor Levels**: Progression system (e.g., "Level 5 Donor").
    - **Karma Points**: Rewards currency for donations and referrals.
    - **Badges**: Visual recognition for milestones.
- **Health Passport**: Interactive chart visualizing health metrics like Hemoglobin levels over time.
- **Wellness Tools**: Toggle-able reminders for medication (e.g., Iron supplements).

## 7. App Architecture
- **PWA Shell**: "App-like" feel with a persistent bottom navigation bar.
- **Responsive Design**: Optimized for mobile viewports with safe-area handling.
- **State Management**: Centralized view handling for smooth transitions between Onboarding, Home, Requests, Hospital, and Profile views.
