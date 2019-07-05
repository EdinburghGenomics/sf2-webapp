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

        const url = 'http://localhost:8888/submit/';

        fetch(url, {
          method: 'POST', 
          mode: 'cors',
          body: JSON.stringify(project_data), 
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success:', JSON.stringify(json));
                this.setState(
                    {
                        stage1FormUrl: '',
                        stage1ModalIsActive: true
                    });
            }).catch(error => {
                console.error('Error:', error);
                alert('Network error. Please try again later.');
            });

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
