import { auth, db } from "./firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_EMAIL_LINK_REDIRECT_URL || "http://localhost:3000/",
  handleCodeInApp: true,
};

export async function sendLoginLink(email: string) {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
}

export async function completeSignIn() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please confirm your email for sign-in")!;
    }
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");

    // after successful sign-in, create Firestore user doc
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "user",
        createdAt: new Date(),
      });
    }

    return user;
  }
  return null;
}
