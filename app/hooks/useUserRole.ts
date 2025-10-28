import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      
      const user = auth.currentUser;
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
