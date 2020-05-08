/* eslint-disable */
import Paper from 'material-ui/Paper';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink, withRouter} from 'react-router-dom';
import CertificateSelectionView from './CertificateSelectionView'


class Certificate extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {};
    }

    componentDidMount() {
        this.getStudentList();
        this.getCoursesList();
        
    }

    getStudentList(){
        let user = JSON.parse(localStorage.getItem('user'));
        var authHeader = "Token " + user["access_token"];
        fetch(process.env.REACT_APP_API_URL + "/api/courses/students", {
                method: "GET",
                headers: {
                    "X-Authorization": authHeader
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.add_users(result)
            },

            (error) => {

            }
        )
    }

    add_users(data){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({data})
            })
            .then(res => res.json())
            .then(
                (result) => {

            },

            (error) => {

            }
        )
    }

    getCoursesList(){
        let user = JSON.parse(localStorage.getItem('user'));
        var authHeader = "Token " + user["access_token"];
        fetch(process.env.REACT_APP_API_URL + "/api/courses/list", {
                method: "GET",
                headers: {
                    "X-Authorization": authHeader
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.add_internal_courses(result)
            },

            (error) => {

            }
        )
    }

    add_internal_courses(data){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_internal_courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({data})
            })
            .then(res => res.json())
            .then(
                (result) => {

            },

            (error) => {

            }
        )
    }
    
    render() {

        return (
            <div>
                <CertificateSelectionView props={this.props} />
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {fetching, quest} = state.questDetails;

    return {
        fetching,
        quest,
    };
}

const connectedCertificate = connect(mapStateToProps)(Certificate);
const CertificateRouter = withRouter(connectedCertificate);

export {CertificateRouter as Certificate};
