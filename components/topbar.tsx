// import React from "react";

// interface TopBarProps {
//   title: string;
//   rightElement?: React.ReactNode; // optional icon/avatar/etc
// }

// const TopBar: React.FC<TopBarProps> = ({ title, rightElement }) => {
//   return (
//     <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4.5 bg-white w-full">
//       <h2 className="text-xl font-bold text-[#1E1F21S]">{title}</h2>
//       {rightElement && <div>{rightElement}</div>}
//     </div>
//   );
// };

// export default TopBar;

"use client";

import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const [showMenu, setShowMenu] = useState(false);

  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      window.location.href = "/login"; // redirect after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4.5 bg-white w-full relative">
      <h2 className="text-xl font-bold text-[#1E1F21]">{title}</h2>

      {/* Avatar with dropdown */}
      <div className="relative">
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="cursor-pointer w-7 h-7 rounded-full bg-secondary-main flex items-center justify-center text-white font-bold text-sm"
        >
          {userInitial}
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-2 px-6 py-3 w-fit bg-white border rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-m-bold bg-danger-main text-white rounded-md hover:bg-danger-hover"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
