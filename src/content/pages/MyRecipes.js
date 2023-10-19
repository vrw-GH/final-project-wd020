import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { getRecipes, getUser } from "../../components/dataHandling.js";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import "react-tabs/style/react-tabs.css";

const MyRecipes = ({ APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [recipes, setRecipes] = useState([]);
  const [thisUserLikes, setThisUserLikes] = useState([]);
  const [err, setErr] = useState("Loading my recipes...");
  const navigate = useNavigate();

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          const results = await getRecipes();
          setRecipes(results.data.tuples);
          setErr("");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      })();
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (currentUser) {
      if (isLoaded) {
        (async () => {
          try {
            const results = await getUser(currentUser.userName);
            const res2 = results.likes ? results.likes : [];
            setThisUserLikes(res2);
            setErr("");
          } catch (error) {
            setErr(error.message);
          }
        })();
      }
    }
    return () => {
      isLoaded = false; //  avoids a mem leak on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  let k = 0;
  let k2 = 0;

  return (
    <div className="page-container">
      <PageTitle titleText="My Recepies" />
      {currentUser ? (
        <div>
          <button className="btn U-btn" onClick={() => navigate("/newtitle")}>
            Create a New Recipe
          </button>
        </div>
      ) : null}
      <div
        className="page-box col-10"
        style={{
          width: "90%",
        }}
      >
        {err ? (
          <Loading text={err} />
        ) : (
          <>
            <div className="col-11">
              <Tabs>
                <TabList>
                  <Tab style={{ backgroundColor: "lightgreen" }}>
                    📎 My Favourites
                  </Tab>
                  <Tab style={{ backgroundColor: "orange" }}>
                    📑 My Submissions
                  </Tab>
                </TabList>
                <TabPanel
                  style={{
                    backgroundColor: "#cdfdc9",
                    height: "50vh",
                    overflowY: "auto",
                  }}
                >
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: "0",
                    }}
                  >
                    {recipes
                      .filter((it) => thisUserLikes.includes(it.slug))
                      .map((recipe) => (
                        <li key={k2++}>
                          <Link to={`/recipes/${recipe.slug}`} className="link">
                            <pre>
                              <img
                                src={recipe.title_img || recipe.image}
                                style={{ height: "60px" }}
                                alt={k2 + 1}
                                title={k2 + 1}
                              />
                              {"  "}
                              <span
                                style={{ fontSize: "1.5rem", color: "black" }}
                              >
                                {recipe.title}
                              </span>
                            </pre>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </TabPanel>
                <TabPanel
                  style={{
                    backgroundColor: "#fcf1d3",
                    height: "50vh",
                    overflowY: "auto",
                  }}
                >
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: "0",
                    }}
                  >
                    {recipes
                      .filter((it) => it.username === currentUser.userName)
                      .map((recipe) => (
                        <li key={k++}>
                          <Link to={`/recipes/${recipe.slug}`} className="link">
                            <pre>
                              <img
                                src={recipe.title_img || recipe.image}
                                style={{ height: "60px" }}
                                alt={k + 1}
                                title={k + 1}
                              />
                              {"  "}
                              <span
                                style={{ fontSize: "1.5rem", color: "black" }}
                              >
                                {recipe.title}
                              </span>
                            </pre>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </TabPanel>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default MyRecipes;
