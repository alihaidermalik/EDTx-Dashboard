import {Card, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import {coursesActions} from '../../actions';
import {findBlockInTasktree} from '../../helpers';
import {DeleteSectionDialog} from '../DeleteSectionDialog';
import {ListItemComponent} from './ListItemComponent';
import {namingConstants} from '../../constants';

class SubsectionList extends Component {
    constructor() {
        super();

        this.courseID = null;
        this.sectionBlockId = null;
        this.state = {
            open: false,
        };
    }

    componentWillMount() {
        const {dispatch, tasktree} = this.props;

        this.courseID = this.props.location.pathname.split('/')[2];
        this.sectionBlockId = this.props.location.pathname.split('/')[3];

        if (!(tasktree.child_info && ("children" in tasktree.child_info))) {
            dispatch(coursesActions.getCourseTasktree(this.courseID));
        }

    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const {fetchingTasktree, tasktree} = this.props;
        const this_block = findBlockInTasktree(tasktree, this.sectionBlockId);
        const parent_block = this_block ? findBlockInTasktree(tasktree, this_block.parent) : null;

        return (
            <div>
                <div className={"breadcrumbs"}>
                    {fetchingTasktree ?
                        <br/> :
                        <ol className={"breadcrumbs-list"}>
                            <ul className={'breadcrumb'}>
                                <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                    {parent_block ? parent_block.section_name : this.courseID}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                        </ol>
                    }
                </div>
                <div className="section-list-wrapper">
                    <br/>
                    <Card className="section-card">
                        {fetchingTasktree ?
                            <div>
                                <CircularProgress size={60} thickness={7}/>
                            </div> :

                            <div>
                                <div className="section-card-header">
                                    <CardMedia>
                                        <img src={""}
                                             alt=""/>
                                    </CardMedia>
                                    <CardTitle className="section-card-title" title={this_block['section_name']}/>
                                    <NavLink to={"/edit_section/" + this.courseID + "/" + this.sectionBlockId}
                                             key={this.sectionBlockId}>
                                        <IconButton>
                                            <EditIcon/>
                                        </IconButton>
                                    </NavLink>
                                    <DeleteSectionDialog courseID={this.courseID} sectionID={this.sectionBlockId}
                                                         redirect={"/courses/" + this.courseID}/>
                                </div>
                                <CardText style={{display: "block"}}>
                                    {namingConstants.SECTION} name: {this_block['section_name']}
                                    <br/>
                                    Type: {this_block['type']}
                                </CardText>
                            </div>
                        }
                        <h3 style={{fontSize: "2em", marginLeft: "0.5em"}}>{namingConstants.SUBSECTION_PLURAL}</h3>
                        {fetchingTasktree ?
                            <div>
                                <CircularProgress size={60} thickness={7}/>
                            </div>
                            :
                            <div style={{
                                display: "flex",
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                width: "100%",
                                padding: "0.5em"
                            }}>
                                <GridList
                                    cellHeight={100}
                                    style={{
                                        width: "100%",
                                        
                                        overflowY: 'auto',
                                    }}
                                    cols={1}
                                >
                                    {this_block && this_block.children ?
                                        this_block.children.map((subsection) => (
                                            <ListItemComponent key={subsection.section_url} section={subsection}
                                                               courseID={this.courseID}
                                                               redirectTo={"/subsections/" + this.courseID + "/" + subsection.section_url}/>


                                        )) : <br/>
                                    }
                                    <NavLink to={"/new_subsection/" + this.courseID + "/" + this.sectionBlockId}
                                             key={'new'}>
                                        <GridTile
                                            key={'new'}
                                            title={"Create a new Block"}
                                            subtitle={""}
                                            actionIcon={<IconButton><AddIcon color="white"/></IconButton>}
                                        >
                                            <img
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2HPlPwAE5QKRuXBlewAAAABJRU5ErkJggg=="
                                                alt={"Create new"}/>
                                        </GridTile>
                                    </NavLink>

                                </GridList>
                            </div>
                        }
                    </Card>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {fetchingTasktree, tasktree} = state.tasktrees;
    return {
        fetchingTasktree,
        tasktree
    };
}

const connectedSubsectionList = connect(mapStateToProps)(SubsectionList);
export {connectedSubsectionList as SubsectionList};
