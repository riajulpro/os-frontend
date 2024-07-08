"use client";
import { useAppSelector } from "@/redux/hook";
import { format } from "date-fns";
import Image from "next/image";
const Profile = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  console.log("user from user profile", user);
  if (!user) return;
  const img = user?.picture || "/images/avatar.jpg";
  const accountCreated = user.createdAt ? new Date(user.createdAt) : new Date();

  return (
    <div className="pl-[20px] flex flex-col gap-[20px]">
      <h1 className="text-[35px] font-[700] text-primaryTxt">
        Hello <span className="text-primaryMat">{user?.firstName}</span>,
      </h1>{" "}
      <div className="flex items-start justify-start gap-[15px] mt-[20px]">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[1px] border-borderColor">
          <Image
            src={img}
            width={100}
            height={100}
            className="w-full h-full rounded-full object-cover"
            alt="user"
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="text-[20px] text-primaryTxt font-[700]">
            {user.firstName} {user.lastName}
          </p>
          <p>
            {user.role || "customer"} since{" "}
            {format(accountCreated, "MMM dd, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
