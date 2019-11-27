// General type definitions

import type { Grid } from "../sf2datasheet/types/flowTypes";

export type Grids = Array<Grid>;
export type GridWithID = { id: string, grid: Grid };
export type GridWithIDs = Array<GridWithID>;

export type Warning = { row : string, message: string };
export type Warnings = Array<Warning>;

export type Table = { name: string, grids: GridWithIDs };
export type Tables = Array<Table>;

export type SF2Data = { name: string, tables: Tables };


export type Stage1FormState = {
    projectID: string,
    sf2type: string,
    containerTypeIsPlate: boolean,
    numberOfSamplesOrLibraries: string,
    sf2IsDualIndex: boolean,
    barcodeSetIsNA: boolean,
    sf2HasPools: boolean,
    numberOfPools: string,
    sf2HasCustomPrimers: boolean,
    numberOfCustomPrimers: string,
    sf2HasUnpooledSamplesOrLibraries: string,
    numberOfUnpooledSamplesOrLibraries: string,
    numberOfSamplesOrLibrariesInPools: string
};


export type AbbreviatedStage1FormState = {
    pid: string,
    st: string,
    ctp: boolean,
    nsl: string,
    di: boolean,
    na: boolean,
    hp: boolean,
    np: string,
    hc: boolean,
    nc: string,
    husl: string,
    nusl: string,
    nslp: string
};

