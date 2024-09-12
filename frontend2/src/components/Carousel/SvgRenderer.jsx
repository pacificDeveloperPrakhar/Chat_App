// src/components/SvgDisplay.jsx

import React,{forwardRef} from 'react'; // Import the SVG

const SvgDisplay = forwardRef(({Img,size},ref) => {
  return (
    <div className="flex justify-center items-center  aspect-square"
    style={{width:"", height:`${2*size}rem` }} ref={ref}>
      <img src={Img} alt="" />
    </div>
  );
});

export default SvgDisplay;
