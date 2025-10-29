# 🧩 Frontend Engineer Case Study 2025
A simplified **Hiring Management Web App** that allows recruiters (Admin) to manage job vacancies and applicants (Job Seekers) to apply, built based on the given PRD and design handoff.

---

## 🚀 Project Overview
This project implements a **two-role hiring management system**:

### 👩‍💼 Admin (Recruiter)
- View all created job vacancies.  
- Create and configure job postings dynamically.  
- Manage and review candidate applications via a reorderable table view.

### 👨‍💻 Applicant (Job Seeker)
- View and apply for active job postings.  
- Application form fields adapt dynamically based on backend configuration.  
- Capture profile picture via webcam and hand gestures (1️⃣ 2️⃣ 3️⃣).

<h2 align="center">🎥 Demo Video</h2>
<p align="center">
  <a href="https://youtu.be/llAJPq5vP10" target="_blank">
    <img src="https://img.youtube.com/vi/llAJPq5vP10/hqdefault.jpg" alt="Watch the demo video" width="480">
  </a>
</p>

The main focus of this project is:
- Translating **Figma design** and **PRD requirements** into a functional, responsive web app.  
- Demonstrating **dynamic frontend behavior** and **clean, modular code architecture**.  
- Providing a **pixel-perfect**, **accessible**, and **enterprise-grade** user experience.

---
## 🌐 Deployed App
Live Demo: [https://yourproject.vercel.app](https://yourproject.vercel.app)

---

## 🔐 Authentication and Authorization

The application uses **Firebase Authentication** and includes three authentication methods:

1. **Email Link Sign-In** – Users receive a secure sign-in link via email.  
   *(Note: Check the spam folder as the link may sometimes be filtered there.)*

2. **Google Sign-In** – Simplified one-click login using a Google account.

3. **Email and Password** – Users can register directly using an email and password combination.

All new users are automatically registered under the **Applicant (User)** role.  
To assign the **Admin** role, update the user’s role field manually in **Firebase Firestore**.  
This allows flexible role-based testing and ensures secure role management.

### 🧪 Demo Credentials (for evaluation)

**User Account**  
- Email: `user@rakatest.com`  
- Password: `rakatest`

**Admin Account**  
- Email: `admin@rakatest.com`  
- Password: `rakatest`

---

## 🧠 Tech Stack Used

| Area | Technology / Library | Notes |
|------|-----------------------|-------|
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | For building a performant React-based web app with routing and API integration |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | For utility-first responsive design and consistent styling |
| **Database / Backend** | [Supabase](https://supabase.com/) | Used for job listings and candidate data persistence |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) | To manage user roles (Admin / Applicant) |
| **Firestore** | [Firebase Firestore](https://firebase.google.com/docs/firestore) | Used to store user metadata such as role and profile info |
| **State Management** | React built-in hooks (`useState`, `useEffect`, `useContext`) | Simple local state handling — **no Redux/Zustand needed** for this project’s scope |
| **Webcam & Gesture** | @mediapipe/tasks-vision + Browser Webcam API | Detects hand gestures for profile photo capture (user permission required, privacy-friendly) |
| **Testing** | [Playwright](https://playwright.dev/) | For end-to-end testing of core user flows (job creation, form validation, submission) |
| **Deployment** | [Vercel](https://vercel.com/) | For hosting and CI/CD integration with Next.js |

### ⚡ Why no Redux / Zustand?
This project’s state management is **component-scoped** and **contextual** — React’s native hooks and context API are sufficient for handling user role, form state, and simple data flow.  
Introducing a global state library like Redux or Zustand would add unnecessary complexity for this scale.

---


---

## 🧭 How to Run Locally

### 1️⃣ Clone this repository
```bash
git clone https://github.com/yourusername/rakamin-frontend-case.git
cd rakamin-frontend-case
```

### 2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

3️⃣ Setup environment variables
Create a .env.local file in the root directory with the following:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4️⃣ Run the development server
```bash
npm run dev
# or
yarn dev
```

App will be available at http://localhost:3000

## 🧪 Run Tests (Playwright)

Make sure Playwright is installed:

```bash
npx playwright install
```

Then run:

```bash
npx playwright test
```

To open the UI test viewer:
```bash
npx playwright test --ui
```

## 🧱 Future Improvements
 - Add more detailed Playwright coverage for edge cases.
 - Improve accessibility (focus rings, ARIA roles).
 - Add dark mode toggle for better UX.

## ⚠️ Known Limitations
 - 🧱 **Backend Integration Simplified** — uses Supabase and Firebase in combination instead of a full backend API.  
 - 🔁 **Column reordering** implemented with basic logic; not persisted across sessions yet.  
 - 🧩 **Form validation** currently based on front-end schema from Supabase response (no deep nested field validation).  
 - 📱 Some spacing may slightly differ from Figma on smaller viewports due to Tailwind breakpoints.  
 - 🧾 No authentication persistence (session restore) beyond Firebase default — would need additional logic for production.

## 📝 License

This project is for Case Study — intended solely for assessment and demonstration purposes.
