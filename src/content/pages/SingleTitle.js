import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SingleTitle.css";

const SingleTitle = ({ BACKEND }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState([]);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [likeBtn, setLikeBtn] = useState(false);
  const currentUser = sessionStorage.getItem("currentUser");

  useEffect(() => {
    (async () => {
      const results = await axios.get(`${BACKEND}/api/recipes/${id}`);
      setRecipe(results.data.tuple[0]);
    })();
    // eslint-disable-next-line
  }, []);

  if (error) return <div>{error}</div>;

  const handleClick = (e) => {
    if (!currentUser) return alert("You must be logged in");
    if (currentUser !== recipe.username) return setLikeBtn(!likeBtn);
    if (currentUser === recipe.username) return alert("Edit");
  };

  return (
    <>
      <div className="single_title_container">
        <div className="single_title_title">
          <h2>{recipe.title}</h2>
        </div>
        <div className="row">
          <img
            src={recipe.image}
            alt="recipe"
            className="single_title_img col"
          />
          <div className="col">
            <div className="single_title_info col">
              <button
                style={{
                  background: "rgba(14, 150, 0, 0.4)",
                  border: "1px single",
                  borderRadius: "6px",
                  padding: "4px",
                }}
                onClick={(e) => handleClick(e)}
              >
                {recipe.username === currentUser
                  ? "✍Edit"
                  : likeBtn
                  ? "✅"
                  : "👍Like"}
              </button>
              {"   "}
              Submitted by: {recipe.username} ...{" "}
              {new Date(recipe.create_time).toLocaleString()}
            </div>
            <div className="single_title_details col">
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
