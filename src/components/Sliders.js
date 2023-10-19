import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
import ctgType from "./ctgType.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Sliders.css";

const Slider1 = ({ sliderData }) => {
  const navigate = useNavigate();
  if (sliderData.length < 1)
    return (
      <div style={{ textAlign: "center" }}>
        <h3>😬 Sorry, we did not find any recipes ..</h3>
        try *And/Or* button above
      </div>
    );

  let mouseX;

  const handleMouseUp = (e, slug) => {
    // we only check for horizontal movement
    let x = Math.abs(e.pageX - mouseX);
    if (x < 4) {
      navigate(`/recipes/${slug}`);
    }
  };

  const toPlain = (html) => {
    let str = html.replace(/<[^>]*>/g, "\n");
    str = str.replace(/\n\n/g, "\n");
    str = str.replace(/\n\n/g, "\n");
    return str;
  };

  // var settings = {
  //   dots: true,
  //   infinite: sliderData.length > 3,
  //   speed: 800,
  //   // slidesToShow: window.innerWidth / 300,
  //   slidesToShow: 4,
  //   slidesToScroll: 2,
  //   arrows: true,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   // variableWidth: true,
  // };

  return (
    <>
      <div style={{ marginBottom: "0.8rem", textAlign: "center" }}>
        <i>Drag slider ◄ or ►. Click each Title to open the Recipe Page</i>
        <br />
        <br />
      </div>
      <div className="sliderPortal">
        {/* {sliderData.map((data) => <>{data.title}</>)} */}
        {/* <Slider {...settings}> */}
        {sliderData.map((data) => (
          <div key={data.slug}>
            <object
              data={data.title_img || data.image}
              type="image/jpg,jpeg,png"
            >
              <img
                src={data.title_img || data.image}
                alt={data.image}
                className="recipesSlider_img"
                title={toPlain(data.ingredients)}
                onMouseDown={(e) => (mouseX = e.pageX)}
                onMouseUp={(e) => handleMouseUp(e, data.slug)}
              />
            </object>
            <Link
              to={`/recipes/${data.slug}`}
              className="link"
              title="Click here to go to recipe page"
            >
              <div className="recipesSlider_description">
                by: {data.username} ({ctgType(data.category)})
              </div>
              <div className="recipesSlider_title">{data.title}</div>
            </Link>
          </div>
        ))}
        {/* </Slider> */}
        <div className="slider-page">Slider Pages:</div>
      </div>
    </>
  );
};

export default Slider1;
