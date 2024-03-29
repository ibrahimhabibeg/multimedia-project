import {useEffect, useRef} from "react";
import dither from "./dither.ts";

type propsType = {
  imageData: ImageData | undefined
}

const Result = ({imageData}:propsType) => {

  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const naiveThresholdImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const brightnessThresholdImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const errorDiffusionImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const orderedImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const patternImageCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    if(imageData){
      updateCanvasToImage(originalImageCanvasRef, imageData);
      updateCanvasToImage(naiveThresholdImageCanvasRef, dither.naiveThresholdDithering(imageData));
      updateCanvasToImage(brightnessThresholdImageCanvasRef, dither.brightnessThresholdDithering(imageData));
      updateCanvasToImage(errorDiffusionImageCanvasRef, dither.errorDiffusionDithering(imageData));
      updateCanvasToImage(orderedImageCanvasRef, dither.orderedDithering(imageData));
      updateCanvasToImage(patternImageCanvasRef, dither.patternDithering(imageData));
    }
  }, [imageData]);

  const updateCanvasToImage = (canvasRef:React.RefObject<HTMLCanvasElement>, imageData: ImageData) => {
    const canvas = canvasRef.current;
    if(!canvas || !imageData) return;
    const context = canvas.getContext('2d');
    if(!context) return;
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context.putImageData(imageData, 0, 0);
  }

  return(
    <div style={{display:"flex", justifyContent:"space-around"}}>
      <div>
        <div style={{position:"sticky", top:0, paddingTop:70}}>
          <h3>Original Image Dithering</h3>
          <canvas ref={originalImageCanvasRef}/>
        </div>
      </div>
      <div>
        <div style={{display: "block", marginTop:70}}>
        <h3>Naive Threshold Dithering</h3>
          <canvas ref={naiveThresholdImageCanvasRef}/>
        </div>
        <div style={{display: "block", marginTop: 70}}>
          <h3>Brightness Threshold Dithering</h3>
          <canvas ref={brightnessThresholdImageCanvasRef}/>
        </div>
        <div style={{display: "block", marginTop: 70}}>
          <h3>Error Diffusion Dithering</h3>
          <canvas ref={errorDiffusionImageCanvasRef}/>
        </div>
        <div style={{display: "block", marginTop: 70}}>
          <h3>Ordered Dithering</h3>
          <canvas ref={orderedImageCanvasRef}/>
        </div>
        <div style={{display: "block", marginTop: 70}}>
          <h3>Pattern Dithering</h3>
          <canvas ref={patternImageCanvasRef}/>
        </div>
      </div>
    </div>
  )
}

export default Result;