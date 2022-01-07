import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import "./CreateTitle.css";

const CreateTitle = ({ currentUser, categories, BACKEND }) => {
  const [published, setPublished] = useState(false);
  // eslint-disable-next-line
  const [ingredients, setIngredients] = useState([]);
  // eslint-disable-next-line
  const [ingredient, setIngredient] = useState([]);
  const [newInfo, setNewInfo] = useState({
    title: "",
    category: categories[0].category_id,
    title_img: "",
    image: "is from database",
    ingredients: [],
    recipe: "",
    username: currentUser,
  });
  const maxAllowedSize = 1024 * 100; //kb

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const axiosData = await axios.get(`${BACKEND}/api/ingredients/`);
        const finalData = await axiosData.data.tuples.map((obj) => ({
          checked: false,
          ...obj,
        }));

        const sortedData = finalData.sort((a, b) => {
          let nameA = a.ingredient_name.toUpperCase(); // ignore upper and lowercase
          let nameB = b.ingredient_name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1; //nameA comes first
          }
          if (nameA > nameB) {
            return 1; // nameB comes first
          }
          return 0; // names must be equal
        });
        setIngredients(sortedData);
      })();
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const info = { ...newInfo };
    info["ingredients"] = formatIngredients(info["ingredients"]); // convert [] to html!
    info["recipe"] = formatMethod(info["recipe"]); // convert [] to html!
    try {
      for (const key in info) {
        if (!info[key]) throw Error(key + " is empty. All fields required.");
      }
      await axios.post(`${BACKEND}/api/recipes`, info);
      setPublished(true);
    } catch (error) {
      window.alert(error);
    }
  };

  function handle(e) {
    const info = { ...newInfo };
    info[e.target.id] = e.target.value;
    setNewInfo(info);
  }

  function handleImgInput(e) {
    if (e.target.files[0].size > maxAllowedSize) {
      alert(
        `File too big (${Math.round(e.target.files[0].size / 1024)}kb) - max ${
          maxAllowedSize / 1024
        }kb`
      );
      e.target.value = "";
      return;
    }
    const info = { ...newInfo };
    var reader = new FileReader();
    reader.onloadend = (event) => {
      info[e.target.id] = event.target.result; // raw image data ?
      setNewInfo(info);
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  const addIngredient = (e) => {
    e.preventDefault();
    if (!e.target.form.elements["ingredient"].value) return;
    let qty = e.target.form.elements["quantity"].value.match(/([0-9,.]+)/g);
    qty = qty ? qty : "";
    const unit = e.target.form.elements["quantity"].value
      .replace(qty, "")
      .trim();
    const info = { ...newInfo };
    info["ingredients"] = [
      ...info["ingredients"],
      [e.target.form.elements["ingredient"].value, qty + " " + unit],
    ];
    setNewInfo(info);
    e.target.form.elements["quantity"].value = "";
    e.target.form.elements["ingredient"].value = "";
    e.target.form.elements["ingredient"].focus();
  };

  const formatIngredients = (data) => {
    data = JSON.stringify(data).replace(/","/g, " ");
    data = data.replace('[["', "<ul><li>");
    data = data.replace('"]]', "</li></ul>");
    data = data.split('"],["').join("</li><li>");
    return data;
  };

  const formatMethod = (data) => {
    // use only at end - to upload
    data = data.split("\n").join("</p><p>");
    data = "<p>" + data + "</p>";
    data = data.replace("<p></p>", "");
    return data;
  };

  let k = 0;
  return (
    <>
      {published ? (
        <Navigate to={`/recipes/${newInfo.title}`} replace={true} />
      ) : (
        <div className="create_title_container">
          <h2>Create a new recipe</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              className="create_title_title"
              type="text"
              placeholder="title"
              id="title"
              size="50"
              value={newInfo.title}
              onChange={(e) => handle(e)}
            ></input>
            <div className="inline">
              Select a Category:
              <select
                className="create_title_category"
                type="text"
                placeholder="category"
                id="category"
                value={newInfo.category}
                onChange={(e) => handle(e)}
              >
                {categories.map((ctg) => (
                  <option key={k++} value={ctg.category_id}>
                    {ctg.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="row">
              <div className="col">
                <object
                  data={newInfo.title_img}
                  type="image/jpg,png"
                  className="create_title_img row"
                >
                  <input
                    type="file"
                    encType="multipart/form-data"
                    accept="image/png, .jpeg, .jpg, image/gif"
                    id="title_img"
                    name="title_img"
                    onChange={(e) => handleImgInput(e)}
                  />
                  {/* <img src="default.img" alt="recipe" /> */}
                  {/* <img src={newInfo.image} alt="recipe" /> */}
                  <img
                    src={newInfo.title_img}
                    className="create_title_img row"
                    alt={`upload (max size ${maxAllowedSize / 1024}kb)`}
                  />
                </object>
              </div>
              <div className="create_title_ingredients col">
                <h5>
                  <u>INGREDIENTS</u>
                </h5>
                <div className="form-group">
                  <input
                    list="datalist_item"
                    placeholder="select ingredient"
                    id="ingredient"
                    tabIndex="1"
                    value={ingredient[0]}
                  />
                  <input
                    size="5"
                    placeholder="quantity"
                    id="quantity"
                    tabIndex="2"
                    value={ingredient[1]}
                  />
                  <button onClick={addIngredient}>Add</button>

                  <datalist id="datalist_item">
                    {ingredients.map((el) => (
                      <option
                        key={k++}
                        value={
                          el.ingredient_name + " (" + el.ingredient_unit + ")"
                        }
                      />
                    ))}
                  </datalist>
                </div>
                <div
                  placeholder="ingredients"
                  id="ingredients"
                  // readOnly
                  dangerouslySetInnerHTML={{
                    __html: formatIngredients(newInfo.ingredients),
                  }}
                ></div>
              </div>
            </div>
            {/* //!                              set HTML IDE */}
            <div className="create_title_method">
              <h5>
                <u>METHOD</u>
              </h5>
              <textarea
                cols="40"
                rows="6"
                type="text"
                placeholder="enter the recipe here"
                id="recipe"
                value={newInfo.recipe}
                onChange={(e) => handle(e)}
              ></textarea>
            </div>
            <button type="submit" className="btns">
              Submit by {currentUser}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateTitle;
