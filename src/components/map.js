import React, { useState } from "react"
import { Map, Marker } from "pigeon-maps"

export function MyMap({ itemSelector }) {


  // const [location, setLocation] = useState([{}])
  const [hue, setHue] = useState(0)
  const color = `hsl(${hue % 360}deg 39% 70%)`
  

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