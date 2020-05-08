import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React, {Component} from 'react';

import {HTMLEditor} from './HTMLEditor';

export class Reports extends Component {

    state = {
        model: {innerHTML: 'Click Me'}
    };

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <br/>
                <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                    <h2>Reports</h2>
                    <HTMLEditor/>
                    <RaisedButton label="Save" primary={true}/>
                </Paper>
            </div>
        )
    }
}

