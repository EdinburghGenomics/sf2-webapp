// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from '../../general/SF2Validator';

import {
    tenXSampleInformationColumns,
    frozenTenXSampleInformationColumns
} from './constants/10XSampleInformationColumns';

import { naBarcodeSet_options } from '../../../constants/options';

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

import type { SF2Data, Table, Tables, Stage1FormState, GridWithID, Warnings } from '../../../types/flowTypes';
import type { Columns } from '../../../sf2datasheet/types/flowTypes';


type TenXSF2Props = {
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


class TenXSF2 extends React.Component<TenXSF2Props> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    frozenGrids = [];
    tableTypes = ['10XSampleInformation'];
    formType = '10XSF2';


    constructor (props : Object) {
        super(props);

        this.state = {
            warnings: []
        };

        this.allRowsWithSampleAndLibraryIDs = getAllRowsWithSampleAndLibraryIDs(
            this.props.initialState,
            this.props.startIndices
        );

        const tenXSampleInformationFrozenGrids = calculateFrozenGrids(
            this.allRowsWithSampleAndLibraryIDs,
            false,
            this.getTenXSampleInformationFrozenGridRowsToReturn
        );

        this.frozenGrids = [
            {
                name: this.tableTypes[0],
                grids: tenXSampleInformationFrozenGrids.map(x=>{return{id: "0", grid: x}})
            }
        ];

    };


    getTenXSampleInformationFrozenGridRowsToReturn = (rowsWithIDs : Array<Object>) : Array<Object> => rowsWithIDs.map(row => {
        return [{value: row.egSampleID}, {value: row.egSubmissionID}];
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
            getSF2(this.formType, this.tables, this.frozenGrids)
        );
    };


    makeTableFromGridWithID = (gridWithID : GridWithID) : Table => {
        const grids = [gridWithID];
        return {name: this.tableTypes[0], grids: grids};
    };


    updateTables = (table: Table) : void => {
        this.tables = updateTables(table, this.tables);
        this.props.updateSaveDisabled(this.tables);
    };


    updateTablesFromGridWithID = R.pipe(this.makeTableFromGridWithID, this.updateTables);


    updateWarnings = (warnings : Warnings) : void => {

        if(!R.equals(this.state.warnings, warnings)) {
            this.setState({
                warnings: warnings
            });
        }

    };


    initialiseColumns = (initialState : Object) : Columns => {

        const filteredColumns = initialState.sf2HasPools ? tenXSampleInformationColumns : R.remove(3, 2, tenXSampleInformationColumns);

        return filteredColumns.map(
            col => col.id === 'barcodeSet' && initialState.barcodeSetIsNA === true ?
                R.assoc('selectOptions', naBarcodeSet_options)(col) :
                col
        );

    };


    render() {

        const initialTables = getInitialTables(this.props);

        const initialGrids = getInitialInformationTableGrids(
            initialTables,
            this.frozenGrids,
            this.tableTypes[0]
        );

        const tenXSampleInformationFrozenGrid = this.frozenGrids[0].grids[0].grid;

        return (
            <SF2Validator
                id={"0"}
                columns={this.initialiseColumns(this.props.initialState)}
                frozenColumns={frozenTenXSampleInformationColumns}
                frozenGrid={tenXSampleInformationFrozenGrid}
                initialState={this.props.initialState}
                initialGrid={initialGrids[0]}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.handleDownload}
                showDocumentation={this.props.showDocumentation}
                updateHasErrors={(_,e) => this.props.updateShouldDisableSubmit(e)}
                updateGrids={this.updateTablesFromGridWithID}
                updateWarningList={this.updateWarnings}
                showHiddenColumns={this.props.showHiddenColumns}
                topRowNumber={1}
                submitDisabled={this.props.shouldDisableSubmit}
                saveDisabled={this.props.shouldDisableSave}
                tableType={this.tableTypes[0]}
            />
        );
    }
}


//$FlowFixMe
export default withConfirmHandler(withDisableHandler(withShowDocumentationHandler(TenXSF2)));
