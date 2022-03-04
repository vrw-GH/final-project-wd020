import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../loading.css";
import "./Categories.css";

export default function Categories({ categories, BACKEND }) {
  let key = 0;
  return (
    <div className="Categories">
      {categories.map((ctg) => (
        <CtgList key={key++} ctg={ctg} BACKEND={BACKEND} />
      ))}
    </div>
  );
}

function CtgList({ ctg, BACKEND }) {
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      const getCat = async () => {
        try {
          const results = await axios.get(`${BACKEND}/api/categories/${ctg}`);
          if (!results.data.tuples[0]) throw new Error("No Categories Data.");
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      };
      getCat();
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, []);

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  return (
    <div className="categories_container">
      <Link to={`/categories/${ctg.name}`} className="link">
        <img className="categories_img" src={ctg.image} alt="category" />
        <div className="categories_title">{ctg.name}</div>
        <div className="categories_description">{ctg.description}</div>
      </Link>
    </div>
  );
}
