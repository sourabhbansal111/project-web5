# FixMyCity 🏙️

**FixMyCity** is a frontend-based civic issue reporting and management web application. It allows citizens to report problems in their city, track complaints, and manage their profiles, while workers and administrators have role-specific panels for handling civic issues.

The project is built primarily with **HTML, CSS, and JavaScript** and is designed to demonstrate important frontend and browser concepts without requiring a traditional backend server.

---

## 📌 Project Overview

In many cities, problems such as potholes, garbage accumulation, damaged roads, broken streetlights, water issues, and drainage problems can take time to reach the appropriate authorities.

FixMyCity provides a simple digital workflow:

**Citizen → Report Issue → Location & Image → Complaint Stored → Worker/Admin → Resolve Issue**

The project aims to demonstrate how a real-world civic reporting platform can be implemented using browser technologies.

---

## 🎯 Objectives

- Allow users to report civic problems.
- Capture the user's current location.
- Convert GPS coordinates into a readable address.
- Allow users to upload an image of an issue.
- Store user and complaint information using IndexedDB.
- Provide separate interfaces for users, workers, and administrators.
- Allow users to track their complaints.
- Allow workers to view and manage assigned complaints.
- Allow administrators to manage workers.
- Demonstrate modern JavaScript concepts and browser APIs.
- Build the project without relying on an external backend.

---

## 👥 User Roles

FixMyCity has three main roles.

### 👤 User

A normal citizen can:

- Create an account.
- Log in.
- View the city dashboard.
- Report civic issues.
- Use their current location while reporting.
- Upload issue images.
- View and track their complaints.
- Edit their profile.
- Manage notification preferences.
- Log out.

### 👷 Worker

A worker can:

- Log in as a worker.
- Access the Worker Panel.
- View their assigned complaints.
- Manage complaint progress.
- View their profile.
- Log out.

### 🛠️ Admin

The administrator has administrative access and can:

- Access the Admin Panel.
- View registered users.
- Add/promote users as workers.
- Remove/demote workers.
- Manage the worker role.

The admin role is handled separately from normal users and workers.

---

# 🖥️ Main Features

## 1. City Dashboard

The dashboard provides an overview of civic complaints in the city.

It displays:

- Total Reports
- Resolved Reports
- Reports In Progress
- Pending Reports
- Issues by Category
- Complaint Status
- Last Updated time

The dashboard data is loaded dynamically from:

```text
data/dashboard.json
```

JavaScript uses the **Fetch API** and **async/await** to retrieve and display this data.

---

## 2. User Authentication

The project includes a frontend authentication system.

Users can:

- Sign up
- Log in
- Log out
- Maintain a login session

The current session is maintained using:

```text
localStorage
```

The password itself is **not stored in localStorage**.

Password information is intended to be stored in IndexedDB as:

```text
passwordHash
salt
```

This demonstrates the difference between session information and sensitive credential storage.

---

## 3. Role-Based Access

FixMyCity uses role-based access control.

Available roles:

```text
user
worker
admin
```

The application checks the logged-in user's role before allowing access to protected pages.

For example:

- Users can access Profile.
- Workers can access Profile and Worker Panel.
- Admin can access Admin Panel.
- Admin does not use the normal user Profile page.

This prevents users from simply navigating directly to a page that they should not access.

---

# 📝 4. Report Issue

The Report Issue page allows users and workers to submit civic complaints.

Users can provide:

### Category

Available categories include:

- Potholes
- Waste & Garbage
- Broken Streetlights
- Water Issues
- Damaged Roads
- Drainage

### Issue Title

A short title describing the problem.

### Description

A detailed description of the issue with a character limit and live character counter.

### Location

The user can enter or detect the location of the issue.

The application provides a:

**Use My Current Location**

button.

When clicked, the browser's **Geolocation API** obtains:

```text
Latitude
Longitude
```

These coordinates are then sent to a reverse-geocoding service to obtain a readable address.

The returned information can contain:

```text
Address
Latitude
Longitude
```

The readable address is displayed in the location field.

### Image

Users can upload an image showing the civic problem.

The application also provides an image preview before submission.

---

# 📍 5. Geolocation & Reverse Geocoding

FixMyCity uses the browser's Geolocation API to obtain the user's current coordinates.

The general process is:

```text
User clicks "Use My Current Location"
                ↓
Browser asks for location permission
                ↓
Geolocation API
                ↓
Latitude + Longitude
                ↓
Reverse Geocoding
                ↓
Readable Address
                ↓
Location field
```

The project currently uses OpenStreetMap's Nominatim reverse-geocoding service for this feature.

The application should respect the service's usage policy and rate limits. For a production application with significant traffic, a dedicated geocoding service or backend solution would be more appropriate.

---

# 👤 6. Profile Management

Users and workers have access to a Profile page.

The profile can contain information such as:

- Name
- Email
- Phone
- Address
- City
- State
- Pincode
- Date of Birth
- Gender
- Bio
- Profile Image
- Notification preferences

