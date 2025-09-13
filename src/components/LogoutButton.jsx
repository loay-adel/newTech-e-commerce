"use client";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/redux/slices/userSlice";
import { toast } from "sonner";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
