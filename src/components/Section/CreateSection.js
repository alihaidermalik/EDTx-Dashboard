import DropDownMenu from 'material-ui/DropDownMenu';
import {MenuItem} from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

import {sectionActions, coursesActions} from '../../actions';
import BreadCrumbs from '../BreadCrumbs';
import SyncValidationForm from '../SyncValidationForm';
import {namingConstants} from '../../constants';
import UploadMediaSelector from './UploadMediaSelector';
import Toggle from 'material-ui/Toggle';

import {GridList, GridTile} from 'material-ui/GridList';


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

class CreateSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sectionName: "",
            category: "html",
            signature: "no",
            submitting: false,
        };
        this.TableRowData = this.TableRowData.bind(this);
        this.state.Type = this.props.Type === undefined ? "Section" : this.props.Type;


    }

    componentWillMount() {
        const {dispatch} = this.props;

        this.courseID = this.props.location.pathname.split('/')[2];
        this.blockID = this.props.location.pathname.split('/')[3];

        const typeToRedirect = () => {
            switch (this.state.Type) {
                case 'sections':
                    return 'courses';
                case 'subsections':
                    return 'sections';
                case 'units':
                    return 'subsections';
                case 'components':
                    return 'units';
                default:
                    return 'courses';
            }
        }
        this.redirectTo = typeToRedirect();

        dispatch(coursesActions.getCourseDetails(this.courseID));
        dispatch(coursesActions.getCourseTasktree(this.courseID));

    }

    handleSubmit = (values) => {

        if (this.state.submitting === false) {
            this.setState({
                submitting: true,
            })
            const {dispatch} = this.props;

            const typeToCategory = () => {
                switch (this.state.Type) {
                    case 'sections':
                        return 'chapter';
                    case 'subsections':
                        return 'sequential';
                    case 'units':
                        return 'vertical';
                    case 'components':
                        return this.state.category;
                    default:
                        return 'chapter';
                }
            }
            var categoryType = typeToCategory();
            var sectionData = {
                parent_locator: this.blockID,
                category: categoryType,
                display_name: values.section_name,
            }
            dispatch(sectionActions.createSection(sectionData));
        }
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    TableRowData = (props) => {
        return (
            <TableRow>
                <TableRowColumn><strong>{props.setting}</strong></TableRowColumn>
                <TableRowColumn>
                    <TextField floatingLabelText={props.value} onChange={props.method}/>
                </TableRowColumn>
            </TableRow>
        )
    };

    handleSectionName = (value) => {
        this.setState({sectionName: value});
    };

    handleSelectChange = (event, index, values) => {
        this.setState({category: values});
    };
    handleSignatureChange = (event, index, values) => {
        this.setState({signature: values});
    };

    render() {
        const {dispatch, status, updateSectionResponse, tasktree, fetchingTasktree} = this.props;
        const typeToText = () => {
            switch (this.state.Type) {
                case 'sections':
                    return namingConstants.SECTION;
                case 'subsections':
                    return namingConstants.SUBSECTION;
                case 'units':
                    return namingConstants.UNITS;
                case 'components':
                    return namingConstants.COMPONENTS
                default:
                    return 'Section';
            }
        }
        //TODO: Greater map all at once
        const typeToBreadcrumbType = () => {
            switch (this.state.Type) {
                case 'subsections':
                    return 'sections';
                case 'units':
                    return 'subsections';
                case 'components':
                    return 'units';
                default:
                    return 'sections';
            }
        }
        const skillsheetTypeField = [(
            <TableRow>
                <TableRowColumn>
                    <strong>Signature Value</strong>
                </TableRowColumn>
                <TableRowColumn>
                    <DropDownMenu styles={{align: "left", "padding-left": "0 !important"}} value={this.state.signature}
                                  onChange={this.handleSignatureChange}>
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
                    <DropDownMenu styles={{align: "left", "padding-left": "0 !important"}} value={this.state.category}
                                  onChange={this.handleSelectChange}>
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
            {name: "section_name", label: typeToText() + " Name", floatLabel: typeToText() + " name"},

        ];
        var extras = [];
        switch (this.props.Type) {

            case 'sections':
                fields = [
                    {name: "section_name", label: typeToText() + " Name", floatLabel: typeToText() + " name"},
                    {name: "group_name", label: "Group Name", floatLabel: "e.g. Basic gestures"},
                    {name: "group_number", label: "Group Number", floatLabel: "e.g. 1"},
                    {name: "information", label: "Information", floatLabel: "e.g. Chapter description"},
                    {name: "objectives", label: "Objectives", floatLabel: ""},
                    {name: "category", label: "Category", floatLabel: ""},
                    {name: "total_value", label: "Total Value (hours/points)", floatLabel: "Sum of hours/points"},
                ]
                break;
            case 'units':
                fields = [
                    {name: "section_name", label: typeToText() + " Name", floatLabel: typeToText() + " name"},
                    {name: "group_name", label: "Sub Group Name", floatLabel: "e.g. Basic gestures"},
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
                    {name: "section_name", label: typeToText() + " Name", floatLabel: typeToText() + " name"},
                    {name: "group_name", label: "Sub Group Name", floatLabel: "e.g. Basic gestures"},
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


        if (status === "success" && updateSectionResponse !== null) {
            
            var redirectTo = "/courses";


            if (this.redirectTo !== undefined && this.courseID !== undefined && this.blockID !== undefined) {

                if (this.state.Type === "sections") {
                    redirectTo = "/" + this.redirectTo + "/" + this.courseID
                } else if (this.state.Type === "components") {
                    redirectTo = "/edit_component/" + this.courseID + "/" + updateSectionResponse.section_url;
                }
                else {
                    redirectTo = "/" + this.redirectTo + "/" + this.courseID + "/" + this.blockID;
                }
            }
            dispatch(sectionActions.clearCreateSection());
            dispatch(sectionActions.clearUpdateSection());

            this.setState({submitting: false})
            return (
                <Redirect to={redirectTo}/>
            )
        } else {
            //TODO: in case of failure
            if (status === "failure") {
                this.setState({submitting: false})
                dispatch(sectionActions.clearCreateSection());
                dispatch(sectionActions.clearUpdateSection());
            }
            return (
                <div>
                    <div className={"breadcrumbs"}>
                        {fetchingTasktree ?
                            <br/> :
                            <BreadCrumbs tasktree={tasktree} type={typeToBreadcrumbType()} sectionID={this.blockID}
                                         courseID={this.courseID}/>
                        }
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <br/>
                        <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                            <h2>Create new {typeToText()}</h2>
                            <SyncValidationForm onSubmit={this.handleSubmit} submitting={this.state.submitting}
                                                onCancel={this.handleCancel} fields={fields} extras={extras}/>
                        </Paper>
                    </div>
                </div>
            )
        }
    }


}

function mapStateToProps(state) {
    const {fetchingDetails, deets} = state.deetss;
    const {fetchingTasktree, tasktree} = state.tasktrees;
    const {status, updateSectionResponse} = state.updateSection;

    const {alert} = state;


    return {
        fetchingDetails,
        fetchingTasktree,
        deets,
        tasktree,
        status,
        updateSectionResponse,
        alert,
    };
}

const connectedCreateSection = connect(mapStateToProps)(CreateSection);
export {connectedCreateSection as CreateSection};

