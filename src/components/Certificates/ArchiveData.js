/* eslint-disable */
import React, {Component} from 'react';
import { Dropdown, DropdownButton, Container,Card, ListGroup, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Table, Modal,Tab, Tabs,Image  } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GoogleDocsViewer from 'react-google-docs-viewer';
/*import logger from 'logging-library';*/
import FileViewer from 'react-file-viewer';
/*import { CustomErrorComponent } from 'custom-error';*/

import Downloader from 'js-file-downloader';
import printJS from 'print-js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';
import Pagination from "react-js-pagination";
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import axios from "axios/index";
import swal from 'sweetalert';
const file = 'https://cdn.scotch.io/scotchy-uploads/2014/10/react-tweets-demo-2.png';
const type = 'png';

const pxToMm = (px) => {
    return Math.floor(px/document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight*mm;
};

const range = (start, end) => {
    return Array(end-start).join(0).split(0).map(function(val, id) {return id+start});
};

const Api2Pdf = require('api2pdf');
const a2pClient = new Api2Pdf('100132f5-688e-4ed0-8ece-4379c9de1dc5');
const async = require('async');

class ArchiveData extends Component {
    constructor(props) {
        super(props);

        this.handleShowAddArchiveModal = this.handleShowAddArchiveModal.bind(this);
        this.handleCloseAddArchiveModal = this.handleCloseAddArchiveModal.bind(this);
        this.handleShowAddFolderModal = this.handleShowAddFolderModal.bind(this);
        this.handleCloseAddFolderModal = this.handleCloseAddFolderModal.bind(this);
        this.handleShowAddCategoryModal = this.handleShowAddCategoryModal.bind(this);
        this.handleCloseAddCategoryModal = this.handleCloseAddCategoryModal.bind(this);
        this.addNewFolder = this.addNewFolder.bind(this);

        this.state = {
            validated: false,
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            rows_count_certificate: 0,
            rows_count_archive: 0,
            isDesc: false,
            column: '',
            archive_bundle_array: [],
            certificate_bundle_array: [],
            bundle_view_files: [],
            archive_rows: [],
            temp_archive_rows: [],
            certificate_rows: [],
            temp_certificate_rows: [],
            folders_list : [],
            sub_folders_list : [],
            users_list : [],
            roles_list : [],
            category_list : [],
            files : [],
            certificates_list : [],
            default_dropdown_folder : "Select Folder",
            default_dropdown_sub_folder : "Select Sub Folder",
            default_dropdown_related_to : "Select Realted To",
            default_dropdown_user : "Select User",
            default_dropdown_role : "Select Role",
            default_dropdown_certificate : "Select Certificate",
            default_dropdown_category : "Select Category",
            folder_id : -1,
            sub_folder_id : -1,
            object_name : "",
            related_to : "",
            user_id : -1,
            role_id : -1,
            certificate_id : -1,
            objectComments: '',
            folder_name : "",
            sub_folder_name : "",
            new_folder_name : "",
            new_sub_folder_name : "",
            new_category_name : "",
            category_id : "",
            category_name : "",
            add_new_archive_modal : false,
            add_new_folder_modal : false,
            add_new_sub_folder_modal : false,
            add_new_category_modal : false,
            folder_view_modal : false,
            subfolder_view_modal : false,
            folder_view_files: [],
            subfolder_view_files : [],
            file_view_modal : false,
            bundle_view_modal : false,
            file_url_to_view : null,
            file_type_to_view : null,
            file_type_extention : "",
            active_tab : 1,

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
            temp_certificates: "",
            filter_result_certificates : "",
            filter_dropdown_category_certificates : "Select Category",
            filter_dropdown_related_to_certificates : "Select Realted To",
            filter_dropdown_uploaded_by_certificates : "Select Uploded By",
            filter_start_date_certificates : "",
            filter_end_date_certificates : "",
            filter_certificate_date_show : null,
            filter_search_string_certificates : "",
            filterationObj_certificates : {
                "category_name": "",
                "related_to_name": "",
                "uploaded_by": "",
                "start_date": "",
                "end_date": "",
                "string": ""
            }
        };
    }

    componentDidMount() {
        this.getAllArchives();
        this.getFoldersList();
        this.getCategoryList();
    }
    getAllArchives = () => {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_archive_main", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    let allCertificateRows = [];
                    let certificateRows = [];
                    let allArchiveRows = [];
                    let archiveRows = [];

                    let perPageLimit = this.state.perPageLimit;
                    let rows_count_certificate= 0;
                    for(let i=0;i<result.certificate_rows.length;i++){
                        rows_count_certificate = rows_count_certificate + 1;
                        if(result.certificate_rows[i].uploaded_at.length!=0) {
                            const date = new Date(result.certificate_rows[i].uploaded_at);
                            const formattedDate = moment(date).format('DD-MMM-YY');
                            result.certificate_rows[i].uploaded_at = formattedDate;
                        }
                        allCertificateRows.push(result.certificate_rows[i]);
                        if(rows_count_certificate <= perPageLimit) {
                            certificateRows.push(result.certificate_rows[i]);
                        }
                    }
                    let rows_count_archive = 0;
                    for(let j=0;j<result.archive_rows.length;j++){
                        rows_count_archive = rows_count_archive + 1;
                        if(result.archive_rows[j].uploaded_at.length!=0) {
                            const date = new Date(result.archive_rows[j].uploaded_at);
                            const formattedDate = moment(date).format('DD-MMM-YY');
                            result.archive_rows[j].uploaded_at = formattedDate;
                        }
                        allArchiveRows.push(result.archive_rows[j])
                        if(rows_count_archive <= perPageLimit) {
                            archiveRows.push(result.archive_rows[j]);
                        }
                    }
                    this.setState({
                        archive_rows: archiveRows,
                        temp_archives: result.archive_rows,
                        temp_archive_rows: allArchiveRows,
                        rows_count_archive: rows_count_archive,
                        certificate_rows: certificateRows,
                        temp_certificates: result.certificate_rows,
                        temp_certificate_rows: allCertificateRows,
                        rows_count_certificate: rows_count_certificate
                    });
                },
                (error) => {

                }
            )
    };
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
                title: "Error!",
                text: "Kindly Add Folder Name!",
                icon: "error",
            });
            return;
        }
        this.setState({
            add_new_folder_modal : false
        });
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_folder",{
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
                title: "Error!",
                text: "Kindly Add Sub Folder Name!",
                icon: "error",
            });
            return;
        }
        this.setState({
            add_new_folder_modal : false
        });
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_subfolder",{
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

    addNewArchive =() => {
        const form = this.refs.addNewObjectForm;
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
        let subFolderId = this.state.sub_folder_id;
        if(this.state.sub_folder_id == -1 || this.state.sub_folder_id == null){
            subFolderId = 0;
            /*errorString = errorString + "You Must Select Sub Folder!\n";
            showErrorChk = true;*/
        }
        if(this.state.category_id == "" || this.state.category_id == null){
            errorString = errorString + "You Must Select Category!\n";
            showErrorChk = true;
        }
        if(this.state.related_to == "" || this.state.related_to == null){
            errorString = errorString + "You Must Select Related To!\n";
            showErrorChk = true;
        }
        if(this.state.related_to == "user"){
            if(this.state.user_id == -1) {
                errorString = errorString + "You Must Select User!\n";
                showErrorChk = true;
            }
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
        if(this.state.files.length<1){
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
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_file_object", {
            method: "POST",
            body:JSON.stringify({
                'folder_id': this.state.folder_id,
                'folder_name': this.state.folder_name,
                'subfolder_id': subFolderId,
                'object_name': this.state.object_name,
                'related_to': this.state.related_to,
                'category_id': this.state.category_id,
                'user': this.state.user_id,
                'role': this.state.role_id,
                'certificate': this.state.certificate_id,
                'files': this.state.files,
                'comments': this.state.objectComments
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.getAllArchives();
                    swal({
                        title: "Success!",
                        text: "Object Added Successfully",
                        icon: "success",
                    });
                    this.setState({
                        add_new_archive_modal: false,
                        folder_id: -1,
                        sub_folder_id: -1,
                        object_name: "",
                        related_to: "",
                        category_id: "",
                        user_id: -1,
                        role_id: -1,
                        certificate_id: -1,
                        files: [],
                        objectComments: "",
                        validate: false
                    });
                },
                (error) => {
                    swal({
                        title: "Error!",
                        text: "Unable To Add Object",
                        icon: "error",
                    });
                }
            )
    };
    getUsersList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(function (res) {
                        res.label = res.username;
                        res.value = res.id;
                    })
                    this.setState({ users_list: result });
                },

                (error) => {

                }
            )
    }
    getCertificateList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list",{
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
                    this.setState({ certificates_list: result });
                },
                (error) => {

                }
            )
    }
    getRolesList(){
        fetch("/api/get_roles", {
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
                    this.setState({ roles_list: result });
                },

                (error) => {

                }
            )
    }
    getCategoryList = () => {
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
    addCategory = () => {
        this.setState({
            add_new_category_modal: false
        });
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_file_category",{
            method: "POST",
            body:JSON.stringify({
                'name': this.state.new_category_name,
            }),
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

    checkTab =(event)=>{
        if(event.target.id == "userArchivesTabView-tab-archives"){
            this.setState({
                activePage: 1,
                active_tab:1,
                default_perPageLimit: "No of pages",
                isDesc: false,
                column: ''
            })
        }
        if(event.target.id == "userArchivesTabView-tab-certificates"){
            this.setState({
                activePage: 1,
                active_tab:2,
                default_perPageLimit: "No of pages",
                isDesc: false,
                column: ''
            })
        }
    }

    handleCloseAddArchiveModal() {
        this.setState({ add_new_archive_modal: false });
    }

    handleShowAddArchiveModal() {
        this.setState({ add_new_archive_modal: true });
    }
    handleCloseAddFolderModal() {
        this.setState({ add_new_folder_modal: false });
    }
    handleCloseAddSubFolderModal=()=> {
        this.setState({ add_new_sub_folder_modal: false });
    }

    handleShowAddFolderModal() {
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
    handleCloseAddCategoryModal() {
        this.setState({ add_new_category_modal: false });
    }

    handleShowAddCategoryModal() {
        this.setState({
            add_new_category_modal: true,
            category_id: "",
            category_name: "",
            default_dropdown_category: "Select Category"
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
            for (let i = 0; i < this.state.temp_archives.length; i++) {
                if (this.state.temp_archives[i].subfolder_id == subfolder_id) {
                    let obj = this.state.temp_archives[i];
                    let ext = obj.file_name.split(".");
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
                    files.push(this.state.temp_archives[i]);
                }
            }
        }
        else{
            for (let i = 0; i < this.state.temp_archives.length; i++) {
                if (this.state.temp_archives[i].folder_id == folder_id && this.state.temp_archives[i].subfolder_id == 0) {
                    let obj = this.state.temp_archives[i];
                    let ext = obj.file_name.split(".");
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
                    files.push(this.state.temp_archives[i]);
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

    handleShowFolderViewModal=(id)=> {
        let files = [];
        for(let i=0;i<this.state.temp_archives.length;i++){
            if(this.state.temp_archives[i].object_id == id){
                let obj = this.state.temp_archives[i];
                let ext = obj.file_name.split(".");
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
                files.push(this.state.temp_archives[i]);
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
    handleShowFolderViewModalCertificate=(id)=> {
        let files = [];
        for(let i=0;i<this.state.temp_certificates.length;i++){
            if(this.state.temp_certificates[i].object_id == id){
                let obj = this.state.temp_certificates[i];
                let ext = obj.file_name.split(".");
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
                files.push(this.state.temp_certificates[i]);
            }
        }
        let newUrl = null;
        let fileType = null;
        if(files.length>0) {
            newUrl = process.env.REACT_APP_FILES_URL + files[0].file_url;
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
    handleChangeRelatedTo =(value,capValue) =>{
        if(value == "user"){
            this.getUsersList();
        }
        else if(value == "role"){
            this.getRolesList();
        }
        else if(value == "certificate"){
            this.getCertificateList();
        }
        this.setState({
            related_to: value,
            default_dropdown_related_to: capValue
        });
    };
    handleChangeRelatedToFurtherSelect =(selected) =>{
        if(this.state.related_to == "user"){
            this.setState({
                user_id: selected.value,
                default_dropdown_user: selected.label
            });
        }
        else if(this.state.related_to == "role"){
            this.setState({
                role_id: selected.value,
                default_dropdown_role: selected.label
            });
        }
        else if(this.state.related_to == "certificate"){
            this.setState({
                certificate_id: selected.value,
                default_dropdown_certificate: selected.label
            });
        }

    };
    handleChangeCategorySelect = (id,name) => {
        this.setState({
            category_id: id,
            category_name: name,
            default_dropdown_category: name
        });
    }
    addFile = () => {
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name : files.files[0].name, file : fileBase64[1]}
                arr.push(data);
                this.setState({
                    files:arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }

    removeFile = (name) => {
        var data = this.state.files;
        for (var i = 0; i < data.length; i++) {
            if(data[i].name == name){
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            files:data
        });
    }
    handleChangeAllArchives = (e) => {
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1 && inputs[i].classList.contains("archives")) {
                inputs[i].checked = e.target.checked;
                // This way it won't flip flop them and will set them all to the same value which is passed into the function
            }
        }
    }
    handleChangeAllCertificates = (e) => {
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1 && inputs[i].classList.contains("certificates")) {
                inputs[i].checked = e.target.checked;
                // This way it won't flip flop them and will set them all to the same value which is passed into the function
            }
        }
    }
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
            filter_archive_date_show : "",
            filter_search_string_archives : "",
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

        let allArchives = filter_result;
        let allArchiveRows = [];
        let archiveRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count_archive = 0;

        for(let i=0;i<allArchives.length;i++){
            rows_count_archive = rows_count_archive + 1;
            allArchiveRows.push(allArchives[i]);
            if(rows_count_archive <= perPageLimit){
                archiveRows.push(allArchives[i]);
            }
        }
        this.setState({
            archive_rows: archiveRows,
            rows_count_archive: rows_count_archive,
            activePage: 1
        });
    }



    //CERTIFICATE FITER FUNCTIONS

    handleChangeCategoryFilterCertificate = (name) => {
        this.setState({
            filter_dropdown_category_certificates: name
        });
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.category_name = name;
        this.setState({
            filterationObj_certificates: filterationObj_certificates
        })
        this.filterResultCertificate();
    };
    handleChangeRelatedToFilterCertificate =(name,capName) => {
        this.setState({
            filter_dropdown_related_to_certificates: capName
        });
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.related_to_name = name;
        this.setState({
            filterationObj_certificates: filterationObj_certificates
        })
        this.filterResultCertificate();
    };
    handleChangeSearchListFilterCertificate = (event) => {
        this.setState({
            filter_search_string_certificates: event.target.value,
        });
        if(event.target.value==""){
            this.setState({
                filter_result: "",
            });
        }
    }
    handleCancelDateCertificate = (event, picker) => {
        this.setState({
            filter_start_date_certificates: null,
            filter_end_date_certificates: null
        });
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.start_date = "";
        filterationObj_certificates.end_date = "";
        this.setState({
            filterationObj_certificates: filterationObj_certificates
        })
        this.filterResultCertificate();
    }
    handleApplyDateCertificate = (event, picker) => {
        let filter_archive_date_show = moment(picker.startDate._d).format('DD-MMM-YY') + " to " + moment(picker.endDate._d).format('DD-MMM-YY');
        this.setState({
            filter_start_date_certificates: picker.startDate._d,
            filter_end_date_certificates: picker.endDate._d,
            filter_archive_date_show: filter_archive_date_show
        });
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.start_date = picker.startDate._d;
        filterationObj_certificates.end_date = picker.endDate._d;
        this.setState({
            filterationObj_certificates: filterationObj_certificates
        })
        this.filterResultCertificate();
    }
    handleKeyPressCertificate = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.searchListFilterCertificate();
        }
    }
    searchListFilterCertificate = () => {
        var searchValue = this.state.filter_search_string_certificates.toString().toLowerCase();
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.string = searchValue;
        this.setState({
            filterationObj_certificates: filterationObj_certificates
        })
        this.filterResultCertificate();
    }
    searchClearFilterCertificate = () => {
        let filterationObj_certificates = this.state.filterationObj_certificates;
        filterationObj_certificates.category_name = "";
        filterationObj_certificates.related_to_name = "";
        filterationObj_certificates.uploaded_by = "";
        filterationObj_certificates.start_date = "";
        filterationObj_certificates.end_date = "";
        filterationObj_certificates.string = "";

        this.setState({
            filter_dropdown_category_certificates : "Select Category",
            filter_dropdown_related_to_certificates : "Select Realted To",
            filter_dropdown_uploaded_by_certificates : "Select Uploded By",
            filter_start_date_certificates : "",
            filter_end_date_certificates : "",
            filter_search_string_certificates : "",
            filterationObj_certificates: filterationObj_certificates,
            certificate_rows: this.state.temp_certificate_rows,
            activePage: 1
        })
        this.filterResultCertificate();
    }
    filterResultCertificate = () => {
        let filterationObj = this.state.filterationObj_certificates;
        let filterdBefore = 0;
        // var data = this.state.temp_certificates;
        var data = this.state.temp_certificate_rows;
        var filter_result = [];
        // console.log(data);

        /*if(filterationObj.category_name!=null && filterationObj.category_name!="") {
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
        }*/
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
        let allCertificates = filter_result;
        let certificateRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count_certificate = 0;

        for(let i=0;i<allCertificates.length;i++){
            rows_count_certificate = rows_count_certificate + 1;
            if(rows_count_certificate <= perPageLimit){
                certificateRows.push(allCertificates[i]);
            }
        }

        this.setState({
            certificate_rows: certificateRows,
            rows_count_certificate: rows_count_certificate,
            activePage: 1
        });
    }
    onError = (e) => {
        swal({
            title: "Error!",
            text: "Error In File!",
            icon: "error",
        });
        // logger.logError(e, 'error in file-viewer');
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
                title: "Info!",
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
                /*zip.file(filename, url, {binary:true});
                count++;
                if (count == urls.length) {
                    zip.generateAsync({type:"blob"}).then(function(content) {
                        // see FileSaver.js
                        FileSaver.saveAs(content, zipFilename);
                    });
                }*/
                /*axios.get(url,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/png'
                        }
                    })
                    .then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'file.pdf'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch((error) => console.log(error));*/
                /*axios({
                    url: url,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    abc = response.data;
                    /!*const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'file.pdf');
                    document.body.appendChild(link);
                    link.click();*!/
                });*/

                /*var reader = new FileReader();
                reader.onloadend = function (e) {
                    abc = e.target.result
                    // this.addCertificateQuerry();
                }.bind(this);
                reader.readAsDataURL(url);*/

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
                text: "No Files Present!",
                icon: "info",
            });
        }
    }
    addToBundle = () => {
        let bundle_files = this.state.bundle_view_files;
        if (this.state.active_tab == 1) {
            let files = this.state.archive_bundle_array;
            for (let i = 0; i < this.state.temp_archives.length; i++) {
                let newUrl = process.env.REACT_APP_FILES_URL + this.state.temp_archives[i].file_url;
                newUrl = newUrl.replace(/\\/g,"/");
                if (newUrl == this.state.file_url_to_view) {
                    let chk = false;
                    for(let j=0;j<bundle_files.length;j++){
                        if(bundle_files[j].file_url == this.state.temp_archives[i].file_url){
                            chk = true;
                        }
                    }
                    if(chk == false){
                        bundle_files.push(this.state.temp_archives[i]);
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
    /*archiveBundleToPdf=()=>{
        const archives = this.state.archive_bundle_array;
        if(archives.length>0) {
            const urls = archives.map(async (obj) => {
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
    }*/
    /*downloadArchiveBundle = () => {
        const archives = this.state.archive_bundle_array;
        if(archives.length>0) {
            const urls = archives.map(async (obj) => {
                console.log(obj);
                let newUrl = process.env.REACT_APP_FILES_URL + obj.file_url;
                newUrl = newUrl.replace(/\\/g, "/");
                return a2pClient.libreofficeConvert(newUrl).then(function (result) {
                    console.log(newUrl + " new");
                    console.log(result.pdf + " result");
                    return result.pdf;
                });
            });

            Promise.all(urls).then((completed) => {
                console.log("completed");
                console.log(completed);
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
    }*/
    /*archiveBundlePrint=()=>{
        const archives = this.state.archive_bundle_array;
        if(archives.length>0) {
            const urls = archives.map(async (obj) => {
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
    }*/
    openBundleViewModal=()=>{
        let bundle_files = [];
        for(let i=0;i<this.state.bundle_view_files.length;i++){
            let obj = this.state.bundle_view_files[i];
            let ext = obj.file_name.split(".");
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
        if(property == "id") {
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
        else if(property == "uploaded_at") {
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
        else{
            records.sort(function (a, b) {
                if(a[property] == null){
                    a[property] = "";
                }
                if(b[property] == null){
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
            rows_count_archive: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            default_perPageLimit: "All",
            activePage: 1
        });
        /*
        let isDesc = !this.state.isDesc;
        this.setState({
            isDesc: !this.state.isDesc,
            column: property
        })

        let direction = this.state.isDesc ? 1 : -1;
        let records = this.state.archive_rows;
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

        let newRecords = [];
        records.forEach(function (record) {
            if (record[property] != "") {
                newRecords.push(record);
            }
            records.forEach(function (record2) {
                if ((record["id"] == record2["object_id"]) && record2[property] == "") {
                    newRecords.push(record2);
                }
            });
            /*let reversedRecords = JSON.parse(JSON.stringify(records));
            if(isDesc == false) {
                reversedRecords.reverse();
                console.log("reverse");
                console.log(reversedRecords);
            }
            reversedRecords.forEach(function (record2) {
                if (record["id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }

            });*/
        /*if(property == 'file_name') {
            if (record[property] != "") {
                newRecords.push(record);
            }
            records.forEach(function (record2) {
                let chk = false;
                if ((record["id"] == record2["object_id"])) {
                    newRecords.forEach(function (chkRecord) {
                        if(chkRecord["file_id"] == record["file_id"]) {
                            chk = true;
                        }
                    });
                    if(chk == false){
                        newRecords.push(record2);
                    }
                }
            });
        }
        else{
            if (record[property] != "") {
                newRecords.push(record);
            }
            records.forEach(function (record2) {
                if ((record["id"] == record2["object_id"]) && record2[property] == "") {
                    newRecords.push(record2);
                }
            });
        }
        */
    }
    sortCertificatesByColoumn =(property)=> {
        let isDesc = !this.state.isDesc;
        this.setState({
            isDesc: !this.state.isDesc,
            column: property
        })

        let direction = this.state.isDesc ? 1 : -1;
        let savedRrecords = this.state.temp_certificate_rows;
        let records = [];
        savedRrecords.forEach(function (rec) {
            if (rec["id"] != "") {
                records.push(rec);
            }
        });
        if(property == "id") {
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
        else if(property == "uploaded_at"){
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
        else{
            records.sort(function (a, b) {
                if(a[property] == null){
                    a[property] = "";
                }
                if(b[property] == null){
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
            certificate_rows: newRecords,
            temp_certificates_rows: newRecords,
            rows_count_certificate: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            activePage: 1

        });
    }
    handlePageChangeArchive = (pageNumber) => {
        let allArchives = this.state.temp_archive_rows;
        let archiveRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit -1;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count_archive = 0;
        for(let i=0;i<allArchives.length;i++){
            if(rows_count_archive>=startIndex && rows_count_archive<=endIndex){
                archiveRows.push(allArchives[i]);
            }
            rows_count_archive = rows_count_archive + 1;
        }

        this.setState({
            activePage: pageNumber,
            archive_rows: archiveRows
        });
    }
    handlePerPageLimitArchive = (noOfLinesLimit) => {
        let allArchives = this.state.temp_archive_rows;
        let archiveRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count_archive = 0;
        for(let i=0;i<allArchives.length;i++){
            rows_count_archive = rows_count_archive + 1;
            if(noOfLinesLimit == 0){
                archiveRows.push(allArchives[i]);
            }
            else{
                if(rows_count_archive>=startIndex && rows_count_archive<=endIndex){
                    archiveRows.push(allArchives[i]);
                }
            }
        }
        if(noOfLinesLimit == 0){  // all lines
            perPageLimit = rows_count_archive;
            default_perPageLimit = "All";
        }
        this.setState({
            default_perPageLimit: default_perPageLimit,
            perPageLimit: perPageLimit,
            activePage: 1,
            archive_rows: archiveRows,
            rows_count_archive: rows_count_archive
        });
    }
    hideAlert = () => {
        this.setState({
            showSuccessSweetAlert: false
        })
    }

    handlePageChangeCertificate = (pageNumber) => {
        let allCertificates = this.state.temp_certificate_rows;
        let certificateRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit -1 ;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count_certificate = 0;
        for(let i=0;i<allCertificates.length;i++){
            if(rows_count_certificate>=startIndex && rows_count_certificate<=endIndex){
                certificateRows.push(allCertificates[i]);
            }
            rows_count_certificate = rows_count_certificate + 1;
        }

        this.setState({
            activePage: pageNumber,
            certificate_rows: certificateRows
        });
    }
    handlePerPageLimitCertificate = (noOfLinesLimit) => {
        let allCertificates = this.state.temp_certificate_rows;
        let certificateRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count_certificate = 0;
        for(let i=0;i<allCertificates.length;i++){
            rows_count_certificate = rows_count_certificate + 1;
            if(noOfLinesLimit == 0){
                certificateRows.push(allCertificates[i]);
            }
            else{
                if(rows_count_certificate>=startIndex && rows_count_certificate<=endIndex){
                    certificateRows.push(allCertificates[i]);
                }
            }
        }
        if(noOfLinesLimit == 0){  // all lines
            perPageLimit = rows_count_certificate;
            default_perPageLimit = "All";
        }
        this.setState({
            default_perPageLimit: default_perPageLimit,
            perPageLimit: perPageLimit,
            activePage: 1,
            certificate_rows: certificateRows,
            rows_count_certificate: rows_count_certificate
        });
    }
    hideAlert = () => {
        this.setState({
            showSuccessSweetAlert: false
        })
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
                            <Button variant="outline-primary" onClick={this.handleShowAddArchiveModal} style={{marginRight: 10, marginBottom: 10}}>
                                Add New Object
                            </Button>

                            {/*<Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={this.archiveBundleToPdf}>
                                Bundle PDF
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={this.downloadArchiveBundle}>
                                Download Bundle
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}}>
                                Email Bundle
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={this.archiveBundlePrint}>
                                Print Bundle
                            </Button>
*/}
                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={(id)=>this.openBundleViewModal()}>
                                View Bundle
                            </Button>
                        </Form.Group>
                    </Form.Row>

                    {this.state.rows_count_archive > 0 ?
                        <Row style={{justifyContent: 'flex-end', marginBottom: 10}}>
                            <Dropdown style={{marginTop: 0, width: '15%'}}>
                                <Dropdown.Toggle>
                                    {this.state.default_perPageLimit}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item value="10" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(10)
                                    }}>10</Dropdown.Item>
                                    <Dropdown.Item value="20" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(20)
                                    }}>20</Dropdown.Item>
                                    <Dropdown.Item value="30" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(30)
                                    }}>30</Dropdown.Item>
                                    <Dropdown.Item value="40" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(40)
                                    }}>40</Dropdown.Item>
                                    <Dropdown.Item value="50" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(50)
                                    }}>50</Dropdown.Item>
                                    <Dropdown.Item value="all" onClick={(lines) => {
                                        this.handlePerPageLimitArchive(0)
                                    }}>All</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </Row> :
                        ''
                    }

                </form>
            </div>

        ]
        const FreeTextSearchCertificateTab = [
            <form className="" style={{width: '59.5%', marginTop: '1%'}}>
                <Form.Row style={{paddingLeft: 0, paddingBottom: 0}}>

                    <Form.Group as={Col} style={{marginTop: '1.8%'}}>
                        <DateRangePicker onCancel={this.handleCancelDateCertificate} onApply={this.handleApplyDateCertificate}>
                            <Form.Control type="text" placeholder="Pick A Date Range" value={this.state.filter_certificate_date_show} />
                        </DateRangePicker>
                    </Form.Group>

                    <Form.Group as={Col} style={{marginTop: '1.8%'}}>
                        <Form.Control type="text" placeholder="Enter Search String" value={this.state.filter_search_string_certificates}
                                      onChange={(event) => {this.handleChangeSearchListFilterCertificate(event)}} onKeyPress={this.handleKeyPressCertificate}
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <div style={{ marginTop: '5%'}}>
                            <Button variant="outline-primary" onClick={this.searchListFilterCertificate} style={{marginRight: 10}}>
                                <i class="fa fa-search" aria-hidden="true"></i>Search
                            </Button>
                            <Button variant="outline-primary" onClick={this.searchClearFilterCertificate}>
                                <i class="fa fa-times" aria-hidden="true"></i>Clear
                            </Button>
                        </div>

                    </Form.Group>


                </Form.Row>

            </form>
        ]
        const FreeTextSearchCertificateTabButtons = [
            <div style={{marginBottom: 15}}>
                <form style={{width: '98%'}}>
                    <Form.Row style={{paddingLeft: 0, paddingBottom: 0}}>
                        <Form.Group as={Col} style={{marginBottom: 0}}>
                            <Button variant="outline-primary" onClick={this.handleShowAddArchiveModal} style={{marginRight: 10, marginBottom: 10}}>
                                Add New Object
                            </Button>

                            {/*<Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}}>
                                Bundle PDF
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}}>
                                Download Bundle
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}}>
                                Email Bundle
                            </Button>

                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}}>
                                Print Bundle
                            </Button>
*/}
                            <Button variant="outline-primary" style={{marginRight: 10, marginBottom: 10}} onClick={this.openBundleViewModal}>
                                View Bundle
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </form>
            </div>

        ]
        return (
            <div style={{marginLeft: 15}}>
                {this.state.active_tab == 1 ?
                    <span>
                        {FreeTextSearch}
                    </span>:
                    <span>
                        {FreeTextSearchCertificateTab}
                        {FreeTextSearchCertificateTabButtons}
                        {this.state.rows_count_certificate > 0 ?
                            <Row style={{justifyContent: 'flex-end', margin: 0, marginBottom: 10}}>
                                <Dropdown style={{marginTop: 0, width: '15%'}}>
                                    <Dropdown.Toggle>
                                        {this.state.default_perPageLimit}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item value="10" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(10)
                                        }}>10</Dropdown.Item>
                                        <Dropdown.Item value="20" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(20)
                                        }}>20</Dropdown.Item>
                                        <Dropdown.Item value="30" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(30)
                                        }}>30</Dropdown.Item>
                                        <Dropdown.Item value="40" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(40)
                                        }}>40</Dropdown.Item>
                                        <Dropdown.Item value="50" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(50)
                                        }}>50</Dropdown.Item>
                                        <Dropdown.Item value="all" onClick={(lines) => {
                                            this.handlePerPageLimitCertificate(0)
                                        }}>All</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Row> :
                            ''
                        }

                    </span>
                }

                <div style={{width: '100%'}}>
                    <Tabs defaultActiveKey="archives" id="userArchivesTabView" onClick={this.checkTab}>
                        <Tab eventKey="archives" title={`ARCHIVES (${this.state.rows_count_archive})`}>
                            <Table striped hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th style={{width:'4%', padding: '1%', paddingTop: '1.3%'}}><input type="checkbox" value="-1" onChange={e => this.handleChangeAllArchives(e)} /></th>
                                        <th style={{width:'10%'}} onClick={()=>{this.sortArchivesByColoumn('folder_name')}}>
                                            FOLDER
                                            <i className={this.state.column!='folder_name'?
                                                "fa fa-sort": (this.state.column == 'folder_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'10%'}} onClick={()=>{this.sortArchivesByColoumn('subfolder_name')}}>
                                            SUB FOLDER
                                            <i className={this.state.column!='subfolder_name'?
                                                "fa fa-sort": (this.state.column == 'subfolder_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'7%'}} onClick={()=>{this.sortArchivesByColoumn('id')}}>
                                            OBJECT ID
                                            <i className={this.state.column!='id'?
                                                "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortArchivesByColoumn('object_name')}}>
                                            OBJECT NAME
                                            <i className={this.state.column!='object_name'?
                                                "fa fa-sort": (this.state.column == 'object_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortArchivesByColoumn('uploaded_at')}}>
                                            DATE UPLOADED
                                            <i className={this.state.column!='uploaded_at'?
                                                "fa fa-sort": (this.state.column == 'uploaded_at' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'9%'}} onClick={()=>{this.sortArchivesByColoumn('category_name')}}>
                                            CATEGORY
                                            <i className={this.state.column!='category_name'?
                                                "fa fa-sort": (this.state.column == 'category_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortArchivesByColoumn('related_to')}}>
                                            RELATION
                                            <i className={this.state.column!='related_to'?
                                                "fa fa-sort": (this.state.column == 'related_to' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortArchivesByColoumn('file_name')}}>
                                            FILES
                                            <i className={this.state.column!='file_name'?
                                                "fa fa-sort": (this.state.column == 'file_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortArchivesByColoumn('comments')}}>
                                            COMMENTS
                                            <i className={this.state.column!='comments'?
                                                "fa fa-sort": (this.state.column == 'comments' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.archive_rows ? this.state.archive_rows.map(archive => (
                                            <tr>
                                                <td>{archive.checkbox  && <input type="checkbox" className="archives" value={archive.id} />}</td>
                                                <td>{archive.folder_name}</td>
                                                <td style={{cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowSubFolderViewModal(archive.folder_id, archive.subfolder_id)}}>
                                                    {archive.subfolder_name}
                                                </td>
                                                <td>{archive.id}</td>
                                                <td style={{cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowFolderViewModal(archive.object_id)}}>
                                                    {archive.object_name}
                                                </td>
                                                <td>{archive.uploaded_at}</td>
                                                <td>{archive.category_name}</td>
                                                <td>{archive.related_to}</td>
                                                <td style={{wordBreak: 'break-all',cursor:'pointer',color: '#007bff'}}
                                                    onClick={(id)=>{this.handleShowFileViewModal(archive.file_url)}}>
                                                    {/*<a href={process.env.REACT_APP_FILES_URL +archive.file_url} target="_blank">{archive.file_name}</a>*/}
                                                    {archive.file_name}
                                                </td>
                                                <td>{archive.comments}</td>
                                            </tr>
                                        )) :
                                        <p> </p>
                                    }
                                </tbody>
                            </Table>
                            {this.state.rows_count_archive > this.state.perPageLimit ?
                                <div style={{float: 'right'}}>
                                    <Pagination
                                        prevPageText=' < '
                                        nextPageText=' > '
                                        firstPageText='First'
                                        lastPageText='Last'
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.perPageLimit}
                                        totalItemsCount={this.state.rows_count_archive}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChangeArchive}
                                        breakClassName={'break-me'}
                                        marginPagesDisplayed={2}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />
                                </div> :
                                ''
                            }
                        </Tab>
                        <Tab eventKey="certificates" title={`CERTIFICATES (${this.state.rows_count_certificate})`}>
                            <Table striped hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th style={{width:'4%', padding: '1%', paddingTop: '1.3%'}}><input type="checkbox" value="-1" onChange={e => this.handleChangeAllCertificates(e)} /></th>
                                        <th style={{width:'6%', textAlign: 'left'}} onClick={()=>{this.sortCertificatesByColoumn('id')}}>FILE ID
                                            <i className={this.state.column!='id'?
                                                "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortCertificatesByColoumn('folder_name')}}>FOLDER NAME
                                            <i className={this.state.column!='folder_name'?
                                                "fa fa-sort": (this.state.column == 'folder_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortCertificatesByColoumn('object_name')}}>OBJECT NAME
                                            <i className={this.state.column!='object_name'?
                                                "fa fa-sort": (this.state.column == 'object_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'14%'}} onClick={()=>{this.sortCertificatesByColoumn('uploaded_at')}}>DATE UPLOADED
                                            <i className={this.state.column!='uploaded_at'?
                                                "fa fa-sort": (this.state.column == 'uploaded_at' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'10%'}} onClick={()=>{this.sortCertificatesByColoumn('category_name')}}>CATEGORY
                                            <i className={this.state.column!='category_name'?
                                                "fa fa-sort": (this.state.column == 'category_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'12%'}} onClick={()=>{this.sortCertificatesByColoumn('related_to')}}>RELATION
                                            <i className={this.state.column!='related_to'?
                                                "fa fa-sort": (this.state.column == 'related_to' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortCertificatesByColoumn('file_name')}}>FILES
                                            <i className={this.state.column!='file_name'?
                                                "fa fa-sort": (this.state.column == 'file_name' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                        <th style={{width:'15%'}} onClick={()=>{this.sortCertificatesByColoumn('comments')}}>COMMENTS
                                            <i className={this.state.column!='comments'?
                                                "fa fa-sort": (this.state.column == 'comments' && !this.state.isDesc)?
                                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                                               aria-hidden="true" style={{marginLeft: 5}}></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.certificate_rows ? this.state.certificate_rows.map(certificate => (
                                            <tr>
                                                <td>{certificate.checkbox  && <input type="checkbox" className="certificates" value={certificate.id} />}</td>
                                                <td style={{textAlign: 'left'}}>{certificate.id}</td>
                                                <td onClick={(id)=>{this.handleShowFolderViewModalCertificate(certificate.object_id)}} style={{cursor:'pointer'}}>{certificate.folder_name}</td>
                                                <td>{certificate.object_name}</td>
                                                <td>{certificate.uploaded_at}</td>
                                                <td>{certificate.category_name}</td>
                                                <td>{certificate.related_to}</td>
                                                <td style={{wordBreak: 'break-all'}}><a href={process.env.REACT_APP_FILES_URL +certificate.file_url} target="_blank">{certificate.file_name}</a></td>
                                                <td>{certificate.comments}</td>
                                            </tr>
                                        )) :
                                        <p> </p>
                                    }
                                </tbody>
                            </Table>
                            {this.state.rows_count_certificate > this.state.perPageLimit ?
                                <div style={{float: 'right'}}>
                                    <Pagination
                                        prevPageText=' < '
                                        nextPageText=' > '
                                        firstPageText='First'
                                        lastPageText='Last'
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.perPageLimit}
                                        totalItemsCount={this.state.rows_count_certificate}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChangeCertificate}
                                        breakClassName={'break-me'}
                                        marginPagesDisplayed={2}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />
                                </div> :
                                ''
                            }

                        </Tab>
                    </Tabs>

                    {/*file viewer*/}

                       {/* <FileViewer width="10%" height="10%"
                            fileType={type}
                            filePath={file}
                            errorComponent={CustomErrorComponent}
                            onError={() => null}/>*/}

                </div>




                {/* ADD NEW OBJECT MODAL*/}
                <Modal show={this.state.add_new_archive_modal} onHide={this.handleCloseAddArchiveModal} size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Object</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <Form ref="addNewObjectForm" noValidate
                              validated={validated}>
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
                                                <Dropdown.Item value="user" onClick={(value,capValue) =>{this.handleChangeRelatedTo("user","User")}}>User</Dropdown.Item>
                                                <Dropdown.Item value="role" onClick={(value,capValue) =>{this.handleChangeRelatedTo("role","Role")}}>Role</Dropdown.Item>
                                                <Dropdown.Item value="certificate" onClick={(value,capValue) =>{this.handleChangeRelatedTo("certificate","Certificate")}}>Certificate</Dropdown.Item>
                                                <Dropdown.Item value="others" onClick={(value,capValue) =>{this.handleChangeRelatedTo("others","Others")}}>Others</Dropdown.Item>
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
                                                    {this.state.sub_folders_list.length>0 ? this.state.sub_folders_list.map(subFolder => (
                                                            <Dropdown.Item value={subFolder.id} onClick={(id, name) => {
                                                                this.handleChangeSubFolderSelect(subFolder.id, subFolder.subfolder_name)
                                                            }}>{subFolder.subfolder_name}</Dropdown.Item>
                                                        ))

                                                        :
                                                        <Dropdown.Item value="">No Sub Folder</Dropdown.Item>
                                                    }
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item className="addNewButton" onClick={this.handleShowAddSubFolderModal} >ADD NEW SUB FOLDER</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    </Col> : <span></span>
                                }

                                {/*for user type*/}



                                {this.state.related_to == "user" ?
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <Form.Group as={Col}>
                                            <Select
                                                closeMenuOnSelect={true}
                                                name="selectUser"
                                                components={makeAnimated()}
                                                options={this.state.users_list}
                                                placeholder="Search user..."
                                                onChange={this.handleChangeRelatedToFurtherSelect}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />

                                            {/*<Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_user}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.users_list ? this.state.users_list.map(user => (
                                                            <Dropdown.Item value={user.id} onClick={(id, name) => {
                                                                this.handleChangeRelatedToFurtherSelect(user.id, user.username)
                                                            }}>{user.username}</Dropdown.Item>
                                                        ))

                                                        :
                                                        <Dropdown.Item value="">No User</Dropdown.Item>
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>*/}
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
                                                options={this.state.roles_list}
                                                placeholder="Search role..."
                                                onChange={this.handleChangeRelatedToFurtherSelect}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {/*<Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_role}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.roles_list ? this.state.roles_list.map(role => (
                                                            <Dropdown.Item value={role.id} onClick={(id, name) => {
                                                                this.handleChangeRelatedToFurtherSelect(role.id, role.name)
                                                            }}>{role.name}</Dropdown.Item>
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
                                                options={this.state.certificates_list}
                                                placeholder="Search certificate..."
                                                onChange={this.handleChangeRelatedToFurtherSelect}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {/*<Dropdown style={{marginTop: 0}}>
                                                <Dropdown.Toggle>
                                                    {this.state.default_dropdown_certificate}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="customScrollToDropDowns">
                                                    {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                            <Dropdown.Item value={certificate.id} onClick={(id,name) => {this.handleChangeRelatedToFurtherSelect(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
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
                                        <Form.Control type="text" placeholder="Enter Object Name" required
                                                      onChange={(event) => this.setState({object_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Object name id is required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Control type="text" placeholder="Enter Comment" required
                                                      onChange={(event) =>{this.state.objectComments= event.target.value}}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            commentis required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
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
                                                        <Dropdown.Item value={category.id} onClick={(id,name) => {this.handleChangeCategorySelect(category.id,category.name)}}>{category.name}</Dropdown.Item>
                                                    ))

                                                    :
                                                    <Dropdown.Item value="">No Categories</Dropdown.Item>
                                                }
                                                <Dropdown.Divider />
                                                <Dropdown.Item className="addNewButton" onClick={this.handleShowAddCategoryModal} >ADD NEW CATEGORY</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Form.Row style={{marginLeft: 0}}>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group className="addNewExternalCourceBtn">
                                            <input type="file" id="files" onChange={this.addFile} style={{float : 'right'}}/>
                                        </Form.Group>
                                        {this.state.files ?  this.state.files.map(file => (
                                            <span>
                                                <Col xs={2} sm={2} md={2} lg={2} className="displayInlineBlock">
                                                    <label className="textOut">{file.name} </label>
                                                </Col>
                                                <Col xs={1} sm={1} md={1} lg={1} className="displayInlineBlock">
                                                    <Button className="btn removeFileBtn deleteBtn" onClick={() => this.removeFile(file.name)}><i className="fa fa-trash"></i></Button>
                                                </Col>
                                               <br/>
                                        </span>
                                            )):
                                            <label> No Files Selected</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseAddArchiveModal}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addNewArchive} style={{marginLeft: 5}}>
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


                {/* ADD CATEGORY MODAL*/}
                <Modal show={this.state.add_new_category_modal} onHide={this.handleCloseAddCategoryModal}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Col xs={12} sm={12} md={8} lg={8}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Category Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Category Name"
                                                      onChange={(event) => this.setState({new_category_name: event.target.value})}
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
                                <Button variant="outline-secondary" onClick={this.handleCloseAddCategoryModal}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addCategory} style={{marginLeft: 5}}>
                                    Submit
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
                                    <Button variant="outline-primary" style={{marginBottom:5, width: '100%'}}onClick={()=>{this.printDoc(0)}}>
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
                        {/*<Row>
                            <Col xs={8} sm={8} md={8} lg={8}>
                                <Form.Group as={Col}>
                                    <Card>
                                        <ListGroup variant="flush">
                                            {this.state.bundle_view_files.length>0 ? this.state.bundle_view_files.map(file => (
                                                    <ListGroup.Item>
                                                        {file.file_name}
                                                        <span style={{position: 'absolute', right: '5%'}}>
                                                            <i className="fa fa-trash" onClick={(id)=>this.removeBundleViewFile(file.file_url)} style={{cursor: 'pointer'}}></i>
                                                        </span>
                                                    </ListGroup.Item>
                                                ))
                                                :
                                                <ListGroup.Item value="">No Files In Bundle</ListGroup.Item>
                                            }

                                        </ListGroup>
                                    </Card>
                                </Form.Group>
                            </Col>

                        </Row>*/}
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

            </div>

        )
    }

}


export default ArchiveData;
