import { useState, useEffect } from "react";
import axios from "axios";
import RecipesSlider from "./RecipesSlider";
import "./_Page.css";

const Recipes = ({ loading, categories, APPDATA }) => {
  const [category, setCategory] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [andOr, setAndOr] = useState(false); // false=OR

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const axiosData = await axios.get(
          `${APPDATA.BACKEND}/api/ingredients/`
        );
        const finalData = await axiosData.data.tuples.map((obj) => ({
          checked: false,
          ...obj,
        }));
        const sortedData = finalData.sort((a, b) => {
          let nameA = a.ingredient_name.toUpperCase();
          let nameB = b.ingredient_name.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        setIngredients(sortedData);
      })();
    }
    return () => {
      isLoaded = false; //    avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const axiosData = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
        const filterdData = await axiosData.data.tuples.filter(filterItems);
        setRecipes(filterdData);
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
      <div
        className="page-container"
        style={{
          backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
        }}
      >
        <div className="page-title">
          <h2>-·≡ Recipes Home ≡·-</h2>
        </div>
        <div
          className="page-box col-8"
          style={{
            width: "90%",
          }}
        >
          <strong style={{ color: "black" }}>Filter</strong>

          <ul className="itemsCont">
            <li>
              <strong>
                <label htmlFor="categories">Select by Category : &nbsp;</label>
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
            </li>
            <li className="itemsList">
              <strong>Filter only recipes containing: </strong>
              <i>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  style={{
                    color: "inherit",
                    width: "auto",
                    backgroundColor: "transparent",
                    cursor: "pointer",
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
                  style={{
                    color: "inherit",
                    width: "auto",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={resetIngredients}
                >
                  &nbsp;Clear all&nbsp;
                </button>
                {ingredients
                  .filter((i) => i.checked)
                  .map((ingr) => (
                    <span
                      key={ingr.ingredient_name}
                      style={{ color: "white", fontSize: "0.8rem" }}
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
              {ingredients.map((ingr) => (
                <label key={key++}>
                  <input
                    type="checkbox"
                    value={ingr.ingredient_id}
                    checked={ingr.checked}
                    onChange={selectIng}
                  />
                  {ingr.ingredient_name} &nbsp;&nbsp;
                </label>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <RecipesSlider sliderData={recipes} />
    </>
  );
};

export default Recipes;
