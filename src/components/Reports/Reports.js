import React, { Component } from 'react';


export class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {height: props.height};
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount(){
    this.setState({height: (window.innerHeight - 64) + 'px'});
  }

    render() {
        return (
            <iframe title="Reports" src={"https://qbimanalytics.se/Account/SignIn"} style={{width: "100%", height: this.state.height}}/>
        )
    }
}
