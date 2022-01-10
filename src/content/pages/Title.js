import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import "./Title.css";

export default function Title({ title, handleClearQry }) {
  // eslint-disable-next-line
  const [postToHTML, setPostToHTML] = useState("");

  useEffect(() => {
    setPostToHTML(documentToHtmlString(title.recipe));
  }, [title]);

  return (
    <div className="title_container">
      <Link to={`/recipes/${title.slug}`} onClick={handleClearQry}>
        {/* <img className="title_image" src={title.image} alt="recipe" /> */}
        <img
          className="title_image"
          src={title.title_img || title.image}
          alt="recipe"
        />
        <div className="title_title">{title.title}</div>
      </Link>
      <div className="title_info">{title.username}</div>
    </div>
  );
}
