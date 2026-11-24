import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Request failed.");
        return;
      }

      setMessage(data.message || "If an account exists for this email, a reset link has been sent.");
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card narrow">
      <h1>Forgot password</h1>
      <p className="muted">
        Enter your email and we will send you a reset link.
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {error && <p className="muted">{error}</p>}
        {message && <p className="muted">{message}</p>}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="muted">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}
