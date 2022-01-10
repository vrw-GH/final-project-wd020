import "./_Page.css";

import React, { useState } from "react";
import axios from 'axios'
//--------------------------------------------------------------------------------------
const ShareItems = ({ loading, categories, APPDATA }) => {
  // const [error,setError] = useState("");
  const currentUser = (sessionStorage.getItem("currentUser"));
  // const currentUser = "abdullah"
  const [info, setInfo] = useState({

    sharestatus: "D",
    arrayofitems: [],
    message: "",
    location: ""

  })




  const handleSubmit = async (e) => {
    try {
      e.preventDefault();


      let arrayofItems = []
      arrayofItems.push(info.arrayofitems)
      let sendInfo = {

      };


      if (info.sharestatus) { sendInfo.sharestatus = info.sharestatus }
      if (info.message) { sendInfo.message = info.message }
      if (arrayofItems) { sendInfo.arrayofitems = arrayofItems }
      if (info.location) { sendInfo.location = info.location }
      console.log(sendInfo)
      const { data } = await axios.post(
        `https://avc-food-blog.herokuapp.com/api/shareitems/${currentUser}`, sendInfo
        // {
        //   // username: info.username,
        //   // arrayofitems: arrayofItems,
        //   // sharestatus: info.sharestatus,
        //   // message: info.message,
        //   // location: "1,2"
        // }

      ).then(res => console.log(res.data));
      console.log(data)

    } catch (error) {
      console.log(error)
      // setError("Created")
    }


  };
  function handle(event) {
    event.preventDefault()
    const newInfo = { ...info }
    newInfo[event.target.id] = event.target.value
    setInfo(newInfo)
    console.log(newInfo)
  }




  return (
    <>
      <h2 className="h22">test sharing</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="form">
        <input className="arrayOfItems" type="text" placeholder="arrayofitems" onChange={(event) => handle(event)} id="arrayofitems" value={info.arrayofitems}></input>
        <br /><br />
        <input className="category" type="text" placeholder="username" id="username" value={currentUser}>
        </input>
        <br />
        <br />
        <br />
        <textarea cols="40" rows="8" className="ingredients" type="text" placeholder="message" onChange={(event) => handle(event)} id="message" value={info.message} ></textarea>
        <br />
        <input type="text" placeholder="Location X,Y" onChange={(event) => handle(event)} id="location" value={info.location}></input>
        <br /> <br />
        <button className="btns">Submit</button>
      </form>

    </>

  );
};

export default ShareItems;
