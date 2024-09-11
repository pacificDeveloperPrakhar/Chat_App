// src/components/SvgDisplay.jsx

import React from 'react';
import Logo from '../../assets/images/node.svg'; // Import the SVG

const SvgDisplay = () => {
  return (
    <div className="flex justify-center items-center w-full max-w-xs aspect-square">
      <img src={Logo} alt="" />
    </div>
  );
};

export default SvgDisplay;
