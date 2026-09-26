Build a complete, modern, production-ready full-stack web application for the following problem statement:

## PROJECT TITLE

Donation Drive & Volunteer Coordination Platform

## PROBLEM STATEMENT

NGOs and community organizations often coordinate donation drives and volunteer activities using spreadsheets, messaging applications, and manual follow-ups. This makes it difficult to track donors, volunteers, donation targets, actual contributions, assigned tasks, and overall campaign progress.

Build a centralized web platform that allows NGOs/community organizations to create and manage donation drives, coordinate volunteers, track donations and contributions, monitor targets, and view real-time campaign progress.

---

# 1. TECHNOLOGY STACK

Use the following stack:

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts
* Lucide React icons

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* JWT
* bcrypt
* Role-based authentication

### Optional/Additional

* Socket.IO for real-time dashboard updates
* Cloudinary for campaign images
* Nodemailer for email notifications

Do NOT use PostgreSQL, MySQL, Firebase, or Supabase.

The primary database must be MongoDB.

---

# 2. USER ROLES

Create three roles:

### ADMIN / ORGANIZER

Can:

* Create donation drives
* Edit/delete drives
* Set donation targets
* Track donations
* Manage donors
* Manage volunteers
* Create volunteer tasks
* Assign tasks
* Approve/reject volunteer applications
* Monitor campaign progress
* View analytics
* View reports

### DONOR

Can:

* Register/login
* View active donation drives
* View drive details
* Make a donation
* Select donation type
* View donation history
* View contribution history
* Track campaign progress

### VOLUNTEER

Can:

* Register/login
* View available volunteer opportunities
* Apply for volunteer tasks
* View assigned tasks
* Accept/reject assigned tasks
* Update task status
* Record volunteer hours
* View volunteering history

---

# 3. MAIN PAGES

Create the following pages.

## Public Pages

### Home Page

Create an attractive landing page containing:

* Navbar
* Logo
* Hero section
* Problem/solution explanation
* Active donation drives
* Donation progress cards
* Volunteer section
* Statistics
* How the platform works
* Call-to-action section
* Footer

Hero heading:

"Together, We Can Make a Difference"

Subheading:

"One platform to manage donations, volunteers, campaigns, and community impact."

Buttons:

* Start a Donation Drive
* Become a Volunteer

Use modern cards, animations, responsive layouts, and clean spacing.

---

### About Page

Explain:

* Platform purpose
* Problems with manual coordination
* Benefits of centralized management
* How NGOs and communities can use the platform

---

### Campaign/Donation Drives Page

Display all active donation drives.

Each card should show:

* Campaign image
* Campaign title
* Description
* Target amount
* Amount collected
* Percentage progress
* Number of donors
* Start date
* End date
* View Details button
* Donate button

Include:

* Search
* Filter
* Sort
* Campaign status

---

### Campaign Details Page

Show:

* Campaign banner
* Campaign title
* Description
* Organizer
* Target
* Amount collected
* Remaining amount
* Progress bar
* Number of donors
* Recent donations
* Required items
* Campaign timeline
* Volunteer opportunities
* Donate button

---

### Login Page

Create a modern login interface.

Fields:

* Email
* Password

Options:

* Login
* Forgot password
* Create account

---

### Registration Page

Fields:

* Full name
* Email
* Phone
* Password
* Confirm password
* Role

Role options:

* Donor
* Volunteer
* Organizer

---

# 4. DONOR DASHBOARD

Create a donor dashboard.

Sidebar:

* Dashboard
* Browse Drives
* My Donations
* Donation History
* Profile
* Logout

Dashboard cards:

* Total Donated
* Number of Donations
* Active Campaigns
* Impact

Show:

* Recent donations
* Active campaigns
* Donation history
* Progress charts

---

# 5. VOLUNTEER DASHBOARD

Sidebar:

* Dashboard
* Opportunities
* My Applications
* Assigned Tasks
* Volunteer Hours
* History
* Profile
* Logout

Dashboard statistics:

* Total Volunteer Hours
* Active Tasks
* Completed Tasks
* Applications

Show:

* Available opportunities
* Assigned tasks
* Task deadlines
* Task status

Task statuses:

