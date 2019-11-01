// @flow
import React from 'react';
import * as R from 'ramda';

import Stage1FormStateSummary from '../general/Stage1FormStateSummary';
import SampleSF2 from '../SF2s/SampleSF2/SampleSF2';
import LibrarySF2 from '../SF2s/LibrarySF2/LibrarySF2';
import TenXSF2 from '../SF2s/10XSF2/10XSF2';

import { decodeFormStateQueryString } from '../../functions/lib';

import type { SF2Data, Stage1FormState, AbbreviatedStage1FormState } from '../../types/flowTypes';


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
    handleDownload: SF2Data => void,
    startIndices: Object
};


export default class Stage3SF2Container extends React.Component<Stage3SF2ContainerProps, Stage1FormState> {
    initialSF2Data = {};
    saveDataName = '';


    constructor (props : Object) {
        super(props);

        if (!R.isEmpty(this.props.initState)) {
            this.state = inflateStage1FormState(this.props.initState);
        }

        if (!R.isEmpty(this.props.initialSF2Data)) {
            this.initialSF2Data = this.props.initialSF2Data;
        }

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


    handleDownload = (tables : SF2Data) : void => {
        this.props.handleDownload(this.getSubmissionData(tables));
    }


    render() {
        return(
            <div>
                <h2>{this.state.sf2type} SF2 Submission Review</h2>
                {<Stage1FormStateSummary {...this.state}/>}
                {this.state.sf2type === 'Sample' &&
                    <SampleSF2
                        initialState={this.state}
                        initialSF2Data={this.initialSF2Data}
                        handleSubmission={this.handleSubmission}
                        handleSave={this.handleSave}
                        handleDownload={this.handleDownload}
                        showHiddenColumns={true}
                        startIndices={this.props.startIndices}
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
                        handleDownload={this.handleDownload}
                        showHiddenColumns={true}
                        startIndices={this.props.startIndices}
                    />
                }
                {this.state.sf2type === 'Library' &&
                <LibrarySF2
                    initialState={this.state}
                    initialSF2Data={this.initialSF2Data}
                    handleSubmission={this.handleSubmission}
                    handleSave={this.handleSave}
                    handleDownload={this.handleDownload}
                    showHiddenColumns={true}
                    startIndices={this.props.startIndices}
                />
                }
            </div>
    )};
};
