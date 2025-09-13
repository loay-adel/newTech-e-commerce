"use client";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/lib/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to continue</h1>
          <p className="text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return children;
}
