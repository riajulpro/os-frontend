"use client";

import Loading from "@/app/loading";
import { useGetAuthorQuery } from "@/redux/features/auth/auth.api";
import { useAppSelector } from "@/redux/hook";
import React from "react";
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth);

  const { data, isSuccess, isError, isLoading } = useGetAuthorQuery(
    token || ""
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
