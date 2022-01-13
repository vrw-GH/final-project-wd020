import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Datas from './Datas';
import MapChart2 from '../content/pages/MapChart2';


// import { useParams } from 'react-router-dom';



const Fetched = ({ setItemSelector }) => {
    //   const {username} = useParams
    const [data, setData] = useState([])
    const [selectedPlz, setSelectedPlz] = useState("")
    const handleSelect = items => setItemSelector(items)

    useEffect(() => {
        (async () => {
            const shareItems = await axios.get(
                `https://avc-food-blog.herokuapp.com/api/shareitems`
            );
            console.log("Fetched data ::::", shareItems.data.tuples)
            setData(shareItems.data.tuples);
        })();
    }, []);
    const handleChange = (e) => {

        e.preventDefault()




    }


    return (
        <>
            <form style={{textAlign:"center",marginTop:"20px"}}onSubmit={handleChange}>
                
                <input placeholder='Enter you PLZ here' type="text" onChange={(e) => setSelectedPlz(e.target.value)} value={selectedPlz} id="plz"></input>
            </form>
            {data
                .filter(x => x.plz === selectedPlz)
                .map(datas => (
                    <>
                        <div style={{ width: "350px" }} >
                            <Datas key={datas.username} datas={datas} handleSelect={handleSelect} />
                            <MapChart2 coordinates={[datas.location.y, datas.location.x]} plz={datas.plz} />
                        </div>



                    </>
                ))}

        </>
    )
}

export default Fetched
