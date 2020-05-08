/* eslint-disable */
import React, {Component} from 'react';


class AddRole extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        this.addRole = this.addRole.bind(this);
        this.addFile = this.addFile.bind(this);
        this.state = {
            user_id:path[2],
            logoImage: "",
            name: "",
            description : "",
            work_description:"",
            status : "",
            files : [],
            certificates_list : "",
            certificates_list_ids : "",
        };
    }

    componentDidMount() {

      this.getCertificateList();
        
    }

    getCertificateList(){
         fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ certificates_list: result });
            },

            (error) => {

            }
        )
    }

    addRole(event){
      event.preventDefault();
      this.setState({
          'name': this.refs.name.value,
          'status': this.refs.status.checked,
          'description': this.refs.description.value,
          'work_description': this.refs.work_description.value,
      });
      this.readURL(this.refs.logo);
    }

    addRoleQuerry(){
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_role", {
                method: "POST",
                body:JSON.stringify({
                  'name': this.state.name,
                  'user_id' : this.state.user_id,
                  'status' : this.state.status,
                  'description' : this.state.description,
                  'work_description' : this.state.work_description,
                  'logo' : this.state.logoImage,
                  'files' : this.state.files,
                  'certificates_list_ids' : this.state.certificates_list_ids
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

    readURL(input) {

      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          this.setState({
              logoImage:e.target.result
          });
         
          this.addRoleQuerry();
        }.bind(this);
      reader.readAsDataURL(input.files[0]);
      }
    }

    addFile(){
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
        }.bind(this);
      reader.readAsDataURL(files.files[0]);
      }
    }

    handleChange(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          certificates_list_ids : arr
        })
      }else{
        var arr = this.state.certificates_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          certificates_list_ids : arr
        })
      } 
    }

    render() {

        return (
            <div>
               <form ref="addRoleForm" onSubmit = {this.addRole}>
                  <label>Name</label>
                  <input type="text" ref="name"/>
                  <label>Status Active</label>
                  <input type="checkbox" ref="status"/>
                  <label>Description</label>
                  <textarea ref="description"></textarea>
                  <label>Work Description</label>
                  <textarea ref="work_description"></textarea>
                  <label>Logo</label>
                  <input type="file" ref="logo" />
                  <label>Files</label>
                  <input type="file" id="files" onChange={this.addFile} />
                  <input type="submit" value="Add Role" name="submit"/>
               </form>
               <label> Connect Certificates </label>
               {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                <div>
                  <input type="checkbox"  value={certificate.id} onChange={e => this.handleChange(e)} /> 
                  <label>{certificate.name} </label> 
                  </div>
                )):
                  <label> No Certificates</label>
             }
            </div>
        )
    }

}


export default AddRole;
