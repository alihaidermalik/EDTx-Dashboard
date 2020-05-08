import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';

class DeleteDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    };

    handleOpenDialog = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                keyboardFocused={true}
                onClick={this.props.deleteAction}
            />
        ];

        return [
            <div className={this.props.className} onClick={this.handleOpenDialog}
                 style={this.props.style ? this.props.style : null}>{this.props.children}</div>
            ,
            <Dialog
                title={"Delete " + this.props.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                Do you want to permanently delete this {this.props.title}
                <br/>
                ID: {this.props.id}
            </Dialog>
        ]
    }
}

export default DeleteDialog;