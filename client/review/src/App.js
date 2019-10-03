// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import Stage3Modal from './components/stage3/Stage3Modal';
import Stage3SF2Container from './components/stage3/Stage3SF2Container';


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


    handleStage3FormSaveForDownload = (saveData : Object) : void => {

        const fullSaveData = {
            queryString: this.state.queryString,
            saveData: saveData
        };

        this.saveSF2ForDownload(fullSaveData);
    };


    handleStage3FormSubmission = (submissionData : Object) : void => {

        const fullSubmissionData = {
            queryString: this.state.queryString,
            submissionData: submissionData
        };

        this.submitSF2(fullSubmissionData);
    };


    getCallbackHref = (location : Object) : string => {

        // work out web service url
        let href = '';
        if(location.port === "3002") {
            // running in dev environment, just use hardcoded url
            href = 'http://localhost:8002/';
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

        const postData = {
            "submissionData": submissionData,
            "stage": "review"
        };

        fetch(submit_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(postData),
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


    saveSF2ForDownload = (submissionData: Object) : void => {

        const savedownload_url = this.getCallbackHref(window.location).concat("savedownload/");
        const tsvdownload_url = this.getCallbackHref(window.location).concat("getdownload/?"+this.state.queryString);

        fetch(savedownload_url, {
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
                console.log('Success (savedownload):', JSON.stringify(json));
                let a = document.createElement('a');
                a.href = tsvdownload_url;
                a.id = "tsvDownloadLink";
                document.body.appendChild(a);
                document.getElementById('tsvDownloadLink').click();

            }).catch(error => {
                console.error('Error (savedownload):', error);
                alert('Network error (savedownload). Please try again later.');
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

        const postData = {
            "queryString": queryString,
            "stage": "review"
        };

        fetch(init_url, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(postData),
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (initdata):', JSON.stringify(json));
                this.setState({'submittedAt': json.submittedAt, 'sf2': json.sf2}, () => {
                    ReactDOM.render(<Stage3SF2Container initState={this.initialState} initialSF2Data={this.state.sf2} handleSubmission={this.handleStage3FormSubmission} handleSave={this.handleStage3FormSave} handleDownload={this.handleStage3FormSaveForDownload} />, document.getElementById('stage3Container'));
                });
            }).catch(error => {
                console.error('Error (initdata):', error);
                alert('Network error (initdata). Please try again later.');
            });

    };


    componentDidMount() {

        const queryString = window.location.search.replace(/^\?/,'');

        this.setState({'queryString': queryString}, () => {
            console.log('fetching init state');
            this.fetchInitState(queryString);
        });

    }

    render() {

        return (
            <div style={{margin: 10}}>
                <div id="stage3Container"></div>
                <div id="submittedAt">{this.state.submittedAt != '' && 'Submitted at: ' + this.state.submittedAt}</div>
            </div>
        )

    };

};