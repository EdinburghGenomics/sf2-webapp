// General type definitions


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

