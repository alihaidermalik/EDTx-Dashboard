/* eslint-disable */
import React, {Component} from 'react';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Tab, Tabs, Image,Table  } from 'react-bootstrap';
import { connect } from 'react-redux';
// import { alertActions } from '../../actions';
import moment from "moment";
import swal from 'sweetalert';
import Pagination from "react-js-pagination";


class UserProfile extends Component {
    constructor(props) {
        super(props);
        let path = window.location.pathname.split("/");
        this.addRoleToUser = this.addRoleToUser.bind(this);
        this.completeCertifcateUser = this.completeCertifcateUser.bind(this);
        this.connectCertifcateUser = this.connectCertifcateUser.bind(this);
        this.goUserArchive = this.goUserArchive.bind(this);
        this.addNewCertificateFile = this.addNewCertificateFile.bind(this);
        this.removeNewCertificateFile = this.removeNewCertificateFile.bind(this);
        this.addCompleteCertificateFile = this.addCompleteCertificateFile.bind(this);
        this.removeCompleteCertificateFile = this.removeCompleteCertificateFile.bind(this);
        this.removeRoleFromUser = this.removeRoleFromUser.bind(this);
        this.removeCertificateFromUser = this.removeCertificateFromUser.bind(this);
        console.log(path);
        this.state = {
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            user_id:path[2],
            name: "",
            email: "",
            country_code : "",
            username : "",
            openConnectRole: false,
            new_roles: "",
            role_id:"",
            default_dropdown_role_name:"Select Role",
            roles_list : "",
            certificate_list : "",
            openCompleteCertificate : false,
            complete_certificate_id : "",
            complete_certificate_user_id : "",
            complete_certificate_accreditor : "",
            complete_certificate_start_date : "",
            complete_certificate_end_date : "",
            complete_certificate_valid_months : "",
            complete_certificate_assessor_id : "",
            complete_certificate_assessor_firstname : "",
            complete_certificate_assessor_lastname : "",
            complete_certificate_comments : "",
            complete_certificate_files : [],
            openConnectCertificate : false ,
            new_certificates : "",
            new_certificate_id : "",
            default_dropdown_certificate_name : "Select Certificate",
            new_certificate_user_id : "",
            new_certificate_accreditor : "",
            new_certificate_start_date : "",
            new_certificate_end_date : "",
            new_certificate_valid_months : "",
            new_certificate_assessor_id : "",
            new_certificate_assessor_firstname : "",
            new_certificate_assessor_lastname : "",
            new_certificate_comments : "",
            new_certificate_files : [],
            user_rows : "",
            temp_rows : "",
            start_date : "",
            roles_list_file : "",
            certificate_list_file : "",
            end_date : "",
            remove_role_id : "",
            default_dropdown_remove_role_name : "Select Role",
            remove_certificate_id : "",
            default_dropdown_remove_certificate_name : "Select Certificate",
            openRemoveRole : false ,
            openRemoveCertificate : false
        };
    }

    componentDidMount() {
        this.getUsersData(this.state.user_id);
        this.getRolesForUser(this.state.user_id);
        this.getCertificatesForUser(this.state.user_id);
        this.getUserRolesList();
        this.getUserCertificateList();
    }

