import React, { useEffect ,useState} from 'react'
import Carousel from './Carousel/Carousel'
import Form from './Form'
export default function Registration() {
  const [images,setImages]=useState([])
  return (
    <>
    <div className="Registration absolute inset-0 overflow-hidden flex">
      <Carousel/>
      <>
      <div className='  flex justify-stretch' style={{
        flexGrow:6
    }}>
        <div className="section_registration section_1 flex-1">

        </div>
        <div className="section_registration section_2 flex-1 ">
          <Form/>
        </div>
    </div>
      </>
      </div>
    </>
  )
}
