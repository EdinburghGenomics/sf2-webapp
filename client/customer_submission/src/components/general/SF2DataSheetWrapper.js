// @flow
import React from 'react';
import * as R from 'ramda';

import SF2DataSheet from '../../sf2datasheet/components/SF2DataSheet';

import { Grid, Columns, StringMap } from '../../sf2datasheet/types/flowTypes';

import { createFrozenGrid } from '../../functions/lib';


type SF2DataSheetWrapperProps = {
    id: number,
    columns: Columns,
    data?: StringMap,
    initialGrid: Grid,
    onUpdateGrid: Grid => void,
    showHiddenColumns: boolean,
    frozenColumns: Columns,
    frozenGrid?: ?Grid,
    projectID: string,
    topRowNumber: number,
    sf2type: string,
    tableType: string,
    containerTypeIsPlate: boolean
};


const SF2DataSheetWrapper = (props : SF2DataSheetWrapperProps) => {

    const frozenGrid = R.isNil(props.frozenGrid) ?
        createFrozenGrid(props.initialGrid.length, props.frozenColumns, props.projectID, props.topRowNumber, props.sf2type, props.tableType, props.containerTypeIsPlate) :
        props.frozenGrid;


    const getRowColours = () => {

        const submissionIDIndex = R.findIndex(R.propEq('isSubmissionID', true))(props.frozenColumns);

        if(submissionIDIndex === -1) {

            return null;

        } else {

            const submissionIDs = props.frozenGrid.map(x=>x[1].value);
            const uniqueSubmissionIDs = R.uniq(submissionIDs);

            const repeatCount = Math.ceil(uniqueSubmissionIDs.length/2);
            const colours = R.flatten(R.repeat(["#e0eeee", "#ffffff"], repeatCount));

            const coloursList = R.zip(uniqueSubmissionIDs, colours);

            let colourDict = {};
            coloursList.forEach(x=>{colourDict[x[0]] = x[1]});

            return submissionIDs.map(x=>colourDict[x]);

        }

    };


    return(
        <SF2DataSheet
            id={props.id}
            uuid="0"
            columns={props.columns}
            data={props.data}
            initialBodyGrid={props.initialGrid}
            onUpdateBodyGrid={props.onUpdateGrid}
            bodyHeight={(props.initialGrid.length * 30) + 25}
            frozenColumns={props.frozenColumns}
            frozenGrid={frozenGrid}
            width={"97vw"}
            showHiddenColumns={props.showHiddenColumns}
            bottomPadding={140}
            rowColours={getRowColours()}
        />
    )
};


export default SF2DataSheetWrapper;
