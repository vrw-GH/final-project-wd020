import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
// Local components
import NavbarTop from "./components/NavbarTop.js";
import Loading from "./components/Loading.js";
import Header from "./content/pages/Header.js";
import Footer from "./content/pages/Footer.js";
import Home from "./content/pages/Home.js";
import About from "./content/pages/About.js";
import Recipes from "./content/pages/Recipes.js";
import Sharing from "./content/pages/Sharing.js";
import Login from "./content/pages/Login.js";
import Category from "./content/pages/Category.js";
import SingleTitle from "./content/pages/SingleTitle.js";
import SearchTitles from "./content/pages/SearchTitles.js";
import MyProfile from "./content/pages/MyProfile.js";
import MyRecipes from "./content/pages/MyRecipes.js";
import MyShares from "./content/pages/MyShares.js";
import CreateTitle from "./content/pages/CreateTitle.js";
//-------------------------------------------------
import packageJson from '../package.json'; //* available in Prod, otw fallbacks.
let appName = packageJson.name || "Share My Food (Test)";
let appSuffix = packageJson.suffix || "final-project-wbs#020";
let appVer = packageJson.version || "Test";
let appInfo = packageJson.info || "for Testing only";
let appHomepage = packageJson.homepage || ".";
const APPDATA = {
  TITLE: appName,
  NAME:
    appName
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "",
  PROJECT:
    appName.replace(/-/g, " ").toUpperCase() + ` (${appSuffix})` ||
    "Project Not Set",
  VER: appVer,
  INFO: appInfo,
  //---------------------------------------
  TITLEIMG: process.env.REACT_APP_IMG_TITLE || "/img-title.jpg",
  FOOTERIMG: process.env.REACT_APP_IMG_FOOTER || "/img-footer.jpg",
  //---------------------------------------
  BACKEND: process.env.REACT_APP_BACKEND || "http://127.0.0.1:5000",
  FRONTEND:
    process.env.REACT_APP_FRONTEND ||
    (process.env.HOST || "https://127.0.0.1") +
    ":" +
    (process.env.PORT || "3000"),
  DEVLEAD: process.env.REACT_APP_DEV_LEAD || "Victor Wright",
  DEVTEAM: process.env.REACT_APP_DEV_TEAM || "",
  EMAIL: process.env.REACT_APP_DEV_EMAIL || "victor.wright@outlook.de",
  PHONE: process.env.REACT_APP_DEV_PHONE || "+49 176 4677 4278",
  LOCATION: process.env.REACT_APP_DEV_ADDR || "83707, Germany",
  MODE: process.env.REACT_APP_PROJECT_MODE || process.env.NODE_ENV || "Dev",
  DESCRIPTION: process.env.REACT_APP_PROJECT_DESCRIPTION || "-in development-",
  WEBSITE: process.env.HOST || appHomepage || "App HOMEPAGE Not Set",
  HOST: process.env.HOST || "http://127.0.0.1",
  PORT: process.env.PORT || 5000,
  ROOT: process.env.REACT_APP_FRONTEND || window.location.host || '/',
};
document.title = "Welcome to " + APPDATA.NAME;
//-------------------------------------------------

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [searchQry, setSearchQry] = useState("");
  const [loading, setLoading] = useState("");
  const [spinUp, setSpinUp] = useState(0);

  useEffect(() => { }, [loading]); //  to re-render when any loading event occurs

  useEffect(() => { //loading
    setLoading("Loading ...");
    setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
    sessionStorage.setItem("APPDATA", JSON.stringify(APPDATA));
    window.scrollTo(0, 0);
    setLoading("");
    return () => {
      sessionStorage.clear();
      localStorage.clear();
    };
  }, []);

  useEffect(() => {  //backend-spinup   
    let s = 0;
    const elapsed = setInterval(() => setSpinUp(`Backend is still spinning-up... (${s++})`), 1000);
    const getBackend = async () => {
      await fetch(`${APPDATA.BACKEND}/api/users`)
        .then(response => {
          if (!response || !response.ok) {
            throw new Error('Server/Api no response.');
          } else {
            setSpinUp(false);
          };
        })
        .catch((error) => {
          console.log(error);
          setSpinUp("We ran into trouble - Backend did NOT spin-up 😓");
        });
      clearInterval(elapsed);
    };
    getBackend();
    return () => clearInterval(elapsed);
  }, []);

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (e.target.form[0].value !== "") {
      setSearchQry(e.target.form[0].value);
      e.target.form[0].value = "";
    } else {
      alert("Please enter something in search");
    }
  };

  const handleClearQry = () => setSearchQry("");

  return (
    <>
      <Header APPDATA={APPDATA} />
      {spinUp ? spinUp : null}
      <NavbarTop
        APPDATA={APPDATA}
        handleSearchClick={handleSearchClick}
        handleClearQry={handleClearQry}
        currentUser={currentUser}
      />
      {loading ? (
        <Loading text={loading} />
      ) : (
        <>
          {searchQry ? (
            <SearchTitles
              searchQry={searchQry}
              handleClearQry={handleClearQry}
              APPDATA={APPDATA}
            />
          ) : (
            <Routes>
              <Route path="/" exact element={<Home APPDATA={APPDATA} />} />
              <Route
                path="/home"
                exact
                element={<Home APPDATA={APPDATA} />}
              />
              <Route
                path="/sharing"
                exact
                element={<Sharing APPDATA={APPDATA} />}
              />
              <Route
                path="/recipes"
                exact
                element={<Recipes APPDATA={APPDATA} />}
              />
              <Route
                path="/login"
                exact
                element={
                  <Login setCurrentUser={setCurrentUser} APPDATA={APPDATA} />
                }
              />
              {currentUser ? (
                <>
                  <Route
                    exact
                    path="/myshare"
                    element={
                      <MyShares currentUser={currentUser} APPDATA={APPDATA} />
                    }
                  />
                  <Route
                    exact
                    path="/mytitles"
                    element={
                      <MyRecipes currentUser={currentUser} APPDATA={APPDATA} />
                    }
                  />
                  <Route
                    exact
                    path="/newtitle"
                    element={
                      <CreateTitle
                        currentUser={currentUser}
                        // categories={categories}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/profile"
                    element={
                      <MyProfile
                        setCurrentUser={setCurrentUser}
                        APPDATA={APPDATA}
                      />
                    }
                  />
                </>
              ) : null}
              <Route
                path="/about"
                exact
                element={<About APPDATA={APPDATA} />}
              />
              <Route
                path="/categories/:category"
                exact
                element={<Category APPDATA={APPDATA} />}
              />
              <Route
                path="/recipes/:id"
                exact
                element={<SingleTitle APPDATA={APPDATA} />}
              />
              <Route
                path="/*"
                element={
                  <div
                    style={{
                      margin: "8rem",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    🤫 Page Not Found!
                  </div>
                }
              />
            </Routes>
          )}
        </>
      )}
      <div>
        <Footer APPDATA={APPDATA} />
      </div>
    </>
  );
}

export default App;
