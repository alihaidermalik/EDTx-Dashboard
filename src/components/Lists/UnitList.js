import {Card, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import {coursesActions} from '../../actions';
import {findBlockInTasktree} from '../../helpers';
import {DeleteSectionDialog} from '../DeleteSectionDialog';
import {ListItemComponent} from './ListItemComponent';
import {namingConstants} from '../../constants';


class UnitList extends Component {
    constructor() {
        super();

        this.courseID = null;
        this.subsectionBlockId = null;
    }

    componentWillMount() {
        const {dispatch} = this.props;

        this.courseID = this.props.location.pathname.split('/')[2];
        this.subsectionBlockId = this.props.location.pathname.split('/')[3];

        dispatch(coursesActions.getCourseTasktree(this.courseID));
    }


    render() {
        const {fetchingTasktree, tasktree} = this.props;
        
        const this_block = findBlockInTasktree(tasktree, this.subsectionBlockId);
        const parent_block = this_block ? findBlockInTasktree(tasktree, this_block.parent) : null;

        return (
            <div>
                <div className={"breadcrumbs"}>
                    {fetchingTasktree ?
                        <br/> :
                        <ol className={"breadcrumbs-list"}>
                            <ul className={'breadcrumb'}>
                                <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                    {tasktree.section_name ? tasktree.section_name : this.courseID}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>

                                <NavLink to={"/sections/" + this.courseID + "/" + this_block['parent']}
                                         className={'breadcrumb-navlink'}>
                                    {parent_block['section_name'] ? parent_block['section_name'] : "Parent"}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                        </ol>
                    }
                </div>
                <div style={{display: "flex", justifyContent: "center", paddingBottom: 100}}>
                    <br/>
                    <Paper style={{paddingBottom: 75, zDepth: 2}} className={"edtx-paper"} >
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h2 style={{display: "flex", justifyContent: "center"}}>Block Details</h2>
                            <NavLink to={"/edit_subsection/" + this.courseID + "/" + this.subsectionBlockId}
                                     key={this.subsectionBlockId}>
                                <IconButton><EditIcon/></IconButton>
                            </NavLink>
                            {fetchingTasktree ? null :
                                <DeleteSectionDialog courseID={this.courseID} sectionID={this.subsectionBlockId}
                                                     redirect={"/sections/" + this.courseID + "/" + this_block['parent']}/>
                            }
                        </div>
                        {fetchingTasktree ?
                            <div>
                                <CircularProgress size={60} thickness={7}/>
                            </div> :
                            <Card style={{maxWidth: "100%"}}>
                                <CardMedia>
                                    <img src={""}
                                         alt=""/>
                                </CardMedia>
                                <CardTitle title={this_block['section_name']}
                                           subtitle={isMobile ? "" : this_block['section_url']}
                                />
                                <CardText>
                                    Type: {this_block['type']}
                                </CardText>
                            </Card>
                        }
                        <br/>
                        <h3>{namingConstants.UNITS_PLURAL}</h3>
                        {fetchingTasktree ?
                            <div>
                                <CircularProgress size={60} thickness={7}/>
                            </div> :
                            <div style={{
                                display: "flex",
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                width: "80%"
                            }}>
                                <GridList
                                    cellHeight={100}
                                    style={{
                                        width: "100%",
                                        overflowY: 'auto',
                                    }}
                                    cols={1}
                                >
                                    {this_block.children ?
                                        this_block.children.map((unit) => (
                                            <ListItemComponent key={unit.section_url} section={unit}
                                                               courseID={this.courseID}
                                                               redirectTo={"/units/" + this.courseID + "/" + unit.section_url}
                                                               editRedirectTo={"/edit_unit/" + this.courseID + "/" + unit.section_url}/>

                                                            
                                                            
                                        )) : <br/>
                                    }
                                    <NavLink to={"/new_unit/" + this.courseID + "/" + this.subsectionBlockId}
                                             key={'new'}>
                                        <GridTile
                                            key={'new'}
                                            title={"Create a new " + namingConstants.UNITS}
                                            subtitle={""}
                                            actionIcon={<IconButton><AddIcon
                                                color="white"/></IconButton>}
                                        >
                                            <img
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2HPlPwAE5QKRuXBlewAAAABJRU5ErkJggg=="
                                                alt={"Create new"}/>
                                        </GridTile>
                                    </NavLink>
                                </GridList>
                            </div>
                        }
                    </Paper>
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

const connectedUnitList = connect(mapStateToProps)(UnitList);
export {connectedUnitList as UnitList};
