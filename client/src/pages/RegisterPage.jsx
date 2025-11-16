import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import { Mail, Lock, User, Plane } from "lucide-react";
import url from "../constants/url";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../constants/translations";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const registerPromise = axios
      .post(`${url}/auth/register`, formData)
      .then(() => {
        navigate("/login");
      });

    toast
      .promise(
        registerPromise,
        {
          loading: t("register.creatingAccount"),
          success: t("register.registerSuccess"),
          error: (err) =>
            err.response?.data?.message || t("register.registerError"),
        },
        {
          success: {
            duration: 2000,
          },
        }
      )
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const googleLoginPromise = axios
      .post(
        `${url}/auth/google`,
        {},
        {
          headers: {
            token: credentialResponse.credential,
          },
        }
      )
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
        return data;
      });

    toast.promise(
      googleLoginPromise,
      {
        loading: t("register.withGoogle"),
        success: t("register.googleSuccess"),
        error: (err) =>
          err.response?.data?.message || t("register.googleError"),
      },
      {
        success: {
          duration: 2000,
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Plane className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t("register.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{t("register.subtitle")}</p>
        </div>

        {/* Register Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("register.fullName")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="fullname"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t("register.minChars")}
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t("register.processing")
                  : t("register.registerButton")}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t("register.or")}
                </span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                toast.error(t("register.googleError"));
              }}
            />
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("register.haveAccount")}{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t("register.loginHere")}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            ← {t("register.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
