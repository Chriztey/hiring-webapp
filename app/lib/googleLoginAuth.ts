import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export async function handleGoogleLogin() {
  try {
    // Ensure session persists after refresh
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create or update user document
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: "user", // default role
        createdAt: new Date(),
      });
      console.log("✅ Created new user doc for:", user.email);
    } else {
      console.log("ℹ️ Existing user found:", user.email);
    }

    return user;
  } catch (error) {
    console.error("🔥 Google login failed:", error);
    throw error;
  }
}
