// @flow
import React from 'react';

import Stage1Form from './components/stage1/Stage1Form';
import Stage1Modal from './components/stage1/Stage1Modal';


export default class App extends React.Component{
    state = {
        stage1FormUrl: '',
        stage1ModalIsActive: false
    };

    // Callback function to submit the data to the server for stage 1
    submitData = (project_data: string) => {

        console.log(project_data);

        this.setState(
            {
                stage1FormUrl: '',
                stage1ModalIsActive: true
            })
    };

    render() {
        return (
                <div style={{margin: 10}}>
                <Stage1Form submitData={this.submitData}/>
                <Stage1Modal formUrl={this.state.stage1FormUrl} active={this.state.stage1ModalIsActive}/>
            </div>
        )
    };

};
