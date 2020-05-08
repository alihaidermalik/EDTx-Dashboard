import React, {Component} from 'react';
import {TextField} from 'material-ui';

class EditCourseDescription extends Component {

    constructor(props) {
        super(props);

        const {value, maxlen} = this.props;

        this.state = {overAmount: value ? value.length - maxlen : 0};
    }

    onInput = (e) => {
        const {value, onChange, maxlen} = this.props;

        this.setState({
            overAmount: value ? value.length - maxlen : 0
        });

        onChange(e);
    }


    render() {
        const {value, name} = this.props;
        
        
        

        return (
            <div className="edit-course-description">
                <h4>Short Description</h4>
                <h6>(max 150 characters)</h6>
                <div className="course-description-editor">
                    <TextField
                        name={name}
                        fullWidth={true}
                        multiLine={true}
                        value={value}
                        onChange={this.onInput}
                    />
                </div>
                <div className="length-warning">
                    <p>{this.state.overAmount > 0 ? this.state.overAmount + " too many characters" : null}</p>
                </div>
            </div>
        );
    }
}

export default EditCourseDescription;