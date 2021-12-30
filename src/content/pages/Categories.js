import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
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
  useEffect(() => {
    // setLoading(true);
    (async () => {
      // eslint-disable-next-line
      const results = await axios.get(`${BACKEND}/api/categories/${ctg}`);
      // setLoading(false);
    })();
    // eslint-disable-next-line
  }, []);

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