PENDING
ASSIGNED
IN_PROGRESS
COMPLETED
CANCELLED

Allow volunteers to update task status.

---

# 6. ADMIN / ORGANIZER DASHBOARD

Create a professional admin dashboard.

Sidebar:

* Overview
* Donation Drives
* Donations
* Donors
* Volunteers
* Volunteer Tasks
* Reports
* Analytics
* Settings
* Logout

Dashboard cards:

* Total Donations
* Total Amount Raised
* Active Drives
* Total Donors
* Total Volunteers
* Completed Tasks

Dashboard should contain:

### Donation Analytics

* Total amount raised
* Target vs collected
* Donations over time
* Top campaigns

### Volunteer Analytics

* Total volunteers
* Active volunteers
* Completed tasks
* Volunteer hours

### Campaign Progress

Show campaign progress using progress bars and charts.

### Recent Activity

Display:

* New donations
* New volunteer registrations
* Completed tasks
* New campaigns

---

# 7. DONATION MANAGEMENT

Admin should be able to:

* View all donations
* Search donations
* Filter by campaign
* Filter by date
* Filter by donor
* View donation details
* Export donation data

Donation fields:

* donorId
* driveId
* amount
* donationType
* paymentStatus
* transactionId
* message
* createdAt

Donation types:

* Money
* Food
* Clothes
* Books
* Medical Supplies
* Other

For the prototype, use a mock payment flow instead of requiring a real payment gateway.

Create a "Donate Now" flow where the user enters donation details and receives a successful donation confirmation.

---

# 8. VOLUNTEER MANAGEMENT

Admin should be able to:

* View volunteers
* Search volunteers
* Filter volunteers
* View volunteer profiles
* Approve applications
* Reject applications
* Assign tasks
* Track volunteer hours
* View completed tasks

Volunteer profile should show:

* Name
* Email
* Phone
* Skills
* Availability
* Total hours
* Completed tasks
* Joined date

---

# 9. VOLUNTEER TASK MANAGEMENT

Organizer can create tasks.

Task fields:

* title
* description
* driveId
* location
* requiredVolunteers
* deadline
* skillsRequired
* status

Organizer can assign volunteers to tasks.

Volunteer can:

* View task
* Accept task
* Start task
* Mark task as completed

---

# 10. MONGODB DATABASE DESIGN

Use MongoDB with Mongoose.

Create these models:

### User

Fields:

```text
name
email
phone
password
role
profileImage
skills
availability
createdAt
updatedAt
```

Role:

```text
ADMIN
DONOR
VOLUNTEER
```

### DonationDrive

Fields:

```text
title
description
image
targetAmount
collectedAmount
startDate
endDate
organizerId
status
requiredItems
location
createdAt
updatedAt
```

### Donation

Fields:

```text
donorId
driveId
amount
donationType
paymentStatus
transactionId
message
createdAt
```

### VolunteerTask

Fields:

```text
driveId
title
description
location
deadline
skillsRequired
assignedVolunteers
requiredVolunteers
status
createdAt
updatedAt
```

### VolunteerApplication

Fields:

```text
volunteerId
driveId
taskId
status
appliedAt
approvedAt
```

### VolunteerHours

Fields:

```text
volunteerId
taskId
hours
date
description
```

Use MongoDB ObjectId references between related collections.

Create appropriate indexes for frequently searched fields such as email, drive status, donorId, volunteerId, and createdAt.

---

# 11. BACKEND API

Create a clean Express.js backend.

Structure:

```text
server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
├── config/
└── server.js
```

Create REST APIs for:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Donation Drives

```text
GET /api/drives
GET /api/drives/:id
POST /api/drives
PUT /api/drives/:id
DELETE /api/drives/:id
```

### Donations

```text
POST /api/donations
GET /api/donations
GET /api/donations/:id
GET /api/donations/my
```

### Volunteers

```text
GET /api/volunteers
GET /api/volunteers/:id
POST /api/volunteers/apply
PUT /api/volunteers/:id
```

### Volunteer Tasks

```text
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
POST /api/tasks/:id/assign
PUT /api/tasks/:id/status
```

### Analytics

