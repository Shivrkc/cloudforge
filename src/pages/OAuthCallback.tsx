import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      navigate("/login?error=google_auth_failed", {
        replace: true,
      });
      return;
    }

    localStorage.setItem("token", token);

    navigate("/dashboard", {
      replace: true,
    });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;