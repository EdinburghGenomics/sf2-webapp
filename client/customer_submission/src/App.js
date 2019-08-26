// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import Stage2Modal from './components/stage2/Stage2Modal';
import Stage2SF2Container from './components/stage2/Stage2SF2Container';


// App class
type AppProps = {};


type AppState = {
    stage2ModalIsActive: boolean,
    queryString: String,
    submittedAt: String
}


export default class App extends React.Component<AppProps, AppState> {
    initialState = {}
    state = {
        stage2ModalIsActive: false,
        queryString: '',
        submittedAt: '',
        sf2: {}
    };


    handleStage2FormSave = (saveData : Object) : void => {

        const fullSaveData = {
            queryString: this.state.queryString,
            saveData: saveData
        };

        this.saveSF2(fullSaveData);
    };


    handleStage2FormSubmission = (submissionData : Object) : void => {

        const fullSubmissionData = {
            queryString: this.state.queryString,
            submissionData: submissionData
        };

        this.submitSF2(fullSubmissionData);
    };


    getCallbackHref = (location : Object) : string => {

        // work out web service url
        let href = '';
        if(location.port === "3001") {
            // running in dev environment, just use hardcoded url
            href = 'http://localhost:8001/';
        } else {
            // running in test / production, infer url from window.location
            href = location.href;
        }

        return href;

    };


    saveSF2 = (saveData: Object) : void => {

        const save_url = this.getCallbackHref(window.location).concat("save/");

        fetch(save_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(saveData),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (save):', JSON.stringify(json));
            }).catch(error => {
                console.error('Error (save):', error);
                alert('Network error (save). Please try again later.');
            });

    };


    submitSF2 = (submissionData: Object) : void => {

        const submit_url = this.getCallbackHref(window.location).concat("submit/");

        fetch(submit_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(submissionData),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (submit):', JSON.stringify(json));
                this.setState({'submittedAt': json});
            }).catch(error => {
                console.error('Error (submit):', error);
                alert('Network error (submit). Please try again later.');
            });

    };


    fetchInitState = (queryString: String) : void => {

        const init_url = this.getCallbackHref(window.location).concat("initstate/");

        fetch(init_url, {
          method: 'POST',
          mode: 'cors',
            body: JSON.stringify(queryString),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (initstate):', JSON.stringify(json));
                this.initialState = json;
                this.fetchInitData(queryString);
            }).catch(error => {
                console.error('Error (initstate):', error);
                alert('Network error (initstate). Please try again later.');
            });

    };


    fetchInitData = (queryString: String) : void => {

        const init_url = this.getCallbackHref(window.location).concat("initdata/");

        fetch(init_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(queryString),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (initdata):', JSON.stringify(json));
                this.setState({'submittedAt': json.submittedAt, 'sf2': json.sf2}, () => {
                    ReactDOM.render(<Stage2SF2Container initState={this.initialState} initialSF2Data={this.state.sf2} handleSubmission={this.handleStage2FormSubmission} handleSave={this.handleStage2FormSave}/>, document.getElementById('stage2Container'));
                });
            }).catch(error => {
                console.error('Error (initdata):', error);
                alert('Network error (initdata). Please try again later.');
            });

    };


    componentDidMount() {

        const queryString = window.location.search.replace(/^\?/,'');

        this.setState({'queryString': queryString});
        this.fetchInitState(queryString);

    }

    render() {

        return (
            <div style={{margin: 10}}>
                <div id="stage2Container"></div>
                <div id="submittedAt">{this.state.submittedAt != '' && 'Submitted at: ' + this.state.submittedAt}</div>
            </div>
        )

    };

};
