"use client";

import { useRouter } from "next/navigation";
import { sendLoginLink } from "@/features/auth/lib/emailLinkAuth";
import { handleGoogleLogin } from "@/features/auth/lib/googleLoginAuth";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
            {" "}
            {/* gap-2 = 8px */}
            <p className="font-bold text-[20px] leading-[30px] text-neutral-90">
              Bergabung dengan Rakamin
            </p>
            <p className="font-normal text-[14px] leading-6 text-neutral-90">
              Sudah punya akun?{" "}
              <a
                href="/login"
                className="text-[14px] leading-6 text-primary-main"
              >
                Masuk
              </a>
            </p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-2 mb-4">
            {" "}
            {/* 8px spacing inside */}
            <label className="font-normal text-[12px] leading-5 text-neutral-90">
              Alamat email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full h-10 border-2 border-neutral-40 rounded-lg px-4 py-2 opacity-100 focus:outline-2[px] focus:outline-primary-main focus:ring-2 focus:ring-primary-main"
            />
          </div>

          {/* Primary Button */}
          <button
            className=" bg-secondary-main w-full py-3  text-neutral-90 text-l-bold flex items-center justify-center gap-1 
            rounded-lg pt-1.5 pr-4 pb-1.5 pl-4 "
            onClick={handleSendLink}
          >
            Daftar dengan email
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-neutral-60" />
            <span className="px-3 text-sm text-neutral-60">or</span>
            <hr className="flex-1 border-neutral-60" />
          </div>

          {/* Google Button */}
          <button
            onClick={onGoogleClick}
            className="w-full py-3 flex items-center justify-center gap-1 
            rounded-lg pt-1.5 pr-4 pb-1.5 pl-4 bg-neutral-10 border border-neutral-40"
          >
            <img src="/google.svg" alt="Google" className="h-6 pr-2" />
            <span className="font-semibold text-[14px] leading-[21px] align-middle text-neutral-90">
              Daftar dengan Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
