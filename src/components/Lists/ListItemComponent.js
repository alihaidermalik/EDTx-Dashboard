import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import React from 'react';
import {withRouter} from 'react-router-dom';

import {DeleteSectionDialog} from '../DeleteSectionDialog';

class ListItemComponent extends React.Component {

    state = {
        open: false,
    };

    handleOpen = (event) => {
        
        event.stopPropagation();

        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    handleRedirect = () => {
        const {history} = this.props;
        const {redirectTo} = this.props;
        history.push(redirectTo);
    }
    handleEditRedirect = () => {
        const {history} = this.props;
        const {courseID} = this.props;
        const {section} = this.props;

        const {editRedirectTo} = this.props;
        var editRedirect = editRedirectTo !== undefined ? editRedirectTo : '/edit_section/' + courseID + '/' + section.section_url;

        history.push(editRedirect)
    }

    render() {
        const {section} = this.props;
        return [
            section ?
                [
                    !this.state.open ?
                        <GridTile
                            key={section.section_url}
                            title={section.section_name}
                            //subtitle={<span><b>{course.start_display}</b></span>}
                            onClick={this.handleRedirect}
                            actionIcon={
                                <IconButton onClick={this.handleOpen}>
                                    <MoreVertIcon color="white"/>
                                </IconButton>
                            }
                            titleBackground={"#414141"}

                            color="black"
                        >
                            <img
                                src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UA8AAgUBQbH2eGIAAAAASUVORK5CYII="}
                                alt={section.section_name}/>
                        </GridTile>
                        :
                        <GridList
                            key={section.section_url}
                            cellHeight={100}
                            style={{
                                width: "100%",
                                overflowY: 'auto',
                                backgroundColor: '#364D7C'

                            }}
                            cols={4}
                        >

                            <GridTile
                                key={section.section_url}
                                title={section.section_name}
                                onClick={this.handleRedirect}
                                
                            >
                            </GridTile>
                            <GridTile
                                title={"Edit"}
                                actionIcon={
                                    <IconButton>
                                        <EditIcon color="white"/>
                                    </IconButton>
                                }
                                style={{
                                    textAlign: "center"
                                }}
                                onClick={this.handleEditRedirect}
                            >
                                <EditIcon
                                    style={{
                                        height: "100px",
                                        width: "100px"
                                    }}
                                    color="white"
                                />
                            </GridTile>
                            <GridTile
                                title={"Delete"}
                                actionIcon={<DeleteSectionDialog color="white" courseID={this.props.courseID}
                                                                 sectionID={section.section_url} redirect={""}/>}
                                style={{textAlign: "center"}}
                            >
                                <DeleteSectionDialog
                                    color="white"
                                    style={{
                                        height: "100px",
                                        width: "100px"
                                    }}
                                    courseID={this.courseID}
                                    sectionID={section.section_url} redirect={""}
                                />
                            </GridTile>

                            <GridTile
                                title={"Close"}
                                onClick={this.handleClose}
                                actionIcon={
                                    <IconButton onClick={this.handleClose}>
                                        <NavigationClose color="white"/>
                                    </IconButton>
                                }
                                style={{textAlign: "center"}}
                            >
                                <NavigationClose
                                    color="white"
                                    style={{
                                        height: "100px",
                                        width: "100px"
                                    }}
                                />
                            </GridTile>
                        </GridList>
                ]
                :
                <br/>
        ]
    }
}

const ListItemRouter = withRouter(ListItemComponent);

export {ListItemRouter as ListItemComponent};