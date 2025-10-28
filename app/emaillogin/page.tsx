"use client";

import { useState, useEffect } from "react";
import { sendLoginLink, completeSignIn } from "../lib/emailLinkAuth";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "../lib/googleLoginAuth";
import { loginWithEmailPassword } from "../lib/emailPass";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle redirect link from email
  useEffect(() => {
    completeSignIn().then((user) => {
      if (user) {
        router.push("/"); // redirect to home after login
      }
    });
  }, [router]);

  const handleLoginEmailPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user, role } = await loginWithEmailPassword(email, password);
      console.log("Logged in user:", user, "Role:", role);
      router.replace("/"); // redirect after successful login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendLoginLink(email);
      setMessage("Link login telah dikirim ke email Anda!");
      router.push(`/register-success?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const onGoogleClick = async () => {
    try {
      const user = await handleGoogleLogin();
      console.log("✅ Logged in as:", user.email);
      router.replace("/"); // your home will auto-redirect based on role
    } catch (error) {
      alert("Login with Google failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md ">
        {/* Logo */}
        <div className="flex items-center gap-2 pb-6 py-10">
          <img src="/logo.svg" alt="Rakamin" className="w-[145px] h-[50px]" />
        </div>

        <div className="bg-white w-full p-10 border border-[#EFEEEE]">
          {/* Title Section */}
          <div className="flex flex-col gap-2 mb-4">
            <p className="font-bold text-[20px] leading-[30px] text-neutral-90">
              Masuk ke Rakamin
            </p>
            <p className="font-normal text-[14px] leading-[24px] text-neutral-90">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-[14px] leading-[24px] text-primary-main"
              >
                Daftar menggunakan email
              </a>
            </p>
          </div>

          {/* Input Section */}
          <form
            onSubmit={handleLoginEmailPass}
            className="flex flex-col gap-2 mb-4"
          >
            <label className="font-normal text-[12px] leading-[20px] text-neutral-90">
              Alamat email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[40px] border-2 border-neutral-40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-main"
              required
            />

            <label className="font-normal text-[12px] leading-[20px] text-neutral-90">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full h-[40px] border-2 border-neutral-40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-main"
              required
            />

            <button
              type="submit"
              className=" bg-secondary-main w-full py-3 text-neutral-90 text-l-bold rounded-lg flex items-center justify-center gap-1"
            >
              Masuk
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-neutral-60" />
            <span className="px-3 text-sm text-neutral-60">or</span>
            <hr className="flex-1 border-neutral-60" />
          </div>

          {/* Email & Google Button */}
          <button
            className="w-full h-[48px] py-3 rounded-lg flex items-center justify-center gap-1 bg-neutral-10 border border-neutral-40 
            pt-[6px] pr-4 pb-[6px] pl-4 mb-2"
            onClick={() => router.push("/login")}
          >
            <i className="ri-mail-fill h-[16px] pr-2 pb-6"></i>
            <span className="font-semibold text-[14px] leading-[21px] text-neutral-90">
              Kirim link login melalui email
            </span>
          </button>

          <button
            className="w-full h-[48px] py-3 rounded-lg flex items-center justify-center gap-1 
            pt-[6px] pr-4 pb-[6px] pl-4 bg-neutral-10 border border-neutral-40 "
            onClick={onGoogleClick}
          >
            <img src="/google.svg" alt="Google" className="h-[24px] pr-2" />
            <span className="font-semibold text-[14px] leading-[21px] text-neutral-90">
              Masuk dengan Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
