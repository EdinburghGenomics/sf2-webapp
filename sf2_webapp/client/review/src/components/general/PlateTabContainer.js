// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from './SF2Validator';
import TabContainer from '../hoc/TabContainer';

import {
    getDuplicateWarnings,
    getRepeatedKeys,
    initialiseGrids,
    addContainerIDs
} from '../../functions/lib';

import type { Grid, StringMap } from '../../sf2datasheet/types/flowTypes';
import type { GridWithID, GridWithIDs, Warnings, Stage1FormState } from '../../types/flowTypes';
import type { Columns } from '../../sf2datasheet/types/flowTypes';


type PlateTabContainerProps = {
    columns: Columns,
    data?: StringMap,
    frozenColumns: Columns,
    frozenGridWithIDs: GridWithIDs,
    initialGridWithIDs?: GridWithIDs,
    initialState: Stage1FormState,
    numberOfRows: number,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    showHiddenColumns: boolean,
    updateGridWithIDs: GridWithIDs => void,
    updateWarningList?: Warnings => void,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateHasErrors: boolean => void,
    tableType: string,
    validator?: (Array<string>, Grid) => Array<string>
};


type PlateTabContainerState = {
    warnings: Warnings
};


export default class PlateTabContainer extends React.Component<PlateTabContainerProps, PlateTabContainerState> {
    maxRowsPerGrid: number;
    gridWithIDs: GridWithIDs;


    gridWithIDs = [];


    constructor (props : Object) {
        super(props);

        this.maxRowsPerGrid = 96;

        if(this.props.initialGridWithIDs === undefined || R.equals(this.props.initialGridWithIDs, [])) {
            const initialGrids = initialiseGrids(this.props.numberOfRows, this.maxRowsPerGrid);
            const initialContainerIDs = R.map(R.prop('id'), this.props.frozenGridWithIDs);
            this.gridWithIDs = addContainerIDs(initialContainerIDs, initialGrids);
        } else {
            this.gridWithIDs = this.props.initialGridWithIDs;
        }

        this.state = {
            warnings: []
        };

    };


    getNewWarnings = (columns : Columns, grids : GridWithIDs, frozenGrids : GridWithIDs) : Warnings => {

        const getOverallGrid = R.pipe(
            R.pluck('grid'),
            R.unnest
        );

        const overallGrid = getOverallGrid(grids);
        const overallFrozenGrid = getOverallGrid(frozenGrids);

        const repeatedKeys = getRepeatedKeys(0, overallGrid);

        return getDuplicateWarnings(
            0,
            columns,
            overallGrid,
            overallFrozenGrid,
            repeatedKeys
        );

    };


    updateGrids = (gridForTab : GridWithID) : void => {

        const indexToUpdate = R.findIndex(R.propEq('id', gridForTab.id))(this.gridWithIDs);

        this.gridWithIDs = R.update(
            indexToUpdate,
            gridForTab,
            this.gridWithIDs
        );

        this.props.updateGridWithIDs(this.gridWithIDs);

        const newWarnings = this.getNewWarnings(this.props.columns, this.gridWithIDs, this.props.frozenGridWithIDs);

        if(!R.equals(this.state.warnings, newWarnings)) {
            this.setState({warnings: newWarnings});
        }

        if(!R.isNil(this.props.updateWarningList)) {
            this.props.updateWarningList(newWarnings);
        }

    };


    handleSave = () : void => {
        this.props.handleSave();
    };


    handleSubmission = () : void => {
        this.props.handleSubmission();
    };


    getChildComponent = (tabName : string, updateHasErrors : (string, boolean) => void) : Object => {

        const getGridWithMatchingID = (id, grids) => {
            return R.find(R.propEq('id', id))(grids).grid;
        };

        const frozenGrid = getGridWithMatchingID(tabName, this.props.frozenGridWithIDs);
        const grid = getGridWithMatchingID(tabName, this.gridWithIDs);

        if(R.isNil(this.gridWithIDs) || R.isNil(this.props.frozenGridWithIDs)) {

            return <div>No grid to display</div>

        } else {

            return(
                <SF2Validator
                    id={tabName}
                    columns={this.props.columns}
                    data={this.props.data}
                    frozenColumns={this.props.frozenColumns}
                    initialState={this.props.initialState}
                    frozenGrid={frozenGrid}
                    initialGrid={grid}
                    handleSubmission={this.handleSubmission}
                    handleSave={this.handleSave}
                    handleDownload={this.props.handleDownload}
                    showDocumentation={this.props.showDocumentation}
                    updateHasErrors={updateHasErrors}
                    updateGrids={this.updateGrids}
                    showHiddenColumns={this.props.showHiddenColumns}
                    topRowNumber={1}
                    submitDisabled={this.props.shouldDisableSubmit}
                    saveDisabled={this.props.shouldDisableSave}
                    tableType={this.props.tableType}
                    warnings={this.state.warnings}
                    validator={this.props.validator}
                />
            );

        }

    };


    render() {
        return(
            <TabContainer
                tabNames={R.map(R.prop('id'), this.gridWithIDs)}
                getChildComponent={this.getChildComponent}
                updateSomeTabHasErrors={this.props.updateHasErrors}
            />
        );
    }

};
