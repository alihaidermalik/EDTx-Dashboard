/* eslint-disable */
import React, {Component} from 'react';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Table, Modal,Tab, Tabs, Image  } from 'react-bootstrap';
import moment from 'moment';
import Pagination from "react-js-pagination";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import GoogleDocsViewer from 'react-google-docs-viewer';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import swal from 'sweetalert';

import Downloader from 'js-file-downloader';
import printJS from 'print-js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import './userArchive.style.css';


const Api2Pdf = require('api2pdf');
const a2pClient = new Api2Pdf('100132f5-688e-4ed0-8ece-4379c9de1dc5');
const async = require('async');

class UserArchive extends Component {
    constructor(props) {
        super(props);
        let path = window.location.pathname.split("/");
        this.addRoleToUser = this.addRoleToUser.bind(this);
        this.completeCertifcateUser = this.completeCertifcateUser.bind(this);
        this.uploadUserFile = this.uploadUserFile.bind(this);
        this.goUserArchive = this.goUserArchive.bind(this);
        this.addCategory = this.addCategory.bind(this);
        console.log(path);
        this.state = {
            validated: false,
            column: '',
            isDesc: false,
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            active_tab: 1,
            user_id:path[2],
            name: "",
            email: "",
            country_code : "",
            username : "",
            file_name : "",
            openUploadDocument : false ,
            openAddCategory : false,
            add_file_category : "",
            category_list : "",
            category : "",
            categoryId : "",
            default_dropdown_category : "Select Category",
            related_to : "",
            default_dropdown_related_to : "Select Related To",
            role : "",
            roles_list_file : "",
            certificate_list_file : "",
            certificate : "",
            default_dropdown_certificate : "Select Certificate",
            file : "",
            upload_file_name : "",
            openSuccessPopup : false,
            message_success : "File has been uploaded successfully.",

            default_dropdown_folder : "Select Folder",
            default_dropdown_sub_folder : "Select Sub Folder",
            folders_list : [],
            sub_folders_list : [],
            folder_id : -1,
            sub_folder_id : -1,
            folder_name : "",
            sub_folder_name : "",
            new_folder_name : "",
            new_sub_folder_name : "",
            add_new_folder_modal : false,
            add_new_sub_folder_modal : false,

            openConnectRole: false,
            new_roles: "",
            role_id:"",
            default_dropdown_role:"Select Role",
            roles_list : "",
            certificate_list : "",
            openCompleteCertificate : false,
            certificate_name : "",
            certificate_id : "",
            complete_certificate_user_id : "",
            complete_certificate_valid_time : "",
            complete_certificate_accreditor : "",
            complete_certificate_training_minimum : "",
            complete_certificate_expiration_notice : "",
            
            new_certificates : "",
            new_certificate_id : "",
            new_certificate_user_id : "",
            new_certificate_valid_time : "",
            new_certificate_accreditor : "",
            new_certificate_training_minimum : "",
            new_certificate_expiration_notice : "",
            user_rows : "",
            start_date : "",
            end_date : "",
            archive_rows: [],
            temp_archive_rows: [],
            certificate_rows: [],
            temp_certificate_rows: [],

            temp_archives: "",
            filter_result_archives : "",
            filter_dropdown_category_archives : "Select Category",
            filter_dropdown_related_to_archives : "Select Realted To",
            filter_dropdown_folder_archives : "Select Folder",
            filter_dropdown_subfolder_archives : "Select Sub Folder",
            filter_dropdown_uploaded_by_archives : "Select Uploded By",
            filter_start_date_archives : "",
            filter_end_date_archives : "",
            filter_archive_date_show : null,
            filter_search_string_archives : "",
            filterationObj_archives : {
                "category_name": "",
                "related_to_name": "",
                "folder_name": "",
                "subfolder_name": "",
                "uploaded_by": "",
                "start_date": "",
                "end_date": "",
                "string": ""
            },

            folder_view_modal : false,
            subfolder_view_modal : false,
            folder_view_files: [],
            subfolder_view_files : [],
            file_view_modal : false,
            bundle_view_modal : false,
            file_url_to_view : null,
            file_type_to_view : null,
            file_type_extention : "",
            archive_bundle_array: [],
            bundle_view_files: []
        };
    }

