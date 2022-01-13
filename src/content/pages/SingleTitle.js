import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../loading.css";
import "./SingleTitle.css";

const SingleTitle = ({ APPDATA }) => {
  const { id } = useParams();
  const currentUser = sessionStorage.getItem("currentUser");
  const [recipe, setRecipe] = useState([]);
  const [err, setErr] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [thisUserLikes, setThisUserLikes] = useState([]);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      const getRecipe = async () => {
        try {
          const results = await axios.get(
            `${APPDATA.BACKEND}/api/recipes/${id}`
          );
          if (!results.data.tuple[0]) throw new Error("No Recipe Data.");
          setRecipe(results.data.tuple[0]);
        } catch (error) {
          setErr(error.message);
        }
      };
      getRecipe();
    }
    return () => {
      isLoaded = false; //  avoids a mem leak (of the promise) on unloaded component??
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (currentUser) {
      if (isLoaded) {
        const getUser = async () => {
          try {
            const results = await axios.get(
              `${APPDATA.BACKEND}/api/users/${currentUser}`
            );
            if (!results.data.tuple[0]) throw new Error("No User Data.");
            let res2 = results.data.tuple[0].likes
              ? results.data.tuple[0].likes
              : [];
            setThisUserLikes(res2);
            if (res2.length !== 0) setIsLiked(res2.includes(recipe.slug));
          } catch (error) {
            setErr(error.message);
          }
        };
        getUser();
      }
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, [recipe]);

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  const handleLikeEdit = (e) => {
    if (!currentUser) return alert("You must be logged in");

    if (currentUser !== recipe.username) {
      if (!isLiked) {
        thisUserLikes.push(recipe.slug);
      } else {
        for (let i = 0; i < thisUserLikes.length; i++) {
          if (thisUserLikes[i] === recipe.slug) {
            thisUserLikes.splice(i, 1);
          }
        }
      }
      const postUser = async () => {
        try {
          await axios.post(`${APPDATA.BACKEND}/api/users/${currentUser}`, {
            likes: thisUserLikes,
          });
        } catch (error) {
          setErr("Post User Data " + error);
        }
      };
      postUser();
      return setIsLiked(!isLiked);
    }
    if (currentUser === recipe.username) return alert("Edit");
  };

  return (
    <>
      <div
        className="page-container"
        style={{
          backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
        }}
      >
        {/* <div className="single_title_container"> */}
        <div className="single_title_title">
          <h2>-·≡ {recipe.title} ≡·-</h2>
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
              onClick={(e) => handleLikeEdit(e)}
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
