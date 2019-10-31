// @flow
import React from 'react';
import * as R from 'ramda';

// import SF2Validator from './SF2Validator';
import TabContainer from '../../hoc/TabContainer';

// import { initialiseGrids } from '../../functions/lib';
//
// import type { Grid, GridWithID } from '../../sf2datasheet/types/flowTypes'
// import type { Stage1FormState } from '../../types/types';
// import type { Columns } from '../../sf2datasheet/types/flowTypes'
//

type LibrarySF2TabContainerProps = {
//     columns: Columns,
//     frozenColumns: Columns,
//     initialGridWithIDs?: Array<Grid>,
//     initialState: Stage1FormState,
//     handleSubmission: Array<Grid> => void,
//     handleSave: Array<Grid> => void,
//     showHiddenColumns: boolean
};


type LibrarySF2TabContainerState = {
    activeTab: number,
    errors: Map<number, boolean>,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean
};



export default class LibrarySF2TabContainer extends React.Component<LibrarySF2TabContainerProps, LibrarySF2TabContainerState> {
    // maxRowsPerGrid: number;

    // grids = [];
    // lastSavedGrids = [];


    constructor (props : Object) {
        super(props);

        // this.maxRowsPerGrid = 96;
        //
        // if(this.props.initialGridWithIDs === undefined || R.equals(this.props.initialGridWithIDs, [])) {
        //     this.gridWithIDs = initialiseGrids(this.props.initialState.numberOfSamplesOrLibraries, this.maxRowsPerGrid);
        // } else {
        //     this.gridWithIDs = this.props.initialGridWithIDs
        // }

        this.state = {
            activeTab: 0,
            errors: new Map([[0, true], [1, true], [2, true]]),
            // errors: new Map(this.gridWithIDs.map((grid, gridIndex) => {return [gridIndex, true]})),
            shouldDisableSubmit: true,
            shouldDisableSave: true
        };

    };


    updateHasErrors = (hasErrors : boolean, id : number) : void => {

        let newErrors = R.clone(this.state.errors);
        newErrors.set(id, hasErrors);

        const someDataSheetHasErrors = R.any(R.identity, Array.from(newErrors.values()));

        this.setState({
            errors: newErrors,
            shouldDisableSubmit: someDataSheetHasErrors
        });

    };


    // updateSaveDisabled = () : void => {
    //
    //     if(R.equals(this.lastSavedGrids, [])) {
    //         the last saved grids haven't been initialised yet, so do it here
            // this.lastSavedGrids = R.clone(this.grids);
        // }
        //
        // if(!R.equals(this.grids, this.lastSavedGrids)) {
        //     this.setState({shouldDisableSave: false})
        // } else {
        //     this.setState({shouldDisableSave: true})
        // }
    //
    // };

    //
    // updateGrids = (gridForTab : GridWithID) : void => {
    //
    //     this.grids = R.update(gridForTab.id, gridForTab.grid, this.grids);
    //
    //     this.updateSaveDisabled();
    //
    // };

    //
    // handleSave = () : void => {
    //
    //     this.props.handleSave(this.grids);
    //     this.lastSavedGrids = R.clone(this.grids);
    //     this.updateSaveDisabled();
    //
    // };


    handleSubmission = () : void => {

        this.props.handleSubmission(this.grids);

    };


    setActiveTab = (tabIndex : number) : void => {
        if (this.state.activeTab !== tabIndex) {
            this.setState({
                activeTab: tabIndex
            });
        }
    };


    getChildComponent = (tabIndex : number) : Object => {
        return(
            {/*<SF2Validator*/}
                // id={tabIndex}
                // columns={this.props.columns}
                // frozenColumns={this.props.frozenColumns}
                // initialState={this.props.initialState}
                // initialGrid={this.gridWithIDs[tabIndex]}
                // handleSubmission={this.handleSubmission}
                // handleSave={this.handleSave}
                // updateHasErrors={this.updateHasErrors}
                // updateGridWithIDs={this.updateGridWithIDs}
                // showHiddenColumns={this.props.showHiddenColumns}
                // topRowNumber={(tabIndex * this.maxRowsPerGrid) + 1}
                // submitDisabled={this.state.shouldDisableSubmit}
                // saveDisabled={this.state.shouldDisableSave}
            // />
        )
    };


    render() {
        return(
            <TabContainer
                tabContents={this.grids}
                setActiveTab={this.setActiveTab}
                activeTab={this.state.activeTab}
                errors={this.state.errors}
                getChildComponent={this.getChildComponent}
                tabPrefix={'Plate'}
            />
        );
    }

};
