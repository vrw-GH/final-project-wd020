import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import "./CreateTitle.css";

const CreateTitle = ({ currentUser, categories, BACKEND }) => {
  const [published, setPublished] = useState(false);
  // const [titleImg, setTitleImg] = useState("");
  // eslint-disable-next-line
  const [ingredient, setIngredient] = useState([]);
  const [newInfo, setNewInfo] = useState({
    title: "",
    category: "",
    image: "",
    ingredients: [],
    recipe: "",
    username: currentUser,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const key in newInfo) {
        if (!newInfo[key]) throw Error(key + " is empty. All fields required.");
      }
      await axios.post(`${BACKEND}/api/recipes`, newInfo);
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
    const info = { ...newInfo };
    info[e.target.id] = URL.createObjectURL(e.target.files[0]);
    setNewInfo(info);
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
    e.target.form.elements["ingredient"].value = "";
    e.target.form.elements["quantity"].value = "";
  };

  const formatIngredients = (data) => {
    data = JSON.stringify(data).replace(/","/g, " ");
    data = data.replace('[["', "");
    data = data.replace('"]]', "");
    data = data.split('"],["').join("\n");
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
                <input
                  // type="text"
                  type="file"
                  placeholder="image"
                  encType="multipart/form-data"
                  accept="image/png, .jpeg, .jpg, image/gif"
                  id="image"
                  name="image"
                  onChange={(e) => handleImgInput(e)}
                ></input>
                <object
                  data={newInfo.image}
                  type="image/jpg"
                  className="create_title_img col"
                >
                  {/* <img src="default.jpg" alt="recipe" /> */}
                </object>
              </div>
              {/* //!                              Need Database for Ingredients */}
              <div className="create_title_details col">
                <h5>
                  <u>INGREDIENTS</u>
                </h5>
                <input
                  list="datalist1"
                  placeholder="ingredient"
                  id="ingredient"
                  value={ingredient[0]}
                />
                <input
                  list="datalist2"
                  size="5"
                  placeholder="quantity"
                  id="quantity"
                  value={ingredient[1]}
                />
                <button onClick={addIngredient}>Add</button>
                {/* //! populate from database ? */}
                <datalist id="datalist1">
                  <option value="Rice" />
                  <option value="Potato" />
                  <option value="Sugar" />
                  <option value="Milk" />
                  <option value="Salt" />
                </datalist>
                <datalist id="datalist2">
                  <option value="kg " />
                  <option value="g" />
                  <option value="ltr" />
                  <option value="ml" />
                  <option value="teaspoon" />
                  <option value="tablespoon" />
                  <option value="to-taste" />
                </datalist>
                <textarea
                  cols="40"
                  rows="8"
                  type="text"
                  placeholder="ingredients"
                  id="ingredients"
                  value={formatIngredients(newInfo.ingredients)}
                  // onChange={(e) => handle(e)}
                  onChange={handle}
                  readOnly
                ></textarea>
              </div>
            </div>
            {/* //!                              set HTML IDE */}
            <div className="create_title_method">
              <h5>
                <u>METHOD</u>
              </h5>
              <textarea
                cols="40"
                rows="8"
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
