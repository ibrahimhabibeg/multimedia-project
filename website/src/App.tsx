import './App.css'
import Upload from "./Upload.tsx";
import {useState} from "react";
import Result from "./Result.tsx";
import Footer from "./Footer.tsx";

function App() {
  const [imageData, setImageData] = useState<ImageData>();
  return (
    <div style={{width:"1500"}}>
      <Upload generateMonochrome={(newImageData)=>setImageData(newImageData)}/>
      {
        imageData && <Result imageData={imageData}/>
      }
      <Footer/>
    </div>
  )
}

export default App
