import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Datas from './Datas';
import MapChart2 from '../content/pages/MapChart2';


// import { useParams } from 'react-router-dom';



const Fetched = ({ setItemSelector }) => {
    //   const {username} = useParams
    const [data, setData] = useState([])
    const handleSelect = items => setItemSelector(items)

    useEffect(() => {
        (async () => {
            const recipes = await axios.get(
                `https://avc-food-blog.herokuapp.com/api/shareitems`
            );
            console.log("Fetched data ::::", recipes.data.tuples)
            setData(recipes.data.tuples);
        })();
    }, []);

    //   const arr = data.map((datas, index)=>{

    //     return (
    //       <div className='sharedCont'>
    //         <div className='userName'>{datas.username}</div>
    //         <div>{datas.arrayofitems}</div>
    //         <div>{datas.datetime}</div>
    //         <div>{datas.plz}</div>
    //         <div>{datas.location.x}</div>
    //         <div>{datas.location.y}</div>
    //         <div>{datas.sharestatus}</div>
    //         <div>{datas.message}</div>
    //       </div>
    //     )
    //   })

    return (
        <>
           
           
            {data
            .map(datas => (
                <>
                    <div style={{ display: "flex", width: "350px" }} >
                        <Datas key={datas.username} datas={datas} handleSelect={handleSelect} />
                        
                            {/* <MapChart2 coordinates={[datas.location.y, datas.location.x]} plz={datas.plz} /> */}
                    
                    </div>

                </>
            ))}

        </>
    )
}

export default Fetched
