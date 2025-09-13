// app/signup/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  registerUser,
  clearError,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from "@/lib/redux/slices/userSlice";
import { AuthSuccess, AuthError } from "@/components/AuthStatus";
import { useTranslation } from "@/lib/use-translation";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

// Governorate data (expanded list)
const governorates = [
  { value: "cairo", label: { en: "Cairo", ar: "القاهرة" } },
  { value: "alexandria", label: { en: "Alexandria", ar: "الإسكندرية" } },
  { value: "giza", label: { en: "Giza", ar: "الجيزة" } },
  { value: "sharqia", label: { en: "Sharqia", ar: "الشرقية" } },
  { value: "dakahlia", label: { en: "Dakahlia", ar: "الدقهلية" } },
  { value: "beheira", label: { en: "Beheira", ar: "البحيرة" } },
  { value: "monufia", label: { en: "Monufia", ar: "المنوفية" } },
  { value: "qalyubia", label: { en: "Qalyubia", ar: "القليوبية" } },
  { value: "aswan", label: { en: "Aswan", ar: "أسوان" } },
  { value: "asyut", label: { en: "Asyut", ar: "أسيوط" } },
  { value: "luxor", label: { en: "Luxor", ar: "الأقصر" } },
  { value: "red-sea", label: { en: "Red Sea", ar: "البحر الأحمر" } },
  { value: "new-valley", label: { en: "New Valley", ar: "الوادي الجديد" } },
  { value: "north-sinai", label: { en: "North Sinai", ar: "شمال سيناء" } },
  { value: "south-sinai", label: { en: "South Sinai", ar: "جنوب سيناء" } },
];

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    governorate: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    agreeToTerms: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isLoading = status === "loading";

  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = t("auth.signup.validation.name_required");
        break;
      case "email":
        if (!value.trim()) {
          error = t("auth.signup.validation.email_required");
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = t("auth.signup.validation.email_invalid");
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = t("auth.signup.validation.phone_required");
        } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(value)) {
          error = t("auth.signup.validation.phone_invalid");
        }
        break;
      case "governorate":
        if (!value) error = t("auth.signup.validation.governorate_required");
        break;
      case "city":
        if (!value.trim()) error = t("auth.signup.validation.city_required");
        break;
      case "postalCode":
        if (!value.trim())
          error = t("auth.signup.validation.postal_code_required");
        break;
      case "streetAddress":
        if (!value.trim()) error = t("auth.signup.validation.address_required");
        break;
      case "password":
        if (!value) {
          error = t("auth.signup.validation.password_required");
        } else if (value.length < 6) {
          error = t("auth.signup.validation.password_length");
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = t("auth.signup.validation.password_mismatch");
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "agreeToTerms") {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = t("auth.signup.validation.terms");
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate field if it's been touched before
    if (touched[name]) {
      const error = validateField(name, newValue);
      setLocalErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setLocalErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setLocalErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSelectBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Clear previous errors
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(localErrors)[0];
      if (firstErrorKey) {
        document.getElementById(firstErrorKey)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const addressData = {
      street: formData.streetAddress,
      city: formData.city,
      state: formData.governorate,
      zipCode: formData.postalCode,
      country: "Egypt",
      isDefault: true,
    };

    try {
      const result = await dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          addresses: [addressData],
        })
      ).unwrap();

      if (result) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center py-12">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
            {t("auth.signup.already_logged_in")}
          </h1>
          <p className="mt-2 text-green-600 dark:text-green-300">
            {t("auth.signup.redirecting")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-8 my-8 md:my-12 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("auth.signup.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {t("auth.signup.subtitle")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                  {t("auth.signup.personal_info")}
                </h2>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    {t("auth.signup.full_name")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      placeholder={
                        currentLanguage === "ar" ? "محمد أحمد" : "John Doe"
                      }
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={localErrors.name ? "border-red-500 pr-10" : ""}
                      aria-invalid={!!localErrors.name}
                      aria-describedby={
                        localErrors.name ? "name-error" : undefined
                      }
                    />
                    {localErrors.name && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.name && (
                    <p
                      id="name-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    {t("auth.signin.email")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      placeholder="example@email.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={
                        localErrors.email ? "border-red-500 pr-10" : ""
                      }
                      aria-invalid={!!localErrors.email}
                      aria-describedby={
                        localErrors.email ? "email-error" : undefined
                      }
                    />
                    {localErrors.email && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    {t("auth.signup.phone")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      placeholder={
                        currentLanguage === "ar"
                          ? "01XXXXXXXXX"
                          : "123-456-7890"
                      }
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={
                        localErrors.phone ? "border-red-500 pr-10" : ""
                      }
                      aria-invalid={!!localErrors.phone}
                      aria-describedby={
                        localErrors.phone ? "phone-error" : undefined
                      }
                    />
                    {localErrors.phone && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.phone && (
                    <p
                      id="phone-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                  {t("auth.signup.address_info")}
                </h2>

                {/* Governorate */}
                <div className="space-y-2">
                  <Label
                    htmlFor="governorate"
                    className="flex items-center gap-1"
                  >
                    {t("auth.signup.governorate")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.governorate}
                    onValueChange={(value) =>
                      handleSelectChange("governorate", value)
                    }
                    onOpenChange={(open) =>
                      !open && handleSelectBlur("governorate")
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="governorate"
                      className={
                        localErrors.governorate ? "border-red-500" : ""
                      }
                      aria-invalid={!!localErrors.governorate}
                      aria-describedby={
                        localErrors.governorate
                          ? "governorate-error"
                          : undefined
                      }
                    >
                      <SelectValue
                        placeholder={t("auth.signup.choose_governorate")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov.value} value={gov.value}>
                          {currentLanguage === "ar"
                            ? gov.label.ar
                            : gov.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {localErrors.governorate && (
                    <p
                      id="governorate-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.governorate}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-1">
                    {t("auth.signup.city")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="city"
                      name="city"
                      placeholder={
                        currentLanguage === "ar" ? "اسم المدينة" : "City name"
                      }
                      required
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={localErrors.city ? "border-red-500 pr-10" : ""}
                      aria-invalid={!!localErrors.city}
                      aria-describedby={
                        localErrors.city ? "city-error" : undefined
                      }
                    />
                    {localErrors.city && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.city && (
                    <p
                      id="city-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.city}
                    </p>
                  )}
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label
                    htmlFor="postalCode"
                    className="flex items-center gap-1"
                  >
                    {t("auth.signup.postal_code")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder={
                        currentLanguage === "ar"
                          ? "الرمز البريدي"
                          : "Postal Code"
                      }
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={
                        localErrors.postalCode ? "border-red-500 pr-10" : ""
                      }
                      aria-invalid={!!localErrors.postalCode}
                      aria-describedby={
                        localErrors.postalCode ? "postalCode-error" : undefined
                      }
                    />
                    {localErrors.postalCode && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.postalCode && (
                    <p
                      id="postalCode-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.postalCode}
                    </p>
                  )}
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <Label
                    htmlFor="streetAddress"
                    className="flex items-center gap-1"
                  >
                    {t("auth.signup.address")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      placeholder={
                        currentLanguage === "ar"
                          ? "اسم الشارع، رقم العمارة، الدور، الشقة"
                          : "Street name, building number, floor, apartment"
                      }
                      required
                      value={formData.streetAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={
                        localErrors.streetAddress ? "border-red-500 pr-10" : ""
                      }
                      aria-invalid={!!localErrors.streetAddress}
                      aria-describedby={
                        localErrors.streetAddress
                          ? "streetAddress-error"
                          : undefined
                      }
                    />
                    {localErrors.streetAddress && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {localErrors.streetAddress && (
                    <p
                      id="streetAddress-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.streetAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t("auth.signup.security_info")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    {t("auth.signin.password")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      minLength={6}
                      className={
                        localErrors.password ? "border-red-500 pr-10" : ""
                      }
                      aria-invalid={!!localErrors.password}
                      aria-describedby={
                        localErrors.password ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {localErrors.password && (
                    <p
                      id="password-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center gap-1"
                  >
                    {t("auth.signup.confirm_password")}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      className={
                        localErrors.confirmPassword
                          ? "border-red-500 pr-10"
                          : ""
                      }
                      aria-invalid={!!localErrors.confirmPassword}
                      aria-describedby={
                        localErrors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {localErrors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {localErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  localErrors.agreeToTerms ? "border-red-500" : ""
                }`}
                aria-invalid={!!localErrors.agreeToTerms}
                aria-describedby={
                  localErrors.agreeToTerms ? "agreeToTerms-error" : undefined
                }
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {t("auth.signup.agree_terms")}
              </label>
            </div>
            {localErrors.agreeToTerms && (
              <p
                id="agreeToTerms-error"
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {localErrors.agreeToTerms}
              </p>
            )}

            <Button
              className="w-full py-3 text-base font-medium"
              type="submit"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  {t("auth.signup.loading")}
                </div>
              ) : (
                t("auth.signup.button")
              )}
            </Button>
          </form>

          {/* Already have account */}
          <div className="text-center text-sm pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            {t("auth.signup.already_account")}{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
            >
              {t("auth.signup.signin")}
            </Link>
          </div>
        </div>
      </div>

      {/* Success & Error Modals */}
      {showSuccess && (
        <AuthSuccess
          message={t("auth.signup.success")}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <AuthError
          message={error || t("auth.signup.error")}
          onClose={() => {
            setShowError(false);
            dispatch(clearError());
          }}
        />
      )}
    </>
  );
}
