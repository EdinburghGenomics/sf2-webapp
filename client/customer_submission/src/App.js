// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import Stage2Modal from './components/stage2/Stage2Modal';
import Stage2SF2Container from './components/stage2/Stage2SF2Container';

import { getCallbackHref } from './functions/lib.js';

// App class
type AppProps = {};


type AppState = {
    stage2ModalIsActive: boolean
}


export default class App extends React.Component<AppProps, AppState> {
    state = {
        stage2ModalIsActive: false
    };

    handleStage2FormSubmission = () => {
        this.setState({stage2ModalIsActive: true});
    };

    fetchInitState = (queryString: String) : void => {

        const submit_url = getCallbackHref(window.location).concat("initstate/");

        fetch(submit_url, {
          method: 'POST',
          mode: 'cors',
          body: '{"queryString": '+queryString+'}',
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                console.log('Success (initstate):', JSON.stringify(json));
                ReactDOM.render(<div style={{margin: 10}}>
                <Stage2SF2Container initState={json} handleSubmission={this.handleStage2FormSubmission} />
                <Stage2Modal redirectUrl={''} active={this.state.stage2ModalIsActive}/>
                                </div>, document.getElementById('stage2Container'))
            }).catch(error => {
                console.error('Error (initstate):', error);
                alert('Network error (initstate). Please try again later.');
            });

    };

    componentDidMount() {

        var queryString = window.location.search.replace(/^\?/,'');

        this.fetchInitState(queryString);

    }

    render() {

        return (
            <div id="stage2Container"></div>
        )

    };

};
