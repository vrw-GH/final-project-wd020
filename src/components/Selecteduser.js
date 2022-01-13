import {MyMap} from './map'
import Datas from './Datas'




function Selecteduser({ itemSelector, datas }) {


    return (
        <div style={{ padding: "25px", borderRadius: "35px", backgroundColor: "rgb(255, 203, 89)", display: "flex", flexDirection: "column", alignItems: "center", width:"250px"}}>
            <div>Username: {itemSelector.username}</div>
            <div>Share status: {itemSelector.sharestatus}</div>
            <div>Message: {itemSelector.message}</div>
            <div>PLZ: {itemSelector.plz}</div>
            <div>location: {itemSelector?.location?.x}</div>
            <div>location: {itemSelector?.location?.y}</div>
            {/* {!itemSelector.location ? null :
                
            } */}
            {/* <MyMap/> */}
        </div>
    )
}

export default Selecteduser
