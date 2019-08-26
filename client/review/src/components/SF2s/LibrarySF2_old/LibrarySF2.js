// @flow
import React from 'react';
import * as R from 'ramda';

import LibraryInformation from './LibraryInformation';
import PoolInformation from './PoolInformation';
import PrimerInformation from './PrimerInformation';

import TabContainer from '../../hoc/TabContainer';

import {getSF2, getInitialTables, updateTables, calculateEGID} from '../../../functions/lib';
import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";

import type { SF2Data, Table, Tables, Stage1FormState } from '../../../types/flowTypes';
import type { StringMap } from '../../../sf2datasheet/types/flowTypes';


type LibrarySF2Props = {
    initialSF2Data?: ?SF2Data,
    initialState: Stage1FormState,
    handleSubmission: Tables => void,
    handleSave: Tables => void,
    showHiddenColumns: boolean,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateShouldDisableSubmit: (string, boolean) => void,
    updateSaveDisabled: Tables => void,
    disableSaveButton: Tables => void
};


type LibrarySF2State = {
    libraryInformationData: StringMap,
    primerInformationData: StringMap
}


class LibrarySF2 extends React.Component<LibrarySF2Props, LibrarySF2State> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    tableTypes = [];
    formType = 'LibrarySF2';
    errors = new Map();
    tableNames = new Map([
        [ 'PoolInformation', 'Pool Information' ],
        [ 'PrimerInformation', 'Primer Information' ],
        [ 'LibraryInformation', 'Library Information' ]
    ]);


    constructor (props : Object) {
        super(props);

        if (this.props.initialState.sf2HasPools === true) {
            this.tableTypes.push('PoolInformation');
        }
        if (this.props.initialState.sf2HasCustomPrimers === true) {
            this.tableTypes.push('PrimerInformation');
        }
        this.tableTypes.push('LibraryInformation');

        this.errors = new Map(this.tableTypes.map((_, tableTypeIndex) => {return [tableTypeIndex, true]}));

        this.state = {
            libraryInformationData: new Map(),
            primerInformationData: new Map()
        };

    };


    handleSave = () : void => {
        this.props.handleSave(getSF2(this.formType, this.tables));
        this.props.disableSaveButton(this.tables);
    };


    handleSubmission = () : void => this.props.handleSubmission(getSF2(this.formType, this.tables));


    updateHasErrors = (tableName : string, hasErrors : boolean) : void => {
        this.props.updateShouldDisableSubmit(tableName, hasErrors);
        const tableIndex = R.indexOf(tableName, this.tableTypes);
        this.errors.set(tableIndex, hasErrors);
    };


    getLibraryInformationData = () : StringMap => {

        const poolIDs = R.pipe(
            R.find(R.propEq('name', 'PoolInformation')),
            R.propOr([[]], 'grids'),
            R.reduce(R.concat, []),
            R.map(row => row[0]),
            R.pluck('value')
        )(this.tables);

        const dataArray = poolIDs.map(
            (x,ix) => {
                const egID = calculateEGID(
                    ix+1,
                    this.props.initialState.projectID,
                    'Library_old',
                    'PoolInformation'
                );
                return [x,egID];
            }
        );

        return new Map(dataArray);

    };


    getTableNames = () : Array<string> => {
        return this.tableTypes.map(t => { const tn = this.tableNames.get(t); return tn === undefined ? 'Unknown' : tn});
    };


    updateTables = (table: Table) : void => {

        this.tables = updateTables(table, this.tables);

        const newLibraryInformationData = this.getLibraryInformationData();
        if(!R.equals(this.state.libraryInformationData, newLibraryInformationData)) {
            this.setState({
                libraryInformationData: newLibraryInformationData
            });
        }

        let newPrimerInformationData = new Map(Array.from(newLibraryInformationData));
        newPrimerInformationData.set('all pools', '');
        if(!R.equals(this.state.primerInformationData, newPrimerInformationData)) {
            this.setState({
                primerInformationData: newPrimerInformationData
            });
        }

        this.props.updateSaveDisabled(this.tables);

    };


    getChildComponent = (tabName : string) : Object => {

        switch(tabName) {
            case 'Pool Information':
                return (<PoolInformation
                            formType={this.formType}
                            initialState={this.props.initialState}
                            initialTables={getInitialTables(this.props)}
                            handleSubmission={this.handleSubmission}
                            handleSave={this.handleSave}
                            showHiddenColumns={this.props.showHiddenColumns}
                            updateTables={this.updateTables}
                            shouldDisableSubmit={this.props.shouldDisableSubmit}
                            shouldDisableSave={this.props.shouldDisableSave}
                            updateHasErrors={this.updateHasErrors}
                        />);
            case 'Primer Information':
                return (<PrimerInformation
                            formType={this.formType}
                            data={this.state.primerInformationData}
                            initialState={this.props.initialState}
                            initialTables={getInitialTables(this.props)}
                            handleSubmission={this.handleSubmission}
                            handleSave={this.handleSave}
                            showHiddenColumns={this.props.showHiddenColumns}
                            updateTables={this.updateTables}
                            shouldDisableSubmit={this.props.shouldDisableSubmit}
                            shouldDisableSave={this.props.shouldDisableSave}
                            updateHasErrors={this.updateHasErrors}
                        />);
            case 'Library Information':
                return (<LibraryInformation
                            formType={this.formType}
                            data={this.state.libraryInformationData}
                            initialState={this.props.initialState}
                            initialTables={getInitialTables(this.props)}
                            handleSubmission={this.handleSubmission}
                            handleSave={this.handleSave}
                            showHiddenColumns={this.props.showHiddenColumns}
                            updateTables={this.updateTables}
                            shouldDisableSubmit={this.props.shouldDisableSubmit}
                            shouldDisableSave={this.props.shouldDisableSave}
                            updateHasErrors={this.updateHasErrors}
                        />);
            default:
                return <div>unknown</div>;
        }

    };


    render() {
        if(this.tableTypes.length < 2) {
            return(this.getChildComponent('Library Information'));
        } else {
            return(
                <TabContainer
                    tabNames={this.getTableNames()}
                    tabHasErrors={this.errors}
                    getChildComponent={this.getChildComponent}
                />
            );
        }
    }

}


//$FlowFixMe
export default withDisableHandler(LibrarySF2);
