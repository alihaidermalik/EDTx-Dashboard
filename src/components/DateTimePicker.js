import 'input-moment/dist/input-moment.css'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import InputMoment from 'input-moment';
import moment from 'moment';
import { GridList, GridTile } from 'material-ui/GridList';
import { TextField } from 'material-ui';
const styles = {
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    }
}
class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            m: moment()
        };
    };

    handleOpenDialog = () => {
        this.setState({

            open: true,
            m: this.props.value ? this.props.value : moment()
        });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    handleChange = m => {
        this.setState({ m });
        this.props.onChange(m)
    };
    handleSave = () => {
        if (this.props.value === null) {
            this.props.onChange(moment().format('YYYY-MM-DD HH:mm'))
        }
        this.handleClose();
    };
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Save"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSave}
            />
        ];
        return [
            <div className={this.props.className}
                style={this.props.style ? this.props.style : null}
            >
                <GridList className="syncGrid" cellHeight={80} cols={3}>
                    <GridTile style={styles.gridKey}>
                        <span className="syncLabel">{this.props.text}</span>
                    </GridTile>
                    <GridTile>
                        <span className="syncLabel">
                            <TextField
                                value={this.props.value ? moment(this.props.value).format('YYYY-MM-DD HH:mm') : "No date set."}
                            />
                        </span>
                    </GridTile>
                    <GridTile>
                        <div style={{ height: 50 }}>
                            <FlatButton label="Choose Date" style={{ margin: 1 }} onClick={this.handleOpenDialog} />
                        </div>
                    </GridTile>
                </GridList>
                {this.props.children}
            </div>
            ,
            <Dialog
                title={this.props.headerText}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                contentStyle={{ width: "100%", alignItems: "center", maxWidth: "375px" }}
            >
                <div>
                    <div className="app">
                        <form>
                            <InputMoment
                                moment={this.state.m}
                                onChange={this.handleChange}
                                minStep={5}
                                onSave={this.handleSave}
                            />
                        </form>
                    </div>
                </div>
            </Dialog>
        ]
    }
}
export default DeleteDialog;