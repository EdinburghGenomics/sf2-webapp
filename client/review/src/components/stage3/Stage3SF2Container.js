// @flow
import React from 'react';
import * as R from 'ramda';

import Stage1FormStateSummary from '../general/Stage1FormStateSummary';

import SampleSF2 from '../SF2s/SampleSF2/SampleSF2';
import LibrarySF2Old from '../SF2s/LibrarySF2_old/LibrarySF2';
import LibrarySF2 from '../SF2s/LibrarySF2/LibrarySF2';
import TenXSF2Old from '../SF2s/10XSF2_old/10XSF2';
import TenXSF2 from '../SF2s/10XSF2/10XSF2';

import type { Tables } from '../../sf2datasheet/types/flowTypes'


const uppercaseFirstLetter = (str : String) : String => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


const inflateStage1FormState = (abbreviatedState : AbbreviatedStage1FormState) : Stage1FormState => {

    return {
        projectID: abbreviatedState.pid,
        sf2type: uppercaseFirstLetter(abbreviatedState.st),
        containerTypeIsPlate: abbreviatedState.ctp,
        numberOfSamplesOrLibraries: abbreviatedState.nsl,
        sf2IsDualIndex: abbreviatedState.di,
        barcodeSetIsNA: abbreviatedState.na,
        sf2HasPools: abbreviatedState.hp,
        numberOfPools: abbreviatedState.np,
        sf2HasCustomPrimers: abbreviatedState.hc,
        numberOfCustomPrimers: abbreviatedState.nc,
        sf2HasUnpooledSamplesOrLibraries: abbreviatedState.husl,
        numberOfUnpooledSamplesOrLibraries: abbreviatedState.nusl,
        numberOfSamplesOrLibrariesInPools: abbreviatedState.nslp
    };

}


type Stage3SF2ContainerProps = {
    initState: ?String,
    initialSF2Data: ?String,
    handleSave: SF2Data => void,
    handleSubmission: SF2Data => void,
    submittedAt: String
};


type Stage3SF2ContainerState = {
    projectID?: string,
    sf2type?: string
}


export default class Stage3SF2Container extends React.Component<Stage3SF2ContainerProps, Stage3SF2ContainerState> {

    initialSF2Data = {};
    saveDataName = null;


    constructor (props : Object) {
        super(props);

        if (!R.isNil(this.props.initState)) {
            this.state = inflateStage1FormState(this.props.initState);
        }

        if (!R.isNil(this.props.initialSF2Data)) {
            this.initialSF2Data = this.props.initialSF2Data;
        }


        //const submissionData = window.sessionStorage === undefined ?
        //    {projectID: null, initialState: {}, queryString: null, tables: null} :
            //JSON.parse(window.sessionStorage.getItem('submissionData'));

//        this.state = !R.isNil(submissionData) ? submissionData.initialState : {};

        // Redirect to home page if there is no project ID
//        if (!this.state.projectID) {
//            this.props.redirectToHome();

//        } else {

            //$FlowFixMe
//            this.saveDataName = 'saveData-stage3-' + submissionData.queryString;

            // Load initial grids if present
//            if (window.sessionStorage !== undefined) {

//                const saveData = window.sessionStorage.getItem(this.saveDataName);

//                if (!R.isNil(saveData)) {
 //                   this.initialSF2Data = JSON.parse(saveData);
//                }

 //           }

 //           if (R.isNil(this.initialSF2Data)) {
                // the grids weren't initialised from session storage so initialise them from the submission data
   //             this.initialSF2Data = submissionData.tables;
   //         }

    //    }

    };


    getSubmissionData = tables => {
        return {
            initialState: this.state,
            queryString: this.props.queryString,
            tables: tables
        }
    }


    handleSave = (tables : SF2Data) : void => {
        this.props.handleSave(this.getSubmissionData(tables));
    };


    handleSubmission = (tables : SF2Data) : void => {
        this.props.handleSubmission(this.getSubmissionData(tables));
    };
    
//    handleSave = (tables : Tables) : void => {

//        window.sessionStorage.setItem(this.saveDataName, JSON.stringify(tables));

//    };


//    handleSubmission = (tables : Tables) : void => {

        //window.sessionStorage.removeItem('submissionData');
        //window.sessionStorage.removeItem(this.saveDataName);

//        this.props.handleSubmission();

//    };


    render() {
        return(
            <div>{/*style={{border: "1px solid green"}}>}*/}
            <h2>{this.state.sf2type} SF2 Submission Review</h2>
                <Stage1FormStateSummary {...this.state}/>
                {<br/>}
                {this.state.sf2type === 'Sample' &&
                    <SampleSF2
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={true}
                    />
                }
                {this.state.sf2type === 'Library_old' &&
                    <LibrarySF2Old
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={true}
                    />
                }
                {this.state.sf2type === '10X_old' &&
                    <TenXSF2Old
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        showHiddenColumns={true}
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
                <div>{this.props.submittedAt}</div>
            </div>
    )};
};
