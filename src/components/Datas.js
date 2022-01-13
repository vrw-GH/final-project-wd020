
const Datas = ({ datas, handleSelect }) => {
    return (<p onClick={() => handleSelect(datas)} className="col-md-4 arrayItems" key={datas.arrayofitems} datax={datas}> Items to share: {datas.arrayofitems}</p>)
}

export default Datas