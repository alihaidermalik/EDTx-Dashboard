import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {Component} from 'react';

const styles = {
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    btnWrapper: {
        width: "40%",
        display: "flex",
        paddingTop: "42px",
        marginLeft: "11%"
    }
};

const validate = values => {
    const errors = {}
    if (!values.course_name) {
        errors.course_name = 'Required'
    }
    if (!values.organization) {
        errors.organization = 'Required'
    }
    if (!values.number) {
        errors.number = 'Required'
    }
    if (!values.run) {
        errors.run = 'Required'
    }
    return errors
}

const warn = values => {
    const warnings = {}
    
    
    
    return warnings
}

const renderField = ({input, label, valueText, defaultValue, meta: {touched, error, warning}}) => (

    <GridList className="syncGrid" cellHeight={80} cols={3}>
        <GridTile style={styles.gridKey}>
            <span className="syncLabel">{label}</span>
        </GridTile>
        <GridTile cols={2}>
            <TextField fullWidth={true} {...input} placeholder={label} defaultValue={defaultValue} value={valueText}/>
            {touched &&
            ((error && <span style={{color: "red"}}>{error}</span>) ||
                (warning && <span style={{color: "red"}}>{warning}</span>))}
        </GridTile>
    </GridList>
)

//TODO: Make this actually work, validation and submitting prop
class SyncValidationForm extends Component {

    render() {
        return (
            <form onSubmit={this.props.handleSubmit} className="syncForm">
                {this.props.fields.map((field, i) =>
                    <Field key={i} name={field.name} label={field.label} component={renderField} type="text"
                           floatLabel={field.floatLabel} valueText={field.value} defaultValue={field.defaultValue}/>)
                }
                {
                    this.props.extras ? this.props.extras.map(extra => extra) : null
                }
                <div style={styles.btnWrapper}>
                    <RaisedButton
                        type="submit" label={(this.props.submitting) ? 'Please wait...' : 'Submit'}
                        backgroundColor={'#364D7C'}
                        labelColor='#fff'
                        disabled={this.props.submitting}
                        fullWidth={true}
                        style={{marginRight: "1em"}}
                    />
                    <RaisedButton
                        label="Cancel"
                        disabled={this.props.submitting}
                        fullWidth={true}
                        onClick={this.props.onCancel}
                    />
                </div>
            </form>
        )
    }
}

export default reduxForm({
    form: 'syncValidation',  // a unique identifier for this form
    validate,                // <--- validation function given to redux-form
    warn                     // <--- warning function given to redux-form
})(SyncValidationForm)