```text
GET /api/analytics/dashboard
GET /api/analytics/donations
GET /api/analytics/volunteers
```

Implement proper:

* Authentication middleware
* Role-based authorization
* Input validation
* Error handling
* Secure password hashing
* JWT verification

---

# 12. UI/UX DESIGN

Make the website look like a modern SaaS platform.

Design requirements:

* Clean professional interface
* Responsive on desktop, tablet, and mobile
* Modern cards
* Rounded corners
* Subtle shadows
* Good typography
* Consistent spacing
* Accessible buttons
* Loading states
* Empty states
* Error states
* Toast notifications
* Confirmation dialogs

Use Tailwind CSS.

Use Lucide icons instead of manually created SVG icons.

Do not make the UI look like a basic CRUD application.

---

# 13. DASHBOARD VISUALIZATIONS

Use Recharts.

Create:

### Line Chart

Donation amount over time.

### Bar Chart

Campaign-wise donations.

### Pie/Donut Chart

Donation types.

### Volunteer Chart

Volunteer hours by campaign.

### Progress Bars

Campaign target vs actual collection.

---

# 14. SEARCH AND FILTERING

Implement search and filters for:

### Campaigns

* Search by title
* Status
* Date
* Location

### Donations

* Donor
* Campaign
* Donation type
* Date

### Volunteers

* Name
* Skills
* Availability
* Status

Use debounced search where appropriate.

---

# 15. SECURITY

Implement:

* Password hashing using bcrypt
* JWT authentication
* Protected routes
* Role-based authorization
* Input validation
* MongoDB injection protection
* CORS configuration
* Environment variables
* Do not expose secrets in frontend
* Proper error handling

Create:

```text
.env
```

Example:

```text
MONGODB_URI=
JWT_SECRET=
PORT=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never hardcode secrets.

---

# 16. PROJECT STRUCTURE

Use this overall structure:

```text
donation-volunteer-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 17. IMPORTANT FUNCTIONAL REQUIREMENT

The entire application must actually work end-to-end.

Do NOT create only static frontend pages.

Connect:

React frontend
↓
Express API
↓
Mongoose
↓
MongoDB Atlas

When a donor makes a donation, the database should update.

When a volunteer applies for a task, the database should update.

When an organizer creates a campaign, it should appear on the public campaign page.

When a donation is made, the campaign's collected amount and dashboard analytics should update.

When a volunteer completes a task, their task status and volunteer statistics should update.

---

# 18. DEMO DATA

Create a database seed script containing realistic demo data:

* 1 admin/organizer
* 5 donors
* 5 volunteers
* 4 donation campaigns
* Multiple donations
* Multiple volunteer tasks
* Volunteer applications
* Volunteer hours

Make the application immediately demonstrable after running the seed script.

---

# 19. ERROR AND LOADING STATES

Every API request must have:

* Loading state
* Success state
* Error state
* Empty state

Show appropriate toast messages.

Examples:

"Donation submitted successfully."

"Volunteer application submitted."

"Campaign created successfully."

"Task assigned successfully."

---

# 20. FINAL REQUIREMENTS

Build the complete application, not a mockup.

First create the project structure.

Then implement:

1. MongoDB connection
2. Mongoose models
3. Authentication
4. Backend APIs
5. Frontend routing
6. Authentication context
7. Public pages
8. Donor dashboard
9. Volunteer dashboard
10. Admin dashboard
11. Donation management
12. Volunteer management
13. Task management
14. Analytics
15. Search/filter
16. Responsive design
17. Error handling
18. Seed data
19. README
20. Setup instructions

Use clean, modular, maintainable code.

Before finishing, check that there are no broken imports, missing dependencies, incorrect API URLs, or obvious runtime errors.

The application should be ready to run locally with:

```bash
npm install
npm run dev
```

Provide clear setup instructions for MongoDB Atlas and environment variables in README.md.



PS

Smart donation Drive & Volunteer Coordination Platform
NGOs and community  organization often coordinate donation drives through spredsheets , message application and manual follow-ups.  This makes it difficult to track donors , volunteers , targets and actual contributuinss.

Build a donation drive and volunteer Cooordination Platform that helps organizers manage drives, donors, volunteers and progress towrd targets
