// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "@/services/firebase";
// import { completeSignIn } from "@/features/auth/lib/emailLinkAuth";

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function checkAuthAndRole() {
//       const userFromLink = await completeSignIn();

//       const user = userFromLink || auth.currentUser;

//       if (!user) {
//         // Not logged in → send to login page
//         router.replace("/login");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch Firestore role
//         const userRef = doc(db, "users", user.uid);
//         const snapshot = await getDoc(userRef);

//         if (snapshot.exists()) {
//           const role = snapshot.data().role;
//           console.log("✅ Role:", role);

//           // Redirect based on role
//           if (role === "admin") {
//             router.replace("/joblist");
//           } else {
//             router.replace("/jobboard");
//           }
//         } else {
//           console.warn("⚠️ User doc not found — defaulting to /jobboard");
//           router.replace("/jobboard");
//         }
//       } catch (err) {
//         console.error("🔥 Error checking role:", err);
//         router.replace("/login");
//       }

//       setLoading(false);
//     }

//     // Watch auth state
//     const unsubscribe = onAuthStateChanged(auth, () => {
//       checkAuthAndRole();
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-l-bold">
//         <p className="text-neutral-80">Please wait...</p>
//       </div>
//     );
//   }

//   return null;
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "@/services/firebase";
// import { completeSignIn } from "@/features/auth/lib/emailLinkAuth";

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let unsub: (() => void) | null = null;

//     async function handleUser(user: any) {
//       if (!user) {
//         localStorage.removeItem("userRole");
//         router.replace("/login");
//         setLoading(false);
//         return;
//       }

//       const cachedRole = localStorage.getItem("userRole");
//       if (cachedRole) {
//         console.log("🧠 Using cached role:", cachedRole);
//         router.replace(cachedRole === "admin" ? "/joblist" : "/jobboard");
//         setLoading(false);
//         return;
//       }

//       try {
//         const userRef = doc(db, "users", user.uid);
//         const snapshot = await getDoc(userRef);

//         if (!snapshot.exists()) {
//           console.warn("⚠️ No user doc — default to /jobboard");
//           localStorage.setItem("userRole", "user");
//           router.replace("/jobboard");
//           return;
//         }

//         const role = snapshot.data().role;
//         console.log("✅ Role from Firestore:", role);

//         localStorage.setItem("userRole", role);
//         router.replace(role === "admin" ? "/joblist" : "/jobboard");
//       } catch (err) {
//         console.error("🔥 Error checking role:", err);
//         router.replace("/login");
//       } finally {
//         setLoading(false);
//       }
//     }

//     async function initAuth() {
//       const userFromLink = await completeSignIn();
//       if (userFromLink) {
//         await handleUser(userFromLink);
//         return;
//       }

//       unsub = onAuthStateChanged(auth, async (user) => {
//         await handleUser(user);
//       });
//     }

//     initAuth();

//     // ✅ Proper cleanup
//     return () => {
//       if (unsub) unsub();
//     };
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-l-bold">
//         <p className="text-neutral-80">Please wait...</p>
//       </div>
//     );
//   }

//   return null;
// }

"use client";

import AuthRedirect from "@/components/authredirect";

export default function HomePage() {
  console.log("✅ HomePage mounted"); // <-- add this to test
  return <AuthRedirect />;
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "./store";

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   const user = useSelector((state: RootState) => state.auth.user);
//   const role = user?.role;

//   useEffect(() => {
//     if (user) {
//       if (role === "admin") {
//         router.replace("/joblist");
//       } else {
//         router.replace("/jobboard");
//       }
//     } else {
//       router.replace("/login");
//     }
//     setLoading(false);
//   }, [user, role, router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-l-bold">
//         <p className="text-neutral-80">Please wait...</p>
//       </div>
//     );
//   }

//   return null;
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "@/services/firebase";
// import { completeSignIn } from "@/features/auth/lib/emailLinkAuth";
// import { useSelector } from "react-redux";
// import { RootState } from "./store";

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const reduxUser = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       // 1️⃣ Try to complete email link sign-in (if applicable)
//       await completeSignIn();

//       // 2️⃣ Prefer Firebase user if available, fallback to Redux user
//       const user = firebaseUser || reduxUser;

//       if (!user) {
//         router.replace("/login");
//         setLoading(false);
//         return;
//       }

//       // 3️⃣ Get role
//       const ref = doc(db, "users", user.uid);
//       const snap = await getDoc(ref);
//       const role = snap.exists() ? snap.data().role : "user";

//       if (role === "admin") router.replace("/joblist");
//       else router.replace("/jobboard");

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [router, reduxUser]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-neutral-80">Please wait...</p>
//       </div>
//     );
//   }

//   return null;
// }