    getUsersData(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_user_profile/"+this.state.user_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ 
                      name: result.user.name,
                      email: result.user.email,
                      country_code: result.user.country_code,
                      image : result.user.profile_picture_url,
                      username : result.user.username,
                      user_rows : result.user_rows,
                      temp_rows : result.user_rows
                    });
                    if(result.roles.length>0){
                      this.setState({ 
                        roles_list: result.roles
                      });
                    }

                    if(result.certificates.length>0){
                        this.setState({
                            certificate_list: result.certificates
                        });
                    }
            },

            (error) => {

            }
        )
    }

    getRolesForUser(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_roles_for_user/"+this.state.user_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.length >0){
                      this.setState({ 
                        new_roles: result
                      });
                    }else{
                      this.setState({ 
                        new_roles: ""
                      });
                    }
                    
            },

            (error) => {

            }
        )
    }

    getCertificatesForUser(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificates_for_user/"+this.state.user_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.length >0){
                      this.setState({ 
                        new_certificates: result
                      });
                    }else{
                      this.setState({ 
                        new_certificates: ""
                      });
                    }
                    
            },

            (error) => {

            }
        )
    }

    goBack = () => {
        this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'users' }});
    }

    openConnectRole = () => {
      this.setState({ openConnectRole: true });
    };

    closeConnectRole = () => {
      this.setState({ openConnectRole: false,role_id: "", start_date: "" });
    };

    openConnectCertificate = () => {
      this.setState({ openConnectCertificate: true });
    };

    closeConnectCertificate = () => {
      this.setState({
          openConnectCertificate: false,
          new_certificate_id: "",
          new_certificate_user_id: "",
          new_certificate_accreditor: "",
          new_certificate_start_date: "",
          new_certificate_end_date: "",
          new_certificate_assessor_id: "",
          new_certificate_assessor_firstname: "",
          new_certificate_assessor_lastname: "",
          new_certificate_comments: ""
      });
    };

    handleChangeRole = (id,name) => {
        this.setState({
            role_id: id,
            default_dropdown_role_name: name
        });
    };

    handleChangeCertificate = (id,name,validMonths) => {
        this.setState({
            new_certificate_id: id,
            default_dropdown_certificate_name: name,
            new_certificate_valid_months: validMonths
        });
    };

    openRemoveRole = () => {
        this.setState({ openRemoveRole: true });
    };

    closeRemoveRole = () => {
        this.setState({ openRemoveRole: false });
    };

    handleChangeRemoveRole = (id,name) => {
        this.setState({
            remove_role_id: id,
            default_dropdown_remove_role_name: name
        });
    };

    openRemoveCertificate = () => {
        this.setState({ openRemoveCertificate: true });
    };

    closeRemoveCertificate = () => {
        this.setState({ openRemoveCertificate: false });
    };

    handleChangeRemoveCertificate = (id,name) => {
        this.setState({
            remove_certificate_id: id,
            default_dropdown_remove_certificate_name: name
        });
    };


    addRoleToUser(){
      var role_ids = [];
      role_ids.push(this.state.role_id);
      const { dispatch } = this.props;
      // dispatch(alertActions.clear());
      if(this.state.role_id =="" || this.state.role_id==null){
          /*dispatch(alertActions.error("Select Role To Be Connected"));
          this.setState({
              openConnectRole: false,
              role_id: ""
          });*/
          swal({
              title: "Error!",
              text: "Select Role To Be Connected!",
              icon: "error",
          });
          return;
      }
      if(this.state.start_date =="" || this.state.start_date==null){
          /*dispatch(alertActions.error("Select Role Start Date"));
          this.setState({
              openConnectRole: false,
              start_date: ""
          });*/
          swal({
              title: "Error!",
              text: "Select Role Start Date!",
              icon: "error",
          });
          return;
      }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_role_user", {
                method: "POST",
                body:JSON.stringify({
                  'role_id': role_ids,
                  'user_id': this.state.user_id,
                  'start_date' : this.state.start_date,
                  'end_date' : this.state.start_date
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ 
                      openConnectRole: false,
                      activePage: 1

                    });
                    this.getUsersData(this.state.user_id);
                    this.getRolesForUser(this.state.user_id);
                    this.getCertificatesForUser(this.state.user_id);
                    swal({
                        title: "Success!",
                        text: "Role Connected Successfully!",
                        icon: "success",
                    });
                    // dispatch(alertActions.success("Role Connected Successfully"));
            },

            (error) => {
                // dispatch(alertActions.error("Unable To Connect Role"));
                swal({
                    title: "Error!",
                    text: "Unable To Connect Role!",
                    icon: "error",
                });
            }
        )
    }

    completeCertifcateUser(){
        const {dispatch} = this.props;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/complete_certificate_user", {
                method: "POST",
                body:JSON.stringify({
                  'id': this.state.complete_certificate_id,
                  'user_certificate_id': this.state.complete_certificate_user_id,
                  'accreditor': this.state.complete_certificate_accreditor,
                  'start_date': this.state.complete_certificate_start_date,
                  'end_date': this.state.complete_certificate_end_date,
                  'assessor_id': this.state.complete_certificate_assessor_id,
                  'assessor_first_name': this.state.complete_certificate_assessor_firstname,
                  'assessor_last_name': this.state.complete_certificate_assessor_lastname,
                  'comments': this.state.complete_certificate_comments,
                  'user_id': this.state.user_id,
                  'files': this.state.complete_certificate_files,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ 
                      name: result.user.name,
                      email: result.user.email,
                      country_code: result.user.country_code,
                      image : result.user.profile_picture_url,
                      username : result.user.username,
                      user_rows : result.user_rows,
                      openCompleteCertificate: false,
                      activePage: 1
                    });

                    if(result.roles.length>0){
                      this.setState({ 
                        roles_list: result.roles
                      });
                    }

                    if(result.certificates.length>0){
                      this.setState({ 
                        certificate_list: result.certificates
                      });
                    }
                    this.getUsersData(this.state.user_id);
                    this.getRolesForUser(this.state.user_id);
                    this.getCertificatesForUser(this.state.user_id);
                    swal({
                        title: "Success!",
                        text: "Certificate Updated Successfully!",
                        icon: "success",
                    });
                    // dispatch(alertActions.success("Certificate Updated Successfully"));
            },

            (error) => {
                this.setState({
                    openCompleteCertificate: false
                });
                // dispatch(alertActions.error("Error While Completing Certificate Status"));
                swal({
                    title: "Error!",
                    text: "Error While Completing Certificate Status!",
                    icon: "error",
                });
            }
        )
    }

    connectCertifcateUser(){
        /*const { dispatch } = this.props;
        dispatch(alertActions.clear());*/
        if(this.state.new_certificate_id =="" || this.state.new_certificate_id==null){
            /*dispatch(alertActions.error("Select Certificate To Be Connected"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Certificate To Be Connected!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_user_id =="" || this.state.new_certificate_user_id==null){
            /*dispatch(alertActions.error("Enter Certificate ID"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Enter Certificate ID!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_accreditor =="" || this.state.new_certificate_accreditor==null){
            /*dispatch(alertActions.error("Enter Certificate Accreditor"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Enter Certificate Accreditor!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_start_date =="" || this.state.new_certificate_start_date==null){
            /*dispatch(alertActions.error("Select Certitficate Start Date"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Certitficate Start Date!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_assessor_id =="" || this.state.new_certificate_assessor_id==null){
            /*dispatch(alertActions.error("Enter Assessor ID"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Enter Assessor ID!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_assessor_firstname =="" || this.state.new_certificate_assessor_firstname==null){
            /*dispatch(alertActions.error("Enter Assessor First Name"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Enter Assessor First Name!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_assessor_lastname =="" || this.state.new_certificate_assessor_lastname==null){
            /*dispatch(alertActions.error("Enter Assessor Last Name"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Enter Assessor Last Name!",
                icon: "error",
            });
            return;
        }
        if(this.state.new_certificate_comments =="" || this.state.new_certificate_comments==null){
            /*dispatch(alertActions.error("Add Comments"));
            this.setState({
                openConnectCertificate: false,
                new_certificate_id: "",
                new_certificate_user_id: "",
                new_certificate_accreditor: "",
                new_certificate_start_date: "",
                new_certificate_assessor_id: "",
                new_certificate_assessor_firstname: "",
                new_certificate_assessor_lastname: "",
                new_certificate_comments: ""
            });*/
            swal({
                title: "Error!",
                text: "Add Comments!",
                icon: "error",
            });
            return;
        }

        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_certificate_user", {
                method: "POST",
                body:JSON.stringify({
                  'certificate_id': this.state.new_certificate_id,
                  'user_certificate_id': this.state.new_certificate_user_id,
                  'accreditor': this.state.new_certificate_accreditor,
                  'start_date': this.state.new_certificate_start_date,
                  'end_date': this.state.new_certificate_end_date,
                  'assessor_id': this.state.new_certificate_assessor_id,
                  'assessor_first_name': this.state.new_certificate_assessor_firstname,
                  'assessor_last_name': this.state.new_certificate_assessor_lastname,
                  'comments': this.state.new_certificate_comments,
                  'user_id': this.state.user_id,
                  'files': this.state.new_certificate_files,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ 
                      name: result.user.name,
                      email: result.user.email,
                      country_code: result.user.country_code,
                      image : result.user.profile_picture_url,
                      username : result.user.username,
                      user_rows : result.user_rows,
                      openConnectCertificate: false,
                      activePage: 1
                    });

                    if(result.roles.length>0){
                      this.setState({ 
                        roles_list: result.roles
                      });
                    }

                    if(result.certificates.length>0){
                      this.setState({ 
                        certificate_list: result.certificates
                      });
                    }
                  this.getUsersData(this.state.user_id);
                  this.getRolesForUser(this.state.user_id);
                  this.getCertificatesForUser(this.state.user_id);
                  // dispatch(alertActions.success("Certificate Connected Successfully"));
                    swal({
                        title: "Success!",
                        text: "Certificate Connected Successfully!",
                        icon: "success",
                    });
            },

            (error) => {
                this.setState({
                    openConnectCertificate: false
                });
                // dispatch(alertActions.error("Unable To Connect Certificate"));
                swal({
                    title: "Error!",
                    text: "Unable To Connect Certificate!",
                    icon: "error",
                });
            }
        )
    }
    getUserRolesList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_user_role_list/"+this.state.user_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ roles_list_file: result });
                },

                (error) => {

                }
            )
    }

    getUserCertificateList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_user_certificate_list/"+this.state.user_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ certificate_list_file: result });
                },

                (error) => {

                }
            )
    }
    removeRoleFromUser(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/remove_role_user", {
            method: "POST",
            body:JSON.stringify({
                'user_id': this.state.user_id,
                'role_id': this.state.remove_role_id
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ openRemoveRole: false });
                },

                (error) => {

                }
            )
    }
    removeCertificateFromUser(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/remove_certificate_user", {
            method: "POST",
            body:JSON.stringify({
                'user_id': this.state.user_id,
                'certificate_id': this.state.remove_certificate_id
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ openRemoveCertificate: false });
                },

                (error) => {

                }
            )
    }

    openCompleteCertificate = (id,name,validMonth) => {
        this.setState({ openCompleteCertificate: true,complete_certificate_name : name ,
            complete_certificate_id : id, complete_certificate_valid_months: validMonth });
      // this.setState({ openCompleteCertificate: true,certificate_name : name , certificate_id : id });
    };

    closeCompleteCertificate = (id) => {
      this.setState({ openCompleteCertificate: false });
    };
    changeCompleteCertificateDates = (startDate) => {
        let endDate = new Date(startDate);
        endDate.setMonth( endDate.getMonth() + parseInt(this.state.complete_certificate_valid_months));
        endDate = moment(endDate).format('MM-DD-YYYY');
        this.setState({
            complete_certificate_start_date: startDate,
            complete_certificate_end_date: endDate
        })
    };
    changeNewCertificateDates = (startDate) => {
        let endDate = new Date(startDate);
        endDate.setMonth( endDate.getMonth() + parseInt(this.state.new_certificate_valid_months));
        endDate = moment(endDate).format('MM-DD-YYYY');
        this.setState({
            new_certificate_start_date: startDate,
            new_certificate_end_date: endDate
        })
    };

    goUserArchive = () => {
        const redirectTo = "/userArchive/"+this.state.user_id;
        this.props.history.push(redirectTo);
    }
    addNewCertificateFile() {
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.new_certificate_files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name: files.files[0].name, file: fileBase64[1]}
                arr.push(data);
                this.setState({
                    new_certificate_files: arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }
    removeNewCertificateFile(name) {
        var data = this.state.new_certificate_files;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == name) {
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            new_certificate_files: data
        });
    }
    addCompleteCertificateFile() {
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.complete_certificate_files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name: files.files[0].name, file: fileBase64[1]}
                arr.push(data);
                this.setState({
                    complete_certificate_files: arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }
    removeCompleteCertificateFile(name) {
        var data = this.state.complete_certificate_files;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == name) {
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            complete_certificate_files: data
        });
    }
    handlePageChange = (pageNumber) => {
        let allRows = this.state.temp_rows;
        let userRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count = 0;
        for(let i=0;i<allRows.length;i++){
            rows_count = rows_count + 1;
            if(rows_count>=startIndex && rows_count<=endIndex){
                userRows.push(allRows[i]);
            }
        }

        this.setState({
            activePage: pageNumber,
            user_rows: userRows
        });
    }
    handlePerPageLimit = (noOfLinesLimit) => {
        let allRows = this.state.temp_rows;
        let userRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count = 0;
        for(let i=0;i<allRows.length;i++){
            rows_count = rows_count + 1;
            if(noOfLinesLimit == 0){
                userRows.push(allRows[i]);
            }
            else{
                if(rows_count>=startIndex && rows_count<=endIndex){
                    userRows.push(allRows[i]);
                }
            }
        }
        if(noOfLinesLimit == 0){  // all lines
            perPageLimit = rows_count;
            default_perPageLimit = "All";
        }
        this.setState({
            default_perPageLimit: default_perPageLimit,
            perPageLimit: perPageLimit,
            activePage: 1,
            user_rows: userRows
        });
    }

    render() {

        return (
            <div style={{width:'98.5%'}}>
                <Row style={{marginTop: '1%',marginLeft: 0, marginBottom: '1%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <h1 style={{margin: '0px auto'}}>
                            USER PROFILE
                        </h1>
                    </Col>
                </Row>
                {/*<Row style={{marginTop: '1%'}}>
                    <Col xs={3} sm={3} md={2} lg={2}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive" style={{borderRadius:0}}><i className="fa fa-arrow-left"></i> Go Back</Button>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}></Col>
                    <Col xs={3} sm={3} md={2} lg={2} style={{textAlign: 'center'}}>
                        <Alert  variant="primary" className="pageHeading">
                            USER PROFILE
                        </Alert>
                    </Col>
                    <Col xs={3} sm={3} md={5} lg={5}></Col>
                </Row>*/}
                <Row style={{marginLeft: 15}}>
                    <Col xs={3} sm={3} md={1} lg={1}>
                        <Image style={{marginLeft: '-18%', width: '100%'}} src={this.state.image} thumbnail />
                    </Col>
                    <Col xs={6} sm={6} md={8} lg={8}>
                        <Form.Label><b>Name :</b> {this.state.name}</Form.Label>
                        <br/>
                        <Form.Label><b>Username :</b> {this.state.username}</Form.Label>
                        <br/>
                        <Form.Label><b>Email :</b> {this.state.email}</Form.Label>
                        <br/>
                        <Form.Label><b>Country :</b> {this.state.country_code}</Form.Label>
                        <br/>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3}>
                        <Button variant="outline-primary" onClick={this.openConnectRole} style={{marginBottom : 10,display:'block',width:190,height:35}}>
                            Connect Role
                        </Button>
                        <Button variant="outline-primary" onClick={this.openConnectCertificate} style={{marginBottom : 10,display:'block',width:190,height:35}}>
                            Connect Certificate
                        </Button>
                        <Button variant="outline-primary" onClick={this.openRemoveRole} style={{marginBottom : 10,display:'block',width:190,height:35}}>
                            Remove Role
                        </Button>
                        <Button variant="outline-primary" onClick={this.openRemoveCertificate} style={{marginBottom : 10,display:'block',width:190,height:35}}>
                            Remove Certificate
                        </Button>
                        <Button variant="outline-primary" style={{marginBottom : 10,display:'block',width:190,height:35}} onClick={this.goUserArchive}>
                            Archive
                        </Button>
                    </Col>
                </Row>

                {/*<br />
                <Divider variant="middle" style={{width: '50%'}}/>
                <br />

                <div style={{width: '87%', marginTop: 10}}>
                  <label> Connected Roles </label>
                  <ul> 
                    {this.state.roles_list ? this.state.roles_list.map(role => (
                        <li><span style={{marginRight : 70}}>{role.name}</span> <span>{role.status==1 && <label>Active</label>} {role.status==0 && <label>Not Active</label>}</span></li> 
                    )):
                      <li> No Role Connected</li>
                    }
                  </ul>
                </div>

                <br />
                <Divider variant="middle" style={{width: '50%'}}/>
                <br />

                <div style={{width: '87%', marginTop: 10}}>
                  <label> Connected Certificates </label>
                  <ul> 
                    {this.state.certificate_list ? this.state.certificate_list.map(certificate => (
                        <li style={{marginTop : 15}}>
                          <span style={{marginRight : 30}}>{certificate.name}</span> 
                          {!certificate.status&& <Button variant="outlined" color="primary" onClick={() => this.openCompleteCertificate(certificate.id,certificate.name)}>
                            Complete Certificate
                          </Button>}

                        </li> 
                    )):
                      <li> No Certificates Connected</li>
                    }
                  </ul>
                </div>*/}

                <br />
                {/*<hr style={{width: '97%'}}/>
                <br />*/}
                <div style={{marginLeft:"1%", width: '99.5%'}}>
                    {this.state.temp_rows.length > 10 ?
                        <Row style={{marginTop: 15, justifyContent: 'flex-end', margin: 0, marginRight: 2, marginBottom: 10}}>
                            <Dropdown style={{marginTop: 0, width: '15%'}}>
                                <Dropdown.Toggle>
                                    {this.state.default_perPageLimit}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item value="10" onClick={(lines) => {
                                        this.handlePerPageLimit(10)
                                    }}>10</Dropdown.Item>
                                    <Dropdown.Item value="20" onClick={(lines) => {
                                        this.handlePerPageLimit(20)
                                    }}>20</Dropdown.Item>
                                    <Dropdown.Item value="30" onClick={(lines) => {
                                        this.handlePerPageLimit(30)
                                    }}>30</Dropdown.Item>
                                    <Dropdown.Item value="40" onClick={(lines) => {
                                        this.handlePerPageLimit(40)
                                    }}>40</Dropdown.Item>
                                    <Dropdown.Item value="50" onClick={(lines) => {
                                        this.handlePerPageLimit(50)
                                    }}>50</Dropdown.Item>
                                    <Dropdown.Item value="all" onClick={(lines) => {
                                        this.handlePerPageLimit(0)
                                    }}>All</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </Row> :
                        ''
                    }
                    <Table striped hover size="sm" bordered>
                        <thead>
                          <tr>
                            {/*<th style={{width:'3%', paddingLeft: '1%', paddingTop: '0.5%'}}><input type="checkbox"/></th>*/}
                            <th style={{width:'10%',padding: '1%',textAlign: 'left', paddingLeft: '0.5%'}}>ID</th>
                            <th style={{width:'15%'}}>Name</th>
                            <th style={{width:'10%'}}>Roles</th>
                            <th style={{width:'10%'}}>Roles Status</th>
                            <th style={{width:'15%'}}>Certificates</th>
                            <th style={{width:'10%'}}>Certificates Status</th>
                            <th style={{width:'10%'}}>Action</th>
                            <th style={{width:'20%'}}>Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                                {this.state.user_rows ? this.state.user_rows.map(user_row => (
                                     <tr>
                                          {/*<td style={{paddingLeft: '1%', paddingTop: '0.5%'}}>
                                            {user_row.checkbox && <input type="checkbox" />}
                                          </td>*/}
                                          <td style={{textAlign: 'left'}}>{user_row.id}</td>
                                          <td>{user_row.name}</td>
                                          <td>{user_row.role}</td>
                                          {user_row.role_status =="" && <td>{user_row.role_status}</td>}
                                          {user_row.role_status =="Active" && <td style={{background:'#66BB6A'}}>{user_row.role_status}</td>}
                                          {user_row.role_status =="Not Active" && <td style={{background:'#EF5350'}}>{user_row.role_status}</td>}
                                          {user_row.certificate!=""&&
                                          <td>
                                              <ul style={{textAlign: 'left',margin: 0}}>
                                                  <li>{user_row.certificate}</li>
                                              </ul>
                                          </td>}
                                          {user_row.certificate==""&&<td>{user_row.certificate}</td>}
                                          {user_row.certificate_status =="" && <td>{user_row.certificate_status}</td>}
                                          {user_row.certificate_status =="Yes" && <td style={{background:'#66BB6A'}}>{user_row.certificate_status}</td>}
                                          {user_row.certificate_status =="No" && <td style={{background:'#EF5350'}}>{user_row.certificate_status}</td>}

                                          {user_row.certificate_action =="" && <td>{user_row.certificate_action}</td>}
                                          {user_row.certificate_action =="None" && <td style={{background:'#66BB6A'}}>{user_row.certificate_action}</td>}
                                          {user_row.certificate_action =="Incomplete" && <td style={{background:'#FFCA28'}}><a style={{cursor: 'pointer'}}
                                               onClick={() => this.openCompleteCertificate(user_row.certificate_id,user_row.certificate,user_row.valid_months)}>{user_row.certificate_action}</a>
                                            </td>
                                          }
                                         {user_row.certificate_action =="Expire Soon" && <td style={{background:'#9500c6'}}>{user_row.certificate_action}</td>}
                                         {user_row.certificate_action =="Expired" && <td style={{background:'#EF5350'}}>{user_row.certificate_action}</td>}

                                         <td>{user_row.comments}</td>
                                    </tr>
                                )) :
                                ''
                                }
                        </tbody>
                    </Table>

                    {this.state.temp_rows.length > this.state.perPageLimit ?
                        <div style={{float: 'right'}}>
                            <Pagination
                                prevPageText=' < '
                                nextPageText=' > '
                                firstPageText='First'
                                lastPageText='Last'
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.state.perPageLimit}
                                totalItemsCount={this.state.temp_rows.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                                breakClassName={'break-me'}
                                marginPagesDisplayed={2}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            />
                        </div> :
                        ''
                    }
                </div>


                {/* CONNECT ROLE MODAL*/}
                <Modal show={this.state.openConnectRole} onHide={this.closeConnectRole}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_role_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.new_roles ? this.state.new_roles.map(role => (
                                                    <Dropdown.Item value={role.id} onClick={(id,name) => {this.handleChangeRole(role.id,role.name)}}>{role.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Roles</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date"
                                                  onChange={(event) => this.setState({start_date: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                            {/*<Row>
                                <Form.Group as={Col}>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date"
                                                  onChange={(event) => this.setState({end_date: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>*/}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectRole}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addRoleToUser} style={{marginLeft: 5}}>
                                    Connect
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* COMPLETE CERTIFICATE MODAL*/}
                <Modal show={this.state.openCompleteCertificate} onHide={this.closeCompleteCertificate}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Complete Certificate: &nbsp;<span style={{fontWeight: 'normal'}}>{this.state.complete_certificate_name}</span></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Personal Certificate ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate ID"
                                                      onChange={(event) => this.setState({complete_certificate_user_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Personal Certificate Accreditor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                      onChange={(event) => this.setState({complete_certificate_accreditor: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date"
                                                      onChange={(event) => this.changeCompleteCertificateDates(event.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Valid Months</Form.Label>
                                        <Form.Control type="text" value={this.state.complete_certificate_valid_months} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="text" value={this.state.complete_certificate_end_date} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Assessor ID"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor First Name"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_firstname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor Last Name"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_lastname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Comments</Form.Label>
                                        <Form.Control as="textarea" ref="complete_certificate_comments" rows="3" className="textArea" placeholder="Enter Comments"
                                                      onChange={(event) => this.setState({complete_certificate_comments: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Row style={{marginLeft: 0}}>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group className="addNewExternalCourceBtn">
                                            <input type="file" id="files" onChange={this.addCompleteCertificateFile} style={{float : 'right'}}/>
                                        </Form.Group>
                                        {this.state.complete_certificate_files ?  this.state.complete_certificate_files.map(file => (
                                                <span>
                                                <Col xs={2} sm={2} md={2} lg={2} className="displayInlineBlock">
                                                    <label className="textOut">{file.name} </label>
                                                </Col>
                                                <Col xs={1} sm={1} md={1} lg={1} className="displayInlineBlock">
                                                    <Button className="btn removeFileBtn deleteBtn" onClick={() => this.removeCompleteCertificateFile(file.name)}><i className="fa fa-trash"></i></Button>
                                                </Col>
                                               <br/>
                                        </span>
                                            )):
                                            <label> No Files Selected</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeCompleteCertificate}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.completeCertifcateUser} style={{marginLeft: 5}}>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* CONNECT CERTIFICATE MODAL*/}
                <Modal show={this.state.openConnectCertificate} onHide={this.closeConnectCertificate}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Dropdown className="addNewArchiveModalDropDowns">
                                            <Dropdown.Toggle>
                                                {this.state.default_dropdown_certificate_name}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="customScrollToDropDowns">
                                                {this.state.new_certificates ? this.state.new_certificates.map(certificate => (
                                                        <Dropdown.Item value={certificate.id} onClick={(id,name,validMonths) => {this.handleChangeCertificate(certificate.id,certificate.name,certificate.valid_months)}}>{certificate.name}</Dropdown.Item>
                                                    ))

                                                    :
                                                    <Dropdown.Item value="">No New Certificate</Dropdown.Item>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Certificate ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate ID"
                                                      onChange={(event) => this.setState({new_certificate_user_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Certificate Accreditor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                      onChange={(event) => this.setState({new_certificate_accreditor: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date"
                                                      onChange={(event) => this.changeNewCertificateDates(event.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Valid Months</Form.Label>
                                        <Form.Control type="text" value={this.state.new_certificate_valid_months} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="text" value={this.state.new_certificate_end_date} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Assessor ID"
                                                      onChange={(event) => this.setState({new_certificate_assessor_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor First Name"
                                                      onChange={(event) => this.setState({new_certificate_assessor_firstname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor Last Name"
                                                      onChange={(event) => this.setState({new_certificate_assessor_lastname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Comments</Form.Label>
                                        <Form.Control as="textarea" ref="complete_certificate_comments" rows="3" className="textArea" placeholder="Enter Comments"
                                                      onChange={(event) => this.setState({new_certificate_comments: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Row style={{marginLeft: 0}}>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group className="addNewExternalCourceBtn">
                                            <input type="file" id="files" onChange={this.addNewCertificateFile} style={{float : 'right'}}/>
                                        </Form.Group>
                                        {this.state.new_certificate_files ?  this.state.new_certificate_files.map(file => (
                                                <span>
                                                <Col xs={2} sm={2} md={2} lg={2} className="displayInlineBlock">
                                                    <label className="textOut">{file.name} </label>
                                                </Col>
                                                <Col xs={1} sm={1} md={1} lg={1} className="displayInlineBlock">
                                                    <Button className="btn removeFileBtn deleteBtn" onClick={() => this.removeNewCertificateFile(file.name)}><i className="fa fa-trash"></i></Button>
                                                </Col>
                                               <br/>
                                        </span>
                                            )):
                                            <label> No Files Selected</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectCertificate}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.connectCertifcateUser} style={{marginLeft: 5}}>
                                    Connect
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* REMOVE ROLE MODAL*/}
                <Modal show={this.state.openRemoveRole} onHide={this.closeRemoveRole}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_remove_role_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.roles_list_file ? this.state.roles_list_file.map(role => (
                                                    <Dropdown.Item value={role.id} onClick={(id,name) => {this.handleChangeRemoveRole(role.id,role.name)}}>{role.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Roles</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeRemoveRole}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.removeRoleFromUser} style={{marginLeft: 5}}>
                                    Remove
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* REMOVE CERTIFICATE MODAL*/}
                <Modal show={this.state.openRemoveCertificate} onHide={this.closeRemoveCertificate}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_remove_certificate_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.certificate_list_file ? this.state.certificate_list_file.map(certificate => (
                                                    <Dropdown.Item value={certificate.id} onClick={(id,name) => {this.handleChangeRemoveCertificate(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Roles</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeRemoveCertificate}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.removeCertificateFromUser} style={{marginLeft: 5}}>
                                    Remove
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

               {/*<a href={"/addRole/"+this.state.user_id}>Add Role</a>
               <a href={"/addCertificate/"+this.state.user_id}>Add Certificate</a>*/}
              
            </div>
        )
    }

}
function mapStateToProps(state) {
    const {filterationObj} = state.filteration;
    return {
        filterationObj
    };
}

export default connect(mapStateToProps) (UserProfile);

// export default UserProfile;
