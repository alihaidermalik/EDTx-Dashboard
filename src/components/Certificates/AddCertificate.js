/* eslint-disable */
import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class AddCertificate extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        this.addCertificateType = this.addCertificateType.bind(this);
        this.addProfession = this.addProfession.bind(this);
        this.addCertificate = this.addCertificate.bind(this);
        this.addExternalCourse = this.addExternalCourse.bind(this);
        this.state = {
            user_id:path[2],
            openAddCertificateType : false,
            certificate_type : "",
            certificate_type_id: "",
            profession_id : "",
            profession_list: "",
            openAddProfession : false,
            version: "",
            accreditor : "",
            valid_time : "",
            expiration_notice : "",
            training_minimum : "",
            logoImage:"",
            internal_course_list : "",
            internal_course_list_ids : "",
            openAddExternalCourse : false,
            external_course_list: "",
            external_course_list_ids : "",
            roles_list : "",
            roles_list_ids : "",
          }
    }

    componentDidMount() {
        this.getCertificateTypeList();
        this.getProfessionList();
        this.getInternalCourseList();
        this.getExternalCourseList();
        this.getRolesList();
    }

    getCertificateTypeList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_type_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ certificate_type: result });
            },

            (error) => {

            }
        )
    }

    getProfessionList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_profession_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ profession_list: result });
            },

            (error) => {

            }
        )
    }

    getInternalCourseList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_internal_course_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ internal_course_list: result });
            },

            (error) => {

            }
        )
    }

    getExternalCourseList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_external_course_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ external_course_list: result });
            },

            (error) => {

            }
        )
    }

    getRolesList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_roles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ roles_list: result });
            },

            (error) => {

            }
        )
    }

    handleClickOpen = () => {
      this.setState({ openAddCertificateType: true });
    };

    handleClose = () => {
      this.setState({ openAddCertificateType: false });
    };

    handleClickOpenProfession = () => {
      this.setState({ openAddProfession: true });
    };

    handleCloseProfession = () => {
      this.setState({ openAddProfession: false });
    };

    addCertificateType (){
      var type_name = document.getElementById("certificate_type").value;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_certificate_type", {
                method: "POST",
                body:JSON.stringify({
                  'name': type_name,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ certificate_type: result, openAddCertificateType: false  });
            },

            (error) => {

            }
        )
    }

    addProfession (){
      var profession_name = document.getElementById("profession_name").value;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_profession", {
                method: "POST",
                body:JSON.stringify({
                  'name': profession_name,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ profession_list: result, openAddProfession: false  });
            },

            (error) => {

            }
        )
    }

    handleChange = event => {
        this.setState({ certificate_type_id: event.target.value });
    };

    handleChangePrfession = event => {
        this.setState({ profession_id: event.target.value });
    };

    addCertificate(event){
      event.preventDefault();
      this.setState({
          'name': this.refs.name.value,
          'status': this.refs.status.checked,
          'description': this.refs.description.value,
          'version': this.refs.version.value,
          'accreditor' : this.refs.accreditor.value,
          'valid_time' : this.refs.valid_time.value,
          'expiration_notice' : this.refs.expiration_notice.value,
          'training_minimum' : this.refs.training_minimum.value,
      });
      this.readURL(this.refs.logo);
    }

    readURL(input) {

      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          this.setState({
              logoImage:e.target.result
          });
         
          this.addCertificateQuerry();
        }.bind(this);
      reader.readAsDataURL(input.files[0]);
      }
    }

    addCertificateQuerry(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_certificate", {
                method: "POST",
                body:JSON.stringify({
                  'name': this.state.name,
                  'user_id' : this.state.user_id,
                  'status' : this.state.status,
                  'description' : this.state.description,
                  'version' : this.state.version,
                  'logo' : this.state.logoImage,
                  'accreditor' : this.state.accreditor,
                  'valid_time' : this.state.valid_time,
                  'training_minimum' : this.state.training_minimum,
                  'expiration_notice' : this.state.expiration_notice,
                  'certificate_type_id' : this.state.certificate_type_id,
                  'profession_id' : this.state.profession_id,
                  'internal_course_list_ids' : this.state.internal_course_list_ids,
                  'external_course_list_ids' : this.state.external_course_list_ids,
                  'roles_list_ids' : this.state.roles_list_ids
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {

            },

            (error) => {

            }
        )
    }

    handleChangeInternal(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          internal_course_list_ids : arr
        })
      }else{
        var arr = this.state.internal_course_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          internal_course_list_ids : arr
        })
      } 
    }

    handleChangeExternal(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          external_course_list_ids : arr
        })
      }else{
        var arr = this.state.external_course_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          external_course_list_ids : arr
        })
      } 
    }

    handleChangeRole(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          roles_list_ids : arr
        })
      }else{
        var arr = this.state.roles_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          roles_list_ids : arr
        })
      } 
    }

    handleClickOpenExternalCourse = () => {
      this.setState({ openAddExternalCourse: true });
    };

    handleCloseExternalCourse = () => {
      this.setState({ openAddExternalCourse: false });
    };

    addExternalCourse(){
      this.readURLCourse(document.getElementById("course_image"))
    }

    readURLCourse(input) {

      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onloadend = function (e) {         
          this.addExternalCourseQuerry(e.target.result);
        }.bind(this);
      reader.readAsDataURL(input.files[0]);
      }
    }

    addExternalCourseQuerry(image){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_external_course", {
                method: "POST",
                body:JSON.stringify({
                  'image': image,
                  'name' : document.getElementById("course_name").value,
                  'description' : document.getElementById("course_details").value,
                  'vendor' : document.getElementById("vendor").value,
                  'course_url' : document.getElementById("course_url").value,
                  'cost' : document.getElementById("cost").value,
                  'comments' : document.getElementById("comments").value
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ external_course_list: result, openAddExternalCourse: false  });
            },

            (error) => {

            }
        )
    }

    render() {

        return (
            <div>

            <form ref="addCertificateForm" onSubmit = {this.addCertificate}>
              <label>Version</label>
              <input type="text" ref="version"/>
              <label>Type</label>
              <Select value={this.state.certificate_type_id} onChange={this.handleChange}>
                {this.state.certificate_type ? this.state.certificate_type.map(certificate_type => (
                    <MenuItem value={certificate_type.id}>{certificate_type.name}</MenuItem>
                  )) 

                  :
                  <MenuItem value="">No Type</MenuItem>
                }
                <MenuItem value="">
                  <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Add New Certificate Type
                  </Button>
                </MenuItem>
              </Select>
              <label>Status Active</label>
              <input type="checkbox" ref="status"/>
              <label>Name</label>
              <input type="text" ref="name"/>
              <label>Description</label>
              <textarea ref="description"></textarea>
              <label>Logo</label>
              <input type="file" ref="logo" />
              <label>Profession</label>
              <Select value={this.state.profession_id} onChange={this.handleChangePrfession}>
                {this.state.profession_list ? this.state.profession_list.map(profession => (
                    <MenuItem value={profession.id}>{profession.name}</MenuItem>
                  )) 

                  :
                  <MenuItem value="">No Type</MenuItem>
                }
                <MenuItem value="">
                  <Button variant="outlined" color="primary" onClick={this.handleClickOpenProfession}>
                    Add New Profession
                  </Button>
                </MenuItem>
              </Select>
              <label>Accreditor</label>
              <input type="text" ref="accreditor"/>
              <label>Valid Time (Months)</label>
              <input type="number" ref="valid_time"/>
              <label>Expiration Notice (Days)</label>
              <input type="number" ref="expiration_notice"/>
              <label>Training Minimum (Hours)</label>
              <input type="number" ref="training_minimum"/>
              <input type="submit" value="Add Certificate" name="submit"/>
            </form>

            <label> Connect Internal Courses </label>
               {this.state.internal_course_list ? this.state.internal_course_list.map(internal_course => (
                <div>
                  <input type="checkbox"  value={internal_course.id} onChange={e => this.handleChangeInternal(e)} /> 
                  <label>{internal_course.name} </label> 
                  </div>
                )):
                  <label> No Internal Courses</label>
             }
             <label> Connect External Courses </label>
             {this.state.external_course_list ? this.state.external_course_list.map(external_course => (
                <div>
                  <input type="checkbox"  value={external_course.id} onChange={e => this.handleChangeExternal(e)} /> 
                  <label>{external_course.name} </label> 
                  </div>
                )):
                  <label> No External Courses</label>
             }
             <Button variant="outlined" color="primary" onClick={this.handleClickOpenExternalCourse}>
                    Add New External Course
            </Button>

            <label> Connect Roles </label>
               {this.state.roles_list ? this.state.roles_list.map(role => (
                <div>
                  <input type="checkbox"  value={role.id} onChange={e => this.handleChangeRole(e)} /> 
                  <label>{role.name} </label> 
                  </div>
                )):
                  <label> No Certificates</label>
             }

            <Dialog
                open={this.state.openAddExternalCourse}
                onClose={this.handleCloseExternalCourse}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add New External Course</DialogTitle>
                <DialogContent>
                <label>Course Name</label>
                <input type="text" id="course_name"/>
                <label>Course Details</label>
                <textarea id="course_details"> </textarea>
                <label>Course URL</label>
                <input type="text" id="course_url"/>
                <label>Vendor</label>
                <input type="text" id="vendor"/>
                <label>Cost</label>
                <input type="text" id="cost"/>
                <label>Comments</label>
                <textarea id="comments"> </textarea>
                <label>Course Image</label>
                <input type="file" id="course_image" />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseExternalCourse} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.addExternalCourse} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>


               <Dialog
                open={this.state.openAddCertificateType}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add New Certificate Type</DialogTitle>
                <DialogContent>
                <label>Certificate Type Name</label>
                <input type="text" id="certificate_type"/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.addCertificateType} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={this.state.openAddProfession}
                onClose={this.handleCloseProfession}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add New Profession</DialogTitle>
                <DialogContent>
                <label>Profession Name</label>
                <input type="text" id="profession_name"/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseProfession} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.addProfession} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>

            </div>
        )
    }

}


export default AddCertificate;
