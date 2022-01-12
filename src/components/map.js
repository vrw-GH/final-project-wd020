import React, { useState, useEffect } from "react"
import { Map, Marker } from "pigeon-maps"
import axios from 'axios';

export function MyMap({ datas }) {


  // const [location, setLocation] = useState([{}])
  const [hue, setHue] = useState(0)
  const color = `hsl(${hue % 360}deg 39% 70%)`
  // const [data, setData] = useState([])

  // useEffect(() => {
  //   (async () => {
  //     const recipes = await axios.get(
  //       `https://avc-food-blog.herokuapp.com/api/shareitems`
  //     );
  //     console.log("Fetched data ::::", recipes.data.tuples)
  //     setData(recipes.data.tuples);
  //   })();
  // }, []);

  return (
    <Map height={300} defaultCenter={[52.522748, 13.455567]} defaultZoom={11}>
      <Marker
        width={50}
        anchor={[52.522748, 13.455567]}
        color={color}
        onClick={() => setHue(hue + 20)}
      />
      <Marker
        width={50}
        anchor={[51, 11]}
        color={color}
        onClick={() => setHue(hue + 20)}
      />
    </Map>
  )
}