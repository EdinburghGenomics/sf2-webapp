// @flow

import * as R from 'ramda';

import type { Grid, Row, Changes, StringMap } from "../sf2datasheet/types/flowTypes";

// Sample SF2

export const yieldCalcFormula = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    return (row.get('conc') * row.get('volume')).toString();
};


// Old Library / 10X SF2


// Library Information / 10XSampleInformation

export const egPoolIDFormula = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    const id = row.get('yourPoolID');
    return data.get(id);
};


export const poolSizeFormulaV1 = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    const id = row.get('yourPoolID');
    return (grid.map((_,ix) => grid[ix][2].value).filter(x=>x===id).length).toString();
};


export const estimatedMolarityFormulaV1 = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    return (Math.round(10 * (row.get('conc') * 1000000) / (row.get('averageLibrarySize') * 650)) / 10).toString();
};


// Pool Information / 10XPoolInformation

export const estimatedConcentrationFormula = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    return (Math.round(10 * (row.get('conc') * 1000000) / (row.get('averageFragmentSize') * 650)) / 10).toString();
};


// 10X SF2


// 10XSampleInformation


export const poolConcFormula = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {

    const id = frozenGrid[rowIndex][1].value;

    let newValues = new Map();
    R.reverse(R.range(0, frozenGrid.length)).forEach(rowIx => {
        const submissionId = frozenGrid[rowIx][1].value;
        newValues.set(submissionId, grid[rowIx][3].value);
    });

    // eslint-disable-next-line
    if (latestChanges != undefined && latestChanges !== null) {
        R.reverse(R.filter(change => change.col === 3, latestChanges)).forEach(change => {
            const changeSubmissionId = frozenGrid[change.row][1].value;
            newValues.set(changeSubmissionId, change.value);
        });
    }

    const poolMatch = id.match(/pool/);
    const poolConcentration = (poolMatch === null || poolMatch === undefined) ? 'NA' : newValues.get(id);

    return poolConcentration === undefined ? '' : poolConcentration;

};


export const poolSizeFormulaV2 = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    const id = frozenGrid[rowIndex][1].value;
    return id.match(/pool/) === null ? 'NA' :
        frozenGrid.map((_,ix) => frozenGrid[ix][1].value).filter(x=>x===id).length.toString();
};


export const estimatedMolarityFormulaV2 = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) : string => {
    return (Math.round(10 * (row.get('tenXSampleConcentration') * 1000000) / (row.get('averageTenXSampleSize') * 650)) / 10).toString();
};


