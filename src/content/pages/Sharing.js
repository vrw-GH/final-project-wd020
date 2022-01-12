import "./_Page.css";

import React, { useState, useEffect } from "react";
import axios from 'axios'
import Itemsrender from "../../components/itemsrender";
//--------------------------------------------------------------------------------------
const ShareItems = ({ loading, categories, APPDATA }) => {
  // const [error,setError] = useState("");
  const currentUser = (sessionStorage.getItem("currentUser"));
  const [posts, setPosts] = useState([]);
  // const currentUser = "abdullah"
  const [info, setInfo] = useState({

    sharestatus: "D",
    arrayofitems: [],
    message: "",
    location: ""

  })

  useEffect(() => {
    (async () => {
      const fetchedData = await axios.get(
        "https://avc-food-blog.herokuapp.com/api/shareitems"
      );
      setPosts(fetchedData.data.tuples);
      console.log(fetchedData.data.tuples)
    })();

  }, []);




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
      const post = await axios.post(
        `https://avc-food-blog.herokuapp.com/api/shareitems/${currentUser}`, sendInfo
      //   {
      //   username: info.username,
      //   arrayofitems: arrayofItems,
      //   sharestatus: info.sharestatus,
      //   message: info.message,
      //   location: "1,2"
      // }

      ).then(res => console.log(res.data));
      console.log(post)

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

      <form onSubmit={(e) => handleSubmit(e)} className="form">
        <h2 className="h22">Update shared items</h2>
        <br />
        <input className="arrayOfItems" type="text" placeholder="arrayofitems" onChange={(event) => handle(event)} id="arrayofitems" value={info.arrayofitems}></input>
        <br />
        <input className="category" type="text" placeholder="username" id="username" value={currentUser}>
        </input>
        <br />
        <input cols="40" rows="8" className="ingredients" type="text" placeholder="message" onChange={(event) => handle(event)} id="message" value={info.message} ></input>
        <br />
        <input type="text" placeholder="Location X,Y" onChange={(event) => handle(event)} id="location" value={info.location}></input>

        <button className="btns">Update</button>
      </form>
      <div className="container mt-5">
        <div className="row">
          <Itemsrender />
        </div>
      </div>
    </>

  );
};

export default ShareItems;
