import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token"); // comes from email link

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!token) return setMsg("Missing token. Please use the link from your email.");
    if (newPassword.length < 8) return setMsg("Password must be at least 8 characters.");
    if (newPassword !== confirm) return setMsg("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      console.log("API:", import.meta.env.VITE_API_URL);


      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Reset failed.");
      } else {
        setMsg("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>

        {!token && (
          <div className="text-sm bg-red-100 p-2 rounded-lg mb-4">
            Missing token. Open the reset link from your email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border rounded-lg p-2"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!token}
            required
          />
          <input
            type="password"
            className="w-full border rounded-lg p-2"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={!token}
            required
          />

          {msg && <div className="text-sm bg-gray-100 p-2 rounded-lg">{msg}</div>}

          <button
            disabled={loading || !token}
            className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
