import { useNavigate, useOutletContext } from "react-router-dom";

export default function ProfilePage() {
  const { loggedIn, email } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="card">
      {!loggedIn && navigate("/login")}
      {loggedIn && <p>{email}</p>}
    </div>
  );
}
