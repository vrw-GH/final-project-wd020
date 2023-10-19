import { useState, useEffect } from "react";
import Title from "./Title.js";
import Loading from "../../components/Loading.js";
import { getRecipes } from "../../components/dataHandling.js";
import PageTitle from "../../components/PageTitle.js";
import "./_General.css";

const SearchTitles = ({ searchQry, handleClearQry, APPDATA }) => {
  const [titles, setTitles] = useState([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("Searching...");
  searchQry = searchQry.replace(/[sS]$/, "");

  useEffect(() => {
    let isLoaded = true;

    if (isLoaded) {
      (async () => {
        try {
          const recipes = await getRecipes(filterPosts);
          setTitles(recipes);
          setTotal(recipes.length);
          setErr("");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
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

  return (
    <div className="page-container">
      <PageTitle titleText="Search Results" />
      <div
        className="page-box col-8"
        style={{
          width: "90%",
        }}
      >
        {err ? (
          <Loading text={err} />
        ) : (
          <>
            {total > 0 ? (
              <>
                <h6>
                  We found {total} {total > 1 ? "entries" : "entry"} containing
                </h6>
                <h5 style={{ color: "red" }}>"{searchQry}"</h5>
                {titles.map((title) => (
                  <Title
                    key={title.slug}
                    title={title}
                    handleClearQry={handleClearQry}
                  />
                ))}
              </>
            ) : (
              <>
                <h6>We found NO entries containing:</h6>
                <h5 style={{ color: "red" }}>"{searchQry}"</h5>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchTitles;
