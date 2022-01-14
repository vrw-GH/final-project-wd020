import React, { useState } from "react";
// import Fetched from "./Fetched";
import Selecteduser from "./Selecteduser";

const Itemsrender = ({ shareItems }) => {
  const [itemSelector, setItemSelector] = useState({});
  return (
    <>
      {/* <Fetched setItemSelector={setItemSelector} /> */}
      <Selecteduser itemSelector={itemSelector} />
    </>
  );
};

export default Itemsrender;
