// @flow
import React from 'react';


import PlateTabContainer from './PlateTabContainer';

import { getInitialGrids } from "../../functions/lib";

import type { Stage1FormState, Grids, Table, Tables } from '../../types/flowTypes';

import type { Columns, StringMap } from '../../sf2datasheet/types/flowTypes';


export type GeneralInformationTableProps = {
    formType: string,
    initialTables: Tables,
    initialState: Stage1FormState,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    showHiddenColumns: boolean,
    updateTables: Table => void,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateHasErrors: (string, boolean) => void,
};


type InformationTableProps = {
    tableType: string,
    formType: string,
    columns: Columns,
    data?: StringMap,
    frozenColumns: Columns,
    numberOfRows: number,
    initialTables?: Tables,
    initialState: Stage1FormState,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    showHiddenColumns: boolean,
    updateTables: Table => void,
    shouldDisableSubmit: boolean,
    shouldDisableSave: boolean,
    updateHasErrors: (string, boolean) => void,
    disallowDuplicateIDs?: ?boolean
};


const InformationTable = (props : InformationTableProps) => {


    const updateHasErrors = (hasErrors : boolean) : void => {
        props.updateHasErrors(props.tableType, hasErrors);
    };


    const initialGrids = getInitialGrids(props.initialTables, props.tableType);


    const updateGrids = (grids : Grids) : void => { props.updateTables({name: props.tableType, grids: grids}) };


    return(
        <PlateTabContainer
            columns={props.columns}
            data={props.data}
            frozenColumns={props.frozenColumns}
            initialState={props.initialState}
            numberOfRows={props.numberOfRows}
            initialGrids={initialGrids}
            handleSubmission={props.handleSubmission}
            handleSave={props.handleSave}
            handleDownload={props.handleDownload}
            showDocumentation={props.showDocumentation}
            showHiddenColumns={props.showHiddenColumns}
            updateGrids={updateGrids}
            shouldDisableSubmit={props.shouldDisableSubmit}
            shouldDisableSave={props.shouldDisableSave}
            updateHasErrors={updateHasErrors}
            tableType={props.tableType}
            disallowDuplicateIDs={props.disallowDuplicateIDs}
        />
    );

};


export default InformationTable;
