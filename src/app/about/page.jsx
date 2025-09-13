"use client";
import { useTranslation } from "@/lib/use-translation";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
          {t("about.title")}
        </h1>

        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t("about.content")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {t("about.mission")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("about.content")}{" "}
              {/* You might want separate mission content */}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {t("about.vision")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("about.content")}{" "}
              {/* You might want separate vision content */}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {t("about.values")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("about.content")}{" "}
              {/* You might want separate values content */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
