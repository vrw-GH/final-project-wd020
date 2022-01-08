import { useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import "./_Page.css";

const SearchTitles = ({ searchQry, handleClearQry, APPDATA }) => {
  const [titles, setTitles] = useState([]);
  const [total, setTotal] = useState(0);
  // eslint-disable-next-line
  const [error, setError] = useState(null);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      (async () => {
        const recipes = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
        setTitles(recipes.data.tuples.filter(filterPosts));
        setTotal(recipes.data.tuples.filter(filterPosts).length);
      })();
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

  if (error) return <div>{error}</div>;

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
            We found {total} entries containing the word "{searchQry}"{" "}
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
