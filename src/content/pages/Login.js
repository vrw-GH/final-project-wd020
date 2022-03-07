import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genHash, checkPwd } from "../../components/security.js";
import { userCreate, userLogin } from "../../components/dataHandling.js";
import Loading from "../../components/Loading";
import "./_Page.css";

const Login = ({ setCurrentUser, APPDATA }) => {
  const navigate = useNavigate();
  const [loginMsg, setLoginMsg] = useState("");
  const loginSuccess = () => navigate(-1); //    "/sharing"  ?
  const createSuccess = () => navigate("/profile");
  let username = "";

  useEffect(() => {
    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.removeItem("currentUser");
      setCurrentUser({});
      navigate("/");
      return null;
    }
    window.scrollTo(0, 0);
    return () => {};
    //eslint-disable-next-line
  }, []);

  const doLogin = async (e) => {
    try {
      username = e.target.parentElement.children["username"].value;
      if (!username) throw Error("Enter your credentials and");
      const gotUser = await userLogin(username);
      checkPwd(
        e.target.parentElement.children["password"].value,
        gotUser.password
      );
      const user = {
        userName: gotUser.username,
        token: gotUser.token,
        profilePic: gotUser.profilepic,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      setLoginMsg(`"${user.userName}" - succesfully logged in!`);
      loginSuccess();
    } catch (error) {
      setLoginMsg(error + " - Please try again.");
    }
  };

  const doCreateUser = async (e) => {
    try {
      const pwdHash = await genHash(
        e.target.parentElement.children["password"].value
      );
      const item = {
        username:
          e.target.parentElement.children["username"].value.toLowerCase(),
        password: pwdHash,
        email: e.target.parentElement.children["email"].value,
      };
      if (!item.username || !item.email || !item.password)
        throw Error("Please enter valid credentials");
      const result = await userCreate(item);
      const user = {
        userName: result.username,
        token: result.token,
        profilePic: result.profilepic,
      };
      setCurrentUser(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      setLoginMsg(result.message);
      username = "";
      createSuccess();
    } catch (error) {
      setLoginMsg(error.message);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>-•≡ User Login / Registration ≡•-</h2>
      </div>
      <div className="page-box col-8" style={{ minWidth: "300px" }}>
        {loginMsg ? (
          <>
            <Loading text={loginMsg} back={-1} />
            {/* <button
              onClick={goBack}
              className="btn btn-light"
              autoFocus
              onKeyDown={(keyCode) => (keyCode === 13 ? () => goBack : false)}
            >
              Ok
            </button> */}
          </>
        ) : (
          <>
            <input
              id="username"
              default={true}
              maxLength={16}
              type="text"
              required
              autoFocus={true}
              placeholder="username"
              className="form-control"
            />

            <input
              id="password"
              type="password"
              required
              placeholder="password"
              className="form-control"
            />
            <button
              style={{ marginTop: "20px" }}
              type="submit"
              onClick={doLogin}
              className="btn btn-light"
              id="nav-find"
              onKeyDown={(keyCode) => (keyCode === 13 ? doLogin : false)}
            >
              Login
            </button>
            <br />
            <i>
              New User? Please enter above and additionally the email below..
            </i>
            <br />
            <input
              type="text"
              id="email"
              placeholder="email"
              required={true}
              title="Your email will be shown to other logged-in members"
              className="form-control"
            />
            <i>Your email will be shown to logged-in members when sharing</i>
            <button
              style={{ marginTop: "20px" }}
              onClick={doCreateUser}
              id="nav-find"
              className="btn btn-light"
            >
              Create User
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
