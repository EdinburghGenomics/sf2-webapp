// Primer SF2 columns


// Frozen columns

export const frozenPrimerInformationColumns = [
    {
        value: 'EG Primer ID',
        width: 140
    }
];


// Options lists

const storageBuffer_options = [
    'dH2O',
    '10mM Tris (EB)',
    'TE',
    'low TE'
];


const customPrimerDetails_options = [
    'read1',
    'read2',
    'index1',
    'index2'
];


// Primer SF2 columns

// required

const yourPrimerID = {
    id: 'yourPrimerID',
    value: 'Your Primer ID *',
    width: 250,
    validation: 'required'
};


const concentrationOfPrimer = {
    id: 'concentrationOfPrimer',
    value: 'Primer Conc. (\u03BCM) *',
    width: 120,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const customPrimerDetails = {
    id: 'customPrimerDetails',
    value: 'Custom Primer details *',
    width: 120,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required',
    selectOptions: customPrimerDetails_options
};


// optional

const comments = {
    id: 'comments',
    value: 'Comments',
    width: 1005,
    header: {
        superscriptText: ''
    }
};


const volumeOfPrimer = {
    id: 'volumeOfPrimer',
    value: 'Primer Vol. (\u03BCl)',
    width: 100,
    header: {
        superscriptText: ''
    },
    validation: 'number'
};


const storageBuffer = {
    id: 'storageBuffer',
    value: 'Storage Buffer',
    width: 125,
    header: {
        tooltipText: 'e.g. 10mM Tris',
        superscriptText: ''
    },
    validation: '',
    autocompleteOptions: storageBuffer_options
};


const primerSequence = {
    id: 'primerSequence',
    value: 'Primer Sequence',
    width: 180,
    validation: ''
};



export const primerInformationColumns = [
    yourPrimerID,
    concentrationOfPrimer,
    volumeOfPrimer,
    storageBuffer,
    customPrimerDetails,
    primerSequence,
    comments
];
