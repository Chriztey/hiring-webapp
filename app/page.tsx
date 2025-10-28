"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./lib/firebase";
import { completeSignIn } from "./lib/completeSignIn";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRole() {
      const userFromLink = await completeSignIn();

      const user = userFromLink || auth.currentUser;

      if (!user) {
        // Not logged in → send to login page
        router.replace("/login");
        setLoading(false);
        return;
      }

      try {
        // Fetch Firestore role
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const role = snapshot.data().role;
          console.log("✅ Role:", role);

          // Redirect based on role
          if (role === "admin") {
            router.replace("/joblist");
          } else {
            router.replace("/jobboard");
          }
        } else {
          console.warn("⚠️ User doc not found — defaulting to /jobboard");
          router.replace("/jobboard");
        }
      } catch (err) {
        console.error("🔥 Error checking role:", err);
        router.replace("/login");
      }

      setLoading(false);
    }

    // Watch auth state
    const unsubscribe = onAuthStateChanged(auth, () => {
      checkAuthAndRole();
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-l-bold">
        <p className="text-neutral-80">Please wait...</p>
      </div>
    );
  }

  return null;
}
