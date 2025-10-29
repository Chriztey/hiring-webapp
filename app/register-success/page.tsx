// "use client";
// import { useSearchParams } from "next/navigation";

// export default function RegisterSuccessPage() {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="p-10 bg-white rounded-xl shadow-2xl text-center space-y-2">
//         <p className="heading-m-bold text-neutral-90">Periksa Email Anda</p>
//         <p className="text-s-regular text-neutral-90">
//           Kami sudah mengirimkan link register ke{" "}
//           <span className="text-s-bold">{email ?? "alamat email Anda"}</span>{" "}
//           yang berlaku
//           <br />
//           dalam <span className="text-s-bold">30 menit</span>
//         </p>
//         <img src="/check_mail.svg" alt="check_mail" className="block mx-auto" />
//       </div>
//     </div>
//   );
// }

"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 bg-white rounded-xl shadow-2xl text-center space-y-2">
        <p className="heading-m-bold text-neutral-90">Periksa Email Anda</p>
        <p className="text-s-regular text-neutral-90">
          Kami sudah mengirimkan link register ke{" "}
          <span className="text-s-bold">{email ?? "alamat email Anda"}</span>{" "}
          yang berlaku
          <br />
          dalam <span className="text-s-bold">30 menit</span>
        </p>
        <img src="/check_mail.svg" alt="check_mail" className="block mx-auto" />
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterSuccessContent />{" "}
    </Suspense>
  );
}
