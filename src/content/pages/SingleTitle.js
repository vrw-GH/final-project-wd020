import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading.js";
import PageTitle from "../../components/PageTitle.js";
import {
  get1Recipe,
  getUserLikes,
  postUserLike,
} from "../../components/dataHandling.js";
import "./_General.css";
import "./SingleTitle.css";

const SingleTitle = ({ APPDATA }) => {
  const { id } = useParams();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [recipe, setRecipe] = useState([]);
  const [err, setErr] = useState("Loading recipe...");
  const [isLiked, setIsLiked] = useState(false);
  const [thisUserLikes, setThisUserLikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        try {
          setRecipe(await get1Recipe(id));
          setErr("");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      })();
    }
    return () => {
      isLoaded = false; //  avoids a mem leak on unloaded component??
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (currentUser) {
      if (isLoaded) {
        (async () => {
          try {
            const likes = await getUserLikes(currentUser.userName);
            setThisUserLikes(likes);
            if (likes.length !== 0) setIsLiked(likes.includes(recipe.slug));
            setErr("");
          } catch (error) {
            setErr(error.message);
          }
        })();
      }
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, [recipe]);

  const handleLikeEdit = (e) => {
    if (!currentUser) {
      if (window.confirm("Log In now?")) navigate("/login");
      return;
    }

    if (currentUser.userName !== recipe.username) {
      if (!isLiked) {
        thisUserLikes.push(recipe.slug);
      } else {
        for (let i = 0; i < thisUserLikes.length; i++) {
          if (thisUserLikes[i] === recipe.slug) {
            thisUserLikes.splice(i, 1);
          }
        }
      }
      (async () => {
        try {
          await postUserLike(currentUser.userName, thisUserLikes);
        } catch (error) {
          setErr(error.message);
        }
      })();
      return setIsLiked(!isLiked);
    }
    if (currentUser.userName === recipe.username) return alert("Edit");
  };

  return (
    <>
      <div className="page-container">
        <PageTitle titleText={recipe.title} />
        <div className="page-box col-11">
          {err ? (
            <Loading text={err} />
          ) : (
            <>
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
                  {currentUser?.userName === recipe.username
                    ? "✍ Edit my Recipe "
                    : isLiked
                      ? "📎favourite Recipe!"
                      : "👍Add to favourites"}
                </button>
              </div>

              <div className="row" >
                <div className="row">
                  <div className="col">
                    <object
                      data={recipe.title_img || recipe.image}
                      type="image/jpg,jpeg,png"
                    >
                      <img
                        src={recipe.title_img || recipe.image}
                        alt={recipe.slug}
                        className="single_title_img"
                      /></object>
                  </div>

                  <div className="single_title_ingredients col">
                    <h5>
                      <u>INGREDIENTS</u>
                    </h5>
                    <div
                      dangerouslySetInnerHTML={{ __html: recipe.ingredients }}
                    ></div>
                  </div>
                </div>

                <div className="single_title_method row">
                  <h5>
                    <u>METHOD</u>
                  </h5>
                  <div>
                    <p dangerouslySetInnerHTML={{ __html: recipe.recipe }}></p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div >
    </>
  );
};

export default SingleTitle;
