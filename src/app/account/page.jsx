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
} from "@/lib/redux/slices/userSlice";
import { useTranslation } from "@/lib/use-translation";

const MyAccount = () => {
  const { t, isRTL } = useTranslation();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [isEditing, setIsEditing] = useState(false);
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
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

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
          currentUser.addresses?.length > 0
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
      });
    }
  }, [currentUser]);

  // Fetch user profile if not already loaded
  useEffect(() => {
    if (!currentUser && status === "idle") {
      dispatch(getUserProfile());
    }
  }, [currentUser, status, dispatch]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      // Mock data for demonstration with Egyptian context
      setTimeout(() => {
        setOrders([
          {
            id: "ORD-12345",
            date: "2023-10-15",
            status: "Delivered",
            items: 3,
            total: 1499.99,
            currency: "EGP",
          },
          {
            id: "ORD-12346",
            date: "2023-09-22",
            status: "Processing",
            items: 1,
            total: 499.99,
            currency: "EGP",
          },
        ]);
        setIsLoadingOrders(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setIsLoadingOrders(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      addresses: updatedAddresses,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
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
    // Format Egyptian phone numbers for display
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
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
          <p>{t("auth.signin.already_logged_in")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 ${containerClass}`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-gray-800 dark:text-white ${textAlignClass}`}
      >
        {t("account.my_account")}
      </h1>

      {/* Theme and Language Switcher */}
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label={t("aria_labels.toggle_theme")}
          >
            {theme === "dark" ? t("theme.light") : t("theme.dark")}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav
          className={`flex flex-wrap gap-2 md:gap-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <button
            className={`py-2 px-4 font-medium rounded-t-lg ${
              activeTab === "profile"
                ? "bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            {t("account.profile")}
          </button>
          <button
            className={`py-2 px-4 font-medium rounded-t-lg ${
              activeTab === "orders"
                ? "bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            {t("account.orders")}
          </button>
          <button
            className={`py-2 px-4 font-medium rounded-t-lg ${
              activeTab === "addresses"
                ? "bg-white dark:bg-gray-800 border-t border-l border-r border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("addresses")}
          >
            {t("checkout.shipping_info")}
          </button>
        </nav>
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div
            className={`flex justify-between items-center mb-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {t("account.profile")}
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t("actions.edit")}
              </button>
            )}
          </div>

          {isEditing ? (
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
                    required
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
                  onClick={() => setIsEditing(false)}
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
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {t("account.orders")}
          </h2>

          {isLoadingOrders ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {t("cart.empty")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("checkout.order_summary")} ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("product.ships_in")}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("product.availability")}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("cart.quantity")}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("cart.total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {order.items} {t("cart.items")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.total} {order.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div
            className={`flex justify-between items-center mb-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {t("checkout.shipping_info")}
            </h2>
            <button
              onClick={addNewAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t("actions.add")} {t("checkout.shipping_info")}
            </button>
          </div>

          <div className="space-y-6">
            {formData.addresses.map((address, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
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
                      handleAddressChange(index, "isDefault", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`default-address-${index}`}
                    className="mr-2 block text-sm text-gray-900 dark:text-gray-300"
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
              </div>
            ))}
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
      )}

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
