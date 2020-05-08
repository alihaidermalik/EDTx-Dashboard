import Paper from 'material-ui/Paper';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {NavLink} from 'react-router-dom';

import {sectionActions} from '../../actions';

import {findBlockInTasktree} from '../../helpers';
import BreadCrumbs from '../BreadCrumbs';
import SyncValidationForm from '../SyncValidationForm';
import {namingConstants} from '../../constants';

import {MenuItem} from 'material-ui/Menu';
import UploadMediaSelector from './UploadMediaSelector';
import {GridList, GridTile} from 'material-ui/GridList';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import DropDownMenu from 'material-ui/DropDownMenu';
import Toggle from 'material-ui/Toggle';


const styles = {
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    gridKey2: {
        textAlign: "left",
        paddingRight: "38px",
        overflow: "hidden",
        display: 'flex',
        alignItems: 'center'
    },
    btnWrapper: {
        width: "40%",
        display: "flex",
        paddingTop: "42px",
        marginLeft: "11%"
    }
};

class EditSection extends Component {
    constructor(props) {
        super(props)
        this.courseID = null;
        this.sectionID = null;

        this.state = {
            section: {},
            TypeText: 'Section'
        };

    }

    componentWillMount() {
        const {dispatch} = this.props;

        this.courseID = this.props.location.pathname.split('/')[2];
        this.sectionID = this.props.location.pathname.split('/')[3];

        dispatch(sectionActions.getSectionDetails(this.sectionID));
        
        this.setState({TypeText: this.typeText()});

    }

    componentWillReceiveProps(nextProps) {

        if (!this.isEmpty(nextProps.section)) {
            this.setState({
                section: nextProps.section
            })
        }
    }

    typeText = () => {
        switch (this.props.Type) {
            case 'sections':
                return namingConstants.SECTION;
            case 'subsections':
                return namingConstants.SUBSECTION;
            case 'units':
                return namingConstants.UNITS;
            case 'components':
                return namingConstants.COMPONENTS;
            default:
                return 'Section';
        }
    }
    handleSubmitTemp = () => {
        
        this.props.history.goBack();
    }

    handleSubmit = (e) => {
        const {dispatch} = this.props;

        var sectionData = {
            section_id: this.sectionID,
            metadata: {
                display_name: e.display_name,
            },
            publish: "make_public"
        }

        dispatch(sectionActions.updateSectionById(this.sectionID, sectionData));

    }
    handleCancel = () => {
        this.props.history.goBack();
    }
    handleChange = (event, index, value) => this.setState({value});
    handleSelectChange = (event, index, values) => this.setState({values});

