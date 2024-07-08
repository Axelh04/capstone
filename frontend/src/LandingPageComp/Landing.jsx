import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <div>
        <h1>Think Different.</h1>

        <Link to="/login">
          <p>Login</p>
        </Link>

        <Link to="/signup">
          <p>Sign Up</p>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
