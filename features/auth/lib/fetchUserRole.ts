import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export async function fetchUserRole(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.role as "admin" | "user";
  } else {
    throw new Error("User role not found in Firestore");
  }
}
