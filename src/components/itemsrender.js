import React, { useState } from 'react'
import Fetched from './Fetched'
import Selecteduser from './Selecteduser'

const Itemsrender = () => {
  const [itemSelector,setItemSelector] = useState({})
  return (
    <>
      <Fetched setItemSelector={setItemSelector}/>
      <Selecteduser itemSelector={itemSelector}/>
    </>
  )
}

export default Itemsrender
