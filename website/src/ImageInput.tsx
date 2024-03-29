import React, {useEffect, useState} from "react";
import "./image-input.css";

type propsType = {
  handleImageUpload: (file: File) => void
}
const ImageInput = ({handleImageUpload}: propsType) => {
  const [file, setFile] = useState<File>();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles: Array<File> = Array.from(selectedFiles);
      setFile(newFiles[0]);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles: Array<File> = Array.from(droppedFiles);
      setFile(newFiles[0]);
    }
  };

  useEffect(() => {
    if (file) handleImageUpload(file);
  }, [file, handleImageUpload]);

  return (
    <div
      className={`document-uploader`}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <>
        <div className="upload-info">
          <div>
            <p>Drag and drop your files here</p>
          </div>
        </div>
        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept="image/*"
          multiple
        />
        <label htmlFor="browse" className="browse-btn">
          Browse files
        </label>
      </>
      {file && (
        <p className={"image-name"}>{file.name}</p>
      )}
    </div>
  );
};

export default ImageInput;
