"use client";
import { useState } from "react";
import { useTranslation } from "@/lib/use-translation";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center dark:text-white">
          {t("contact.title")}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
          {t("contact.subtitle")}
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              {t("contact.form.name")}
            </h2>

            {submitted ? (
              <div className="p-4 mb-6 bg-green-100 text-green-700 rounded">
                {t("contact.form.success")}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("contact.form.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              {t("contact.info.address")}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  {t("contact.info.address")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  123 Tech Street, Cairo, Egypt
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  {t("contact.info.phone")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  +20 123 456 7890
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  {t("contact.info.email")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  info@shopease.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  {t("contact.info.hours")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sunday-Thursday: 9AM-5PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
