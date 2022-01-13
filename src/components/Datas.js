
const Datas = ({ datas, handleSelect }) => {
    return (<p onClick={() => handleSelect(datas)} className="col-md-4 arrayItems" key={datas.arrayofitems} datax={datas} style={{backgroundColor: "rgb(131, 208, 238)",alignContent:"center",width:"220px",padding:"20px",borderRradius: "(0px 15px 0px 0px)", cursor: "pointer" }}> Items to share: {datas.arrayofitems}</p>)
}

export default Datas