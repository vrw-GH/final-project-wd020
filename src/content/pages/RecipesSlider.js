import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Categories.css";

export default function HomeSlider({ sliderData }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 2,
  };
  let key = 0;
  console.log(sliderData);
  return (
    <div>
      <Slider {...settings}>
        {sliderData.map((data) => (
          <div key={key++}>
            <img className="categories_img" src={data.image} alt="category" />
            <Link to={`/categories/${data.name}`} className="link">
              <div className="categories_title">{data.name}</div>
            </Link>
            <div className="categories_description">{data.description}</div>
          </div>
        ))}
      </Slider>
      <p>pages .................... </p>
    </div>
  );
}
