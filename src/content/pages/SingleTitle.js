import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SingleTitle.css";

const SingleTitle = ({ BACKEND }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState([]);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const currentUser = sessionStorage.getItem("currentUser");

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const results = await axios.get(`${BACKEND}/api/recipes/${id}`);
        setRecipe(results.data.tuple[0]);
      })();
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  if (error) return <div>{error}</div>;

  const handleClick = (e) => {
    if (!currentUser) return alert("You must be logged in");
    if (currentUser !== recipe.username) return setIsLiked(!isLiked);
    if (currentUser === recipe.username) return alert("Edit");
  };

  return (
    <>
      <div className="single_title_container">
        <div className="single_title_title">
          <h2>{recipe.title}</h2>
        </div>
        <div className="col">
          <div className="single_title_info col">
            Submitted by: {recipe.username} (
            {new Date(recipe.create_time).toLocaleString()}) &nbsp;
            <button
              style={{
                background: "rgba(100, 200, 200, 1)",
                border: "1px single",
                borderRadius: "6px",
                padding: "4px",
              }}
              onClick={(e) => handleClick(e)}
            >
              {recipe.username === currentUser
                ? "✍ Edit my Recipe "
                : isLiked
                ? "✅ favourite Recipe!"
                : "👍Add to favourites"}
            </button>
          </div>
        </div>
        <div className="row">
          <object
            data={recipe.title_img || recipe.image}
            type="image/jpg,jpeg,png"
            className="col"
          >
            <img
              src={recipe.title_img || recipe.image}
              alt={recipe.slug}
              className="create_title_img"
            />
          </object>
          <div className="col">
            <div className="single_title_ingredients col">
              <h5>
                <u>INGREDIENTS</u>
              </h5>
              <div
                dangerouslySetInnerHTML={{ __html: recipe.ingredients }}
              ></div>
            </div>
          </div>
        </div>
        <div className="single_title_method">
          <h5>
            <u>METHOD</u>
          </h5>
          <div>
            <p dangerouslySetInnerHTML={{ __html: recipe.recipe }}></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTitle;
