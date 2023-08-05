import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import 'react-resizable/css/styles.css';

function Image(props) {

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const handleResizeStop = (e, { size }) => {
    const { width, height } = size;
    setImageWidth(width);
    setImageHeight(height);
    props.onResizeComplete(width, height);
    console.log(width, height)
  };

  return (
    <div className="imageContainer">
      <ResizableBox
       width={props.width} 
       height={props.height} 
       className="imageDiv" 
       lockAspectRatio={props.diagonal} 
       minConstraints={[300, 300]} 
       maxConstraints={[1500, 1500]}
       onResizeStop={handleResizeStop}
      >
        <img src={props.url} alt="image" />
      </ResizableBox>
    </div>
  );
}

export default Image;
