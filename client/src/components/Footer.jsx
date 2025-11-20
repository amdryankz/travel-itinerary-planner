import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

const Footer = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("footer.copyright").replace("{year}", currentYear)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
