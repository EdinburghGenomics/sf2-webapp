// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from '../../general/SF2Validator';
import PlateTabContainer from '../../general/PlateTabContainer';


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
    getInitialTables,
    calculateWellID,
    createFrozenGrid,
    getInitialInformationTableGrids,
    calculateFrozenGrids,
    getAllRowsWithSampleAndLibraryIDs,
    addContainerIDs,
    getContainerIDs
} from '../../../functions/lib';


import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";
import { withConfirmHandler } from "../../hoc/ConfirmHandler";
import { withDownloadHandler } from "../../hoc/DownloadHandler";
import { withShowDocumentationHandler } from "../../hoc/ShowDocumentationHandler";
import TabContainer from "../../hoc/TabContainer";


import type {
    SF2Data,
    Table,
    Tables,
    Stage1FormState,
    GridWithID,
    Warnings,
    GridWithIDs
} from '../../../types/flowTypes';
import type {Row, Columns, StringMap} from '../../../sf2datasheet/types/flowTypes';


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
    disableSaveButton: Tables => void,
    startIndices: Object
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
    tableNames = {
        'PrimerInformation': 'Primer Information',
        'LibraryInformation': 'Library Information'
    };

    frozenLibraryInformationColumns = this.props.initialState.containerTypeIsPlate ?
        frozenLibraryInformationColumns.concat([{value: 'Well ID', width: 100}]) :
        frozenLibraryInformationColumns;


    constructor (props : Object) {
        super(props);

        if (this.props.initialState.sf2HasCustomPrimers === true) {
            this.tableTypes.push('PrimerInformation');
        }
        this.tableTypes.push('LibraryInformation');

        this.state = {
            libraryInformationData: new Map(),
            warnings: []
        };

        this.allRowsWithSampleAndLibraryIDs = getAllRowsWithSampleAndLibraryIDs(
            this.props.initialState,
            this.props.startIndices
        );

        const libraryInformationFrozenGrids = calculateFrozenGrids(
            this.allRowsWithSampleAndLibraryIDs,
            this.props.initialState.containerTypeIsPlate,
            this.getLibraryInformationFrozenGridRowsToReturn
        );

        const primerInformationFrozenGrids = [{id: "0", grid: createFrozenGrid(
            this.props.initialState.numberOfCustomPrimers,
            frozenPrimerInformationColumns,
            this.props.initialState.projectID,
            1,
            'Library',
            'PrimerInformation',
            false
        )}];

        const containerIDs = getContainerIDs(
            libraryInformationFrozenGrids,
            this.props.startIndices.container,
            this.props.initialState.containerTypeIsPlate,
            this.props.initialState.projectID
        );

        const libraryInformationFrozenGridWithIDs = addContainerIDs(containerIDs, libraryInformationFrozenGrids);

        this.frozenGrids = [
            {name: 'PrimerInformation', grids: primerInformationFrozenGrids},
            {name: 'LibraryInformation', grids: libraryInformationFrozenGridWithIDs}
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
            getSF2(this.formType, this.tables, this.frozenGrids)
        );
    };


    makeTableFromGridWithIDs = (tableType : string, gridWithIDs : GridWithIDs) : Table => {
        return {name: tableType, grids: gridWithIDs};
    };


    makeTableFromGridWithID = (tableType : string, gridWithID : GridWithID) : Table => {
        return this.makeTableFromGridWithIDs(tableType, [gridWithID]);
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


    updateTablesFromGridWithIDs = (tableType : string, gridWithIDs : GridWithIDs) : void => {
        const table = this.makeTableFromGridWithIDs(tableType, gridWithIDs);
        this.updateTables(table);
    };


    updateWarnings = (warnings : Warnings) : void => {

        if(!R.equals(this.state.warnings, warnings)) {
            this.setState({
                warnings: warnings
            });
        }

    };


    updateRow = (currentWellOffset : number, row : Row) : Row => {

        const newWellIndex = row.wellIndex - currentWellOffset;
        const newWellID = calculateWellID(newWellIndex-1);

        return R.pipe(
            R.assoc('wellIndex', newWellIndex),
            R.assoc('egWellID', newWellID)
        )(row);

    };


    initialiseColumns = (initialState : Object) : Columns => {
        let filteredColumns = libraryInformationColumns;
        filteredColumns = initialState.sf2HasCustomPrimers ? filteredColumns : R.remove(14, 1, filteredColumns);
        filteredColumns = initialState.sf2IsDualIndex ? filteredColumns : R.remove(13, 1, filteredColumns);
        filteredColumns = initialState.sf2HasPools ? filteredColumns : R.remove(3, 2, filteredColumns);
        return filteredColumns;
    };


    getTableNames = () : Array<string> => {
        return this.tableTypes.map(t => { const tn = this.tableNames[t]; return tn === undefined ? 'Unknown' : tn});
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


    getPrimerInformationTable = (updateHasErrors : (string, boolean) => void) => {

        const primerInformationInitialGrid = this.getInitialInformationTableGrids(
            this.frozenGrids,
            'PrimerInformation'
        )[0];

        const primerInformationFrozenGrid = this.getFrozenGrids('PrimerInformation')[0].grid;

        return <SF2Validator
            id={"0"}
            columns={primerInformationColumns}
            frozenColumns={frozenPrimerInformationColumns}
            frozenGrid={primerInformationFrozenGrid}
            initialState={this.props.initialState}
            initialGrid={primerInformationInitialGrid}
            handleSubmission={this.handleSubmission}
            handleSave={this.handleSave}
            handleDownload={this.handleDownload}
            showDocumentation={this.props.showDocumentation}
            updateHasErrors={(_, e) => updateHasErrors('Primer Information', e)}
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


    getChildComponent = (tabName : string, updateHasErrors : (string, boolean) => void) : Object => {

        if (R.isNil(updateHasErrors)) {
            updateHasErrors = (_, e) => this.props.updateShouldDisableSubmit(e);
        }

        if (tabName === 'Primer Information') {

            return this.getPrimerInformationTable(updateHasErrors);

        } else if (tabName === 'Library Information') {

            const libraryInformationInitialGrids = this.getInitialInformationTableGrids(
                this.frozenGrids,
                'LibraryInformation'
            );

            const libraryInformationFrozenGridWithIDs = this.getFrozenGrids('LibraryInformation');

            const containerIDs = libraryInformationFrozenGridWithIDs.map(x => x.id);

            const libraryInformationInitialGridWithIDs = addContainerIDs(containerIDs, libraryInformationInitialGrids);

            const tubeLibraryInformation = <SF2Validator
                id={"0"}
                columns={this.initialiseColumns(this.props.initialState)}
                data={this.state.libraryInformationData}
                frozenColumns={this.frozenLibraryInformationColumns}
                frozenGrid={libraryInformationFrozenGridWithIDs[0].grid}
                initialState={this.props.initialState}
                initialGrid={libraryInformationInitialGrids[0]}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.handleDownload}
                showDocumentation={this.props.showDocumentation}
                updateHasErrors={(_, e) => updateHasErrors(tabName, e)}
                updateGrids={R.curry(this.updateTablesFromGridWithID)('LibraryInformation')}
                updateWarningList={this.updateWarnings}
                showHiddenColumns={this.props.showHiddenColumns}
                topRowNumber={1}
                submitDisabled={this.props.shouldDisableSubmit}
                saveDisabled={this.props.shouldDisableSave}
                tableType={tabName}
                validator={this.validate}
            />;

            const plateLibraryInformation = <PlateTabContainer
                columns={this.initialiseColumns(this.props.initialState)}
                data={this.state.libraryInformationData}
                frozenColumns={this.frozenLibraryInformationColumns}
                frozenGridWithIDs={libraryInformationFrozenGridWithIDs}
                initialState={this.props.initialState}
                numberOfRows={this.allRowsWithSampleAndLibraryIDs.length}
                initialGridWithIDs={libraryInformationInitialGridWithIDs}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.handleDownload}
                showDocumentation={this.props.showDocumentation}
                showHiddenColumns={this.props.showHiddenColumns}
                updateGridWithIDs={R.curry(this.updateTablesFromGridWithIDs)('LibraryInformation')}
                updateWarningList={this.updateWarnings}
                shouldDisableSubmit={this.props.shouldDisableSubmit}
                shouldDisableSave={this.props.shouldDisableSave}
                updateHasErrors={R.curry(updateHasErrors)(tabName)}
                tableType={'LibraryInformation'}
                validator={this.validate}
            />;

            if (this.props.initialState.containerTypeIsPlate) {
                return plateLibraryInformation;
            } else {
                return tubeLibraryInformation;
            }

        }
    };


    render() {return(
        <div>
            {
                this.tableTypes.length < 2 &&
                this.getChildComponent('Library Information', null)
            }
            {
                this.tableTypes.length >= 2 &&
                <TabContainer
                    tabNames={this.getTableNames()}
                    getChildComponent={this.getChildComponent}
                    updateSomeTabHasErrors={this.props.updateShouldDisableSubmit}
                />
            }
        </div>
    )}

}


//$FlowFixMe
export default withConfirmHandler(withDisableHandler(withShowDocumentationHandler(LibrarySF2)));
