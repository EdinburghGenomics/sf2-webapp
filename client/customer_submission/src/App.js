// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import * as R from 'ramda';

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

    startIndices = {
        "sampleOrLibrary": "1",
        "unpooledSubmission": "1",
        "pool": "1",
        "container": "1"
    };


    getStartIndices = R.pipe(
        R.pick(R.keys(this.startIndices).map(x=>x+"StartIndex")),
        R.toPairs,
        R.map(x=>[x[0].replace(/StartIndex$/, ""),x[1]]),
        R.fromPairs
    );


    getInitialState = R.omit(R.keys(this.startIndices).map(x=>x+"StartIndex"));


    handleFormSave = (saveData : Object) : void => {

        const fullSaveData = {
            queryString: this.state.queryString,
            saveData: saveData
        };

        this.saveSF2(fullSaveData);
    };


    handleFormSaveForDownload = (saveData : Object) : void => {

        const fullSaveData = {
            queryString: this.state.queryString,
            saveData: saveData
        };

        this.saveSF2ForDownload(fullSaveData);
    };


    handleFormSubmission = (submissionData : Object) : void => {

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
            href = [location.protocol, '//', location.host, location.pathname].join('');
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
            "stage": "customer_submission"
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
                this.initialState = this.getInitialState(json);
                this.startIndices = this.getStartIndices(json);
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
            "stage": "customer_submission"
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
                    ReactDOM.render(<Stage2SF2Container initState={this.initialState} initialSF2Data={this.state.sf2} handleSubmission={this.handleFormSubmission} handleSave={this.handleFormSave} handleDownload={this.handleFormSaveForDownload} startIndices={this.startIndices} />, document.getElementById('stage2Container'));
                });
            }).catch(error => {
                console.error('Error (initdata):', error);
                alert('Network error (initdata). Please try again later.');
            });

    };


    componentDidMount() {

        const queryString = window.location.search.replace(/^\?/,'');

        this.setState({'queryString': queryString}, () => {
            this.fetchInitState(queryString);
        });

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
