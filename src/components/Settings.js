import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import React, {Component} from 'react';

var pjson = require('../../package.json');

export class Settings extends Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <br/>
                <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                    <h2>Settings page</h2>
                    <Table>
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={true}
                        >
                            <TableRow>
                                <TableHeaderColumn>Setting</TableHeaderColumn>
                                <TableHeaderColumn>Value</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableRowColumn><strong>Logged in</strong></TableRowColumn>
                                <TableRowColumn>{localStorage.user ? "True" : "False"}</TableRowColumn>
                            </TableRow>
                            <TableRow striped={true}>
                                <TableRowColumn><strong>EDTx App version</strong></TableRowColumn>
                                <TableRowColumn>{pjson.version}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn><strong>Node Env</strong></TableRowColumn>
                                <TableRowColumn>{process.env.NODE_ENV}</TableRowColumn>
                            </TableRow>
                            <TableRow striped={true}>
                                <TableRowColumn><strong>React App Env</strong></TableRowColumn>
                                <TableRowColumn>{process.env.REACT_APP_ENV_VERSION}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn><strong>Backend API URL</strong></TableRowColumn>
                                <TableRowColumn>{process.env.REACT_APP_API_URL}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn><strong>ICAL API URL</strong></TableRowColumn>
                                <TableRowColumn>{process.env.REACT_APP_ICAL_API_URL}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

