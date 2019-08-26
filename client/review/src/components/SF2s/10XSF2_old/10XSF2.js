// @flow
import React from 'react';
import * as R from 'ramda';

import TenXSampleInformation from './10XSampleInformation';
import TenXPoolInformation from './10XPoolInformation';

import TabContainer from '../../hoc/TabContainer';

import { getSF2, getInitialTables, updateTables, calculateEGID } from '../../../functions/lib';
import { SF2DefaultProps, withDisableHandler } from "../../hoc/DisableHandler";

import type { SF2Data, Table, Tables, Stage1FormState } from '../../../types/flowTypes';
import type { StringMap } from '../../../sf2datasheet/types/flowTypes';

type TenXSF2Props = {
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


type TenXSF2State = {
    libraryInformationData: StringMap,
    primerInformationData: StringMap
}


class TenXSF2Old extends React.Component<TenXSF2Props, TenXSF2State> {
    static defaultProps = SF2DefaultProps;
    tables = [];
    tableTypes = [];
    formType = '10XSF2_old';
    errors = new Map();
    tableNames = new Map([
        [ '10XPoolInformation', 'Pool Information' ],
        [ '10XSampleInformation', '10X Sample Information' ]
    ]);


    constructor (props : Object) {
        super(props);

        if (this.props.initialState.sf2HasPools === true) {
            this.tableTypes.push('10XPoolInformation');
        }
        this.tableTypes.push('10XSampleInformation');

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
            R.find(R.propEq('name', '10XPoolInformation')),
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
                    '10X_old',
                    '10XPoolInformation'
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

        this.props.updateSaveDisabled(this.tables);

    };


    getChildComponent = (tabName : string) : Object => {

        switch(tabName) {
            case 'Pool Information':
                return (<TenXPoolInformation
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
            case '10X Sample Information':
                return (<TenXSampleInformation
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
            return(this.getChildComponent('10X Sample Information'));
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
export default withDisableHandler(TenXSF2Old);
