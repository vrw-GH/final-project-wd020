import { useState, useEffect } from "react";
import axios from "axios";
import RecipesSlider from "./RecipesSlider";
import "./Page.css";

const Recipes = ({ loading, categories, APPDATA }) => {
  const [category, setCategory] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    (async () => {
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/ingredients/`);
      const data = loaddata.data.tuples.map((obj) => ({
        checked: false,
        ...obj,
      }));
      setIngredients(data);
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
      setRecipes(loaddata.data.tuples.filter(filterItems));
    })();
    // eslint-disable-next-line
  }, [category, ingredients]);

  const filterItems = (items) => {
    if (category && items.category !== category) return false;
    // else continue search with ingredient base
    let string = items.title.toLowerCase();
    let retValue = true;
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].checked) {
        let lookfor = ingredients[i].ingredient_name.toLowerCase();
        lookfor = lookfor.match(/^\S+/)[0];
        console.log(lookfor);
        if (string.indexOf(lookfor) !== -1) {
          return true; // exit loop
        } else {
          retValue = false;
        }
      }
    }
    return retValue;
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

  let key = 0;

  return (
    <>
      <div
        className="page-container"
        style={{
          backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
          backgroundSize: "cover",
          height: "350px",
        }}
      >
        <div className="page-title">
          <h2>Recipes Home</h2>
        </div>
        <div
          className="page-box col-8"
          style={{
            width: "90%",
          }}
        >
          <strong style={{ color: "white" }}>Filter</strong>

          <ul>
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
            <li>
              <strong>Filter by: </strong>
              {/* <i>(Select at least 3)</i>  */}
              <br />
              {ingredients.map((ingr) => (
                <label key={key++}>
                  <input
                    type="checkbox"
                    value={ingr.ingredient_id}
                    // value={ingr.ingredient_name}
                    // checked={ingr.checked}
                    onChange={selectIng}
                  />
                  {ingr.ingredient_name}
                  &nbsp;&nbsp;
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
