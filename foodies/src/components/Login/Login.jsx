import { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { setToken, loadCartData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { token, role } = await login(data); // direct destructure

      if (token) {
        // Save token & role
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        await loadCartData(token);

        // Redirect based on role
        if (role === "ROLE_ADMIN") {
          window.location.href = "http://localhost:5173/";
        } else {
          navigate("/");
        }
      } else {
        toast.error("Unable to login. Please try again.");
      }
    } catch (error) {
      console.log("Unable to login", error);
      toast.error("Unable to login. Please try again");
    }
  };

  // Google Login Success Handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential response:", credentialResponse);
      const googleToken = credentialResponse.credential;

      if (!googleToken) {
        toast.error("No Google token received.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        toast.error("Google login failed: server sent no/invalid JSON");
        return;
      }

      if (res.ok && data.token) {
        const { token, role } = data;

        // Save token & role
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        await loadCartData(token);

        // Redirect based on role
        if (role === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

        toast.success("Logged in with Google successfully!");
      } else {
        toast.error(data?.error || "Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Sign In
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase"
                    type="submit"
                  >
                    Sign in
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4">
                  Do not have an account&#39;?{" "}
                  <Link to="/register">Sign up</Link>
                </div>
              </form>

              {/* Google Login Button */}
              <div className="mt-4 text-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
