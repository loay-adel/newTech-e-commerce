// app/signin/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  loginUser,
  clearError,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from "@/lib/redux/slices/userSlice";
import { AuthSuccess, AuthError } from "@/components/AuthStatus";
import { useTranslation } from "@/lib/use-translation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isLoading = status === "loading";

  useEffect(() => {
    setIsMounted(true);

    // Check if user is already authenticated on client side
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      // User is already authenticated, don't show login form
      setIsCheckingAuth(false);
    } else {
      // No token found, show login form
      setIsCheckingAuth(false);
    }
  }, []);

  // Show success popup only when this page initiated a login and auth flipped true.
  useEffect(() => {
    if (loginAttempted && isAuthenticated) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempted, isAuthenticated, router]);

  // Show error popup only when this page initiated a login and an error exists.
  useEffect(() => {
    if (loginAttempted && error) {
      setShowError(true);
    }
  }, [loginAttempted, error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(
        currentLanguage === "ar"
          ? "يرجى ملء جميع الحقول"
          : "Please fill in all fields"
      );
      return;
    }

    setLoginAttempted(true);
    dispatch(loginUser({ email, password }));
  };

  // Avoid hydration flash
  if (!isMounted || isCheckingAuth) {
    return (
      <div className="mx-auto max-w-md space-y-6 my-12 md:my-20 px-2">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("auth.signin.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("auth.signin.subtitle")}
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.signin.email")}</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              type="email"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.signin.password")}</Label>
            <Input id="password" type="password" disabled />
          </div>
          <Button className="w-full" disabled>
            {t("auth.signin.loading")}
          </Button>
        </div>
      </div>
    );
  }

  // If user opens /signin while already logged in (without submitting this form),
  // show the "already logged in" panel.
  if (isAuthenticated && !loginAttempted) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">
          {t("auth.signin.already_logged_in")}
        </h1>
        <Button onClick={() => router.push("/")}>
          {t("auth.signin.go_home")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-md space-y-6 my-12 md:my-20 px-2">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("auth.signin.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("auth.signin.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.signin.email")}</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.signin.password")}</Label>
            <Input
              id="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? t("auth.signin.loading") : t("auth.signin.button")}
          </Button>
        </form>

        <div className="text-center text-sm">
          {t("auth.signin.no_account")}{" "}
          <Link href="/signup" className="underline">
            {t("auth.signin.create_account")}
          </Link>
        </div>
      </div>

      {/* Success Modal: keep it on top and redirect after close */}
      {showSuccess && (
        <AuthSuccess
          message={t("auth.signin.success")}
          onClose={() => {
            setShowSuccess(false);
            setLoginAttempted(false);
            router.push("/");
          }}
        />
      )}

      {/* Error Modal */}
      {showError && (
        <AuthError
          message={error || t("auth.signin.error")}
          onClose={() => {
            setShowError(false);
            setLoginAttempted(false);
            dispatch(clearError());
          }}
        />
      )}
    </>
  );
}
