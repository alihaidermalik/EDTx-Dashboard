import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import { Divider } from 'material-ui';

import CohortListItemComponent from './CohortListItemComponent';
const styles = {
    insetListItem: {
        marginLeft: "50px"
    },
    tooltipContainer: {
        height: 200,
        width: 200,
        fontSize: 10,
        lineHeight: "1.6"
    },
    tooltipText: {

        whiteSpace: "initial",
    },
    tooltipAvatar: {
        marginTop: 10
    },
    selectAll: {
        color: "rgba(0, 0, 0, 0.54)",
        marginLeft: "50px"
    }
}
export class Pagination extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            currentPage: null,
            pageCount: null
        }
    }
    componentWillMount() {
        const startingPage = this.props.startingPage
            ? this.props.startingPage
            : 1;
        const data = this.props.data;
        const pageSize = this.props.pageSize;
        let pageCount = parseInt(data.length / pageSize, 10);
        if (data.length % pageSize > 0) {
            pageCount++;
        }
        this.setState({
            currentPage: startingPage,
            pageCount: pageCount
        });
    }
    setCurrentPage(num) {
        this.setState({ currentPage: num });
    }
    createControls() {
        let controls = [];
        const pageCount = this.state.pageCount;
        for (let i = 1; i <= pageCount; i++) {
            const baseClassName = 'pagination-controls__button';
            const activeClassName = i === this.state.currentPage ? `${baseClassName}--active` : '';
            controls.push(
                <div
                    key={i}
                    className={`${baseClassName} ${activeClassName}`}
                    onClick={() => this.setCurrentPage(i)}
                >
                    {i}
                </div>
            );
        }
        return controls;
    }
    createPaginatedData() {
        const data = this.props.data;
        if (data !== undefined && data instanceof Array) {
            const pageSize = this.props.pageSize;
            const currentPage = this.state.currentPage;
            const upperLimit = currentPage * pageSize;
            const dataSlice = data.slice((upperLimit - pageSize), upperLimit);
            return dataSlice;
        } else {
            return []
        }
    }
    render() {
        return (
            <div className='pagination'>
                <div className='pagination-results'>
                    {React.cloneElement(this.props.children, { data: this.createPaginatedData() })}
                </div>
                <br />
                <div className='pagination-controls'>
                    {/*<span className="pagination-span">Page: </span> {this.createControls()}*/}
                </div>
            </div>
        );
    }
}
Pagination.defaultProps = {
    pageSize: 10,
    startingPage: 1
};
export class PaginationListItems extends React.Component {
    render() {
        const data = this.props.data;
        // const iconButtonElement = (cohort) => (
        //     <IconButton
        //         touch={true}
        //         tooltip={
        //             <div style={styles.tooltipContainer}>
        //                 <div style={styles.tooltipAvatar}><Avatar src={cohort.profile_image.image_url_small} /></div>
        //                 <div>Info on {cohort.first_name + " " + cohort.last_name}</div>
        //                 <div><span>Email: </span><span>{cohort.email}</span></div>
        //                 <div><span>ID: </span><span>{cohort.id}</span></div>
        //                 <div><span>Country: </span><span>{cohort.country}</span></div>
        //                 <div><span>Year of birth: </span><span>{cohort.year_of_birth}</span></div>
        //                 <div style={styles.tooltipText}><span>Enrolled in courses: </span><span>{cohort.courses.map((c) => { return c.course_details.course_name }).toString()}</span></div>
        //                 <div style={styles.tooltipText}><span>Part of cohorts: </span><span>{cohort.cohorts.map((c) => { return c.name }).toString()}</span></div>
        //             </div>
        //         }
        //         tooltipPosition="top-left"
        //     >
        //         <ActionInfo color={grey400} />
        //     </IconButton>
        // );
        return (
            [
                <ListItem
                    key={"select-all"}
                    leftCheckbox={
                        <Checkbox
                            onCheck={(evt, checked) => {


                                this.props.handleSelectAllCohorts(evt, checked);
                            }}

                        />
                    }
                    primaryText={<div style={styles.selectAll}>Select All</div>}
                />,
                <Divider />,
                data.map((cohort) => (
                    <ListItem
                        leftCheckbox={
                            <Checkbox
                                style={{ paddingTop: 20 }}
                                onCheck={(evt, checked) => {
                                    this.props.handleChangeCohortCheckbox(evt, checked, cohort);
                                }}
                                defaultChecked={this.props.selectedCohorts && this.props.selectedCohorts.map((e) => {
                                    return e.id
                                }).indexOf(cohort.id) > -1}
                            />
                        }                       
                    >

                        <CohortListItemComponent cohort={cohort}
                            value={this.props.selectedCohorts && this.props.selectedCohorts.map((e) => {
                                return e.id
                            }).indexOf(cohort.id) > -1} onCheck={this.props.handleChangeCohortCheckbox}

                        />
                    </ListItem>
                    // <ListItem
                    //     key={cohort.name}
                    //     leftAvatar={
                    //         <Avatar
                    //             src={cohort.profile_image.image_url_small}
                    //             style={styles.insetListItem}
                    //         />
                    //     }
                    //     rightIcon={iconButtonElement(cohort)}
                    //     leftCheckbox={
                    //         <Checkbox
                    //             onCheck={(evt, checked) => {
                    //                 this.props.handleChangeCohortCheckbox(evt, checked, cohort);
                    //             }}
                    //             defaultChecked={this.props.selectedCohorts && this.props.selectedCohorts.map((e) => {
                    //                 return e.id
                    //             }).indexOf(cohort.id) > -1}
                    //         />
                    //     }
                    //     primaryText={<div style={styles.insetListItem}>{cohort.first_name + " " + cohort.last_name}</div>}
                    //     secondaryText={<div style={styles.insetListItem}>{"Username: " + cohort.name + " ID: " + cohort.id}</div>}
                    // />

                ))
            ]
        )
    }
}