    handleInputChange = (event) => {
        const target = event.target;

        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    breadCrumbs = () => {
        const {tasktree} = this.props;
        const this_block = findBlockInTasktree(tasktree, this.sectionID);
        const parent_block = this_block ? findBlockInTasktree(tasktree, this_block.parent) : null;
        const parent_parent_block = parent_block ? findBlockInTasktree(tasktree, parent_block.parent) : null;

        switch (this.state.Type) {
            case 'sections':
                return (
                    [
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                {parent_block ? parent_block.section_name : this.courseID}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    ]

                )
            case 'subsections':
                return (
                    [
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                {tasktree.section_name ? tasktree.section_name : this.courseID}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>

                            <NavLink to={"/sections/" + this.courseID + "/" + this_block['parent']}
                                     className={'breadcrumb-navlink'}>
                                {parent_block['section_name'] ? parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    ]
                )
            case 'units':
                return (
                    [
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                {tasktree.section_name ? tasktree.section_name : this.courseID}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/sections/" + this.courseID + "/" + parent_block['parent']}
                                     className={'breadcrumb-navlink'}>
                                {parent_parent_block['section_name'] ? parent_parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>
                            <NavLink to={"/subsections/" + this.courseID + "/" + this_block['parent']}
                                     className={'breadcrumb-navlink'}>
                                {parent_block['section_name'] ? parent_block['section_name'] : "Parent"}
                            </NavLink>
                        </ul>,
                        <ul className={'breadcrumb'}>{this_block['section_name']}</ul>
                    ]
                )
            default:
                return null
        }
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    render() {
        const {status, updateSectionResponse, dispatch} = this.props;

        const {fetchingTasktree, tasktree, sectionFetching} = this.props;

        if (!sectionFetching) {

            const skillsheetTypeField = [(
                <TableRow>
                    <TableRowColumn>
                        <strong>Signature Value</strong>
                    </TableRowColumn>
                    <TableRowColumn>
                        <DropDownMenu styles={{align: "left", "padding-left": "0 !important"}}
                                      value={this.state.signature} onChange={this.handleSignatureChange}>
                            <MenuItem value={"no"} primaryText="No signature"/>
                            <MenuItem value={"onscreen"} primaryText="Onscreen"/>
                            <MenuItem value={"by_employee"} primaryText="By employee"/>
                            <MenuItem value={"instructor"} primaryText="Instructor"/>
                        </DropDownMenu>
                    </TableRowColumn>
                </TableRow>
            )];
            const componentTypeField = [(

                <GridList className="syncGrid" cellHeight={80} cols={3}>
                    <GridTile style={styles.gridKey}>
                        <span className="syncLabel">Task Type</span>
                    </GridTile>
                    <GridTile cols={2} style={styles.gridKey2}>
                        <DropDownMenu styles={{align: "left", "padding-left": "0 !important"}}
                                      value={this.state.category} onChange={this.handleSelectChange}>
                            <MenuItem value={"html"} primaryText="HTML"/>
                            <MenuItem value={"video"} primaryText="Video"/>
                            <MenuItem value={"discussion"} primaryText="Discussion"/>
                            <MenuItem value={"edx_sga"} primaryText="Staff gradeable assignment"/>
                            <MenuItem value={"problem"} primaryText="Problem"/>
                        </DropDownMenu>
                    </GridTile>
                </GridList>
            )];
            const componentGradeToggle = [(

                <GridList className="syncGrid" cellHeight={80} cols={3}>
                    <GridTile style={styles.gridKey}>
                        <span className="syncLabel">Grade (on/off)</span>
                    </GridTile>
                    <GridTile cols={2} style={styles.gridKey2}>
                        <Toggle
                            
                            defaultToggled={true}
                        />
                    </GridTile>
                </GridList>
            )];

            var fields = [
                {
                    name: "display_name",
                    label: this.state.TypeText + " Name",
                    floatLabel: this.props.section.display_name,
                    defaultValue: this.props.section.display_name
                },
            ];
            var extras = [];
            switch (this.props.Type) {

                case 'sections':
                    fields = [
                        {
                            name: "display_name",
                            label: this.state.TypeText + " Name",
                            floatLabel: this.props.section.display_name,
                            defaultValue: this.props.section.display_name
                        },
                        {name: "group_number", label: "Group Number", floatLabel: "e.g. 1"},
                        {name: "information", label: "Information", floatLabel: "e.g. Chapter description"},
                        {name: "objectives", label: "Objectives", floatLabel: ""},
                        {name: "category", label: "Category", floatLabel: ""},
                        {name: "total_value", label: "Total Value (hours/points)", floatLabel: "Sum of hours/points"},
                    ]
                    break;
                case 'units':
                    fields = [
                        {
                            name: "display_name",
                            label: this.state.TypeText + " Name",
                            floatLabel: this.props.section.display_name,
                            defaultValue: this.props.section.display_name
                        },
                        {name: "group_number", label: "Sub Group Number", floatLabel: "e.g. 1"},
                        {name: "information", label: "Information", floatLabel: "e.g. Chapter description"},
                        {name: "primary_task", label: "Primary task", floatLabel: "e.g. Task name"},
                        {name: "objectives", label: "Objectives", floatLabel: ""},
                        {name: "standards", label: "Standards", floatLabel: ""},
                        {name: "Attempts", label: "Attempts", floatLabel: ""},
                        {name: "resources", label: "Resources", floatLabel: ""},
                        {name: "total_value", label: "Total Value (hours/points)", floatLabel: "Sum of hours/points"},
                        {name: "competence", label: "Competence", floatLabel: ""},


                    ]
                    extras = skillsheetTypeField
                    break;
                case 'components':
                    fields = [
                        {
                            name: "display_name",
                            label: this.state.TypeText + " Name",
                            floatLabel: this.props.section.display_name,
                            defaultValue: this.props.section.display_name
                        },
                        {name: "group_number", label: "Sub Group Number", floatLabel: "e.g. 1"},
                        {name: "primary_task", label: "Primary task", floatLabel: "e.g. Task name"},
                    ]
                    extras = [
                        componentGradeToggle,
                        componentTypeField,
                        <br/>,
                        <hr/>,
                        <br/>,
                        <UploadMediaSelector title="Upload Media"/>,
                    ];
                    break;
                default:
                    break;
            }
        }
        if (status === "success" && updateSectionResponse !== null) {
            
            var redirectTo = "/courses";
            if (this.courseID !== undefined && this.sectionID !== undefined) {
                redirectTo = "/" + this.props.Type + "/" + this.courseID + "/" + this.sectionID;
            }
            dispatch(sectionActions.clearUpdateSection());
            return (
                <Redirect to={redirectTo}/>
            )
        } else {
            return (
                <div>
                    <div className={"breadcrumbs"}>
                        {fetchingTasktree ?
                            <br/> :
                            <BreadCrumbs tasktree={tasktree} type={this.props.Type} sectionID={this.sectionID}
                                         courseID={this.courseID}/>
                        }

                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {this.isEmpty(this.state.section) ?
                            <br/> :
                            <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                                <h2>Edit {this.state.TypeText}</h2>
                                {this.props.section.display_name ?
                                    <SyncValidationForm
                                        onSubmit={this.handleSubmit}
                                        onCancel={this.handleCancel}
                                        fields={fields


                                        }
                                        extras={extras}
                                    />
                                    :
                                    <br/>}
                            </Paper>
                        }
                    </div>
                </div>
            )
        }
    }


}


function mapStateToProps(state) {
    const {status, updateSectionResponse} = state.updateSection;
    const {fetchingTasktree, tasktree} = state.tasktrees;
    const {section, sectionFetching} = state.section;
    const {alert} = state;

    const {deets} = state.deetss;
    return {
        alert,
        status,
        updateSectionResponse,
        deets,
        fetchingTasktree,
        tasktree,
        section,
        sectionFetching
    };
}

const connectedEditSection = connect(mapStateToProps)(EditSection);
export {connectedEditSection as EditSection};
