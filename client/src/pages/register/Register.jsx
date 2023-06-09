import { Link } from "react-router-dom";
import "./register.css";
import { useRef } from "react";
import axios from "axios";

export default function Register() {
  const email = useRef();
  const password = useRef();
  const username = useRef();
  const passwordAgain = useRef();
  // const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Password don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        window.location.replace("/login")
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Facebook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Facebook.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              required
              type="text"
              className="loginInput"
              ref={username}
            />
            <input
              placeholder="Email"
              required
              type="email"
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              required
              type="password"
              className="loginInput"
              ref={password}
              minLength="6"
            />
            <input
              placeholder="Password Again"
              type="password"
              required
              className="loginInput"
              ref={passwordAgain}
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="/login" style={{ textAlign: "center" }}>
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
