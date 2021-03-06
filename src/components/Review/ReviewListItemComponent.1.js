import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import React from 'react';
import { withRouter } from 'react-router-dom';
import DeleteIcon from "material-ui/svg-icons/action/delete";
import { connect } from "react-redux";

import DeleteDialog from '../DeleteDialog'
import { questsActions } from '../../actions';

class ReviewListItemComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			deleteOpen: false
		};
	}

	componentWillReceiveProps(nextProps) {
        
        if (nextProps.status === 'success'){
            this.props.dispatch(questsActions.getQuests(this.props.id));
        }

	}

	handleOpen = event => {
		event.stopPropagation();

		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleRedirect = () => {
		const { history } = this.props;
		const { redirectTo } = this.props;
		history.push(redirectTo);
	};

	handleEditRedirect = () => {
		const { history, questID, editRedirectTo } = this.props;

		var editRedirect =
			editRedirectTo !== undefined
				? editRedirectTo
				: "/edit_quest/" + questID;

		history.push(editRedirect);
	};

	handleToggleDelete = () => {
		this.setState({
			deleteOpen: !this.state.deleteOpen
		});
	};

	handleDelete = () => {
		this.props.dispatch(
			questsActions.deleteQuest(this.props.questID)
		);
	};

	render() {
		const { quest } = this.props;
		
		return [
			quest ? (
				[
					!this.state.open ? (
						<GridTile
							key={quest.id}
							title={[
								quest.cohort ? quest.cohort.name.replace(' Cohort', '').trim() :
								"Activity ID: " + quest.id,
								<span className="quest-subtitle">
									({
										quest.date + " - " + quest.end_date
									})
								</span>
							]}
							//subtitle={<span className='quest-subtitle'>({quest.location})</span>}
							onClick={this.handleRedirect}
							style={{
								backgroundColor: "#414141"
							}}			
							titleBackground={"#414141"}	
										actionIcon={
								<IconButton
									onClick={this.handleOpen}
								>
									<MoreVertIcon color="white" />
								</IconButton>
							}
							color="black"
						/>
					) : (
						<GridList
							key={quest.id}
							cellHeight={50}
							style={{
								width: "100%",
								overflowY: "auto",
								backgroundColor: "#364D7C"
							}}
							cols={4}
						>
							<GridTile
								key={quest.id}
								title={quest.cohort ? quest.cohort.name.replace(' Cohort', '').trim() :
								"Activity ID: " + quest.id}
								onClick={this.handleRedirect}
								
							/>
							<GridTile
								title={"Edit"}
								actionIcon={
									<IconButton>
										<EditIcon color="white" />
									</IconButton>
								}
								style={{
									textAlign:"center"
								}}
								onClick={this.handleEditRedirect}
								className="edit-questitem"
							/>
							<DeleteDialog
								deleteAction={this.handleDelete}
								//getAction={questsActions.getQuests}
								color="white"
								id={quest.id}
								redirect={""}
								className="delete-questbtn"
								style={{
									backgroundColor:"rgba(0, 0, 0, 0.4)"
								}}
							>
								<h3>Delete</h3>
								<DeleteIcon
									color="white"
									style={{
										height: "30px",
										width: "30px"
									}}
								/>
							</DeleteDialog>

							<GridTile
								title={"Close"}
								onClick={this.handleClose}
								actionIcon={
									<IconButton
										onClick={this.handleClose}
									>
										<NavigationClose color="white" />
									</IconButton>
								}
								style={{
									textAlign:
										"center"
								}}
								className="close-questitem"
							/>
						</GridList>
					)
				]
			) : (
				<br />
			)
		];
	}
}

const mapStateToProps = (state) => state.deleteQuest;

const connectedReviewListItemComponent = connect(mapStateToProps)(ReviewListItemComponent);
const ListItemRouter = withRouter(connectedReviewListItemComponent);

export {ListItemRouter as ReviewListItemComponent };