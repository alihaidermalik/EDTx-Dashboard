import React from 'react';

const UploadMediaSelector = ({title, onChange, value}) => {
    return <div>
        <h4>{title}</h4>
        <input className="skill-image-url" type="text" name="skill-image-url" placeholder="File URL"/>
        <input className="skill-image-file" type="file" accept=".jpg, .jpeg, .png" name="skill-image-file"/>
    </div>;
};


export default UploadMediaSelector;