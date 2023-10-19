import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import {
  getCategories,
  getIngredients,
  postRecipe,
} from "../../components/dataHandling.js";
import PageTitle from "../../components/PageTitle.js";
import Loading from "../../components/Loading.js";
import "./CreateTitle.css";

const CreateTitle = ({ currentUser, APPDATA }) => {
  const [published, setPublished] = useState(false);
  const [err, setErr] = useState("Get ready...");
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line
  const [ingredient, setIngredient] = useState([]); // ie: [0]name (unit), [1]999
  const [newInfo, setNewInfo] = useState({
    title: "",
    // category: categories[0].category_id,
    category: "",
    title_img: "",
    image: "is from database",
    ingredients: [],
    recipe: "",
    username: currentUser.userName,
  });
  const maxAllowedSize = 1024 * 100; //kb

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          let ingredients = await getIngredients();
          let categories = await getCategories();
          setCategories(categories);
          setIngredients(ingredients);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const info = { ...newInfo };
    info["ingredients"] = formatIngredients(info["ingredients"]); // convert [] to html!
    info["recipe"] = formatMethod(info["recipe"]); // convert [] to html!
    try {
      for (const key in info) {
        if (!info[key]) throw Error(key + " is empty. All fields required.");
      }
      await postRecipe(info);
      setPublished(true);
    } catch (error) {
      alert(error);
      setErr(error.message);
    }
  };

  function handleChange(e) {
    const info = { ...newInfo };
    info[e.target.id] = e.target.value;
    setNewInfo(info);
  }

  function handleImgInput(e) {
    if (e.target.files[0].size > maxAllowedSize) {
      alert(
        `File too big (${Math.round(e.target.files[0].size / 1024)}kb) - max ${maxAllowedSize / 1024
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
    let qty = "";
    let unit = "";
    // qty = e.target.form.elements["ingredient"].value.match(/([0-9,.]+)/g);
    // ||      e.target.form.elements["quantity"].value.match(/([0-9,.]+)/g);
    // unit = e.target.form.elements["quantity"].value
    //   .replace(qty, "")
    //   .trim();
    const info = { ...newInfo };
    info["ingredients"] = [
      ...info["ingredients"],
      // [e.target.form.elements["ingredient"].value, qty + " " + unit],
      [e.target.form.elements["ingredient"].value, qty + " " + unit],
    ];
    setNewInfo(info);
    // e.target.form.elements["quantity"].value = "";
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
        <div className="page-container" >
          <PageTitle titleText="Create a New Recepie" />
          <div
            className="page-box col-11"
            style={{
              width: "90%",
            }}
          >
            {err ? (
              <Loading text={err} />
            ) : (
              <>
                <div className="create_title_container">
                  {/* <h2>-‧≡ Create a new recipe ≡‧- </h2> */}
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                      className="create_title_title"
                      type="text"
                      required
                      placeholder="please enter a title here"
                      id="title"
                      minLength={6}
                      maxLength={75}
                      value={newInfo.title}
                      onChange={(e) => handleChange(e)}
                      style={{ backgroundColor: "#eed5be", width: "50vw" }}
                      autoFocus
                    ></input>
                    <div className="inline" style={{ padding: "20px" }}>
                      Select a Category:
                      <select
                        className="create_title_category"
                        type="text"
                        required
                        placeholder="category"
                        id="category"
                        value={newInfo.category}
                        onChange={(e) => handleChange(e)}
                      >
                        <option key={k++} value=""></option>
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
                            required
                            onChange={(e) => handleImgInput(e)}
                          />
                          <img
                            src={newInfo.title_img}
                            className="create_title_img row"
                            alt={`200x140 px w/h (max ${maxAllowedSize / 1024}kb)`}
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
                            title="Select or type an ingredient, with quantity (ie: Apple (nos) 2"
                          />
                          {/* <input
                            size="5"
                            placeholder="quantity"
                            id="quantity"
                            tabIndex="2"
                            value={ingredient[1]}
                          /> */}
                          <button onClick={addIngredient}>Add</button>

                          <datalist id="datalist_item">
                            {ingredients.map((el) => (
                              <option
                                key={k++}
                                value={
                                  el.ingredient_name +
                                  " (" +
                                  el.ingredient_unit +
                                  ")"
                                }
                              />
                            ))}
                          </datalist>
                        </div>
                        <div
                          placeholder="ingredients"
                          id="ingredients"
                          required
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
                        onChange={(e) => handleChange(e)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btns">
                      Submit by {currentUser.userName}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTitle;
