import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./RecipesSlider.css";

export default function HomeSlider({ sliderData }) {
  var settings = {
    dots: true,
    infinite: sliderData.length > 3,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  const toPlain = (html) => {
    let str = html.replace(/<[^>]*>/g, "\n");
    str = str.replace(/\n\n/g, "\n");
    str = str.replace(/\n\n/g, "\n");
    return str;
  };

  let key = 0;
  return (
    <div>
      <Slider {...settings}>
        {sliderData.map((data) => (
          <div key={key++}>
            <object
              data={data.title_img || data.image}
              type="image/jpg,jpeg,png"
            >
              <img
                src={data.title_img || data.image}
                alt={data.image}
                className="recipesSlider_img"
                title={toPlain(data.ingredients)}
              />
            </object>
            <div className="recipesSlider_description">
              by: {data.username} ({data.category})
            </div>
            <Link to={`/recipes/${data.slug}`} className="link">
              <div className="recipesSlider_title">{data.title}</div>
            </Link>
          </div>
        ))}
      </Slider>
    
    </div>
  );
}
