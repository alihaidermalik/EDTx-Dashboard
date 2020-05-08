import DeleteIcon from 'material-ui/svg-icons/action/delete';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {sectionActions} from '../actions';
import {coursesActions} from '../actions';
import DeleteDialog from './DeleteDialog';

class DeleteSectionDialog extends React.Component {

    state = {
        open: false,
    };

    componentWillMount() {
        if (this.props.courseID !== undefined && this.props.courseID !== "") {
            this.setState({
                courseID: this.props.courseID,
            });
        }
        if (this.props.redirect !== undefined && this.props.redirect !== "") {
            this.setState({
                redirect: this.props.redirect
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {history, dispatch} = this.props;

        if (!this.isEmpty(nextProps)) {
            if (nextProps.status === 'success') {
                this.handleClose();

                if (this.state.redirect !== undefined && this.state.redirect !== "") {
                    history.push(this.state.redirect);
                } else {
                    if (this.props.courseID !== undefined && this.props.courseID !== "") {
                        dispatch(coursesActions.getCourseTasktree(this.state.courseID));
                    }
                    //backup plan for refreshing the page
                    
                    
                }
            } else if (nextProps.status === 'failure') {
                //TODO: handle failure messages here or globally
                this.handleClose();
            }
        }
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleOpenDialog = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleDelete = () => {
        const {dispatch} = this.props;
        dispatch(sectionActions.deleteSection(this.props.sectionID));
    };

    render() {

        return (
            <DeleteDialog
                deleteAction={this.handleDelete}
                id={this.props.sectionID}
                style={{cursor: 'pointer'}}
            >
                <DeleteIcon style={this.props.style} color={this.props.color}/>
            </DeleteDialog>
        );
    }
}


function mapStateToProps(state) {

    return state.deleteSection;
}

const connectedDeleteSectionDialog = connect(mapStateToProps)(DeleteSectionDialog);

const connectedDeleteSectionDialogWithRouter = withRouter(connectedDeleteSectionDialog);
export {connectedDeleteSectionDialogWithRouter as DeleteSectionDialog};