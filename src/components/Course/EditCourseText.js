import React from 'react';

import {HTMLEditor} from '../HTMLEditor';

const EditCourseText = ({title, onChange, value, name}) => {
    return <div className="edit-course-text">
        <h3>{title}</h3>
        <HTMLEditor
            name={name}
            handleChange={onChange}
            text={value}
            toolbar={{options: ['inline', 'fontSize', 'fontFamily', 'colorPicker', 'image']}}
        />
    </div>;
};


export default EditCourseText;