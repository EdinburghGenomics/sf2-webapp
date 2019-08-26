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
    calculateEGIDPrefix,
    calculateEGSampleID,
    calculateEGIDIndex,
    calculateEGPoolID,
    getInitialTables
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
    disableSaveButton: Tables => void
};


class TenXSF2 extends React.Component<TenXSF2Props> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    tableTypes = ['10XSampleInformation'];
    formType = '10XSF2';
    errors = new Map([[0, true]]);


    constructor (props : Object) {
        super(props);

        this.state = {
            warnings: []
        };

    };


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => this.props.handleSubmission(
        getSF2(this.formType, this.tables),
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


    makeTableFromGridWithID = (gridWithID : GridWithID) : Table => {
        const grids = [gridWithID];
        return {name: '10XSampleInformation', grids: grids};
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


    calculateFrozenGrid = () => {

        const egIDPrefix = calculateEGIDPrefix(this.props.initialState.projectID);

        const numberOfSamplesInPools = Object.assign({},
            ...Object.entries(JSON.parse(this.props.initialState.numberOfSamplesOrLibrariesInPools))
                .map(([k, v]) => ({[parseInt(k,10)]: parseInt(v,10)}))
        );

        const unpooledSampleIndices = R.range(1, parseInt(this.props.initialState.numberOfUnpooledSamplesOrLibraries, 10) + 1);

        const unpooledSampleRows = unpooledSampleIndices.map(i => {
            const egIDIndex = calculateEGIDIndex(i);
            return {
                'index': i,
                'name': 'unpooled-'+i.toString(),
                'egSubmissionID': calculateEGSampleID(egIDPrefix, egIDIndex)
            }
        });

        const poolIndices = R.range(1, parseInt(this.props.initialState.numberOfPools, 10) + 1);

        const pooledSampleRows = poolIndices.map(
            p => {
                const sampleIndicesInPool = R.range(1, numberOfSamplesInPools[p] + 1);
                return sampleIndicesInPool.map(
                    i => {
                        const egIDIndex = calculateEGIDIndex(p);
                        return {
                            'index': i,
                            'name': 'pool' + p.toString() + '-' + i.toString(),
                            'egSubmissionID': calculateEGPoolID(egIDPrefix, egIDIndex)
                        }
                    }
                );
            }
        );

        const allRows = R.flatten([unpooledSampleRows, pooledSampleRows]);

        const allRowsWithSampleIDs = allRows.map((r, i) => {
            const egIDIndex = calculateEGIDIndex(i+1);
            return R.assoc(
                'egSampleID',
                calculateEGSampleID(egIDPrefix, egIDIndex),
                r
            )
        });

        return allRowsWithSampleIDs.map(row => {
            return [{value: row.egSampleID}, {value: row.egSubmissionID}];
        });
    };


    getInitialGrid = frozenGrid => {

        const initialTables = getInitialTables(this.props);
        if(initialTables.length > 0) {
            return initialTables[0].grids[0].grid;
        } else {
            return R.repeat([], frozenGrid.length);
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

        const frozenGrid = this.calculateFrozenGrid();
        const initialGrid = this.getInitialGrid(frozenGrid);

        return (
            <SF2Validator
                id={0}
                columns={this.initialiseColumns(this.props.initialState)}
                frozenColumns={frozenTenXSampleInformationColumns}
                frozenGrid={frozenGrid}
                initialState={this.props.initialState}
                initialGrid={initialGrid}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.handleDownload}
                showDocumentation={this.props.showDocumentation}
                updateHasErrors={R.curry(this.updateHasErrors)(this.tableTypes[0])}
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
export default withConfirmHandler(withDisableHandler(withDownloadHandler(withShowDocumentationHandler(TenXSF2))));
