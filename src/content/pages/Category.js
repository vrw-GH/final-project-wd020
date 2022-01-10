import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Category.css";
import Title from "./Title.js";
import axios from "axios";

const Category = ({ categories, APPDATA }) => {
  let { category } = useParams();
  category = category.toUpperCase();
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const ctgID = categories.find(
    (el) => el.name.toUpperCase() === category
  ).category_id;

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const recipes = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
        setPosts(recipes.data.tuples.filter(filterItems));
      })();
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, [category]);

  if (error) return <div>{error}</div>;

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
