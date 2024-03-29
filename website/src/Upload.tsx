import {useEffect, useRef, useState} from "react";
import ImageInput from "./ImageInput.tsx";
import "./upload.css"

type propsType = {
  generateMonochrome: (imageData:ImageData) => void
}
const Upload = ({generateMonochrome}:propsType) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<ImageData>();
  const MAX_WIDTH = 450;

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const context = canvas.getContext('2d');
    if(!context) return;
    canvas.height = 300;
    canvas.width = 400;
    context.font = "22px serif";
    context.fillStyle = "#fff";
    context.fillText("Uploaded image will be displayed here", 20, 100);
  }, [])
  const handleImageUpload = (file:File) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if(loadEvent.target && typeof loadEvent.target.result === 'string'){
          displayImageAndUpdateData(loadEvent.target.result);
        }
      }
      reader.readAsDataURL(file)

  }

  const displayImageAndUpdateData = (imageString: string) => {
    const canvas = canvasRef.current;
    if(!canvas || !imageString) return;
    const context = canvas.getContext('2d');
    if(!context) return;
    const image = new Image();
    image.onload = () => {
      if(image.width>MAX_WIDTH){
        canvas.width = MAX_WIDTH;
        canvas.height = canvas.width * (image.height/ image.width);
      }else {
        canvas.width = image.width;
        canvas.height = image.height;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setImageData(context.getImageData(0, 0, canvas.width, canvas.height));
    }
    image.src = imageString;
  }

  const handleButtonClick = () => {
    if(imageData) generateMonochrome(imageData);
  }

  return(
    <div>
      <h1>Monochrome Image Generator</h1>
      <div className={"upload-center"}>
        <ImageInput handleImageUpload={handleImageUpload}/>
        <canvas ref={canvasRef}/>
      </div>
      <button onClick={handleButtonClick} style={{marginTop:50}}>Generate Monochrome Images</button>
    </div>
  );
}

export default  Upload;