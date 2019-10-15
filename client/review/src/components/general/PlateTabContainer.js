// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from './SF2Validator';
import TabContainer from '../hoc/TabContainer';

import {
    generatePlateID,
    getDuplicateWarnings,
    getRepeatedKeys,
    initialiseGrids,
    generateContainerOffset
} from '../../functions/lib';

import type { Grid, StringMap } from '../../sf2datasheet/types/flowTypes'
import type { Grids, GridWithID, Warnings, Stage1FormState } from '../../types/flowTypes'
import type { Columns } from '../../sf2datasheet/types/flowTypes'


type PlateTabContainerProps = {
    columns: Columns,
    data?: StringMap,
    frozenColumns: Columns,
    frozenGrids: Grids,
    initialGrids?: Grids,
    initialState: Stage1FormState,
    numberOfRows: number,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    showHiddenColumns: boolean,
    updateGrids: Grids => void,
    updateWarningList?: Warnings => void,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateHasErrors: boolean => void,
    tableType: string,
    validator?: (Array<string>, Grid) => Array<string>,
    containerStartIndex?: string
};


type PlateTabContainerState = {
    warnings: Warnings
};


export default class PlateTabContainer extends React.Component<PlateTabContainerProps, PlateTabContainerState> {
    maxRowsPerGrid: number;
    grids: Array<GridWithID>;


    grids = [];


    constructor (props : Object) {
        super(props);

        this.maxRowsPerGrid = 96;

        let initialGrids = [];

        if(this.props.initialGrids === undefined || R.equals(this.props.initialGrids, [])) {
            initialGrids = initialiseGrids(this.props.numberOfRows, this.maxRowsPerGrid);
        } else {
            initialGrids = this.props.initialGrids;
        }

        const generatePlateIDForGridIndex = (gridIndex, containerOffset) => {
           return(
               generatePlateID(this.props.initialState.projectID, gridIndex + containerOffset)
           );
        };

        const containerOffset = generateContainerOffset(this.props.containerStartIndex);

        const plateIDs = initialGrids.map((_, ix) => {return generatePlateIDForGridIndex(ix, containerOffset)});

        this.grids = initialGrids.map((x, ix) => {return{'id': plateIDs[ix] , 'grid': x}});

        this.state = {
            warnings: []
        };

    };


    getNewWarnings = (columns : Columns, grids : Grids, frozenGrids : Grids) : Warnings => {

        const gridArrays = grids.map(g => g.grid);
        const overallGrid = R.unnest(gridArrays);
        const overallFrozenGrid = R.unnest(frozenGrids);
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

        const indexToUpdate = R.findIndex(R.propEq('id', gridForTab.id))(this.grids);

        this.grids = R.update(
            indexToUpdate,
            gridForTab,
            this.grids
        );

        this.props.updateGrids(this.grids);

        const newWarnings = this.getNewWarnings(this.props.columns, this.grids, this.props.frozenGrids);

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

        const tabIndex = parseInt(R.match(/\d+$/, tabName), 10) -
            generateContainerOffset(this.props.containerStartIndex) - 1;

        if(R.isNil(this.grids) || R.isNil(this.props.frozenGrids)) {

            return <div>No grid to display</div>

        } else {

            return(
                <SF2Validator
                    id={tabName}
                    columns={this.props.columns}
                    data={this.props.data}
                    frozenColumns={this.props.frozenColumns}
                    initialState={this.props.initialState}
                    frozenGrid={this.props.frozenGrids[tabIndex]}
                    initialGrid={this.grids[tabIndex].grid}
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


    generatePlateIDFromGridIndex = (_, gridIndex) => {
        const updatedGridIndex = gridIndex + generateContainerOffset(this.props.containerStartIndex);
        return(generatePlateID(this.props.initialState.projectID, updatedGridIndex));
    };


    render() {
        return(
            <TabContainer
                tabNames={this.grids.map(this.generatePlateIDFromGridIndex)}
                getChildComponent={this.getChildComponent}
                updateSomeTabHasErrors={this.props.updateHasErrors}
            />
        );
    }

};
