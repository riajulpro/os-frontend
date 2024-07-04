"use client";

import { customerLinks } from "@/utils/profileSidebarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileSidebar = () => {
  const path = usePathname();
  return (
    <div className="flex flex-col gap-[15px]">
      {customerLinks.map(({ Icon, href, label }, i) => (
        <Link
          href={href}
          key={"profile" + i}
          className={`w-[240px] border-[1px] border-borderColor py-[12px] rounded-[5px] flex items-center justify-start gap-[5px] font-[500] pl-[20px] ${
            path === href
              ? "bg-primaryMat text-white"
              : "bg-white text-primaryTxt"
          }`}
        >
          <Icon /> {label}
        </Link>
      ))}
    </div>
  );
};

export default ProfileSidebar;
