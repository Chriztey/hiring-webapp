"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { completeSignIn } from "@/features/auth/lib/emailLinkAuth";

export default function AuthRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkUserRole = async (user: any) => {
      if (!user) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const role = snapshot.data().role;
          console.log("✅ Role:", role);

          if (role === "admin") {
            router.replace("/joblist");
          } else {
            router.replace("/jobboard");
          }
        } else {
          console.warn("⚠️ No user doc found — defaulting to /jobboard");
          router.replace("/jobboard");
        }
      } catch (error) {
        console.error("🔥 Role fetch error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      const userFromLink = await completeSignIn().catch(() => null);
      if (userFromLink) {
        await checkUserRole(userFromLink);
        return;
      }

      unsubscribe = onAuthStateChanged(auth, (user) => {
        checkUserRole(user);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-80 text-lg font-semibold">
          Checking login...
        </p>
      </div>
    );
  }

  return null;
}
