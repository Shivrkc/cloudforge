import { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { verifyEmail } from "../services/auth.service";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState("");

  // Prevent duplicate verification requests in React StrictMode
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);

        setStatus("success");
        setMessage(
          result?.message || "Email verified successfully."
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "Invalid or expired verification link."
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-100 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/70 backdrop-blur-2xl shadow-2xl p-8 text-center">

        {/* Loading */}
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />

            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Verifying your email
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <CheckCircle className="w-14 h-14 mx-auto text-green-600" />

            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Email verified!
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="mt-7 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:opacity-95 transition-all cursor-pointer"
            >
              Go to Login
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <XCircle className="w-14 h-14 mx-auto text-red-500" />

            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Verification failed
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="mt-7 w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </main>
  );
}