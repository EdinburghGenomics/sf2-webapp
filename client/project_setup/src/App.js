// @flow
import React from 'react';

import Stage1Form from './components/stage1/Stage1Form';
import Stage1Modal from './components/stage1/Stage1Modal';
import { getCallbackHref } from './functions/lib.js';


export default class App extends React.Component{
    state = {
        stage1FormUrl: '',
        stage1ModalIsActive: false
    };

    // Callback function to submit the data to the server for stage 1
    submitData = (project_data: string) : void => {

        const submit_url = getCallbackHref(window.location).concat("submit/");

        fetch(submit_url, {
          method: 'POST',
          mode: 'cors',
          body: project_data,
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (submit):', JSON.stringify(json));
                this.setState(
                    {
                        stage1FormUrl: '',
                        stage1ModalIsActive: true
                    });
            }).catch(error => {
                console.error('Error (submit):', error);
                alert('Network error (submit). Please try again later.');
            });

    };


    // Callback function to reissue an SF2 for a project for stage 1
    reissueProject = (projectID : string, comments : string) : void => {
        console.log('reissuing');

        const reissue_url = getCallbackHref(window.location).concat("reissue/"); 
        const reissue_json = {'projectID': projectID, 'comments': comments};

        fetch(reissue_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(reissue_json),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (reissue):', JSON.stringify(json));
                this.setState(
                    {
                        stage1FormUrl: '',
                        stage1ModalIsActive: true
                    });
            }).catch(error => {
                console.error('Error (reissue):', error);
                alert('Network error (reissue). Please try again later.');
            });

    };


    render() {
        return (
                <div style={{margin: 10}}>
                <Stage1Form submitData={this.submitData} reissueProject={this.reissueProject}/>
                <Stage1Modal formUrl={this.state.stage1FormUrl} active={this.state.stage1ModalIsActive}/>
            </div>
        )
    };

};
