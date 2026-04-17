"use client";
import React, { useEffect, useState } from "react";
import toTitleCase from "@/app/components/ToTitleCase";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // fetchData()
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Verifying Session...</p>
      </div>
    );
  }

  if (!session) return null;
  return (
    <>
      <title>Todo Application</title>

      <div>WelCome</div>
      <p onClick={signOut}>Sign Out</p>
    </>
  );
}
