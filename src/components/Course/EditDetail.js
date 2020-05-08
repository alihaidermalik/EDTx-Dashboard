import TextField from 'material-ui/TextField';
import React from 'react';

const EditDetail = ({title, name, onChange, value}) => {
    return <TextField
        style={{display: "block"}}
        floatingLabelText={title}
        name={name}
        defaultValue={value}
        onChange={onChange}
        fullWidth={true}/>;
};

export default EditDetail;