"use client";

import AuthRedirect from "@/components/authredirect";

export default function HomePage() {
  console.log("✅ HomePage mounted"); // <-- add this to test
  return <AuthRedirect />;
}