The email is displayed as read-only.

Profile information is stored in IndexedDB and can be updated later.

---

# 👷 7. Worker Panel

The Worker Panel provides a dedicated interface for workers.

The panel contains statistics such as:

- Assigned Complaints
- In Progress
- Pending
- Resolved

It also contains an area for assigned complaints.

The worker page verifies:

1. The user is logged in.
2. The user's role is `worker`.
3. The worker exists in IndexedDB.

Only then is the Worker Panel displayed.

---

# 🛠️ 8. Admin Panel

The Admin Panel provides administrative functionality.

The administrator can view registered users and manage workers.

A worker can be added using a registered user's email.

For example:

```text
Registered User
      ↓
Admin enters email
      ↓
User found
      ↓
Role changed
      ↓
user → worker
```

Workers can also be removed or demoted.

This demonstrates role management using IndexedDB.

---

# 🗄️ Data Storage

FixMyCity uses different browser storage technologies for different purposes.

## IndexedDB

IndexedDB is used for persistent application data.

Planned/used data includes:

### Users

```text
id
name
email
passwordHash
salt
role
phone
address
city
state
pincode
dateOfBirth
gender
bio
profileImage
notificationPreferences
createdAt
updatedAt
```

### Complaints

```text
id
userId
category
title
description
location
latitude
longitude
image
status
createdAt
```

IndexedDB is suitable for this project because it can store structured data and larger data than normal localStorage.

---

## localStorage

localStorage is primarily used for session information.

Examples include:

```text
fixmycityLoggedIn
fixmycityUserId
fixmycityRole
```

The user's password is not stored in localStorage.

---

# 🔐 Password Handling

Passwords are not intended to be stored as plain text.

The project uses the concept of:

```text
Password
   +
Salt
   ↓
Hash
   ↓
passwordHash
```

The database stores the resulting password hash and salt rather than the original password.

For a production authentication system, password hashing should be performed using a well-established password hashing algorithm such as Argon2, bcrypt, or scrypt on a trusted backend. A frontend-only authentication system is suitable for demonstrating browser concepts, but should not be treated as production-grade security.

---

# 🌐 Browser APIs & JavaScript Concepts

FixMyCity is designed to demonstrate a wide range of JavaScript and browser concepts.

### JavaScript

- Variables
- Functions
- Objects
- Arrays
- DOM manipulation
- Event listeners
- Conditional statements
- Loops
- Modules/organized JS files
- Error handling

### Asynchronous JavaScript

- Callbacks
- Promises
- `async`
- `await`
- `try...catch`
- Fetch API

### Browser APIs

- Geolocation API
- File API
- FileReader
- IndexedDB
- localStorage
- DOM API

### Network Communication

The dashboard demonstrates:

```text
fetch()
    ↓
Promise
    ↓
await response.json()
    ↓
Render data
```

---

# 📂 Project Structure

```text
FixMyCity/
│
├── index.html
│
├── pages/
│   ├── dashboard.html
│   ├── report.html
│   ├── track.html
│   ├── admin.html
│   ├── profile.html
│   └── worker.html
│
├── css/
│   ├── dashboard.css
│   ├── report.css
│   ├── track.css
│   ├── admin.css
│   ├── profile.css
│   └── worker.css
│
├── js/
│   ├── dashboard.js
│   ├── report.js
│   ├── track.js
│   ├── admin.js
│   ├── profile.js
│   ├── worker.js
│   └── database.js
│
├── data/
│   └── dashboard.json
│
└── assets/
    ├── images/
    └── icons/
```

---

# 📄 Page Responsibilities

| Page | Purpose |
|---|---|
| `index.html` | Entry point |
| `dashboard.html` | City overview and statistics |
| `report.html` | Report a civic issue |
| `track.html` | Track submitted complaints |
| `admin.html` | Administrative management |
| `profile.html` | User/worker profile |
| `worker.html` | Worker complaint management |

---

# 🎨 Styling

CSS is kept separate from HTML.

Each major page has its own stylesheet:

```text
dashboard.css
report.css
track.css
admin.css
profile.css
worker.css
```

This keeps the project organized and makes individual pages easier to maintain.

---

# 🔄 Application Flow

A typical user journey is:

```text
Open FixMyCity
       ↓
Dashboard
       ↓
Sign Up / Login
       ↓
User Dashboard
       ↓
Report Issue
       ↓
Select Category
       ↓
Enter Description
       ↓
Use Current Location
       ↓
Latitude + Longitude
       ↓
Readable Address
       ↓
Upload Image
       ↓
Submit Complaint
       ↓
Complaint Stored
       ↓
Track Complaint
       ↓
Issue Resolved
```

Worker flow:

```text
Worker Login
     ↓
Worker Panel
     ↓
View Assigned Complaints
     ↓
Update Complaint Status
     ↓
Resolve Issue
```

Admin flow:

```text
Admin Login
     ↓
Admin Panel
     ↓
View Users
     ↓
Add / Remove Worker
     ↓
Manage Worker Roles
```

