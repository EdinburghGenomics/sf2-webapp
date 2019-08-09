// @flow
import React from 'react';
import * as R from 'ramda';

import Stage1FormStateSummary from '../general/Stage1FormStateSummary';
import SampleSF2 from '../SF2s/SampleSF2/SampleSF2';
import LibrarySF2Old from '../SF2s/LibrarySF2_old/LibrarySF2';
import LibrarySF2 from '../SF2s/LibrarySF2/LibrarySF2';
import TenXSF2Old from '../SF2s/10XSF2_old/10XSF2';
import TenXSF2 from '../SF2s/10XSF2/10XSF2';

import { decodeFormStateQueryString } from '../../functions/lib';

import type { SF2Data, Stage1FormState } from '../../types/flowTypes';


type Stage2SF2ContainerProps = {
    queryString: string,
    redirectToHome: () => void,
    handleSubmission: () => void
};


export default class Stage2SF2Container extends React.Component<Stage2SF2ContainerProps, Stage1FormState> {
    initialSF2Data = null;
    saveDataName = '';


    constructor (props : Object) {
        super(props);
        //this.state = decodeFormStateQueryString(this.props.queryString);
        this.state = {"projectID":"21354_a_a","sf2type":"Library","numberOfSamplesOrLibraries":"","sf2IsDualIndex":true,"barcodeSetIsNA":false,"sf2HasPools":true,"numberOfPools":"2","sf2HasCustomPrimers":true,"numberOfCustomPrimers":"1","sf2HasUnpooledSamplesOrLibraries":true,"numberOfUnpooledSamplesOrLibraries":"1","numberOfSamplesOrLibrariesInPools":"{\"1\":\"1\",\"2\":\"2\"}"}
        console.log(JSON.stringify(this.state))

        this.saveDataName = 'saveData-stage2-' + this.props.queryString;

        // Load initial grids if present
        if(window.sessionStorage !== undefined) {

            const saveData = window.sessionStorage.getItem(this.saveDataName);

            if (!R.isNil(saveData)) {
                this.initialSF2Data = JSON.parse(saveData);
            }

        }
    };


    handleSave = (tables : SF2Data) : void => {
        window.sessionStorage.setItem(this.saveDataName, JSON.stringify(tables));
    };


    handleSubmission = (tables : SF2Data) : void => {

        const submissionData = {
            initialState: this.state,
            queryString: this.props.queryString,
            tables: tables
        };

        window.sessionStorage.setItem('submissionData', JSON.stringify(submissionData));
        window.sessionStorage.removeItem(this.saveDataName);

        this.props.handleSubmission();

    };

    render() {
        return(
            <div>
                <h2>{this.state.sf2type} SF2 Submission Form</h2>
                {<Stage1FormStateSummary {...this.state}/>}
                {this.state.sf2type === 'Sample' &&
                    <SampleSF2
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={false}
                    />
                }
                {this.state.sf2type === 'Library_old' &&
                    <LibrarySF2Old
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={false}
                    />
                }
                {this.state.sf2type === '10X_old' &&
                    <TenXSF2Old
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={false}
                    />
                }
                {this.state.sf2type === '10X' &&
                    <TenXSF2
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={false}
                    />
                }
                {this.state.sf2type === 'Library' &&
                <LibrarySF2
                    initialState={this.state}
                    initialSF2Data={this.initialSF2Data}
                    handleSubmission={this.handleSubmission}
                    handleSave={this.handleSave}
                    showHiddenColumns={false}
                />
                }
            </div>
    )};
};
