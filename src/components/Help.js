import Paper from 'material-ui/Paper';
import React, {Component} from 'react';

export class Help extends Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <br/>
                <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                    <h2>Help page</h2>
                    <span>Please contact EDTx for help.</span>
                </Paper>
            </div>
        )
    }
}

