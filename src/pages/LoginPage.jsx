import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function LoginPage() {
  const { setLoggedIn, setEmail } = useOutletContext();
  const navigate = useNavigate();
  const [email, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.loggedIn) {
        setError(data.message || "Login failed.");
        return;
      }

      setLoggedIn(true);
      setEmail(email);
      navigate("/profile");
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card narrow">
      <h1>Log in</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="muted">{error}</p>}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="muted">
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
    </div>
  );
}
