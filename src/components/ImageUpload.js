// src/components/ImagePreview.js
import React, { useState } from 'react';

const ImagePreview = ({ onImageSend }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            onImageSend(file); 
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="preview" style={{ width: '100px' }} />}
        </div>
    );
};

export default ImagePreview;
