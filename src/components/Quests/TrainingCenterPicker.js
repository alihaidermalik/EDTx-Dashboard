import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import { trainingCenterActions } from '../../actions/training_center.actions';
import {Card, CardText,CardMedia,CardHeader} from 'material-ui/Card';
const styles = {
    menuItem: {
        width: "100%"
    },
    DropDownMenu: {
        display: 'flex',
        width: "100%",
        alignContent: 'center',
        alignItems: 'center'
    },
    chip: {
        margin: 4
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap'
    }
}
class TrainingCenterPicker extends React.Component {
    state = {
        open: true,
        value: 1,
        values: [],
        currentTrainingCenterData: null,
        currentTrainingCenterResources: [],
        expanded: false,
    };
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(trainingCenterActions.getTrainingCenters());
    }
    componentWillReceiveProps(nextProps) {
        //If the user leaves the training center tab and comes back the component needs to reload the center resources into state
        if (nextProps.selectedTrainingCenter !== 1) {
            this.loadTrainingCenterResources(nextProps.selectedTrainingCenter)
        }
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleChangeTrainingCenter = (event, index, value) => {
        this.props.handleChangeTrainingCenter(value);
        this.loadTrainingCenterResources(value)
    }
    loadTrainingCenterResources = (value) => {
        if (value !== 1) {
            let trainingCenterElement = this.props.trainingCenters.find((i) => i.id === value)
            if (!!trainingCenterElement) {
                this.setState({
                    currentTrainingCenterData: trainingCenterElement,
                    currentTrainingCenterResources: trainingCenterElement.resources
                })
            }
        }
    }
    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
      };
    renderCurrentTaskCenterData(){
        const title = this.state.currentTrainingCenterData ? this.state.currentTrainingCenterData.name : "Training Center Title";
        const subtitle = this.state.currentTrainingCenterData ? this.state.currentTrainingCenterData.address : "Subtitle"
        const image = this.state.currentTrainingCenterData ? this.state.currentTrainingCenterData.cover : "";
        const descript = this.state.currentTrainingCenterData ? this.state.currentTrainingCenterData.desc : "Description"
        return(
            <Card
            expanded={this.state.expanded}
            showExpandableButton={true}
             onExpandChange={this.handleExpandChange}>
            <CardHeader
                    title={title}
                    subtitle={subtitle}
                    actAsExpander={true}
                    showExpandableButton={true}
                    />
                 <CardMedia
                 expandable={true}
                 mediaStyle={{maxWidth: "25%", maxHeight: "25%", paddingLeft: 15}}
                >
                <img src={image} alt="" />
                </CardMedia>
                <CardText
                expandable={true}
                >
                {descript}
                </CardText>
            </Card>
        )
    }
    renderListItems() {
        return this.state.currentTrainingCenterResources.map((resource, i) => (
            <ListItem
                key={i}
                leftCheckbox={
                    <Checkbox
                        onCheck={(evt, checked) => {
                            this.props.handleChange(evt, checked, resource);
                            this.forceUpdate()
                        }}
                        defaultChecked={this.props.selectedResources && this.props.selectedResources.find((e) => e.id === resource.id)}
                    />
                }
                primaryText={resource.facilitie.name}
                // secondaryText={"Price: " + resource.price}
            />
        ));
    }
    renderResourceChip(resource) {
        return (
            <Chip
                key={resource.id}
                onRequestDelete={() => {
                    this.props.handleChip(resource)
                    this.forceUpdate()
                }}
                style={styles.chip}
            >
                {resource.facilitie.name}
            </Chip>
        );
    }
    render() {
        const { trainingCenters, fetching } = this.props;
        return [
            fetching ?
                <CircularProgress size={60} thickness={7} />
                :
                <DropDownMenu
                    value={this.props.selectedTrainingCenter}
                    onChange={this.handleChangeTrainingCenter}
                    style={styles.DropDownMenu}
                    autoWidth={false}
                >
                    <MenuItem style={styles.menuItem} disabled={true} value={1} primaryText={"Select Training Center"} />
                    {trainingCenters.map((training_center, i) => (
                        <MenuItem
                            key={training_center.id + "-" + i}
                            style={styles.menuItem}
                            value={training_center.id}
                            primaryText={training_center.name} />
                    ))
                    }
                </DropDownMenu>,
            <br />,
            <List>
                {!this.isEmpty(this.props.selectedResources)
                    ?
                    <div style={styles.wrapper}>
                        <span className="pagination-span">Chosen resources: </span>
                        {this.props.selectedResources.map(this.renderResourceChip, this)}
                    </div>
                    : null
                }
                {fetching
                    ?
                    <CircularProgress size={60} thickness={7} />
                    :
                    this.props.selectedTrainingCenter !== 1 ?
                    <div>
                        <Subheader key="subheader">Description</Subheader>
                        {this.renderCurrentTaskCenterData()}
                    </div>
                    : null}
                    {this.props.selectedTrainingCenter !== 1 &&  this.state.currentTrainingCenterResources.length > 0
                        ?
                        [
                            <Subheader key="subheader">Select Sublocations</Subheader>,
                            this.renderListItems()
                        ]
                        :
                        <Subheader>No sublocations on current training center.</Subheader>
                }
            </List>,
        ]
    }
}
function mapStateToProps(state) {
    const { trainingCenters, fetching } = state.trainingCenter;
    return {
        trainingCenters,
        fetching
    };
}
const connectedTrainingCenterPicker = connect(mapStateToProps)(TrainingCenterPicker);
const connectedTrainingCenterPickerWithRouter = withRouter(connectedTrainingCenterPicker);
export { connectedTrainingCenterPickerWithRouter as TrainingCenterPicker };