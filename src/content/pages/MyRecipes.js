import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./_Page.css";

const MyRecipes = ({ APPDATA }) => {
  const currentUser = sessionStorage.getItem("currentUser");
  const [recipes, setRecipes] = useState([]);
  const [thisUserLikes, setThisUserLikes] = useState([]);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const axiosData = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
        setRecipes(axiosData.data.tuples);
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
          const results = await axios.get(
            `${APPDATA.BACKEND}/api/users/${currentUser}`
          );
          let res2 = results.data.tuple[0].likes
            ? results.data.tuple[0].likes
            : [];
          setThisUserLikes(res2);
        })();
      }
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  let k = 0;
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-·≡ My Recipes ≡·- </span>
        </h2>
      </div>
      <div
        className="page-box col-11"
        style={{
          width: "90%",
        }}
      >
        <div className="row">
          <div className="col-5" style={{ backgroundColor: "lightgrey" }}>
            <u>My own recipes</u>
            <ul
            // style={
            //   {
            //     // listStyleType: "upper-roman",
            //     // color: "black",
            //     // border: "2px solid blue",
            //     // backgroundColor: "lightblue",
            //     listStyleImage: recipes.title_img || recipes.image,
            //   }
            // }
            >
              {recipes
                .filter((it) => it.username === currentUser)
                .map((recipe) => (
                  <li key={k++}>
                    <Link to={`/recipes/${recipe.slug}`} className="link">
                      {recipe.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-7" style={{ backgroundColor: "lightyellow" }}>
            <u>My liked recipes</u>
            <ul
              style={{
                // listStyleType: "upper-roman",
                listStyleImage: recipes.title_img || recipes.image,
              }}
            >
              {recipes
                .filter((it) => thisUserLikes.includes(it.slug))
                .map((recipe) => (
                  <li key={k++}>
                    <Link to={`/recipes/${recipe.slug}`} className="link">
                      {recipe.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyRecipes;
