"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import {
  selectCurrentUser,
  selectAuthStatus,
  selectAuthError,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  clearError,
  refreshToken,
} from "@/lib/redux/slices/userSlice";
import { useTranslation } from "@/lib/use-translation";

const MyAccount = () => {
  const { t, isRTL } = useTranslation();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [
      {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Egypt",
        isDefault: false,
      },
    ],
    preferences: {
      newsletter: true,
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  // Egyptian governorates for address selection
  const egyptianGovernorates = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Dakahlia",
    "Red Sea",
    "Beheira",
    "Fayoum",
    "Gharbiya",
    "Ismailia",
    "Menofia",
    "Minya",
    "Qaliubiya",
    "New Valley",
    "Suez",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "Damietta",
    "Sharkia",
    "South Sinai",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Qena",
    "North Sinai",
    "Sohag",
  ];

  // Initialize form data when user data is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        addresses:
          currentUser.addresses && currentUser.addresses.length > 0
            ? currentUser.addresses
            : [
                {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  country: "Egypt",
                  isDefault: false,
                },
              ],
        preferences: currentUser.preferences || {
          newsletter: true,
          emailNotifications: true,
          smsNotifications: false,
        },
      });
    }
  }, [currentUser]);

  // Fetch user profile if not already loaded
  useEffect(() => {
    if (!currentUser && status === "idle") {
      handleGetUserProfile();
    }
  }, [currentUser, status, dispatch]);

  const handleGetUserProfile = async () => {
    try {
      await dispatch(getUserProfile()).unwrap();
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value,
      },
    }));
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][field] = value;

    // If setting as default, unset all other defaults
    if (field === "isDefault" && value) {
      updatedAddresses.forEach((addr, i) => {
        if (i !== index) addr.isDefault = false;
      });
    }

    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out addresses with missing required fields
    const validAddresses = formData.addresses.filter(
      (addr) => addr.street.trim() && addr.city.trim() && addr.state.trim()
    );

    // If no valid addresses, show error
    if (validAddresses.length === 0) {
      alert(
        "Please fill in all required address fields or remove empty addresses"
      );
      return;
    }

    try {
      await dispatch(
        updateUserProfile({
          ...formData,
          addresses: validAddresses,
        })
      ).unwrap();
      setIsEditingProfile(false);
      setIsEditingAddresses(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const addNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Egypt",
          isDefault: false,
        },
      ],
    }));
  };

  const removeAddress = (index) => {
    if (formData.addresses.length <= 1) return;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const formatEgyptianPhone = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("+2")) return phone;
    if (phone.startsWith("01")) return `+2${phone}`;
    return `+2${phone}`;
  };

  // Apply RTL styles if language is Arabic
  const containerClass = isRTL ? "rtl" : "ltr";
  const textAlignClass = isRTL ? "text-right" : "text-left";

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          {t("common.loading")}
        </span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
          <p>{t("auth.signin.please_login")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 ${containerClass}`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-gray-800 dark:text-white ${textAlignClass}`}
      >
        {t("account.my_account")}
      </h1>

      {/* Theme Switcher */}
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label={t("aria_labels.toggle_theme")}
        >
          {theme === "dark" ? t("theme.light") : t("theme.dark")}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200 relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 right-0 p-2"
            onClick={() => dispatch(clearError())}
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div
          className={`flex justify-between items-center mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t("account.profile")}
          </h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t("actions.edit")}
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.signup.full_name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.signin.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.signup.phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div
              className={`flex gap-2 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t("actions.save")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {t("actions.cancel")}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-2xl text-blue-600 dark:text-blue-300">
                  {currentUser.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                  {currentUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("auth.signin.email")}
                </h4>
                <p className="text-gray-800 dark:text-white">
                  {currentUser.email}
                </p>
              </div>
              <div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("auth.signup.phone")}
                </h4>
                <p className="text-gray-800 dark:text-white">
                  {formatEgyptianPhone(currentUser.phone)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div
          className={`flex justify-between items-center mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t("checkout.shipping_info")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={addNewAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t("actions.add")}
            </button>
            <button
              onClick={() => setIsEditingAddresses(!isEditingAddresses)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isEditingAddresses ? t("actions.cancel") : t("actions.edit")}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {formData.addresses.map((address, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              {isEditingAddresses ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.shipping_location")}
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) =>
                          handleAddressChange(index, "state", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">
                          {t("auth.signup.choose_governorate")}
                        </option>
                        {egyptianGovernorates.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.city")}
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          handleAddressChange(index, "city", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.address")}
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) =>
                          handleAddressChange(index, "street", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t("checkout.postal_code")}
                      </label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) =>
                          handleAddressChange(index, "zipCode", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id={`default-address-${index}`}
                      checked={address.isDefault}
                      onChange={(e) =>
                        handleAddressChange(
                          index,
                          "isDefault",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`default-address-${index}`}
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      {t("checkout.default_address")}
                    </label>
                  </div>
                  {formData.addresses.length > 1 && (
                    <button
                      onClick={() => removeAddress(index)}
                      className="mt-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      {t("actions.delete")}
                    </button>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {address.street}
                    </h3>
                    {address.isDefault && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        {t("checkout.default")}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.zipCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.country}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditingAddresses && (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t("actions.save")}
            </button>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {t("account.preferences")}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.preferences.newsletter}
              onChange={(e) =>
                handlePreferenceChange("newsletter", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="newsletter"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {t("account.newsletter")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={formData.preferences.emailNotifications}
              onChange={(e) =>
                handlePreferenceChange("emailNotifications", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="emailNotifications"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {t("account.email_notifications")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={formData.preferences.smsNotifications}
              onChange={(e) =>
                handlePreferenceChange("smsNotifications", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="smsNotifications"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {t("account.sms_notifications")}
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("actions.save")}
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {t("account.sign_out")}
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
