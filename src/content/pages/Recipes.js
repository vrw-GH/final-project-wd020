import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider1 from "../../components/Sliders.js";
import ctgType from "../../components/ctgType.js";
import PageTitle from "../../components/PageTitle.js";
import {
  getCategories,
  getIngredients,
  getRecipes,
} from "../../components/dataHandling.js";
import Loading from "../../components/Loading.js";
import "./_General.css";
import "./Recipes.css";

const Recipes = ({ APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [andOr, setAndOr] = useState(false); // false=OR
  const [err, setErr] = useState("Loading...");
  const [category, setCategory] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState(["Lunch", "Breakfast"]);
  const navigate = useNavigate();

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          setCategories(await getCategories());
          setIngredients(await getIngredients());
          setErr("");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      })();
    }
    return () => {
      isLoaded = false; // avoids a mem leak on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          setRecipes(await getRecipes(filterItems));
          setErr("");
        } catch (error) {
          console.log("Error:001 getRecipes");
          setErr(error.message);
        }
      })();
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, [category, ingredients, andOr]);

  const filterItems = (items) => {
    if (category && items.category !== category) return false;
    // else continue search with ingredient base
    let string = items.title + " " + items.ingredients;
    string = string.toLowerCase();
    let retValue = true;
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].checked) {
        let lookfor = ingredients[i].ingredient_name.toLowerCase();
        // lookfor = lookfor.match(/^\S+/)[0]; // get first word of ing. name
        lookfor = lookfor.replace(/ .*/, "").replace(/s+$/, "");
        if (string.indexOf(lookfor) !== -1) {
          if (!andOr) return true; // exit the loop if OR, allow this recipe
          retValue = true;
        } else {
          if (andOr) return false; // exit the loop if AND, skip this recipe
          retValue = false;
        }
      }
    }
    return retValue;
  };

  const resetIngredients = () => {
    let tArr = [...ingredients];
    for (let i = 0; i < tArr.length; i++) {
      tArr[i].checked = false;
    }
    setIngredients(tArr);
  };

  const selectCtg = (e) => {
    setCategory(e.target.value);
  };

  const selectIng = (e) => {
    const index = ingredients.findIndex(
      (el) => el.ingredient_id === Number(e.target.value)
    );
    let newArr = [...ingredients];
    newArr[index].checked = e.target.checked;
    setIngredients(newArr);
  };

  const handleAndOr = () => {
    setAndOr(!andOr);
  };

  let key = 0;
  return (
    <>
      <div className="page-container">
        <PageTitle titleText="Recepies Home" />
        {currentUser ? (
          <div>
            <button className="btn U-btn" onClick={() => navigate("/mytitles")}>
              Go to My Recipes
            </button>
          </div>
        ) : null}
        <div
          className="page-box col-8"
          style={{
            width: "90%",
          }}
        >
          {err ? (
            <Loading text={err} />
          ) : (
            <>
              <ul className="itemsCont">
                <li>
                  <strong>
                    <label htmlFor="categories">
                      Select by Category : &nbsp;
                    </label>
                  </strong>
                  <select
                    value={category}
                    onChange={selectCtg}
                    name="ctgList"
                    id="categories"
                  >
                    <option value="">All</option>
                    {categories.map((ctg) => (
                      <option key={key++} value={ctg.category_id}>
                        {ctg.name}
                      </option>
                    ))}
                  </select>
                  &nbsp;&nbsp; Today we have {recipes.length}{" "}
                  {ctgType(category)}
                  &nbsp;recipes for you 😊
                </li>

                <li className="itemsList">
                  <strong>Filter only recipes containing: </strong>
                  <i>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      className="btn"
                      style={{
                        color: "black",
                        width: "auto",
                        backgroundColor: "white",
                        cursor: "pointer",
                        borderRadius: "40px",
                      }}
                      value={andOr}
                      onClick={handleAndOr}
                    >
                      &nbsp;And{" "}
                      <span style={{ color: "red" }}>{andOr ? "◄" : "►"}</span>{" "}
                      Or&nbsp;
                    </button>
                    &nbsp;&nbsp;
                    <button
                      className="btn"
                      style={{
                        color: "black",
                        width: "auto",
                        backgroundColor: "white",
                        cursor: "pointer",
                        borderRadius: "40px",
                      }}
                      onClick={resetIngredients}
                    >
                      &nbsp;Clear all&nbsp;
                    </button>
                    &nbsp;
                    {ingredients
                      .filter((i) => i.checked)
                      .map((ingr) => (
                        <span
                          key={ingr.ingredient_name}
                          style={{
                            color: "red",
                            backgroundColor: "lightgrey",
                            colorAdjust: "economy",
                            fontSize: "0.8rem",
                          }}
                        >
                          &nbsp;
                          {ingr.ingredient_name
                            .replace(/ .*/, "")
                            .replace(/s+$/, "")}
                          {andOr ? " +" : ","}
                        </span>
                      ))}
                  </i>
                  <br />
                  <div style={{ height: "100px", overflowY: "scroll" }}>
                    {ingredients.map((ingr) => (
                      <label key={key++}>
                        <input
                          type="checkbox"
                          value={ingr.ingredient_id}
                          checked={ingr.checked}
                          onChange={selectIng}
                        />
                        &nbsp;
                        {ingr.ingredient_name} &nbsp;&nbsp;
                      </label>
                    ))}
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
      <Slider1 sliderData={recipes} />
    </>
  );
};

export default Recipes;
