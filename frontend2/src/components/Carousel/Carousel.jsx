import React,{useState,useEffect,useRef} from 'react'
import SvgDisplay  from './SvgRenderer'
import ImageExtractor from '../../utils/ImageExtractors'
const ImagesImport =import.meta.glob("../../assets/images/*.svg")
import { useMotionValue,motion,animate } from 'framer-motion'
export default function Carousel() {
    let controls;
    const [images,setImages]=useState([])
    const midCarouselRef=useRef(null)
    const carouselRef=useRef(null)
    const yTransform = useMotionValue(0);
  useEffect(()=>{
  if(!images.length)
  {
    (async()=>{
      const images=await ImageExtractor(ImagesImport)
      setImages(images)
    })()
    console.log(images.length)
    
  }
  if(images.length!=0)
    {
        let endpoint
        let midElementOffsetX = midCarouselRef.current.getBoundingClientRect().y;
        let parentOffsetX = carouselRef.current.getBoundingClientRect().y;
        endpoint = -(midElementOffsetX - parentOffsetX);
        console.log(endpoint)
        controls = animate(yTransform, [0, endpoint], {
            ease: 'linear',
            duration: 10 * (1 - yTransform.get() / endpoint), // Adjust duration to control speed
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 0,})
    }
    // this is to run after dismounting
  return ()=>{
    if(controls)
   controls.stop();
  }
},[images])
console.log(images.length)
  return (
    <motion.div className="Registration_Carousel  relative  flex-col space-x-8  flex-1 ml-9" ref={carouselRef}
    style={{ y: yTransform }}
    >
        {[...images, ...images].map((image, index,arr) => {
            return Math.floor(arr.length/2)==index?
                <SvgDisplay Img={image} size={3} ref={midCarouselRef} key={index}/>
                :<SvgDisplay Img={image} size={3} key={index}/>
        })}
      </motion.div>
  )
}
