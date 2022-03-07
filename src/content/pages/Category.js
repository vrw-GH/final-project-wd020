import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Title from "./Title.js";
import "../../components/loading.css";
import "./Category.css";

const Category = ({ categories, APPDATA }) => {
  let { category } = useParams();
  category = category.toUpperCase();
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState(null);
  const ctgID = categories.find(
    (el) => el.name.toUpperCase() === category
  ).category_id;

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      const getRecipes = async () => {
        try {
          const results = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
          if (!results.data.tuples[0]) throw new Error("No Recipe Data.");
          setPosts(results.data.tuples.filter(filterItems));
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      };
      getRecipes();
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, [category]);

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  const filterItems = (items) => {
    if (category) {
      if (items.category === ctgID) {
        return true;
      } else return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className="category_container">
        <h5>
          We have {posts.length} entries for {category}
        </h5>
        {posts.map((title) => (
          <Title key={title.slug} title={title} />
        ))}
      </div>
    </>
  );
};

export default Category;
