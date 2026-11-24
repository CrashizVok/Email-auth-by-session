import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar
        email={email}
        loggedIn={loggedIn}
        onLogin={() => {
          navigate("/login");
        }}
        onLogout={() => {
          setLoggedIn(false);
          navigate("/login");
        }}
      />
      <main className="content">
        <Outlet context={{ loggedIn, setLoggedIn, email, setEmail }} />
      </main>
    </div>
  );
}
