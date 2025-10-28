import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase"; 

export async function loginWithEmailPassword(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    let role = "user"; // default role

    if (snapshot.exists()) {
      role = snapshot.data().role;
    } else {
      // Create a new document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        role,          // default role
        createdAt: new Date()
      });
    }

    return { user, role };
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw new Error(error.message);
  }
}