    componentDidMount() {
        this.getUsersData(this.state.user_id);
        this.getRolesForUser(this.state.user_id);
        this.getCertificatesForUser(this.state.user_id);
        this.getCategoryList();
        this.getUserRolesList();
        this.getUserCertificateList();
        this.getUserFiles();
        this.getFoldersList();
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
    getFoldersList = () => {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_folder_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ folders_list: result });
                },
                (error) => {

                }
            )
    };
    getSubFoldersList = (id) => {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_subfolder_list/"+id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ sub_folders_list: result });
                },
                (error) => {

                }
            )
    };
    addNewFolder =() => {
        if(this.state.new_folder_name == "" || this.state.new_folder_name == null || this.state.new_folder_name == undefined){
            swal({
                title: "Error",
                text: "Kindly Add Folder Name!",
                icon: "error",
            });
            return;
        }
        this.setState({
            add_new_folder_modal : false
        });
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_folder", {
            method: "POST",
            body:JSON.stringify({
                'name': this.state.new_folder_name
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        folders_list: result,
                        add_new_sub_folder_modal: false
                    });
                },
                (error) => {

                }
            )
    };
    addNewSubFolder =() => {
        if(this.state.new_sub_folder_name == "" || this.state.new_sub_folder_name == null || this.state.new_sub_folder_name == undefined){
            swal({
                title: "Error",
                text: "Kindly Add Sub Folder Name!",
                icon: "error",
            });
            return;
        }
        this.setState({
            add_new_folder_modal : false
        });
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_subfolder", {
            method: "POST",
            body:JSON.stringify({
                'subfolder_name': this.state.new_sub_folder_name,
                'folder_id': this.state.folder_id
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        sub_folders_list: result,
                        add_new_sub_folder_modal: false
                    });
                },
                (error) => {

                }
            )
    };
    handleChangeFolderSelect =(id,name) =>{
        this.setState({
            folder_id: id,
            folder_name: name,
            default_dropdown_folder: name
        });
        this.getSubFoldersList(id);
    };
    handleChangeSubFolderSelect =(id,name) =>{
        this.setState({
            sub_folder_id: id,
            sub_folder_name: name,
            default_dropdown_sub_folder: name
        });
        this.getSubFoldersList(id);
    };
    handleCloseAddFolderModal=()=> {
        this.setState({ add_new_folder_modal: false });
    }
    handleCloseAddSubFolderModal=()=> {
        this.setState({ add_new_sub_folder_modal: false });
    }

    handleShowAddFolderModal=()=> {
        this.setState({
            add_new_folder_modal : true,
            folder_id : "",
            folder_name : "",
            default_dropdown_folder : "Select Folder"
        });
    }
    handleShowAddSubFolderModal=()=> {
        this.setState({
            add_new_sub_folder_modal : true,
            sub_folder_id : "",
            sub_folder_name : "",
            default_dropdown_sub_folder : "Select Sub Folder"
        });
    }


    goBack = () => {
        // this.props.push({pathname :'/certificates', state: { select_drop_down: 'archives' }});
        this.props.history.goBack();
    }

    openConnectRole = () => {
      this.setState({ openConnectRole: true });
    };

    closeConnectRole = () => {
      this.setState({ openConnectRole: false });
    };

    openUploadDocument = () => {
      this.setState({ openUploadDocument: true });
    };

    closeUploadDocument = () => {
      this.setState({ openUploadDocument: false });
    };

    handleChangeCategory = (id,name) => {
        this.setState({
            category: name,
            categoryId: id,
            default_dropdown_category: name,
        });
    };

    addRoleToUser(){
      var role_ids = [];
      role_ids.push(this.state.role_id);
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_role_user", {
                method: "POST",
                body:JSON.stringify({
                  'role_id': role_ids,
                  'user_id': this.state.user_id,
                  'start_date' : this.state.start_date,
                  'end_date' : this.state.end_date
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ 
                      openConnectRole: false
                    });
                    this.getUsersData(this.state.user_id);
                    this.getRolesForUser(this.state.user_id);
                    this.getCertificatesForUser(this.state.user_id);
            },

            (error) => {

            }
        )
    }

    completeCertifcateUser(){
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/complete_certificate_user", {
                method: "POST",
                body:JSON.stringify({
                  'id': this.state.certificate_id,
                  'user_certificate_id': this.state.complete_certificate_user_id,
                  'accreditor': this.state.complete_certificate_accreditor,
                  'valid_time': this.state.complete_certificate_valid_time,
                  'training_minimum': this.state.complete_certificate_training_minimum,
                  'expiration_notice': this.state.complete_certificate_expiration_notice,
                  'user_id': this.state.user_id,
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
                      openCompleteCertificate: false
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
                    this.getRolesForUser(this.state.user_id);
                    this.getCertificatesForUser(this.state.user_id);
            },

            (error) => {

            }
        )
    }

    uploadUserFile(event){
      event.preventDefault();
      const form = this.refs.uploadFileForm;
        this.setState({ validated: true });
        if (form.checkValidity() === false) {
            return;
        }
        let errorString = "";
        let showErrorChk = false;
        if(this.state.folder_id == -1 || this.state.folder_id == null){
            errorString = errorString + "You Must Select Folder!\n";
            showErrorChk = true;
        }
        if(this.state.sub_folder_id == -1 || this.state.sub_folder_id == null){
            errorString = errorString + "You Must Select Sub Folder!\n";
            showErrorChk = true;
        }
        if(this.state.categoryId == "" || this.state.categoryId == null){
            errorString = errorString + "You Must Select Category!\n";
            showErrorChk = true;
        }
        if(this.state.related_to == "" || this.state.related_to == null){
            errorString = errorString + "You Must Select Related To!\n";
            showErrorChk = true;
        }
        if(this.state.related_to == "role"){
            if(this.state.role_id == -1) {
                errorString = errorString + "You Must Select Role!\n";
                showErrorChk = true;
            }
        }
        if(this.state.related_to == "certificate"){
            if(this.state.certificate_id == -1) {
                errorString = errorString + "You Must Select Certificate!\n";
                showErrorChk = true;
            }
        }
        if(this.state.file.length<1){
            errorString = errorString + "You Must Select File!\n";
            showErrorChk = true;
        }
        if(showErrorChk){
            swal({
                title: "Error!",
                text: errorString,
                icon: "error",
            });
            this.setState({
                showLoading: false
            });
            return;
        }
      // this.readURL(this.refs.document);
        this.uploadUserFileQuerry();
      
    }

    readURL=()=> {
        const input = this.refs.document;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          var fileBase64 = e.target.result.split("base64,");
          this.setState({
              file:fileBase64[1],
              upload_file_name: input.files[0].name
          });
         
          // this.uploadUserFileQuerry(input.files[0].name);
        }.bind(this);
      reader.readAsDataURL(input.files[0]);
      }
    }

    uploadUserFileQuerry(){
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/upload_user_file", {
                method: "POST",
                body:JSON.stringify({
                  'user_id' : this.state.user_id,
                  'folder_id': this.state.folder_id,
                  'subfolder_id': this.state.sub_folder_id,
                  'name': this.state.file_name,
                  'file' : this.state.file,
                  'category_id' : this.state.categoryId,
                  'related_to' : this.state.related_to,
                  'role' : this.state.role,
                  'certificate' : this.state.certificate,
                  'file_name' : this.state.upload_file_name
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.getUserFiles();
                    swal({
                        title: "Success!",
                        text: "File Uploaded Successfully",
                        icon: "success",
                    });
                    this.setState({
                        openUploadDocument: false,
                        folder_id: -1,
                        sub_folder_id: -1,
                        file_name: "",
                        related_to: "",
                        category_id: "",
                        role_id: -1,
                        certificate_id: -1,
                        file: [],
                        validate: false
                    });
            },
            (error) => {
                swal({
                    title: "Error!",
                    text: "unable To Upload File",
                    icon: "error",
                });
            }
        )
    }

    openCompleteCertificate = (id,name) => {
      this.setState({ openCompleteCertificate: true,certificate_name : name , certificate_id : id });
    };

    closeCompleteCertificate = (id) => {
      this.setState({ openCompleteCertificate: false });
    };

    goUserArchive = () => {
        const redirectTo = "/userArchive/"+this.state.user_id;
        this.props.props.props.history.push(redirectTo);
    }

    handleClickOpenCategory = () => {
      this.setState({ openAddCategory: true });
    };
    handleCloseCategory = () => {
      this.setState({ openAddCategory: false });
    };

    addCategory (){
      var category_name = this.state.add_file_category;
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_file_category", {
                method: "POST",
                body:JSON.stringify({
                  'name': category_name,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ category_list: result, openAddCategory: false  });
            },

            (error) => {

            }
        )
    }

    getCategoryList(){
         fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_category_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ category_list: result });
            },

            (error) => {

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
                    result.forEach(function (res) {
                        res.label = res.name;
                        res.value = res.id;
                    })
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
                    result.forEach(function (res) {
                        res.label = res.name;
                        res.value = res.id;
                    })
                    this.setState({ certificate_list_file: result });
            },

            (error) => {

            }
        )
    }
    getUserFiles(){
         fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_user_files/"+this.state.user_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    let archiveRows = [];
                    let perPageLimit = this.state.perPageLimit;
                    if(result.archive) {
                        for (let i = 0; i < result.archive.length; i++) {
                            const date = new Date(result.archive[i].uploaded_at);
                            const formattedDate = moment(date).format('DD-MMM-YY');
                            result.archive[i].uploaded_at = formattedDate;

                            if(i < perPageLimit) {
                                archiveRows.push(result.archive[i]);
                            }
                        }
                    }

                    this.setState({
                        archive_rows: archiveRows,
                        temp_archive_rows: result.archive,
                        certificate_rows: result.certificates_files_row,
                        temp_certificate_rows: result.certificates_files_row
                    });
            },

            (error) => {

            }
        )
    }

    handleChangeRelated_to = (value,capValue) => {
        this.setState({
            related_to: value,
            default_dropdown_related_to: capValue
        });
    };

    handleChangeRole = (selected) => {
        this.setState({
            role_id: selected.value,
            default_dropdown_role: selected.label,
        });
    };

    handleChangeCertificate = (selected) => {
        this.setState({
            certificate: selected.value,
            default_dropdown_certificate: selected.label
        });
    };

    handleCloseSuccess = () => {
      this.setState({ openSuccessPopup: false });
    };
    checkTab =(event)=>{
        if(event.target.id == "userArchivesTabView-tab-archives"){
            this.setState({
                activePage: 1,
                active_tab:1,
                default_perPageLimit: "No of pages",
            })
        }
        if(event.target.id == "userArchivesTabView-tab-certificates"){
            this.setState({
                activePage: 1,
                active_tab:2,
                default_perPageLimit: "No of pages",
            })
        }
    }
    handlePageChange = (pageNumber) => {
        if(this.state.active_tab==1) {
            let allRowsArchives = this.state.temp_archive_rows;
            let totalRows = [];
            let startIndex = 0;
            let endIndex = this.state.perPageLimit;
            let perPageLimit = this.state.perPageLimit;
            if (pageNumber != 1) {
                startIndex = (pageNumber * perPageLimit) - perPageLimit;
                endIndex = (pageNumber * perPageLimit) - 1;
            }
            let rows_count = 0;
            for (let i = 0; i < allRowsArchives.length; i++) {
                rows_count = rows_count + 1;
                if (rows_count >= startIndex && rows_count <= endIndex) {
                    totalRows.push(allRowsArchives[i]);
                }
            }

            this.setState({
                activePage: pageNumber,
                archive_rows: totalRows
            });
        }
        else{
            let allRowsCertificates = this.state.temp_certificate_rows;
            let totalRows = [];
            let startIndex = 0;
            let endIndex = this.state.perPageLimit;
            let perPageLimit = this.state.perPageLimit;
            if (pageNumber != 1) {
                startIndex = (pageNumber * perPageLimit) - perPageLimit;
                endIndex = (pageNumber * perPageLimit) - 1;
            }
            let rows_count = 0;
            for (let i = 0; i < allRowsCertificates.length; i++) {
                rows_count = rows_count + 1;
                if (rows_count >= startIndex && rows_count <= endIndex) {
                    totalRows.push(allRowsCertificates[i]);
                }
            }

            this.setState({
                activePage: pageNumber,
                certificate_rows: totalRows
            });
        }
    }
    handlePerPageLimit = (noOfLinesLimit) => {
        if(this.state.active_tab==1) {
            let allRows = this.state.temp_archive_rows;
            let totalRows = [];
            let startIndex = 0;
            let endIndex = noOfLinesLimit;
            let perPageLimit = noOfLinesLimit;
            let default_perPageLimit = noOfLinesLimit;
            let rows_count = 0;
            for (let i = 0; i < allRows.length; i++) {
                rows_count = rows_count + 1;
                if (noOfLinesLimit == 0) {
                    totalRows.push(allRows[i]);
                }
                else {
                    if (rows_count >= startIndex && rows_count <= endIndex) {
                        totalRows.push(allRows[i]);
                    }
                }
            }
            if (noOfLinesLimit == 0) {  // all lines
                perPageLimit = rows_count;
                default_perPageLimit = "All";
            }
            this.setState({
                default_perPageLimit: default_perPageLimit,
                perPageLimit: perPageLimit,
                activePage: 1,
                archive_rows: totalRows
            });
        }
        else{
            let allRows = this.state.certificate_rows;
            let totalRows = [];
            let startIndex = 0;
            let endIndex = noOfLinesLimit;
            let perPageLimit = noOfLinesLimit;
            let default_perPageLimit = noOfLinesLimit;
            let rows_count = 0;
            for (let i = 0; i < allRows.length; i++) {
                rows_count = rows_count + 1;
                if (noOfLinesLimit == 0) {
                    totalRows.push(allRows[i]);
                }
                else {
                    if (rows_count >= startIndex && rows_count <= endIndex) {
                        totalRows.push(allRows[i]);
                    }
                }
            }
            if (noOfLinesLimit == 0) {  // all lines
                perPageLimit = rows_count;
                default_perPageLimit = "All";
            }
            this.setState({
                default_perPageLimit: default_perPageLimit,
                perPageLimit: perPageLimit,
                activePage: 1,
                archive_rows: totalRows
            });
        }
    }

    //filter functions
    handleKeyPressArchive = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.searchListFilterArchive();
        }
    }
    handleChangeCategoryFilterArchive = (name) => {
        this.setState({
            filter_dropdown_category_archives: name
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.category_name = name;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    };
    handleChangeRelatedToFilterArchive =(name,capName) => {
        this.setState({
            filter_dropdown_related_to_archives: capName
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.related_to_name = name;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    };
    handleChangeFolderFilterArchive =(name,id) => {
        this.setState({
            filter_dropdown_folder_archives: name
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.folder_name = name;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.getSubFoldersList(id);
        this.filterResultArchive();
    };
    handleChangeSubFolderFilterArchive =(name) => {
        this.setState({
            filter_dropdown_subfolder_archives: name
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.subfolder_name = name;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    };
    handleChangeSearchListFilterArchive = (event) => {
        this.setState({
            filter_search_string_archives: event.target.value,
        });
        if(event.target.value==""){
            this.setState({
                filter_result: "",
            });
        }
    }
    handleCancelDateArchive = (event, picker) => {
        this.setState({
            filter_start_date_archives: null,
            filter_end_date_archives: null
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.start_date = "";
        filterationObj_archives.end_date = "";
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    }
    handleApplyDateArchive = (event, picker) => {
        let filter_archive_date_show = moment(picker.startDate._d).format('DD-MMM-YY') + " to " + moment(picker.endDate._d).format('DD-MMM-YY');
        this.setState({
            filter_start_date_archives: picker.startDate._d,
            filter_end_date_archives: picker.endDate._d,
            filter_archive_date_show: filter_archive_date_show
        });
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.start_date = picker.startDate._d;
        filterationObj_archives.end_date = picker.endDate._d;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    }

    searchListFilterArchive = () => {
        var searchValue = this.state.filter_search_string_archives.toString().toLowerCase();
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.string = searchValue;
        this.setState({
            filterationObj_archives: filterationObj_archives
        })
        this.filterResultArchive();
    }
    searchClearFilterArchive = () => {
        let filterationObj_archives = this.state.filterationObj_archives;
        filterationObj_archives.category_name = "";
        filterationObj_archives.related_to_name = "";
        filterationObj_archives.uploaded_by = "";
        filterationObj_archives.start_date = "";
        filterationObj_archives.end_date = "";
        filterationObj_archives.string = "";
        this.setState({
            filter_dropdown_category_archives : "Select Category",
            filter_dropdown_related_to_archives : "Select Realted To",
            filter_dropdown_uploaded_by_archives : "Select Uploded By",
            filter_start_date_archives : "",
            filter_end_date_archives : "",
            filter_search_string_archives : "",
            filter_archive_date_show : "",
            filterationObj_archives: filterationObj_archives,
            archive_rows: this.state.temp_archive_rows,
            activePage: 1
        })
        this.filterResultArchive();
    }
    filterResultArchive = () => {
        let filterationObj = this.state.filterationObj_archives;
        let filterdBefore = 0;
        // var data = this.state.temp_archives;
        var data = this.state.temp_archive_rows;
        var filter_result = [];

        if(filterationObj.category_name!=null && filterationObj.category_name!="") {
            filterdBefore = 1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].category_name == filterationObj.category_name) {
                    filter_result.push(data[i]);
                }
            }
        }
        if(filterationObj.related_to_name!=null && filterationObj.related_to_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].related_to.toLowerCase().includes(filterationObj.related_to_name.toLowerCase())) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.folder_name!=null && filterationObj.folder_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].folder_name.toLowerCase().includes(filterationObj.folder_name.toLowerCase())) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.subfolder_name!=null && filterationObj.subfolder_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].subfolder_name.toLowerCase().includes(filterationObj.subfolder_name.toLowerCase())) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.start_date!=null && filterationObj.start_date!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            const date = new Date(filterationObj.start_date);
            for (let i = 0; i < innerData.length; i++) {
                const date2 = new Date(innerData[i].uploaded_at);
                if (date2 >= date) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.end_date!=null && filterationObj.end_date!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            const date = new Date(filterationObj.end_date);
            for (let i = 0; i < innerData.length; i++) {
                const date2 = new Date(innerData[i].uploaded_at);
                if (date2 <= date) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.string!="" && filterationObj.string!=null) {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            let searchValue = filterationObj.string;
            for (let i = 0; i< innerData.length ; i++){
                if(innerData[i].comments!=null&&(innerData[i].comments.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].file_name!=null&&(innerData[i].file_name.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].folder_name!=null&&(innerData[i].folder_name.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].object_name!=null&&(innerData[i].object_name.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].related_to!=null&&(innerData[i].related_to.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }

        if(filterdBefore == 0){
            filter_result = data;
        }

        this.setState({
            archive_rows: filter_result
        });
    }

    //folder view
    handleShowFolderViewModal=(id)=> {
        console.log(id);
        let files = [];
        for(let i=0;i<this.state.temp_archive_rows.length;i++){
            if(this.state.temp_archive_rows[i].object_id == id){
                let obj = this.state.temp_archive_rows[i];
                let ext = obj.file_url.split(".");
                let extention = ext[ext.length-1];

                if(extention=="docx" || extention=="doc")
                    ext = "word";
                else if(extention=="xls" || extention=="xlsx" || extention=="xlsm" || extention=="xlsb")
                    ext = "excel";
                else if(extention=="pdf")
                    ext = "pdf";
                else if(extention=="gif" || extention=="png" || extention=="jpeg" || extention=="jpg"
                    || extention=="svg" || extention=="gif") {
                    ext = "image";
                }
                else if(extention=="rar" || extention=="zip")
                    ext = "archive";
                else
                    ext = "file"
                obj.extention = extention;
                obj.type = ext;
                files.push(this.state.temp_archive_rows[i]);
            }
        }
        let newUrl = null;
        let fileType = null;
        if(files.length>0) {
            newUrl = process.env.REACT_APP_FILES_URL + files[0].file_url;
            // newUrl = newUrl.replace(/%5C/g, '/');
            newUrl = newUrl.replace(/\\/g,"/");
            fileType = files[0].type;
        }
        this.setState({
            file_url_to_view: newUrl,
            file_type_to_view: fileType,
            folder_view_files: files,
            folder_view_modal: true
        });
        setTimeout(function () {
            var firstFile = document.getElementsByClassName("allFiles")[0];
            if(firstFile)
                firstFile.style.color = "blue";
        }, 500);
    }
    setFileUrl=(event,url,type,extention)=> {
        var allFiles = document.getElementsByClassName("allFiles");
        for (var i = 0; i < allFiles.length; i++) {
            allFiles[i].style.color = "black";
        }
        event.target.style.color="blue";

        let newUrl = process.env.REACT_APP_FILES_URL + url;
        newUrl = newUrl.replace(/\\/g,"/");
        this.setState({
            file_url_to_view: newUrl,
            file_type_to_view: type,
            file_type_extention: extention
        });
    }
    handleCloseFolderViewModal=()=> {
        this.setState({
            folder_view_modal: false,
            folder_view_files: [],
            file_url_to_view: null,
            file_type_to_view: null
        });
    }

    handleShowFileViewModal=(url)=> {
        let ext = url.split(".");
        let extention = ext[ext.length-1];

        if(extention=="docx" || extention=="doc")
            ext = "word";
        else if(extention=="xls" || extention=="xlsx" || extention=="xlsm" || extention=="xlsb")
            ext = "excel";
        else if(extention=="pdf")
            ext = "pdf";
        else if(extention=="gif" || extention=="png" || extention=="jpeg" || extention=="jpg"
            || extention=="svg" || extention=="gif") {
            ext = "image";
        }
        else if(extention=="rar" || extention=="zip")
            ext = "archive";
        else
            ext = "file";

        this.setState({
            file_url_to_view: process.env.REACT_APP_FILES_URL + url,
            file_type_to_view: ext,
            file_view_modal: true
        });
    }
    handleCloseFileViewModal=()=> {
        this.setState({
            file_view_modal: false,
            file_url_to_view: null,
            file_type_to_view: null
        });
    }
    handleShowSubFolderViewModal=(folder_id,subfolder_id)=> {
        let files = [];
        if(subfolder_id != 0) {
            for (let i = 0; i < this.state.temp_archive_rows.length; i++) {
                if (this.state.temp_archive_rows[i].subfolder_id == subfolder_id) {
                    let obj = this.state.temp_archive_rows[i];
                    let ext = obj.file_url.split(".");
                    let extention = ext[ext.length - 1];

                    if (extention == "docx" || extention == "doc")
                        ext = "word";
                    else if (extention == "xls" || extention == "xlsx" || extention == "xlsm" || extention == "xlsb")
                        ext = "excel";
                    else if (extention == "pdf")
                        ext = "pdf";
                    else if (extention == "gif" || extention == "png" || extention == "jpeg" || extention == "jpg"
                        || extention == "svg" || extention == "gif") {
                        ext = "image";
                    }
                    else if (extention == "rar" || extention == "zip")
                        ext = "archive";
                    else
                        ext = "file"
                    obj.extention = extention;
                    obj.type = ext;
                    files.push(this.state.temp_archive_rows[i]);
                }
            }
        }
        else{
            for (let i = 0; i < this.state.temp_archive_rows.length; i++) {
                if (this.state.temp_archive_rows[i].folder_id == folder_id && this.state.temp_archive_rows[i].subfolder_id == 0) {
                    let obj = this.state.temp_archive_rows[i];
                    let ext = obj.file_url.split(".");
                    let extention = ext[ext.length - 1];

                    if (extention == "docx" || extention == "doc")
                        ext = "word";
                    else if (extention == "xls" || extention == "xlsx" || extention == "xlsm" || extention == "xlsb")
                        ext = "excel";
                    else if (extention == "pdf")
                        ext = "pdf";
                    else if (extention == "gif" || extention == "png" || extention == "jpeg" || extention == "jpg"
                        || extention == "svg" || extention == "gif") {
                        ext = "image";
                    }
                    else if (extention == "rar" || extention == "zip")
                        ext = "archive";
                    else
                        ext = "file"
                    obj.extention = extention;
                    obj.type = ext;
                    files.push(this.state.temp_archive_rows[i]);
                }
            }
        }
        let newUrl = null;
        let fileType = null;
        if(files.length>0) {
            newUrl = process.env.REACT_APP_FILES_URL + files[0].file_url;
            // newUrl = newUrl.replace(/%5C/g, '/');
            newUrl = newUrl.replace(/\\/g,"/");
            fileType = files[0].type;
        }
        this.setState({
            file_url_to_view: newUrl,
            file_type_to_view: fileType,
            subfolder_view_files: files,
            subfolder_view_modal: true
        });
        setTimeout(function () {
            var firstFile = document.getElementsByClassName("allFiles")[0];
            if(firstFile)
                firstFile.style.color = "blue";
        }, 500);
    }
    handleCloseSubFolderViewModal=()=> {
        this.setState({
            subfolder_view_modal: false,
            subfolder_view_files: [],
            file_url_to_view: null,
            file_type_to_view: null
        });
    }
    handleCloseBundleViewModal=()=> {
        this.setState({
            bundle_view_modal: false,
        });
    }

    printDoc = (folderOrSub) => {
        var all_files = this.state.folder_view_files;
        if(folderOrSub == 1){
            all_files = this.state.subfolder_view_files;
        }
        if(all_files.length>0) {
            const urls = all_files.map(async (obj) => {
                let newUrl = process.env.REACT_APP_FILES_URL + obj.file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                return a2pClient.libreofficeConvert(newUrl).then(function (result) {
                    return result.pdf;
                });
            });

            Promise.all(urls).then((completed) => {
                if (completed.length > 1) {
                    a2pClient.merge(completed).then(function (result) {
                        console.log(result);
                        printJS(result.pdf, 'pdf');
                    });
                }
                else {
                    printJS(completed[0], 'pdf');
                }
            });
        }
        else{
            swal({
                title: "Info",
                text: "No Files Present!",
                icon: "info",
            });
        }
        /*a2pClient.libreofficeConvert(this.state.file_url_to_view).then(function(result) {
            console.log("converted",result.pdf);
            if(result.pdf){
                printJS(result.pdf, 'pdf');
            }
        });*/
    }
    convertToPdf=(folderOrSub)=>{
        var all_files = this.state.folder_view_files;
        if(folderOrSub == 1){
            all_files = this.state.subfolder_view_files;
        }
        if(all_files.length>0) {
            const urls = all_files.map(async (obj) => {
                let newUrl = process.env.REACT_APP_FILES_URL + obj.file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                return a2pClient.libreofficeConvert(newUrl).then(function (result) {
                    return result.pdf;
                });
            });

            Promise.all(urls).then((completed) => {
                if (completed.length > 1) {
                    a2pClient.merge(completed).then(function (result) {
                        console.log(result);
                        new Downloader({
                            url: result.pdf
                        }).then(function () {
                            // Called when download ended
                            console.log("Downloaded Successfully")
                        })
                            .catch(function (error) {
                                // Called when an error occurred
                                console.log(error);
                            });
                    });
                }
                else {
                    new Downloader({
                        url: completed[0]
                    }).then(function () {
                        // Called when download ended
                    })
                        .catch(function (error) {
                            // Called when an error occurred
                            console.log(error);
                        });
                }
            });
        }
        else{
            swal({
                title: "Info",
                text: "No Files Present!",
                icon: "info",
            });
        }
        /* a2pClient.libreofficeConvert(this.state.file_url_to_view).then(function(result) {
             console.log(result.pdf);
             var urlToPdf = "https://media.api2pdf.com/857643f0-4563-11e9-b560-b97162dd8722?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJSHKEFTKBQX2AUYQ%2F20190313%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190313T074215Z&X-Amz-Expires=86400&X-Amz-Signature=93a88168c180d40e7626ae1dea48ed8c30ac400601af335d797572f46bf7c1ec&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3Bfilename%3D%22857643f0-4563-11e9-b560-b97162dd8722.pdf%22&response-content-type=application%2Fpdf";
             var urls = [urlToPdf, result.pdf];
             a2pClient.merge(urls).then(function(result) {
                 console.log(result);
             });
         });*/
        /*const input = document.getElementById("myMm");
        const inputHeightMm = pxToMm(input.offsetHeight);
        const a4WidthMm = 210;
        const a4HeightMm = 297;
        const a4HeightPx = mmToPx(a4HeightMm);
        const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm/a4HeightMm) + 1;
        console.log({
            input, inputHeightMm, a4HeightMm, a4HeightPx, numPages, range: range(0, numPages),
            comp: inputHeightMm <= a4HeightMm, inputHeightPx: input.offsetHeight
        });

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');

                // Document of a4WidthMm wide and inputHeightMm high
                if (inputHeightMm > a4HeightMm) {
                    // elongated a4 (system print dialog will handle page breaks)
                    const pdf = new jsPDF('p', 'mm', [inputHeightMm+16, a4WidthMm]);
                    pdf.addImage(imgData, 'PNG', 0, 0);
                    pdf.save(`EDTx Files.pdf`);
                } else {
                    // standard a4
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'PNG', 0, 0);
                    pdf.save(`EDTx Files.pdf`);
                }
            });*/
    }
    zipAndDownload = (folderOrSub) =>{
        var all_files = this.state.folder_view_files;
        if(folderOrSub == 1){
            all_files = this.state.subfolder_view_files;
        }
        if(all_files.length>0) {
            const urls = [];
            for(var i=0; i<all_files.length;i++){
                let newUrl = process.env.REACT_APP_FILES_URL + all_files[i].file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                var extention = newUrl.split(".");
                var name = all_files[i].file_name.split(".")[0];
                const obj= {
                    name: name+"."+extention[extention.length-1],
                    url: newUrl,
                }
                urls.push(obj);
            }
            var zip = new JSZip();
            var count = 0;
            var zipFilename = "EDTx.zip";
            urls.forEach(function(obj){
                var filename = obj.name;
                // loading a file and add it in a zip file
                JSZipUtils.getBinaryContent(obj.url, function (err, data) {
                    if(err) {
                        throw err; // or handle the error
                    }
                    zip.file(filename, data, {binary:true});
                    count++;
                    if (count == urls.length) {
                        zip.generateAsync({type:"blob"}).then(function(content) {
                            // see FileSaver.js
                            FileSaver.saveAs(content, zipFilename);
                        });
                    }
                });
            });
        }
        else{
            swal({
                title: "Info",
                text: "No Files Present!",
                icon: "info",
            });
        }
    }

    // bundle functions

    addToBundle = () => {
        let bundle_files = this.state.bundle_view_files;
        if (this.state.active_tab == 1) {
            let files = this.state.archive_bundle_array;
            for (let i = 0; i < this.state.temp_archive_rows.length; i++) {
                let newUrl = process.env.REACT_APP_FILES_URL + this.state.temp_archive_rows[i].file_url;
                newUrl = newUrl.replace(/\\/g,"/");
                if (newUrl == this.state.file_url_to_view) {
                    let chk = false;
                    for(let j=0;j<bundle_files.length;j++){
                        if(bundle_files[j].file_url == this.state.temp_archive_rows[i].file_url){
                            chk = true;
                        }
                    }
                    if(chk == false){
                        bundle_files.push(this.state.temp_archive_rows[i]);
                        swal({
                            title: "Success!",
                            text: "Added To Bundle Successfully!",
                            icon: "success",
                        });
                    }
                    else{
                        swal({
                            title: "Info!",
                            text: "Already In bundle!",
                            icon: "info",
                        });
                    }
                    this.setState({
                        bundle_view_files: bundle_files
                    });
                    break;
                }
            }
        }
        else {
            let files = this.state.certificate_bundle_array;
            for (let i = 0; i < this.state.temp_certificates.length; i++) {
                let newUrl = process.env.REACT_APP_FILES_URL + this.state.temp_certificates[i].file_url;
                newUrl = newUrl.replace(/\\/g,"/");
                if (newUrl == this.state.file_url_to_view) {
                    let chk = false;
                    for(let j=0;j<bundle_files.length;j++){
                        if(bundle_files[j].file_url == this.state.temp_certificates[i].file_url){
                            chk = true;
                        }
                    }
                    if(chk == false){
                        bundle_files.push(this.state.temp_certificates[i]);
                        swal({
                            title: "Success!",
                            text: "Added To Bundle Successfully!",
                            icon: "success",
                        });
                    }else{
                        swal({
                            title: "Info!",
                            text: "Already In bundle!",
                            icon: "info",
                        });
                    }
                    this.setState({
                        bundle_view_files: bundle_files
                    });
                    break;
                }
            }
        }
    }
    bundleToPdf=()=>{
        const bundle_files = this.state.bundle_view_files;
        if(bundle_files.length>0) {
            const urls = bundle_files.map(async (obj) => {
                let newUrl = process.env.REACT_APP_FILES_URL + obj.file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                return a2pClient.libreofficeConvert(newUrl).then(function (result) {
                    return result.pdf;
                });
            });

            Promise.all(urls).then((completed) => {
                if (completed.length > 1) {
                    a2pClient.merge(completed).then(function (result) {
                        console.log(result);
                        new Downloader({
                            url: result.pdf
                        }).then(function () {
                            // Called when download ended
                        })
                            .catch(function (error) {
                                // Called when an error occurred
                                console.log(error);
                            });
                    });
                }
                else {
                    new Downloader({
                        url: completed[0]
                    }).then(function () {
                        // Called when download ended
                    })
                        .catch(function (error) {
                            // Called when an error occurred
                            console.log(error);
                        });
                }
            });
        }
        else{
            swal({
                title: "Info!",
                text: "Add Some Files To Bundle First!",
                icon: "info",
            });
        }
    }
    downloadBundle = () => {
        const bundle_files = this.state.bundle_view_files;
        if(bundle_files.length>0) {
            const urls = [];
            for(var i=0; i<bundle_files.length;i++){
                let newUrl = process.env.REACT_APP_FILES_URL + bundle_files[i].file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                var extention = newUrl.split(".");
                var name = bundle_files[i].file_name.split(".")[0];
                const obj= {
                    name: name+"."+extention[extention.length-1],
                    url: newUrl,
                }
                urls.push(obj);
            }
            var zip = new JSZip();
            var count = 0;
            var zipFilename = "EDTx.zip";
            urls.forEach(function(obj){
                var filename = obj.name;
                // loading a file and add it in a zip file
                JSZipUtils.getBinaryContent(obj.url, function (err, data) {
                    if(err) {
                        throw err; // or handle the error
                    }
                    zip.file(filename, data, {binary:true});
                    count++;
                    if (count == urls.length) {
                        zip.generateAsync({type:"blob"}).then(function(content) {
                            // see FileSaver.js
                            FileSaver.saveAs(content, zipFilename);
                        });
                    }
                });
            });
        }
        else{
            swal({
                title: "Info!",
                text: "Add Some Files To Bundle First!",
                icon: "info",
            });
        }
    }
    bundlePrint=()=>{
        const bundle_files = this.state.bundle_view_files;
        if(bundle_files.length>0) {
            const urls = bundle_files.map(async (obj) => {
                let newUrl = process.env.REACT_APP_FILES_URL + obj.file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                return a2pClient.libreofficeConvert(newUrl).then(function (result) {
                    console.log("converted",result);
                    return result.pdf;
                });
            });

            Promise.all(urls).then((completed) => {
                if (completed.length > 1) {
                    a2pClient.merge(completed).then(function (result) {
                        console.log("Merged",result);
                        printJS(result.pdf);
                    });
                }
                else {
                    printJS(completed[0]);
                }
            });
        }
        else{
            swal({
                title: "Info!",
                text: "Add Some Files To Bundle First!",
                icon: "info",
            });
        }
    }
    openBundleViewModal=()=>{
        let bundle_files = [];
        for(let i=0;i<this.state.bundle_view_files.length;i++){
            let obj = this.state.bundle_view_files[i];
            let ext = obj.file_url.split(".");
            let extention = ext[ext.length-1];

            if(extention=="docx" || extention=="doc")
                ext = "word";
            else if(extention=="xls" || extention=="xlsx" || extention=="xlsm" || extention=="xlsb")
                ext = "excel";
            else if(extention=="pdf")
                ext = "pdf";
            else if(extention=="gif" || extention=="png" || extention=="jpeg" || extention=="jpg"
                || extention=="svg" || extention=="gif") {
                ext = "image";
            }
            else if(extention=="rar" || extention=="zip")
                ext = "archive";
            else
                ext = "file"
            obj.extention = extention;
            obj.type = ext;
            bundle_files.push(this.state.bundle_view_files[i]);
        }
        let newUrl = null;
        let fileType = null;
        if(bundle_files.length>0) {
            newUrl = process.env.REACT_APP_FILES_URL + bundle_files[0].file_url;
            // newUrl = newUrl.replace(/%5C/g, '/');
            newUrl = newUrl.replace(/\\/g,"/");
            fileType = bundle_files[0].type;
        }
        this.setState({
            file_url_to_view: newUrl,
            file_type_to_view: fileType,
            bundle_view_files: bundle_files,
            bundle_view_modal: true
        });
        setTimeout(function () {
            var firstFile = document.getElementsByClassName("allFiles")[0];
            if(firstFile)
                firstFile.style.color = "blue";
        }, 500);
    }

    removeBundleViewFile=()=>{
        for(let i=0;i<this.state.bundle_view_files.length;i++){
            let newUrl = process.env.REACT_APP_FILES_URL + this.state.bundle_view_files[i].file_url;
            newUrl = newUrl.replace(/\\/g,"/");
            if(this.state.file_url_to_view == newUrl) {
                this.state.bundle_view_files.splice(i, 1);
                break;
            }
        }
        let newUrl = null;
        let fileType = null;
        if(this.state.bundle_view_files.length>0) {
            newUrl = process.env.REACT_APP_FILES_URL + this.state.bundle_view_files[0].file_url;
            newUrl = newUrl.replace(/\\/g,"/");
            fileType = this.state.bundle_view_files[0].type;
        }
        this.setState({
            file_url_to_view: newUrl,
            file_type_to_view: fileType,
        });
        setTimeout(function () {
            var firstFile = document.getElementsByClassName("allFiles")[0];
            if(firstFile)
                firstFile.style.color = "blue";
        }, 500);
    }
    handleCloseBundleViewModal=()=> {
        this.setState({
            bundle_view_modal: false,
        });
    }

    //SORTING
    sortArchivesByColoumn =(property)=> {
        let isDesc = !this.state.isDesc;
        this.setState({
            isDesc: !this.state.isDesc,
            column: property
        })

        let direction = this.state.isDesc ? 1 : -1;
        let savedRrecords = this.state.temp_archive_rows;
        let records = [];
        savedRrecords.forEach(function (rec) {
            if (rec["id"] != "") {
                records.push(rec);
            }
        });
        if (property == "id") {
            records.sort(function (a, b) {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            });
        }
        else if (property == "uploaded_at") {
            records.sort(function (a, b) {
                let aDate = new Date(a[property]);
                let bDate = new Date(b[property]);
                if (aDate < bDate) {
                    return -1 * direction;
                }
                else if (aDate > bDate) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            records.sort(function (a, b) {
                if (a[property] == null) {
                    a[property] = "";
                }
                if (b[property] == null) {
                    b[property] = "";
                }
                if ((a[property].toString().toLowerCase()) < (b[property].toString().toLowerCase())) {
                    return -1 * direction;
                }
                else if ((a[property].toString().toLowerCase()) > (b[property].toString().toLowerCase())) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            });
        }

        let newRecords = [];
        records.forEach(function (record) {
            savedRrecords.forEach(function (record2) {
                if (record["id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }
            });
        });
        this.setState({
            archive_rows: newRecords,
            temp_archive_rows: newRecords,
            // rows_count_archive: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            default_perPageLimit: "All",
            activePage: 1
        });
    }
    render() {
        const { validated } = this.state;
        const FreeTextSearch = [
            <div>
                <form className="" style={{width: '99%'}}>
                    <Form.Row style={{paddingLeft: 0, paddingBottom: 0, width: '81%'}}>
                        <Form.Group as={Col}>
                            <Dropdown className="addNewArchiveModalDropDowns">
                                <Dropdown.Toggle>
                                    {this.state.filter_dropdown_category_archives}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.state.category_list ? this.state.category_list.map(category => (
                                            <Dropdown.Item value={category.id} onClick={(name) => {this.handleChangeCategoryFilterArchive(category.name)}}>{category.name}</Dropdown.Item>
                                        ))

                                        :
                                        <Dropdown.Item value="">No Categories</Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown className="addNewArchiveModalDropDowns">
                                <Dropdown.Toggle>
                                    {this.state.filter_dropdown_related_to_archives}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item value="user" onClick={(value,capValue) =>{this.handleChangeRelatedToFilterArchive("user","User")}}>User</Dropdown.Item>
                                    <Dropdown.Item value="role" onClick={(value,capValue) =>{this.handleChangeRelatedToFilterArchive("role","Role")}}>Role</Dropdown.Item>
                                    <Dropdown.Item value="certificate" onClick={(value,capValue) =>{this.handleChangeRelatedToFilterArchive("certificate","Certificate")}}>Certificate</Dropdown.Item>
                                    <Dropdown.Item value="others" onClick={(value,capValue) =>{this.handleChangeRelatedToFilterArchive("others","Others")}}>Others</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown className="addNewArchiveModalDropDowns">
                                <Dropdown.Toggle>
                                    {this.state.filter_dropdown_folder_archives}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.state.folders_list.length > 0 ? this.state.folders_list.map(folder => (
                                            <Dropdown.Item value="user" onClick={(value,id) => {
                                                this.handleChangeFolderFilterArchive(folder.name,folder.id)
                                            }}>{folder.name}</Dropdown.Item>
                                        )) :
                                        <Dropdown.Item value="">No Folder</Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown className="addNewArchiveModalDropDowns">
                                <Dropdown.Toggle>
                                    {this.state.filter_dropdown_subfolder_archives}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.state.sub_folders_list.length > 0 ? this.state.sub_folders_list.map(subfolder => (
                                            <Dropdown.Item value="user" onClick={(value) => {
                                                this.handleChangeSubFolderFilterArchive(subfolder.subfolder_name)
                                            }}>{subfolder.subfolder_name}</Dropdown.Item>
                                        )) :
                                        <Dropdown.Item value="">No Sub Folder</Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row style={{paddingLeft: 0, paddingBottom: 0, width: '61%'}}>
                        <Form.Group as={Col}>
                            <DateRangePicker onCancel={this.handleCancelDateArchive} onApply={this.handleApplyDateArchive}>
                                <Form.Control type="text" placeholder="Pick A Date Range" value={this.state.filter_archive_date_show} />
                            </DateRangePicker>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Control type="text" placeholder="Enter Search String" value={this.state.filter_search_string_archives}
                                          onChange={(event) => {this.handleChangeSearchListFilterArchive(event)}} onKeyPress={this.handleKeyPressArchive}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <div>
                                <Button variant="outline-primary" onClick={this.searchListFilterArchive} style={{marginRight: 10}}>
                                    <i class="fa fa-search" aria-hidden="true"></i>Search
                                </Button>
                                <Button variant="outline-primary" onClick={this.searchClearFilterArchive}>
                                    <i class="fa fa-times" aria-hidden="true"></i>Clear
                                </Button>
                            </div>

                        </Form.Group>
                    </Form.Row>
                    <Form.Row style={{paddingLeft: 0, paddingBottom: 0}}>
                        <Form.Group as={Col} style={{marginBottom: 0}}>
                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={(id)=>this.openBundleViewModal()}>
                                View Bundle
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </form>
            </div>

        ]
        return (
            <div style={{width: '98.5%'}}>
                <Row style={{marginTop: '1%',marginLeft: 0, marginBottom: '1%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <Alert  variant="primary" className="pageHeading" style={{width: 260}}>
                            USER ARCHIVE
                        </Alert>
                    </Col>
                </Row>

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
                        <Button variant="outline-primary" onClick={this.openUploadDocument} style={{marginBottom : 10,display:'block',width:190,height:35}}>
                            Upload File
                        </Button>
                    </Col>
                </Row>

                <br />

                {/*<hr style={{width: '97%'}} />
                <br />*/}

                <div style={{marginLeft:"1%", width: '99.5%'}}>
                    {this.state.active_tab == 1 ?
                        <div>
                            {FreeTextSearch}
                            {this.state.temp_archive_rows.length > 10 ?
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
                        </div>:
                        <div>
                            {this.state.temp_certificate_rows.length > 10 ?
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
                        </div>

                    }

                    <Tabs defaultActiveKey="archives" id="userArchivesTabView" onClick={this.checkTab}>
                        <Tab eventKey="archives" title={`USER ARCHIVES (${this.state.archive_rows.length})`}>
                            <Table striped hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortArchivesByColoumn('folder_name')}}>
                                            FOLDER
                                            <i className={this.state.column!='folder_name'?
                                                "fa fa-sort": (this.state.column == 'folder_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortArchivesByColoumn('subfolder_name')}}>
                                            SUB FOLDER
                                            <i className={this.state.column!='subfolder_name'?
                                                "fa fa-sort": (this.state.column == 'subfolder_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'10%', padding: '1%', paddingLeft: '0.5%'}} onClick={()=>{this.sortArchivesByColoumn('id')}}>
                                            FILE ID
                                            <i className={this.state.column!='id'?
                                                "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'10%'}} onClick={()=>{this.sortArchivesByColoumn('uploaded_at')}}>
                                            DATE UPLOADED
                                            <i className={this.state.column!='uploaded_at'?
                                                "fa fa-sort": (this.state.column == 'uploaded_at' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortArchivesByColoumn('category_name')}}>
                                            CATEGORY
                                            <i className={this.state.column!='category_name'?
                                                "fa fa-sort": (this.state.column == 'category_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortArchivesByColoumn('related_to')}}>
                                            RELATION
                                            <i className={this.state.column!='related_to'?
                                                "fa fa-sort": (this.state.column == 'related_to' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'20%'}} onClick={()=>{this.sortArchivesByColoumn('file_name')}}>
                                            FILES
                                            <i className={this.state.column!='file_name'?
                                                "fa fa-sort": (this.state.column == 'file_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.archive_rows ? this.state.archive_rows.map(archive => (
                                            <tr>
                                                <td style={{cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowFolderViewModal(archive.object_id)}}>
                                                    {archive.folder_name}
                                                </td>
                                                <td style={{cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowSubFolderViewModal(archive.folder_id,archive.subfolder_id)}}>
                                                    {archive.subfolder_name}
                                                </td>
                                                <td>{archive.id}</td>
                                                <td>{archive.uploaded_at}</td>
                                                <td>{archive.category_name}</td>
                                                <td>{archive.related_to}</td>
                                                <td style={{wordBreak: 'break-all',cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowFileViewModal(archive.file_url)}}>
                                                    {archive.file_name}
                                                </td>
                                            </tr>
                                        )) :
                                        <p> </p>
                                    }
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="certificates" title={`USER CERTIFICATES (${this.state.certificate_rows.length})`}>
                            <Table striped hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th style={{width:'10%', padding: '1%',textAlign: 'left', paddingLeft: '0.5%'}}>ID</th>
                                        <th style={{width:'20%'}}>CERTIFICATE NAME</th>
                                        <th style={{width:'16%'}}>ACCREDITOR</th>
                                        <th style={{width:'10%'}}>VERSION</th>
                                        <th style={{width:'20%'}}>FILES</th>
                                        <th style={{width:'12%'}}>START DATE</th>
                                        <th style={{width:'12%'}}>END DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.certificate_rows ? this.state.certificate_rows.map(certificate => (
                                            <tr>
                                                <td style={{textAlign: 'left'}}>{certificate.id}</td>
                                                <td>{certificate.name}</td>
                                                <td>{certificate.accreditor}</td>
                                                <td>{certificate.version}</td>
                                                <td><a href={process.env.REACT_APP_FILES_URL +certificate.file_url} target="_blank">{certificate.file_name}</a></td>
                                                <td>{certificate.start_date}</td>
                                                <td>{certificate.end_date}</td>
                                            </tr>
                                        )) :
                                        <p> </p>
                                    }
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>

                    {this.state.active_tab == 1 ?
                        <div>
                            {this.state.temp_archive_rows.length > this.state.perPageLimit ?
                                <div style={{float: 'right'}}>
                                    <Pagination
                                        prevPageText=' < '
                                        nextPageText=' > '
                                        firstPageText='First'
                                        lastPageText='Last'
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.perPageLimit}
                                        totalItemsCount={this.state.temp_archive_rows.length}
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
                        </div>:
                        <div>
                            {this.state.temp_certificate_rows.length > this.state.perPageLimit ?
                                <div style={{float: 'right'}}>
                                    <Pagination
                                        prevPageText=' < '
                                        nextPageText=' > '
                                        firstPageText='First'
                                        lastPageText='Last'
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.perPageLimit}
                                        totalItemsCount={this.state.temp_certificate_rows.length}
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
                    }
                </div>

                {/* ADD FILE MODAL*/}
                <Modal show={this.state.openUploadDocument} onHide={this.closeUploadDocument}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form ref="uploadFileForm" noValidate
                              validated={validated}>
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Control type="text" placeholder="Enter File Name" required
                                                      onChange={(event) => this.setState({file_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            File name id is required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group style={{marginLeft: '4%'}}>
                                        <input type="file" ref="document" onChange={this.readURL} />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Dropdown style={{marginTop: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.default_dropdown_folder}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {this.state.folders_list ? this.state.folders_list.map(folder => (
                                                        <Dropdown.Item value={folder.id} onClick={(id,name) => {this.handleChangeFolderSelect(folder.id,folder.name)}}>{folder.name}</Dropdown.Item>
                                                    ))

                                                    :
                                                    <Dropdown.Item value="">No Folder</Dropdown.Item>
                                                }
                                                <Dropdown.Divider />
                                                <Dropdown.Item className="addNewButton" onClick={this.handleShowAddFolderModal} >ADD NEW FOLDER</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Dropdown style={{marginTop: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.default_dropdown_related_to}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item value="user" onClick={(value,capValue) =>{this.handleChangeRelated_to("user","User")}}>User</Dropdown.Item>
                                                <Dropdown.Item value="role" onClick={(value,capValue) =>{this.handleChangeRelated_to("role","Role")}}>Role</Dropdown.Item>
                                                <Dropdown.Item value="certificate" onClick={(value,capValue) =>{this.handleChangeRelated_to("certificate","Certificate")}}>Certificate</Dropdown.Item>
                                                <Dropdown.Item value="others" onClick={(value,capValue) =>{this.handleChangeRelated_to("others","Others")}}>Others</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                {this.state.folder_id != "" && this.state.folder_id != -1 ?
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Group as={Col}>
                                            <Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_sub_folder}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.sub_folders_list.length > 0 ? this.state.sub_folders_list.map(subFolder => (
                                                            <Dropdown.Item value={subFolder.id} onClick={(id, name) => {
                                                                this.handleChangeSubFolderSelect(subFolder.id, subFolder.subfolder_name)
                                                            }}>{subFolder.subfolder_name}</Dropdown.Item>
                                                        ))

                                                        :
                                                        <Dropdown.Item value="">No Sub Folder</Dropdown.Item>
                                                    }
                                                    <Dropdown.Divider/>
                                                    <Dropdown.Item className="addNewButton"
                                                                   onClick={this.handleShowAddSubFolderModal}>ADD NEW
                                                        SUB FOLDER</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    </Col> : <span></span>
                                }

                                {this.state.related_to == "role" ?
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Group as={Col}>
                                            <Select
                                                closeMenuOnSelect={true}
                                                name="selectRole"
                                                components={makeAnimated()}
                                                options={this.state.roles_list_file}
                                                placeholder="Search role..."
                                                onChange={this.handleChangeRole}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {/*<Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_role}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.roles_list_file!="" && this.state.roles_list_file.length>1 ? this.state.roles_list_file.map(role => (
                                                            <Dropdown.Item value={role.id}
                                                                           onClick={(id, name) => {this.handleChangeRole(role.id, role.name)}}>{role.name}</Dropdown.Item>
                                                        ))

                                                        :
                                                        <Dropdown.Item value="">No Role</Dropdown.Item>
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>*/}
                                        </Form.Group>
                                    </Col> : <span></span>
                                }
                                {this.state.related_to == "certificate"?
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Group as={Col}>
                                            <Select
                                                closeMenuOnSelect={true}
                                                name="selectCertificate"
                                                components={makeAnimated()}
                                                options={this.state.certificate_list_file}
                                                placeholder="Search certificate..."
                                                onChange={this.handleChangeCertificate}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {/*<Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_certificate}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.certificate_list_file != "" && this.state.certificate_list_file.length>1 ? this.state.certificate_list_file.map(certificate => (
                                                            <Dropdown.Item value={certificate.id} onClick={(id,name) => {this.handleChangeCertificate(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
                                                        ))

                                                        :
                                                        <Dropdown.Item value="">No Certificate</Dropdown.Item>
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>*/}
                                        </Form.Group>
                                    </Col> :
                                    <span></span>
                                }
                            </Row>


                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Dropdown style={{marginTop: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.default_dropdown_category}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {this.state.category_list ? this.state.category_list.map(category => (
                                                        <Dropdown.Item value={category.id} onClick={(id,name) => {this.handleChangeCategory(category.id,category.name)}}>{category.name}</Dropdown.Item>
                                                    ))

                                                    :
                                                    <Dropdown.Item value="">No Categories</Dropdown.Item>
                                                }
                                                <Dropdown.Divider />
                                                <Dropdown.Item className="addNewButton" onClick={this.handleClickOpenCategory} >ADD NEW CATEGORY</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeUploadDocument}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.uploadUserFile} style={{marginLeft: 5}}>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>



                {/* ADD FOLDER MODAL*/}
                <Modal show={this.state.add_new_folder_modal} onHide={this.handleCloseAddFolderModal}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Folder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Folder Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Folder Name"
                                                  onChange={(event) => this.setState({new_folder_name: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseAddFolderModal}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addNewFolder} style={{marginLeft: 5}}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* ADD SUB FOLDER MODAL*/}
                <Modal show={this.state.add_new_sub_folder_modal} onHide={this.handleCloseAddSubFolderModal}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Sub Folder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Sub Folder Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Sub Folder Name"
                                                  onChange={(event) => this.setState({new_sub_folder_name: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseAddSubFolderModal}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addNewSubFolder} style={{marginLeft: 5}}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* FOLDER VIEW MODAL */}
                <Modal show={this.state.folder_view_modal} onHide={this.handleCloseFolderViewModal}
                       aria-labelledby="contained-modal-title-vcenter" size="lg" id="myMm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Folder View</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row style={{width: '90%'}}>
                                {this.state.folder_view_files ?  this.state.folder_view_files.map(file => (
                                        <Col xs={4} sm={4} md={2} lg={2} style={{height: 60, textAlign: 'center'}}>
                                            {file.type == "file"?
                                                <i class="fa fa-file fa-2x allFiles" aria-hidden="true"
                                                   onClick={(event,url,type,extention)=>{this.setFileUrl(event,file.file_url,file.type,file.extention)}}>
                                                </i>:
                                                <i class={`fa fa-file-${file.type}-o fa-2x allFiles`} aria-hidden="true" style={{cursor:'pointer'}}
                                                   onClick={(event,url,type,extention)=>{this.setFileUrl(event,file.file_url,file.type,file.extention)}}></i>

                                            }
                                            <label className="textOut" style={{marginRight:10}}>{file.file_name}</label>
                                        </Col>
                                    )):
                                    <label>No Files</label>
                                }
                            </Row>
                            <Row>
                                <Col xs={8} sm={8} md={9} lg={9}>
                                    <Form.Group as={Col}>

                                        {this.state.file_url_to_view == null ?
                                            <div>
                                                NO DATA AVAILABLE TO DISPLAY
                                            </div>:
                                            <span>
                                                {this.state.file_type_to_view == "image"?
                                                    <Image style={{width: '100%', border: '12px solid #c1c1c1'}} src={this.state.file_url_to_view} />:
                                                    <GoogleDocsViewer
                                                        width="100%"
                                                        height="500px"
                                                        fileUrl={this.state.file_url_to_view}
                                                    />
                                                }
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={4} sm={4} md={3} lg={3}>
                                    <h1 style={{marginBottom:5, width: '100%',textAlign: 'center', fontWeight: 'bold'}}>
                                        SHARE
                                    </h1>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.printDoc(0)}}>
                                        PRINT
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.convertToPdf(0)}}>
                                        CREATE PDF
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}}>
                                        EMAIL
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.zipAndDownload(0)}}>
                                        DOWNLOAD
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={this.addToBundle}>
                                        ADD TO BUNDLE
                                    </Button>
                                </Col>
                            </Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClick={this.handleCloseFolderViewModal}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* SUB FOLDER VIEW MODAL */}
                <Modal show={this.state.subfolder_view_modal} onHide={this.handleCloseSubFolderViewModal}
                       aria-labelledby="contained-modal-title-vcenter" size="lg" id="myMm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Sub Folder View</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row style={{width: '90%'}}>
                                {this.state.subfolder_view_files ?  this.state.subfolder_view_files.map(file => (
                                        <Col xs={4} sm={4} md={2} lg={2} style={{height: 60, textAlign: 'center'}}>
                                            {file.type == "file"?
                                                <i class="fa fa-file fa-2x allFiles" aria-hidden="true"
                                                   onClick={(event,url,type,extention)=>{this.setFileUrl(event,file.file_url,file.type,file.extention)}}>
                                                </i>:
                                                <i class={`fa fa-file-${file.type}-o fa-2x allFiles`} aria-hidden="true" style={{cursor:'pointer'}}
                                                   onClick={(event,url,type,extention)=>{this.setFileUrl(event,file.file_url,file.type,file.extention)}}></i>

                                            }
                                            <label className="textOut" style={{marginRight:10}}>{file.file_name}</label>
                                        </Col>
                                    )):
                                    <label>No Files</label>
                                }
                            </Row>
                            <Row>
                                <Col xs={8} sm={8} md={9} lg={9}>
                                    <Form.Group as={Col}>

                                        {this.state.file_url_to_view == null ?
                                            <div>
                                                NO DATA AVAILABLE TO DISPLAY
                                            </div>:
                                            <span>
                                                {this.state.file_type_to_view == "image"?
                                                    <Image style={{width: '100%', border: '12px solid #c1c1c1'}} src={this.state.file_url_to_view} />:
                                                    <GoogleDocsViewer
                                                        width="100%"
                                                        height="500px"
                                                        fileUrl={this.state.file_url_to_view}
                                                    />
                                                }
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={4} sm={4} md={3} lg={3}>
                                    <h1 style={{marginBottom:5, width: '100%',textAlign: 'center', fontWeight: 'bold'}}>
                                        SHARE
                                    </h1>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.printDoc(1)}}>
                                        PRINT
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.convertToPdf(1)}}>
                                        CREATE PDF
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}}>
                                        EMAIL
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={()=>{this.zipAndDownload(1)}}>
                                        DOWNLOAD
                                    </Button>
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}} onClick={this.addToBundle}>
                                        ADD TO BUNDLE
                                    </Button>
                                </Col>
                            </Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClick={this.handleCloseSubFolderViewModal}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* FILE VIEW MODAL */}
                <Modal show={this.state.file_view_modal} onHide={this.handleCloseFileViewModal}
                       aria-labelledby="contained-modal-title-vcenter" size="lg" id="myMm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>File View</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>

                                    {this.state.file_url_to_view == null ?
                                        <div>
                                            NO DATA AVAILABLE TO DISPLAY
                                        </div>:
                                        <span>
                                                {this.state.file_type_to_view == "image"?
                                                    <Image style={{width: '100%', border: '12px solid #c1c1c1'}} src={this.state.file_url_to_view} />:
                                                    <GoogleDocsViewer
                                                        width="100%"
                                                        height="500px"
                                                        fileUrl={this.state.file_url_to_view}
                                                    />
                                                }
                                            </span>
                                    }
                                </Form.Group>
                            </Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClick={this.handleCloseFileViewModal}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* BUNDLE VIEW MODAL */}
                <Modal show={this.state.bundle_view_modal} onHide={this.handleCloseBundleViewModal}
                       aria-labelledby="contained-modal-title-vcenter" size="lg" id="bundleVieModal"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Bundle View</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row style={{width: '90%'}}>
                                {this.state.bundle_view_files.length>0 ? this.state.bundle_view_files.map(file => (
                                        <Col xs={4} sm={4} md={2} lg={2} style={{height: 60, textAlign: 'center'}}>
                                            {file.type == "file"?
                                                <i class="fa fa-file" aria-hidden="true"></i>:
                                                <i class={`fa fa-file-${file.type}-o fa-2x allFiles`} aria-hidden="true" style={{cursor:'pointer'}}
                                                   onClick={(event,url,type,extention)=>{this.setFileUrl(event,file.file_url,file.type,file.extention)}}></i>

                                            }
                                            <label className="textOut" style={{marginRight:10}}>{file.file_name}</label>
                                        </Col>
                                    )):
                                    ''
                                }
                            </Row>
                            <Row>
                                <Col xs={8} sm={8} md={9} lg={9}>
                                    <Form.Group as={Col}>

                                        {this.state.file_url_to_view == null ?
                                            <div>
                                                NO DATA AVAILABLE TO DISPLAY
                                            </div>:
                                            <span>
                                                {this.state.file_type_to_view == "image"?
                                                    <Image style={{width: '100%', border: '12px solid #c1c1c1'}} src={this.state.file_url_to_view} />:
                                                    <GoogleDocsViewer
                                                        width="100%"
                                                        height="500px"
                                                        fileUrl={this.state.file_url_to_view}
                                                    />
                                                }
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={4} sm={4} md={3} lg={3}>
                                    <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10, width: '100%'}} onClick={this.bundleToPdf}>
                                        Bundle PDF
                                    </Button>

                                    <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10, width: '100%'}} onClick={this.downloadBundle}>
                                        Download Bundle
                                    </Button>

                                    <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10, width: '100%'}}>
                                        Email Bundle
                                    </Button>

                                    <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10, width: '100%'}} onClick={this.bundlePrint}>
                                        Print Bundle
                                    </Button>
                                    <Button variant="outline-danger" style={{marginRight: 10, marginBottom: 10, width: '100%'}} onClick={this.removeBundleViewFile}>
                                        Remove Fom Bundle
                                    </Button>
                                </Col>
                            </Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClick={this.handleCloseBundleViewModal}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>




                {/* ADD CATEGORY MODAL*/}
                <Modal show={this.state.openAddCategory} onHide={this.handleCloseCategory}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Col xs={12} sm={12} md={8} lg={8}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Category Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Category Name"
                                                      onChange={(event) => this.setState({add_file_category: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4}>
                                </Col>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseCategory}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addCategory} style={{marginLeft: 5}}>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* SUCCESS MODAL*/}
                <Modal show={this.state.openSuccessPopup} onHide={this.handleCloseSuccess}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.message_success}
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClose={this.handleCloseSuccess}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>
              
            </div>
        )
    }

}


export default UserArchive;
