import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json"
// "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"
// "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const markerOffset = -15;

const MapChart = ({ coordinates, plz }) => {
  if (coordinates === undefined) coordinates = [10, 51];
  if (plz === undefined || plz === "" || plz === [10, 51])
    plz = "Somewhere in Germany";
  const markers = [
    { markerOffset, name: "Berlin", coordinates: [13.41053, 52.52437] },
    { markerOffset, name: "Hamburg", coordinates: [9.99302, 53.55073] },
    { markerOffset, name: "Munich", coordinates: [11.57549, 48.13743] },
    {
      markerOffset,
      name: "Frankfurt am Main",
      coordinates: [8.68417, 50.11552],
    },
    { markerOffset, name: "Essen", coordinates: [7.01228, 51.45657] },
    { markerOffset, name: "Stuttgart", coordinates: [9.17702, 48.78232] },
    // { markerOffset, name: "Dortmund", coordinates: [7.466, 51.51494] },
    // { markerOffset, name: "Düsseldorf", coordinates: [6.77616, 51.22172] },
    { markerOffset, name: "Bremen", coordinates: [8.80717, 53.07582] },
    { markerOffset, name: "Leipzig", coordinates: [12.37129, 51.33962] },
    // { markerOffset, name: "Duisburg", coordinates: [6.76516, 51.43247] },
    { markerOffset, name: "Dresden", coordinates: [13.73832, 51.05089] },
    { markerOffset, name: "Köln", coordinates: [6.95, 50.93333] },
    // { markerOffset, name: "Bochum", coordinates: [7.21648, 51.48165] },
    // { markerOffset, name: "Wuppertal", coordinates: [7.14816, 51.25627] },
    // { markerOffset, name: "Bielefeld", coordinates: [8.53333, 52.03333] },
    // { markerOffset, name: "Bonn", coordinates: [7.09549, 50.73438] },
    { markerOffset, name: "Mannheim", coordinates: [8.46694, 49.4891] },
    // { markerOffset, name: "Karlsruhe", coordinates: [8.40444, 49.00937] },
    // { markerOffset, name: "Wiesbaden", coordinates: [8.24932, 50.08258] },
  ];

  return (
    <ComposableMap
      height={290}
      width={270}
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-10, -51, 0],
        scale: 1200,
      }}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              // .filter((d) => d.properties.REGION_UN === "Europe")
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#eeddcc"
                  stroke="#7d4007"
                />
              ))
          }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset }) => (
          <Marker key={name} coordinates={coordinates}>
            <g
              fill="none"
              stroke="#FF5533"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-12,-24)"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </g>
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{
                fontSize: "0.5rem",
                fontFamily: "system-ui",
                fill: "#5D5A6D",
              }}
            >
              {name}
            </text>
          </Marker>
        ))}
        <Marker key={"Me"} coordinates={coordinates}>
          <circle r={10} fill="#00000010" stroke="#20aaaaaa" strokeWidth={5} />
          <text
            textAnchor="middle"
            y={-5}
            style={{ fontSize: "0.8rem", fontWeight: "bold" }}
          >
            {plz}
          </text>
        </Marker>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
