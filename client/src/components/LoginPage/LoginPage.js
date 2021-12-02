import React, { useState } from "react";
import "./loginPage.css";
import image from "../../icons/login_image.jpeg";
import signupImage from "../../icons/signup_image.jpeg";
import catIcon from "../../icons/cat-solid.svg";
import { signIn, signUp } from "../../actions/users";
import { useHistory } from "react-router-dom";
import { Spin } from "antd";

const LoginPage = () => {
  const history = useHistory();

  const [activeForm, setActiveForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [waitCreate, setWaitCreate] = useState(true);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSignIn = async (e) => {
    console.log("button click");
    setWaitCreate(false);
    e.preventDefault();
    await signIn(formData)
      .then((userData) => {
        if (userData) {
          console.log(userData.obj);
          localStorage.setItem("profile", JSON.stringify(userData.obj));
          localStorage.setItem("authError", "");
          history.push("/home");
          setFormData({ email: "", password: "" });
          setWaitCreate(true);
        } else {
          setError(localStorage.getItem("authError"));
          setWaitCreate(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnSignUp = async (e) => {
    setWaitCreate(false);
    console.log("button click");
    e.preventDefault();
    signUp(formData)
      .then((userData) => {
        if (userData) {
          console.log(userData);
          localStorage.setItem("profile", JSON.stringify(userData.obj));
          localStorage.setItem("authError", "");
          history.push("/home");
          setFormData({ email: "", password: "" });
          setWaitCreate(true);
        } else {
          setError(localStorage.getItem("authError"));
          setWaitCreate(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="custom-login-page">
      <section>
        <div class={`container ${activeForm ? "active" : ""}`}>
          <div class="user signinBx">
            <div class="imgBx">
              <img src={image} />
            </div>
            <div class="formBx">
              <form>
                <h1>
                  <img src={catIcon} width={24} />
                  Online Forum
                </h1>
                <h2>Sign In</h2>
                <p style={{ color: "red" }}>{error}</p>
                <input
                  type="text"
                  name="email"
                  placeholder="Username"
                  onChange={handleOnChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleOnChange}
                />
                {waitCreate ? <input
                  type="submit"
                  name=""
                  value="Login"
                  onClick={handleOnSignIn}
                /> :
                  <Spin />}
                <p class="signup">
                  Don't have an account ?
                  <a href="#" onClick={() => setActiveForm(!activeForm)}>
                    Sign Up
                  </a>
                </p>
              </form>
            </div>
          </div>
          <div class="user signupBx">
            <div class="formBx">
              <form>
                <h2>Create an Account</h2>
                <p style={{ color: "red" }}>{error}</p>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Username"
                  onChange={handleOnChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  onChange={handleOnChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  onChange={handleOnChange}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleOnChange}
                />
                {waitCreate ? <input
                  type="submit"
                  name=""
                  value="Sign Up"
                  onClick={handleOnSignUp}
                /> :
                  <Spin />}
                <p class="signup">
                  Already have an account ?
                  <a
                    href="#"
                    onClick={() => {
                      setActiveForm(!activeForm);
                    }}
                  >
                    {" "}
                    Sign In{" "}
                  </a>
                </p>
              </form>
            </div>
            <div class="imgBx">
              <img src={signupImage} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
