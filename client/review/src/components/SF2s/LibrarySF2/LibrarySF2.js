// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from '../../general/SF2Validator';


import {
    libraryInformationColumns,
    frozenLibraryInformationColumns
} from './constants/LibraryInformationColumns';


import {
    getSF2,
    updateTables,
    calculateEGIDPrefix,
    calculateEGSampleID,
    calculateEGIDIndex,
    calculateEGPoolID,
    getInitialTables,
    calculateEGLibraryID,
    calculateWellID
} from '../../../functions/lib';


import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";
import { withDownloadHandler } from "../../hoc/DownloadHandler";
import { withConfirmHandler } from "../../hoc/ConfirmHandler";
import { withShowDocumentationHandler } from "../../hoc/ShowDocumentationHandler";
import TabContainer from "../../hoc/TabContainer";


import type {SF2Data, Table, Tables, Stage1FormState, GridWithID, Grids, Warnings} from '../../../types/flowTypes';
import type {Row, Columns, Grid, StringMap} from '../../../sf2datasheet/types/flowTypes';


import PrimerInformation from "./PrimerInformation";
import PlateTabContainer from "./PlateTabContainer";


type LibrarySF2Props = {
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


type LibrarySF2State = {
    libraryInformationData: Map,
    warnings: Warnings
}


class LibrarySF2 extends React.Component<LibrarySF2Props, LibrarySF2State> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    tableTypes = [];
    formType = 'LibrarySF2';
    errors = new Map();
    tableNames = new Map([
        [ 'PrimerInformation', 'Primer Information' ],
        [ 'LibraryInformation', 'Library Information' ]
    ]);

    frozenLibraryInformationColumns = this.props.initialState.containerTypeIsPlate ?
        frozenLibraryInformationColumns.concat([{value: 'Well ID', width: 100}]) :
        frozenLibraryInformationColumns;


    constructor (props : Object) {
        super(props);

        if (this.props.initialState.sf2HasCustomPrimers === true) {
            this.tableTypes.push('PrimerInformation');
        }
        this.tableTypes.push('LibraryInformation');

        this.errors = new Map(this.tableTypes.map((_, tableTypeIndex) => {return [tableTypeIndex, true]}));

        this.state = {
            libraryInformationData: new Map(),
            warnings: []
        };

    };


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => {
        this.props.handleSubmission(
            getSF2(this.formType, this.tables),
            this.state.warnings
        );
    };


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
        return {name: 'LibraryInformation', grids: grids};
    };


    makeTableFromGridWithID = (gridWithID : GridWithID) : Table => {
        const grids = [gridWithID];
        return this.makeTableFromGrids(grids);
    };


    getLibraryInformationData = () : StringMap => {

        const poolIDs = R.pipe(
            R.find(R.propEq('name', 'PrimerInformation')),
            R.propOr([[]], 'grids'),
            R.reduce(R.concat, []),
            R.map(row => row[0]),
            R.pluck('value')
        )(this.tables);

        const dataArray = poolIDs.map(x => [x,'']);
        const newLibraryInformationData = new Map(dataArray);
        newLibraryInformationData.set('no custom primer', '');

        return newLibraryInformationData;

    };


    updateTables = (table: Table) : void => {
        this.tables = updateTables(table, this.tables);
        this.props.updateSaveDisabled(this.tables);

        const newLibraryInformationData = this.getLibraryInformationData();
        if(!R.equals(this.state.libraryInformationData, newLibraryInformationData)) {
            this.setState({
                libraryInformationData: newLibraryInformationData
            });
        }

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


    getAllRowsWithLibraryIDs = () => {

        const egIDPrefix = calculateEGIDPrefix(this.props.initialState.projectID);

        const numberOfSamplesInPools = Object.assign({},
            ...Object.entries(JSON.parse(this.props.initialState.numberOfSamplesOrLibrariesInPools))
                .map(([k, v]) => ({[parseInt(k,10)]: parseInt(v,10)}))
        );

        const unpooledSampleIndices = R.range(1, parseInt(this.props.initialState.numberOfUnpooledSamplesOrLibraries, 10) + 1);

        const unpooledSampleRows = unpooledSampleIndices.map(i => {
            const egIDIndex = calculateEGIDIndex(i);
            const unpooledCell = {
                'index': i,
                'name': 'unpooled-'+i.toString(),
                'egSubmissionID': calculateEGSampleID(egIDPrefix, egIDIndex),
                'wellIndex': i,
                'egWellID': calculateWellID(i-1)
            };
            return(unpooledCell);
        });

        const poolIndices = R.range(1, parseInt(this.props.initialState.numberOfPools, 10) + 1);

        const pooledSampleRows = poolIndices.map(
            p => {
                const sampleIndicesInPool = R.range(1, numberOfSamplesInPools[p] + 1);
                return sampleIndicesInPool.map(
                    i => {
                        const wellIndex = p + parseInt(this.props.initialState.numberOfUnpooledSamplesOrLibraries, 10);
                        const egIDIndex = calculateEGIDIndex(p);
                        const pooledCell = {
                            'index': i,
                            'name': 'pool' + p.toString() + '-' + i.toString(),
                            'egSubmissionID': calculateEGPoolID(egIDPrefix, egIDIndex),
                            'wellIndex': wellIndex,
                            'egWellID': calculateWellID(wellIndex-1)
                        };
                        return(pooledCell);
                    }
                );
            }
        );

        const allRows = R.flatten([unpooledSampleRows, pooledSampleRows]);

        const allRowsWithLibraryIDs = allRows.map((r, i) => {
            const egIDIndex = calculateEGIDIndex(i+1);
            return R.assoc(
                'egLibraryID',
                calculateEGLibraryID(egIDPrefix, egIDIndex),
                r
            )
        });

        return(allRowsWithLibraryIDs);

    };


    updateRow = (currentWellOffset : number, row : Row) : Row => {

        const newWellIndex = row.wellIndex - currentWellOffset;
        const newWellID = calculateWellID(newWellIndex-1);

        return R.pipe(
            R.assoc('wellIndex', newWellIndex),
            R.assoc('egWellID', newWellID)
        )(row);

    };


    splitRows = (wellsPerPlate : number, rows : Grid) : Grids => {

        const sortedRows = R.sort((a, b) => a.wellIndex - b.wellIndex)(rows);

        let splitRows = [];
        let currentPlate = [];
        let currentWellOffset = 0;
        let currentPlateMaximum = wellsPerPlate;

        sortedRows.forEach(row => {

            if (row.wellIndex > currentPlateMaximum) {
                currentWellOffset = currentPlateMaximum;
                currentPlateMaximum += wellsPerPlate;
                splitRows = splitRows.concat([currentPlate]);
                currentPlate = [this.updateRow(currentWellOffset, row)];
            } else {
                currentPlate = currentPlate.concat([this.updateRow(currentWellOffset, row)]);
            }
        });

        splitRows = splitRows.concat([currentPlate]);

        return splitRows;

    };


    calculateFrozenGrids = (containerTypeIsPlate : boolean) : Grids => {

        const allRowsWithLibraryIDs = this.getAllRowsWithLibraryIDs();

        const getRowsToReturn = rowsWithLibraryIDs => rowsWithLibraryIDs.map(row => {
            const rowsToReturn = [{value: row.egLibraryID}, {value: row.egSubmissionID}];
            return this.props.initialState.containerTypeIsPlate ?
                rowsToReturn.concat([{value: row.egWellID}]) :
                rowsToReturn
        });

        if(containerTypeIsPlate) {
            const splitRows = this.splitRows(96, allRowsWithLibraryIDs);
            return splitRows.map(getRowsToReturn);
        } else {
            return [getRowsToReturn(allRowsWithLibraryIDs)];
        }

    };


    getInitialGrids = (tableIndex : number, containerTypeIsPlate : boolean, frozenGrids : Grids) : Grids => {

        const initialTables = getInitialTables(this.props);
        if(initialTables.length > 0) {
            return containerTypeIsPlate ?
                initialTables[tableIndex].grids :
                initialTables[tableIndex].grids.map(x=>x.grid);
        } else {
            return frozenGrids.map(frozenGrid => R.repeat([], frozenGrid.length));
        }

    };


    initialiseColumns = (initialState : Object) : Columns => {
        let filteredColumns = libraryInformationColumns;
        filteredColumns = initialState.sf2HasCustomPrimers ? filteredColumns : R.remove(14, 1, filteredColumns);
        filteredColumns = initialState.sf2IsDualIndex ? filteredColumns : R.remove(13, 1, filteredColumns);
        filteredColumns = initialState.sf2HasPools ? filteredColumns : R.remove(3, 2, filteredColumns);
        return filteredColumns;
    };


    getTableNames = () : Array<string> => {
        return this.tableTypes.map(t => { const tn = this.tableNames.get(t); return tn === undefined ? 'Unknown' : tn});
    };


    getIndicesWithSubmissionIDsForPools = (egSubmissionIDs, indices) => {

        const assignIndicesToSubmissionIDs = (index, submissionID) => {
            return {
                egSubmissionID: submissionID.value,
                index: index.value
            };
        };

        const indicesWithSubmissionIDs = R.zipWith(
            assignIndicesToSubmissionIDs,
            indices,
            egSubmissionIDs
        );

        return R.pipe(
            R.filter(x => new RegExp(/^.*pool.*$/).test(x.egSubmissionID)),
            R.groupBy(x => x.egSubmissionID),
            R.map(x=>x.map(R.prop('index')))
        )(indicesWithSubmissionIDs);

    };


    validate = (errors, grid, frozenGrid) => {

        const i7ColIndex = this.props.initialState.sf2HasPools ? 12 : 10;
        const i7Indices = grid.map(x=>x[i7ColIndex]);

        const i5ColIndex = this.props.initialState.sf2HasPools ? 13 : 11;
        const i5Indices = this.props.initialState.sf2IsDualIndex ?
            grid.map(x => x[i5ColIndex]) :
            null;

        const egSubmissionIDs = frozenGrid.map(x=>x[1]);

        const getPoolsWithDifferentLengthIndices = R.pipe(
            R.curry(this.getIndicesWithSubmissionIDsForPools)(egSubmissionIDs),
            R.map(x=>x.map(y=>y.length)),
            R.map(R.uniq),
            R.map(x=>x.length),
            R.pickBy((v,_)=>v>1),
            R.keys
        );

        // check that all I7 index sequences are the same length within a pool
        getPoolsWithDifferentLengthIndices(i7Indices).forEach(pool=>{
            errors.push("I7 indices with different lengths in pool: " + pool);
        });

        // check that all I5 index sequences are the same length within a pool
        if(this.props.initialState.sf2IsDualIndex) {
            getPoolsWithDifferentLengthIndices(i5Indices).forEach(pool=>{
                errors.push("I5 indices with different lengths in pool: " + pool);
            });
        }

        // do duplication check on combined index sequence columns, per pool
        const getValues = x => x.map(R.prop('value'));
        const combinedIndexSequences = this.props.initialState.sf2IsDualIndex ?
            R.zip(getValues(i7Indices), getValues(i5Indices)).map(R.join('')) :
            getValues(i7Indices);

        const hasDuplicates = x => x.length > R.uniq(x).length;
        const poolsWithDuplicateCombinedIndexSequences = R.pipe(
            R.curry(this.getIndicesWithSubmissionIDsForPools)(egSubmissionIDs),
            R.map(hasDuplicates),
            R.pickBy((v,_)=>v===true),
            R.keys
        )(combinedIndexSequences.map(x=>{return({value: x})}));

        poolsWithDuplicateCombinedIndexSequences.forEach(pool=>{
            const duplicateSequenceErrorMsg = this.props.initialState.sf2IsDualIndex ?
                "Duplicate combined I7/I5 indices in pool" :
                "Duplicate I7 indices in pool";
            errors.push(duplicateSequenceErrorMsg + ": " + pool);
        });

        // check that I7 sequence has a value if I5 sequence does
        if(this.props.initialState.sf2IsDualIndex) {

            grid.forEach((row, rowIndex) => {

                const rowID = R.isNil(frozenGrid) ?
                    (rowIndex + 1).toString() :
                    frozenGrid[rowIndex][0].value;

                if (row[i5ColIndex].value.length > 0 && row[i7ColIndex].value.length === 0) {
                    errors.push("Missing I7 index with I5 index present in row '" + rowID + "'");
                }

            });
        }

        return errors;

    };


    getChildComponent = (containerTypeIsPlate : boolean, tabName : string) : Object => {

        const frozenGrids = this.calculateFrozenGrids(containerTypeIsPlate);
        const getInitialLibraryInformationGrids = R.curry(this.getInitialGrids)(0)(containerTypeIsPlate);
        const initialGrids = getInitialLibraryInformationGrids(frozenGrids);

        const primerInformation = <PrimerInformation
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
            updateHasErrors={this.updateHasErrors}
        />;

        const tubeLibraryInformation = <SF2Validator
            id={0}
            columns={this.initialiseColumns(this.props.initialState)}
            data={this.state.libraryInformationData}
            frozenColumns={this.frozenLibraryInformationColumns}
            frozenGrid={frozenGrids[0]}
            initialState={this.props.initialState}
            initialGrid={initialGrids[0]}
            handleSubmission={this.handleSubmission}
            handleSave={this.handleSave}
            handleDownload={this.handleDownload}
            showDocumentation={this.props.showDocumentation}
            updateHasErrors={R.curry(this.updateHasErrors)('LibraryInformation')}
            updateGrids={this.updateTablesFromGridWithID}
            updateWarningList={this.updateWarnings}
            showHiddenColumns={this.props.showHiddenColumns}
            topRowNumber={1}
            submitDisabled={this.props.shouldDisableSubmit}
            saveDisabled={this.props.shouldDisableSave}
            tableType={this.tableTypes[0]}
            validator={this.validate}
        />;

        const plateLibraryInformation = <PlateTabContainer
            columns={this.initialiseColumns(this.props.initialState)}
            data={this.state.libraryInformationData}
            frozenColumns={this.frozenLibraryInformationColumns}
            frozenGrids={frozenGrids}
            initialState={this.props.initialState}
            numberOfRows={this.getAllRowsWithLibraryIDs().length}
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
            updateHasErrors={R.curry(this.updateHasErrors)('LibraryInformation')}
            tableType={this.tableTypes[0]}
        />;

        if(tabName === 'Primer Information') {
            return primerInformation;
        } else if (tabName === 'Library Information' && containerTypeIsPlate) {
            return plateLibraryInformation;
        } else if (tabName === 'Library Information') {
            return tubeLibraryInformation;
        } else {
            return <div>unknown</div>;
        }

    };


    render() {return(
        <div>
            {
                this.tableTypes.length < 2 &&
                this.getChildComponent(this.props.initialState.containerTypeIsPlate, 'Library Information')
            }
            {
                this.tableTypes.length >= 2 &&
                <TabContainer
                    tabNames={this.getTableNames()}
                    tabHasErrors={this.errors}
                    getChildComponent={R.curry(this.getChildComponent)(this.props.initialState.containerTypeIsPlate)}
                />
            }
        </div>
    )}

}


//$FlowFixMe
export default withConfirmHandler(withDisableHandler(withDownloadHandler(withShowDocumentationHandler(LibrarySF2))));
