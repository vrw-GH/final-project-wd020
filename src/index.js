import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import App from "./App.js";

let urlBase = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={urlBase} >
      {/* <HashRouter> */}
      <App tab="about" />
      {/* </HashRouter> */}
    </BrowserRouter>
  </React.StrictMode>
)

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter basename={urlBase} >
//       {/* <HashRouter> */}
//       <App />
//       {/* </HashRouter> */}
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
