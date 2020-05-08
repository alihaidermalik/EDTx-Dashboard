import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { trainingCenterActions } from '../../actions/training_center.actions';
const styles = {
    menuItem: {
        width: "100%",
        fontSize: "0.8em"
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
class TrainingCenterDropDown extends React.Component {
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
            // this.loadTrainingCenterResources(nextProps.selectedTrainingCenter)
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


    render() {
        const { trainingCenters, fetching } = this.props;
        const renderAssets = [
            // this.state.currentTrainingCenterResources.map((resource, i) => (
            //     <ListItem
            //         key={i}
            //         leftCheckbox={
            //             <Checkbox
            //                 onCheck={(evt, checked) => {
            //                     this.props.handleChange(evt, checked, resource);
            //                     this.forceUpdate()
            //                 }}
            //                 defaultChecked={this.props.selectedResources && this.props.selectedResources.find((e) => e.id === resource.id)}
            //             />
            //         }
            //         primaryText={resource.facilitie.name}
            //         secondaryText={"Price: " + resource.price}
            //     />
            <DropDownMenu
                value={this.props.selectedAsset}
                onChange={this.props.handleChangeAsset}
                style={styles.DropDownMenu}
                autoWidth={false}
                disabled={this.props.disabled}
            >
                <MenuItem style={styles.menuItem} disabled={true} value={1} primaryText={"Filter on Asset"} />
                {this.state.currentTrainingCenterResources.map((resource, i) => (
                    <MenuItem
                        key={resource.id + "-" + i}
                        style={styles.menuItem}
                        value={resource.id}
                        primaryText={resource.facilitie ? resource.facilitie.name : ""}
                    />
                ))
                }
            </DropDownMenu>

        ]
        return [
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    {fetching ?
                        <CircularProgress size={60} thickness={7} />
                        :
                        <DropDownMenu
                            value={this.props.selectedTrainingCenter}
                            onChange={this.handleChangeTrainingCenter}
                            style={styles.DropDownMenu}
                            autoWidth={false}
                            disabled={this.props.disabled}
                        >
                            <MenuItem style={styles.menuItem} disabled={true} value={1} primaryText={"Filter on Training Center"} />
                            {trainingCenters.map((training_center, i) => (
                                <MenuItem
                                    key={training_center.id + "-" + i}
                                    style={styles.menuItem}
                                    value={training_center.id}
                                    primaryText={training_center.name}
                                />
                            ))
                            }
                        </DropDownMenu>
                    }
                </div>
                <div style={{ flex: 1 }}>
                    {
                        this.props.selectedTrainingCenter !== 1 && this.state.currentTrainingCenterResources.length > 0 ?
                            renderAssets
                            :
                            null

                    }
                </div>
            </div>
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
const connectedTrainingCenterDropDown = connect(mapStateToProps)(TrainingCenterDropDown);
const connectedTrainingCenterDropDownWithRouter = withRouter(connectedTrainingCenterDropDown);
export { connectedTrainingCenterDropDownWithRouter as TrainingCenterDropDown };