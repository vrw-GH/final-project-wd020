import React, { useState } from "react";
import { useMount } from "react-use";
import { genHash, checkPwd } from "../../components/security.js";
import { userCreate, userLogin } from "../../components/dataHandling.js";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import "./_General.css";

const Login = ({ setCurrentUser, APPDATA }) => {
  const [loginMsg, setLoginMsg] = useState("");
  const [goBack, setGoBack] = useState(-1);
  let username = "";

  useMount(() => {
    // logs out if logged in
    if (sessionStorage.getItem("currentUser")) {
      sessionStorage.removeItem("currentUser");
      setCurrentUser({});
      return;
    }
    window.scrollTo(0, 0);
  });

  const doLogin = async (e) => {
    e.preventDefault();
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
      console.log(user);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      setGoBack("/profile");
      setLoginMsg(`"${user.userName}" - succesfully logged in!`);
    } catch (error) {
      setGoBack("/");
      setLoginMsg(error + " - Please try again.");
    }
  };

  const doCreateUser = async (e) => {
    e.preventDefault();
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
      username = "";
      setGoBack("/profile");
      setLoginMsg(result.message);
    } catch (error) {
      setGoBack(-1);
      setLoginMsg(error.message);
    }
  };

  return (
    <div className="page-container">
      <PageTitle titleText="User Portal" />
      <div className="page-box col-8" style={{ minWidth: "300px" }}>
        {loginMsg ? (
          <>
            <Loading text={loginMsg} where={goBack} timeout={3} />
          </>
        ) : (
          <form>
            <input
              id="username"
              default={true}
              maxLength={16}
              type="text"
              required
              autoFocus={true}
              placeholder="username"
              autoComplete="username"
              className="form-control"
            />

            <input
              id="password"
              type="password"
              required
              placeholder="password"
              autoComplete="current-password"
              className="form-control"
              onKeyDown={(keyCode) => (keyCode === 13 ? doLogin : false)}
            />
            <button
              style={{ marginTop: "20px" }}
              // type="submit"
              onClick={doLogin}
              className="btn btn-light"
            // id="nav-find"
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
              autoComplete="email"
              onKeyDown={(keyCode) => (keyCode === 13 ? doCreateUser : false)}
            />
            <i>Your email will be shown to logged-in members when sharing</i>
            <button
              style={{ marginTop: "20px" }}
              onClick={doCreateUser}
              // id="nav-find"
              className="btn btn-light"
            >
              Create User
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
