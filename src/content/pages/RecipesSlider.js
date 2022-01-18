import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./RecipesSlider.css";

export default function HomeSlider({ sliderData }) {
  if (sliderData.length < 1)
    return (
      <div style={{ textAlign: "center" }}>
        <h3>😬 Sorry, we did not find any recipes ..</h3>
        try *And/Or* button above
      </div>
    );
  var settings = {
    dots: true,
    infinite: sliderData.length > 3,
    speed: 800,
    slidesToShow: window.innerWidth / 300,
    slidesToScroll: 3,
  };
  const ctgType = {
    B: "Breakfast",
    L: "Lunch",
    D: "Dinner",
    S: "Dessert",
    X: "Xmas",
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
      <div style={{ textAlign: "center" }}>
        <i>Drag slider ◄ or ►. Click Title for Recipe Page</i>
        <br />
      </div>
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
            <Link
              to={`/recipes/${data.slug}`}
              className="link"
              title="Click here to go to recipe page"
            >
              <div className="recipesSlider_description">
                by: {data.username} ({ctgType[data.category]})
              </div>
              <div className="recipesSlider_title">{data.title}</div>
            </Link>
          </div>
        ))}
      </Slider>
      <div>Pages (Slider)</div>
    </div>
  );
}