---

# 📊 Complaint Status

The application uses complaint states such as:

```text
Submitted
    ↓
Under Review
    ↓
In Progress
    ↓
Resolved
```

These statuses represent the lifecycle of a reported civic issue.

---

# 🚀 Running the Project

Because the project uses Fetch API, JavaScript modules, IndexedDB, and browser APIs, it is recommended to run it through a local development server rather than directly opening the HTML files.

For example, using VS Code:

1. Open the `FixMyCity` folder.
2. Install/use the **Live Server** extension.
3. Open `index.html`.
4. Select **Open with Live Server**.
5. Use the generated local URL.

Example:

```text
http://127.0.0.1:5500/
```

---

# 🌍 Deployment

The project can be deployed as a static frontend using platforms such as:

- GitHub Pages
- Vercel
- Netlify

Because the project currently uses browser storage, data is stored locally in the user's browser.

This means:

```text
Computer A
    ↓
Browser IndexedDB
    ↓
User's local data
```

is separate from:

```text
Computer B
    ↓
Browser IndexedDB
    ↓
Different local data
```

A real multi-user civic platform would require a backend database and server-side authentication so that all users share the same data.

---

# ⚠️ Current Limitations

The current frontend-only architecture has several limitations.

### 1. Data is browser-specific

IndexedDB data is stored locally and is not automatically shared between users or computers.

### 2. Authentication is not production-grade

Without a backend, authentication cannot provide the same security guarantees as a server-based authentication system.

### 3. Admin credentials

The current project uses a predefined/hardcoded admin role rather than a secure server-side administrator account.

### 4. Public geocoding service

The current reverse-geocoding implementation uses a public service intended for appropriate, moderate use. Production deployments should consider a suitable geocoding architecture.

### 5. No real government backend

The project demonstrates the workflow of a civic reporting platform, but it does not actually connect complaints to a government department.

---

# 🔮 Future Improvements

Possible future versions can include:

- Real backend API
- MySQL/PostgreSQL database
- Secure authentication
- JWT/session-based authentication
- Government employee accounts
- Complaint assignment system
- Interactive city map
- Real-time complaint updates
- Email notifications
- SMS notifications
- Push notifications
- Advanced admin dashboard
- Complaint analytics
- Worker performance dashboard
- Image storage using cloud storage
- Cloud-based geocoding
- AI-based issue category detection
- Duplicate complaint detection
- Priority/severity detection
- Web Workers for background processing
- Progressive Web App support

---

# 🧠 Learning Outcomes

This project demonstrates practical understanding of:

- HTML structure
- CSS architecture
- JavaScript fundamentals
- DOM manipulation
- Event-driven programming
- Asynchronous programming
- Promises
- Async/Await
- Fetch API
- JSON
- IndexedDB
- localStorage
- Browser Geolocation
- Reverse geocoding
- File handling
- Image previews
- Form handling
- Role-based UI
- Client-side data management
- Git and GitHub workflow

---

# 🧪 Development Approach

The project is developed feature-by-feature rather than building everything at once.

Example development flow:

```text
Dashboard
   ↓
Dashboard JSON
   ↓
Fetch API
   ↓
Authentication
   ↓
IndexedDB
   ↓
Admin Panel
   ↓
Profile
   ↓
Worker Panel
   ↓
Report Issue
   ↓
Geolocation
   ↓
Reverse Geocoding
   ↓
Complaint Storage
   ↓
Complaint Tracking
```

This approach makes each feature easier to test, debug, and commit separately using Git.

---

# 📜 Git Commit Style

The project follows feature-based commits such as:

```text
feat: create FixMyCity dashboard
feat: load dashboard data using fetch API
fix: wait for IndexedDB before loading admin data
feat: add user and worker profile page
feat: add worker panel
feat: add report issue form
feat: add current location detection
feat: add reverse geocoding for issue location
feat: save complaints to IndexedDB
```

This keeps the Git history understandable and shows the development progress of the project.

---

# 🏁 Conclusion

FixMyCity is a practical frontend web application that demonstrates how common browser technologies can be combined to create a civic issue reporting platform.

The project focuses on a realistic problem while also covering important concepts such as asynchronous JavaScript, Fetch API, IndexedDB, localStorage, Geolocation, file handling, role-based access, and dynamic DOM manipulation.

The current version is designed as a **frontend learning/project implementation**, while the architecture leaves room for a future backend-powered version that could support real multi-user data and government-side complaint management.

---

## 👨‍💻 Project

**Project Name:** FixMyCity  
**Type:** Civic Issue Reporting & Management Platform  
**Architecture:** Frontend-focused / Browser-based  
**Primary Technologies:** HTML, CSS, JavaScript  
**Storage:** IndexedDB + localStorage  
**Geolocation:** Browser Geolocation API  
**Reverse Geocoding:** OpenStreetMap Nominatim  
**Development:** VS Code + Live Server
