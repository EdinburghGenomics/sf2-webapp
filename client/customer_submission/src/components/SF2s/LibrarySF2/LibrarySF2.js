// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from '../../general/SF2Validator';
import PlateTabContainer from "../../general/PlateTabContainer";


import {
    libraryInformationColumns,
    frozenLibraryInformationColumns
} from './constants/LibraryInformationColumns';


import {
    primerInformationColumns,
    frozenPrimerInformationColumns
} from './constants/PrimerInformationColumns';


import {
    getSF2,
    updateTables,
    calculateEGIDPrefix,
    calculateEGSampleID,
    calculateEGIDIndex,
    calculateEGPoolID,
    getInitialTables,
    calculateEGLibraryID,
    calculateWellID,
    createFrozenGrid,
    getInitialInformationTableGrids,
    calculateFrozenGrids
} from '../../../functions/lib';


import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";
import { withDownloadHandler } from "../../hoc/DownloadHandler";
import { withConfirmHandler } from "../../hoc/ConfirmHandler";
import { withShowDocumentationHandler } from "../../hoc/ShowDocumentationHandler";
import TabContainer from "../../hoc/TabContainer";


import type {SF2Data, Table, Tables, Stage1FormState, GridWithID, Grids, Warnings} from '../../../types/flowTypes';
import type {Row, Columns, Grid, StringMap} from '../../../sf2datasheet/types/flowTypes';


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
    frozenGrids = [];
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

        const libraryInformationFrozenGrids = calculateFrozenGrids(
            this.getAllRowsWithLibraryIDs(),
            this.props.initialState.containerTypeIsPlate,
            this.getLibraryInformationFrozenGridRowsToReturn
        );

        const primerInformationFrozenGrids = [{id: 0, grid: createFrozenGrid(
            this.props.initialState.numberOfCustomPrimers,
            frozenPrimerInformationColumns,
            this.props.initialState.projectID,
            1,
            'Library',
            'PrimerInformation',
            false
        )}];

        this.frozenGrids = [
            {name: 'PrimerInformation', grids: primerInformationFrozenGrids},
            {name: 'LibraryInformation', grids: libraryInformationFrozenGrids}
        ];

    };


    getLibraryInformationFrozenGridRowsToReturn = (rowsWithIDs : Array<Object>) : Array<Object> => rowsWithIDs.map(row => {
        const rowsToReturn = [{value: row.egLibraryID}, {value: row.egSubmissionID}];
        return this.props.initialState.containerTypeIsPlate ?
            rowsToReturn.concat([{value: row.egWellID}]) :
            rowsToReturn
    });


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables, this.frozenGrids));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => {
        this.props.handleSubmission(
            getSF2(this.formType, this.tables, this.frozenGrids),
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


    makeTableFromGrids = (tableType : string, grids : Grids) : Table => {
        return {name: tableType, grids: grids};
    };


    makeTableFromGridWithID = (tableType : string, gridWithID : GridWithID) : Table => {
        const grids = [gridWithID];
        return this.makeTableFromGrids(tableType, grids);
    };


    getLibraryInformationData = () : StringMap => {

        const primerInformationTable = R.find(
            R.propEq('name', 'PrimerInformation'),
            this.tables
        );

        let dataArray = [];

        if (!R.isNil(primerInformationTable)) {

            const primerIDs = R.pipe(
                R.propOr([[]], 'grids'),
                R.pluck('grid'),
                R.reduce(R.concat, []),
                R.map(row => row[0]),
                R.pluck('value')
            )(primerInformationTable);

            dataArray = primerIDs.map(x => [x, '']);

        }

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


    updateTablesFromGridWithID = (tableType : string, gridWithID : GridWithID) : Table => {
        const table = this.makeTableFromGridWithID(tableType, gridWithID);
        this.updateTables(table);
    };


    updateTablesFromGrids = (tableType : string, grids : Grids) : void => {
        const table = this.makeTableFromGrids(tableType, grids);
        this.updateTables(table);
    };


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


    getInitialInformationTableGrids = R.curry(getInitialInformationTableGrids)(
        getInitialTables(this.props)
    );


    getFrozenGrids = tableType => R.find(
        R.propEq('name', tableType),
        this.frozenGrids
    ).grids;


    getPrimerInformationTable = () => {

        const primerInformationInitialGrid = this.getInitialInformationTableGrids(
            this.frozenGrids,
            'PrimerInformation'
        )[0];

        const primerInformationFrozenGrid = this.getFrozenGrids('PrimerInformation')[0].grid;

        return <SF2Validator
            id={0}
            columns={primerInformationColumns}
            frozenColumns={frozenPrimerInformationColumns}
            frozenGrid={primerInformationFrozenGrid}
            initialState={this.props.initialState}
            initialGrid={primerInformationInitialGrid}
            handleSubmission={this.handleSubmission}
            handleSave={this.handleSave}
            handleDownload={this.handleDownload}
            showDocumentation={this.props.showDocumentation}
            updateHasErrors={R.curry(this.updateHasErrors)('PrimerInformation')}
            updateGrids={R.curry(this.updateTablesFromGridWithID)('PrimerInformation')}
            updateWarningList={this.updateWarnings}
            showHiddenColumns={this.props.showHiddenColumns}
            topRowNumber={1}
            submitDisabled={this.props.shouldDisableSubmit}
            saveDisabled={this.props.shouldDisableSave}
            tableType={'PrimerInformation'}
            disallowDuplicateIDs={true}
        />;

    };


    getChildComponent = (tabName : string) : Object => {

        if (tabName === 'Primer Information') {

            return this.getPrimerInformationTable();

        } else if (tabName === 'Library Information'){

            const libraryInformationInitialGrids = this.getInitialInformationTableGrids(
                this.frozenGrids,
                'LibraryInformation'
            );

            const libraryInformationFrozenGrids = this.getFrozenGrids('LibraryInformation');

            if (this.props.initialState.containerTypeIsPlate) {

                return <PlateTabContainer
                    columns={this.initialiseColumns(this.props.initialState)}
                    data={this.state.libraryInformationData}
                    frozenColumns={this.frozenLibraryInformationColumns}
                    frozenGrids={libraryInformationFrozenGrids.map(x=>x.grid)}
                    initialState={this.props.initialState}
                    numberOfRows={this.getAllRowsWithLibraryIDs().length}
                    initialGrids={libraryInformationInitialGrids}
                    handleSubmission={this.handleSubmission}
                    handleSave={this.handleSave}
                    handleDownload={this.handleDownload}
                    showDocumentation={this.props.showDocumentation}
                    showHiddenColumns={this.props.showHiddenColumns}
                    updateGrids={R.curry(this.updateTablesFromGrids)('LibraryInformation')}
                    updateWarningList={this.updateWarnings}
                    shouldDisableSubmit={this.props.shouldDisableSubmit}
                    shouldDisableSave={this.props.shouldDisableSave}
                    updateHasErrors={R.curry(this.updateHasErrors)('LibraryInformation')}
                    tableType={'LibraryInformation'}
                />;

            } else {

                return <SF2Validator
                    id={0}
                    columns={this.initialiseColumns(this.props.initialState)}
                    data={this.state.libraryInformationData}
                    frozenColumns={this.frozenLibraryInformationColumns}
                    frozenGrid={libraryInformationFrozenGrids[0].grid}
                    initialState={this.props.initialState}
                    initialGrid={libraryInformationInitialGrids[0]}
                    handleSubmission={this.handleSubmission}
                    handleSave={this.handleSave}
                    handleDownload={this.handleDownload}
                    showDocumentation={this.props.showDocumentation}
                    updateHasErrors={R.curry(this.updateHasErrors)('LibraryInformation')}
                    updateGrids={R.curry(this.updateTablesFromGridWithID)('LibraryInformation')}
                    updateWarningList={this.updateWarnings}
                    showHiddenColumns={this.props.showHiddenColumns}
                    topRowNumber={1}
                    submitDisabled={this.props.shouldDisableSubmit}
                    saveDisabled={this.props.shouldDisableSave}
                    tableType={'LibraryInformation'}
                    validator={this.validate}
                />;

            }

        } else {
            return <div>unknown</div>;
        }

    };


    render() {return(
        <div>
            {
                this.tableTypes.length < 2 &&
                this.getChildComponent('Library Information')
            }
            {
                this.tableTypes.length >= 2 &&
                <TabContainer
                    tabNames={this.getTableNames()}
                    tabHasErrors={this.errors}
                    getChildComponent={this.getChildComponent}
                />
            }
        </div>
    )}

}


//$FlowFixMe
export default withConfirmHandler(withDisableHandler(withDownloadHandler(withShowDocumentationHandler(LibrarySF2))));
