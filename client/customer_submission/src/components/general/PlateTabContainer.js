// @flow
import React from 'react';
import * as R from 'ramda';

import SF2Validator from './SF2Validator';
import TabContainer from '../hoc/TabContainer';

import { initialiseGrids } from '../../functions/lib';

import type { StringMap } from '../../sf2datasheet/types/flowTypes'
import type { Grids, GridWithID, Stage1FormState } from '../../types/flowTypes'
import type { Columns } from '../../sf2datasheet/types/flowTypes'


type PlateTabContainerProps = {
    columns: Columns,
    data?: StringMap,
    frozenColumns: Columns,
    initialGrids?: Grids,
    initialState: Stage1FormState,
    numberOfRows: number,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    showHiddenColumns: boolean,
    updateGrids: Grids => void,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateHasErrors: boolean => void,
    tableType: string,
    disallowDuplicateIDs?: ?boolean
};


type PlateTabContainerState = {
    errors: Map<number, boolean>
};


export default class PlateTabContainer extends React.Component<PlateTabContainerProps, PlateTabContainerState> {
    maxRowsPerGrid: number;


    grids = [];


    constructor (props : Object) {
        super(props);

        this.maxRowsPerGrid = 96;

        if(this.props.initialGrids === undefined || R.equals(this.props.initialGrids, [])) {
            this.grids = initialiseGrids(this.props.numberOfRows, this.maxRowsPerGrid);
        } else {
            this.grids = this.props.initialGrids;
        }

        this.state = {
            errors: new Map(this.grids.map((_, gridIndex) => {return [gridIndex, true]}))
        };

    };


    updateHasErrors = (hasErrors : boolean, id : number) : void => {

        let newErrors = R.clone(this.state.errors);
        newErrors.set(id, hasErrors);

        const someDataSheetHasErrors = R.any(R.identity, Array.from(newErrors.values()));

        this.setState({
            errors: newErrors
        });

        this.props.updateHasErrors(someDataSheetHasErrors);

    };


    updateGrids = (gridForTab : GridWithID) : void => {

        this.grids= R.update(
            gridForTab.id,
            gridForTab.grid,
            this.grids
        );

        this.props.updateGrids(this.grids);

    };


    handleSave = () : void => {
        this.props.handleSave();
    };


    handleSubmission = () : void => {
        this.props.handleSubmission();
    };


    getChildComponent = (tabName : string) : Object => {

        const tabIndex = parseInt(R.match(/\d+$/, tabName), 10) - 1;

        return(
            <SF2Validator
                id={tabIndex}
                columns={this.props.columns}
                data={this.props.data}
                frozenColumns={this.props.frozenColumns}
                initialState={this.props.initialState}
                initialGrid={this.grids[tabIndex]}
                handleSubmission={this.handleSubmission}
                handleSave={this.handleSave}
                handleDownload={this.props.handleDownload}
                showDocumentation={this.props.showDocumentation}
                updateHasErrors={this.updateHasErrors}
                updateGrids={this.updateGrids}
                showHiddenColumns={this.props.showHiddenColumns}
                topRowNumber={(tabIndex * this.maxRowsPerGrid) + 1}
                submitDisabled={this.props.shouldDisableSubmit}
                saveDisabled={this.props.shouldDisableSave}
                tableType={this.props.tableType}
                disallowDuplicateIDs={this.props.disallowDuplicateIDs}
            />
        );

    };


    render() {
        return(
            <TabContainer
                tabNames={this.grids.map((grid, gridIndex) => { return('Plate ' + (gridIndex + 1).toString()) })}
                tabHasErrors={this.state.errors}
                getChildComponent={this.getChildComponent}
            />
        );
    }

};
