import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";



export async function completeSignIn() {
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please confirm your email for sign-in")!;
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("emailForSignIn");

      const user = result.user;
      console.log("✅ Signed in as:", user.email);

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: "user",
          createdAt: new Date(),
        });
        console.log("✅ Firestore user created");
      } else {
        console.log("ℹ️ User already exists in Firestore");
      }

      return user;
    }
    return null;
  } catch (error) {
    console.error("🔥 Error during completeSignIn:", error);
    return null;
  }
}
