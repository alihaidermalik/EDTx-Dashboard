import {Card} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import {coursesActions} from '../../actions';
import {ListItemComponent} from './ListItemComponent';
import SectionListHeader from './SectionListHeader';
import {namingConstants} from '../../constants';


class SectionList extends Component {
    constructor() {
        super();

        this.courseID = null;
        this.state = {};
    }

    componentWillMount() {
        const {dispatch} = this.props;
        this.courseID = this.props.location.pathname.split('/')[2];

        dispatch(coursesActions.getCourseDetails(this.courseID));
        dispatch(coursesActions.getCourseTasktree(this.courseID));
    }

    render() {
        const {fetchingDetails, fetchingTasktree, deets, tasktree} = this.props;
        // TODO: Fix delete background icon
        return (
            <div>
                <div className={"breadcrumbs"}>
                    <ol className={"breadcrumbs-list"}>
                        <ul className={'breadcrumb'}>
                            <NavLink to={this.props.location.pathname} className={'breadcrumb-navlink'}>
                                {deets.name ? deets.name : ""}
                            </NavLink>
                        </ul>
                    </ol>
                </div>
                <div className="section-list-wrapper">
                    <br/>
                    <Card className="section-card">
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        </div>
                        {fetchingDetails ?
                            <div>
                                <CircularProgress style={{padding: "100px", textAlign: "center", width: "100%"}}
                                                  size={60} thickness={7}/>
                            </div> :
                            <SectionListHeader deets={deets} courseID={this.courseID}/>
                        }
                        <br/>
                        <h3 style={{
                            fontSize: "2em",
                            marginLeft: "3%"
                        }}>{namingConstants.SECTION_PLURAL}</h3>
                        {fetchingTasktree ?
                            <div>
                                <CircularProgress style={{padding: "100px", textAlign: "center", width: "100%"}}
                                                  size={60} thickness={7}/>
                            </div> :
                            <div style={{
                                display: "flex",
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                width: "100%",
                                padding: "0.5em"
                            }}>
                                {tasktree && ("children" in tasktree) ?

                                <GridList
                                    cellHeight={100}
                                    style={{
                                        width: "100%",
                                        overflowY: 'auto',
                                    }}
                                    cols={1}
                                >
                                    {tasktree.children.map((section) => (
                                        <ListItemComponent key={section.section_url} section={section} courseID={this.courseID} redirectTo={"/sections/" + this.courseID + "/" + section.section_url}/>
                                    ))}
                                    <NavLink to={"/new_section/" + this.courseID + "/" + tasktree.id}  key={'new'}>
                                        <GridTile
                                            key={'new'}
                                            title={"Create a new " + namingConstants.SECTION}
                                            subtitle={""}
                                            actionIcon={<IconButton><AddIcon
                                            color="white"/></IconButton>}
                                        >
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2HPlPwAE5QKRuXBlewAAAABJRU5ErkJggg==" alt={"Create new"} />
                                        </GridTile>                                      
                                    </NavLink>
                                </GridList>
                                :
                                //  !("id" in tasktree) ? <p>API error.</p> :
                                    tasktree.detail && tasktree.detail === "Not found."
                                    ? <p align="center">"You have not got permission to view sections for this course! " </p>
                                    :
                                    <GridList
                                        cellHeight={100}
                                        style={{
                                            width: "100%",
                                            overflowY: 'auto',
                                        }}
                                        cols={1}
                                    >
                                        <NavLink to={"/new_section/" + this.courseID + "/" + tasktree.id}  key={'new'}>
                                            <GridTile
                                                key={'new'}
                                                title={"Create a new " + namingConstants.SECTION}
                                                subtitle={""}
                                                actionIcon={<IconButton><AddIcon
                                                color="white"/></IconButton>}
                                            >
                                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2HPlPwAE5QKRuXBlewAAAABJRU5ErkJggg==" alt={"Create new"} />
                                            </GridTile>
                                        </NavLink>
                                    </GridList>
                                }
                            </div>
                        }
                    </Card>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {fetchingDetails, deets} = state.deetss;
    const {fetchingTasktree, tasktree} = state.tasktrees;
    return {
        fetchingDetails,
        fetchingTasktree,
        deets,
        tasktree
    };
}

const connectedSectionList = connect(mapStateToProps)(SectionList);
export {connectedSectionList as SectionList};
