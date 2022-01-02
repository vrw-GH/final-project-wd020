import { useState, useEffect } from "react";
import axios from "axios";
import RecipesSlider from "./RecipesSlider";
import "./Page.css";

const Recipes = ({ loading, categories, APPDATA }) => {
  const [category, setCategory] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [listReload, setListReload] = useState(true);

  useEffect(() => {
    (async () => {
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
      setRecipes(loaddata.data.tuples.filter(filterItems));
      setListReload(false);
    })();
    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    (async () => {
      const loaddata = await axios.get(`${APPDATA.BACKEND}/api/ingredients/`);
      setIngredients(loaddata.data.tuples);
      setListReload(false);
    })();
    // eslint-disable-next-line
  }, [listReload]);

  const filterItems = (items) => {
    if (category) {
      console.log(category);
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
    console.log(e);
    e.target.checked = !e.target.checked;
    // setCategory(e.target.value);
    setListReload(true);
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
          Find A Recipe
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
                <label>
                  <input
                    key={key++}
                    type="checkbox"
                    value={ingr.ingredient_id}
                    onChange={selectIng}
                  />
                  {ingr.ingredient_name}
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
