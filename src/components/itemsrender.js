import React, { useState } from 'react'
import Fetched from './Fetched'
import Selecteduser from './Selecteduser'

const Itemsrender = () => {
  const [itemSelector,setItemSelector] = useState({})
  return (
    <>
      <Selecteduser itemSelector={itemSelector}/>
      <Fetched setItemSelector={setItemSelector}/>
    </>
  )
}

export default Itemsrender
