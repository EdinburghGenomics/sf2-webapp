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
    width: 335,
    validation: 'required'
};


const concentrationOfPrimer = {
    id: 'concentrationOfPrimer',
    value: 'Concentration of Primer (\u03BCM) *',
    width: 240,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const libraryPrimerPairing = {
    id: 'libraryPrimerPairing',
    value: 'Library:Primer Pairing *',
    width: 240,
    header: {
        superscriptText: '',
        required: true
    },
    dataKeysAsAutocompleteOptions: true,
    validation: 'required'
};


const customPrimerDetails = {
    id: 'customPrimerDetails',
    value: 'Custom Primer details *',
    width: 240,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required',
    autocompleteOptions: customPrimerDetails_options
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
    value: 'Volume of Primer (\u03BCl)',
    width: 240,
    header: {
        superscriptText: ''
    },
    validation: 'number'
};


const storageBuffer = {
    id: 'storageBuffer',
    value: 'Storage Buffer',
    width: 144,
    header: {
        tooltipText: 'e.g. 10mM Tris',
        superscriptText: ''
    },
    validation: '',
    autocompleteOptions: storageBuffer_options
};


const primerSequence = {
    id: 'primerSequence',
    value: 'Primer Sequence (if available)',
    width: 450,
    validation: ''
};


// Calculated columns


export const primerInformationColumns = [
    yourPrimerID,
    concentrationOfPrimer,
    volumeOfPrimer,
    storageBuffer,
    libraryPrimerPairing,
    customPrimerDetails,
    primerSequence,
    comments
];
