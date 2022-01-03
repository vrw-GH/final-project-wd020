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
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
      setRecipes(loaddata.data.tuples.filter(filterItems));
    })();
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    (async () => {
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/ingredients/`);
      const data = loaddata.data.tuples;
      const arr = data.map((obj) => ({ checked: false, ...obj }));
      setIngredients(arr);
    })();
    // eslint-disable-next-line
  }, []);

  const filterItems = (items) => {
    if (category) {
      if (items.category === category) {
        return true;
      } else return false;
    } else {
      return true; // select all recipes
    }
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
          Filter Recipes
          <ul>
            <li>
              <label htmlFor="categories">Select by Category : &nbsp;</label>
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
