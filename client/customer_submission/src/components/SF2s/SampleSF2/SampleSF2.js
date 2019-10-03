// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from '../../general/SF2Validator';
import PlateTabContainer from '../../general/PlateTabContainer';


import {
    sampleInformationColumns,
    frozenSampleInformationColumns
} from './constants/SampleInformationColumns';


import {
    getSF2,
    updateTables,
    getInitialTables,
    getInitialInformationTableGrids,
    calculateFrozenGrids,
    getAllRowsWithSampleAndLibraryIDs
} from '../../../functions/lib';


import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";
import { withConfirmHandler } from "../../hoc/ConfirmHandler";
import { withDownloadHandler } from "../../hoc/DownloadHandler";
import { withShowDocumentationHandler } from "../../hoc/ShowDocumentationHandler";


import type { SF2Data, Table, Tables, Stage1FormState, GridWithID, Grids, Warnings } from '../../../types/flowTypes';


type SampleSF2Props = {
    initialSF2Data?: ?SF2Data,
    initialState: Stage1FormState,
    handleSubmission: (SF2Data, Warnings) => void,
    handleSave: SF2Data => void,
    handleDownload: SF2Data => void,
    showDocumentation: () => void,
    showHiddenColumns: boolean,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateShouldDisableSubmit: (string, boolean) => void,
    updateSaveDisabled: Tables => void,
    disableSaveButton: Tables => void,
    startIndices: Object
};


class SampleSF2 extends React.Component<SampleSF2Props> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    frozenGrids = [];
    tableTypes = ['SampleInformation'];
    formType = 'SampleSF2';
    errors = new Map([[0, true]]);

    frozenSampleInformationColumns = this.props.initialState.containerTypeIsPlate ?
        frozenSampleInformationColumns.concat([{value: 'Well ID', width: 100}]) :
        frozenSampleInformationColumns;


    constructor (props : Object) {
        super(props);

        this.state = {
            warnings: []
        };

        this.allRowsWithSampleAndLibraryIDs = getAllRowsWithSampleAndLibraryIDs(
            this.props.initialState,
            this.props.startIndices
        );

        const sampleInformationFrozenGrids = calculateFrozenGrids(
            this.allRowsWithSampleAndLibraryIDs,
            this.props.initialState.containerTypeIsPlate,
            this.getSampleInformationFrozenGridRowsToReturn,
            this.props.initialState.projectID
        );

        this.frozenGrids = [
            {name: 'SampleInformation', grids: sampleInformationFrozenGrids}
        ];

    };


    getSampleInformationFrozenGridRowsToReturn = (rowsWithIDs : Array<Object>) => rowsWithIDs.map(row => {
        const rowsToReturn = [{value: row.egSampleID}];
        return this.props.initialState.containerTypeIsPlate ?
            rowsToReturn.concat([{value: row.egWellID}]) :
            rowsToReturn
    });


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables, this.frozenGrids));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => this.props.handleSubmission(
        getSF2(this.formType, this.tables, this.frozenGrids),
        this.state.warnings
    );


    handleDownload = () : void => {
        this.props.handleDownload(
            getSF2(this.formType, this.tables)
        );
    };


    updateHasErrors = (tableName : string, hasErrors : boolean) : void => {
        this.props.updateShouldDisableSubmit(tableName, hasErrors);
        const tableIndex = R.indexOf(tableName, this.tableTypes);
        this.errors.set(tableIndex, hasErrors);
    };


    makeTableFromGrids = (grids : Grids) : Table => {
        return {name: 'SampleInformation', grids: grids};
    };


    makeTableFromGridWithID = (gridWithID : GridWithID) : Table => {
        const grids = [gridWithID];
        return {name: 'SampleInformation', grids: grids};
    };


    updateTables = (table: Table) : void => {
        this.tables = updateTables(table, this.tables);
        this.props.updateSaveDisabled(this.tables);
    };


    updateTablesFromGridWithID = R.pipe(this.makeTableFromGridWithID, this.updateTables);


    updateTablesFromGrids = R.pipe(this.makeTableFromGrids, this.updateTables);


    updateWarnings = (warnings : Warnings) : void => {

        if(!R.equals(this.state.warnings, warnings)) {
            this.setState({
                warnings: warnings
            });
        }

    };


    getChildComponent = () : Object => {

        const initialTables = getInitialTables(this.props);

        const initialGrids = getInitialInformationTableGrids(
            initialTables,
            this.frozenGrids,
            'SampleInformation'
        );

        const sampleInformationFrozenGrids = this.frozenGrids[0].grids.map(x=>x.grid);

        const tubeSampleInformation = <SF2Validator
            id={"0"}
            columns={sampleInformationColumns}
            frozenColumns={frozenSampleInformationColumns}
            frozenGrid={sampleInformationFrozenGrids[0]}
            initialState={this.props.initialState}
            initialGrid={initialGrids[0]}
            handleSubmission={this.handleSubmission}
            handleSave={this.handleSave}
            handleDownload={this.handleDownload}
            showDocumentation={this.props.showDocumentation}
            updateHasErrors={R.curry(this.updateHasErrors)('SampleInformation')}
            updateGrids={this.updateTablesFromGridWithID}
            updateWarningList={this.updateWarnings}
            showHiddenColumns={this.props.showHiddenColumns}
            topRowNumber={1}
            submitDisabled={this.props.shouldDisableSubmit}
            saveDisabled={this.props.shouldDisableSave}
            tableType={this.tableTypes[0]}
        />;

        const plateSampleInformation = <PlateTabContainer
            columns={sampleInformationColumns}
            frozenColumns={this.frozenSampleInformationColumns}
            frozenGrids={sampleInformationFrozenGrids}
            initialState={this.props.initialState}
            numberOfRows={this.allRowsWithSampleAndLibraryIDs.length}
            initialGrids={initialGrids}
            handleSubmission={this.handleSubmission}
            handleSave={this.handleSave}
            handleDownload={this.handleDownload}
            showDocumentation={this.props.showDocumentation}
            showHiddenColumns={this.props.showHiddenColumns}
            updateGrids={this.updateTablesFromGrids}
            updateWarningList={this.updateWarnings}
            shouldDisableSubmit={this.props.shouldDisableSubmit}
            shouldDisableSave={this.props.shouldDisableSave}
            updateHasErrors={R.curry(this.updateHasErrors)('SampleInformation')}
            tableType={this.tableTypes[0]}
        />;

        if (this.props.initialState.containerTypeIsPlate) {
            return plateSampleInformation;
        } else {
            return tubeSampleInformation;
        }

    };


    render() {return(
        <div>
            {this.getChildComponent()}
        </div>
    )}

}

//$FlowFixMe
export default withConfirmHandler(withDisableHandler(withShowDocumentationHandler(SampleSF2)));
