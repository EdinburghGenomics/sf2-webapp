// @flow
import React from 'react';

import SampleInformation from './SampleInformation';

import { getSF2, getInitialTables, updateTables } from '../../../functions/lib';

import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";
import { withDownloadHandler } from "../../hoc/DownloadHandler";
import { withShowDocumentationHandler } from "../../hoc/ShowDocumentationHandler";

import type { Stage1FormState, SF2Data, Table, Tables } from '../../../types/flowTypes';


type SampleSF2Props = {
    initialSF2Data?: ?SF2Data,
    initialState: Stage1FormState,
    handleSubmission: Tables => void,
    handleSave: Tables => void,
    handleDownload: SF2Data => void,
    showDocumentation: () => void,
    showHiddenColumns: boolean,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateShouldDisableSubmit: (string, boolean) => void,
    updateSaveDisabled: Tables => void,
    disableSaveButton: Tables => void
};


class SampleSF2 extends React.Component<SampleSF2Props> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    formType = 'SampleSF2';


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => this.props.handleSubmission(getSF2(this.formType, this.tables));


    handleDownload = () : void => {
        this.props.handleDownload(
            getSF2(this.formType, this.tables)
        );
    };


    updateTables = (table : Table) : void => {
        this.tables = updateTables(table, this.tables);
        this.props.updateSaveDisabled(this.tables);
    };


    render() {
        return(
            <SampleInformation
                formType={this.formType}
                initialState={this.props.initialState}
                initialTables={getInitialTables(this.props)}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.handleDownload}
                showDocumentation={this.props.showDocumentation}
                showHiddenColumns={this.props.showHiddenColumns}
                updateTables={this.updateTables}
                shouldDisableSubmit={this.props.shouldDisableSubmit}
                shouldDisableSave={this.props.shouldDisableSave}
                updateHasErrors={this.props.updateShouldDisableSubmit}
            />
        );
    };

}

//$FlowFixMe
export default withDisableHandler(withDownloadHandler(withShowDocumentationHandler(SampleSF2)));
