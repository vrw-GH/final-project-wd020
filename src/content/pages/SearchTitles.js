import { useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import "../../loading.css";
import "./_Page.css";

const SearchTitles = ({ searchQry, handleClearQry, APPDATA }) => {
  const [titles, setTitles] = useState([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      const getRecipes = async () => {
        try {
          const results = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
          if (!results.data.tuples[0]) throw new Error("No Recipes Data.");
          setTitles(results.data.tuples.filter(filterPosts));
          setTotal(results.data.tuples.filter(filterPosts).length);
        } catch (error) {
          setErr(error.message);
        }
      };
      getRecipes();
    }
    return () => {
      isLoaded = false; //   avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, [searchQry]);

  const filterPosts = (post) => {
    let string = post.title.toLowerCase();
    if (string.indexOf(searchQry.toLowerCase()) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      {total > 0 ? (
        <>
          <h5>
            We found {total} {total > 1 ? "entries" : "entry"} containing the
            word "{searchQry}"{" "}
          </h5>
          {titles.map((title) => (
            <Title
              key={title.slug}
              title={title}
              handleClearQry={handleClearQry}
            />
          ))}
        </>
      ) : (
        <h5>`We found NO entries containing the word "{searchQry}"`</h5>
      )}
    </div>
  );
};

export default SearchTitles;
