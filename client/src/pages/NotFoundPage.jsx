import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function NotFoundPage() {
  return (
    <div>
      <NavBar />
      <div className="page page-dashboard">
        <div className="auth-card">
          <h1>Page Not Found</h1>
          <p>We couldn't find the page you're looking for.</p>
          <Link to="/dashboard" className="button button-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
