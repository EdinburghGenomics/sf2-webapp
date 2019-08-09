// Library SF2 Library Information columns

import {
    genusSpeciesNCBITaxonID_options,
    quantificationMethod_options,
    storageBuffer_options,
    yesNo_options,
    sequencingType_options,
    qcWorkflow_options
} from "../../../../constants/options";

import { egPoolIDFormula, estimatedMolarityFormulaV1, poolSizeFormulaV1 } from "../../../../functions/formulae";


// Select and autocomplete options

const libraryType_options = [
    'DNA-seq',
    'RNA-seq',
    'ChIP-seq',
    'RiboSeq',
    'RNAIP-seq',
    'RAD-seq',
    'ATAC-seq',
    'BIS-seq',
    '10X DNA',
    '10X RNA',
    'small RNA',
    'Targeted re-sequencing',
    'Metagenomics',
    'Amplicon',
    'CAGE',
    'Hi-C',
    'CRAC',
    'Other'
];


const sequencingChemistry_options = [
    'MS v2',
    'MS v3',
    'S1',
    'S2',
    'S4'
];


const platform_options = [
    'MiSeq',
    'NovaSeq',
    'PacBio'
];


// Frozen columns

export const frozenLibraryInformationColumns = [
    {
        value: 'Well ID',
        width: 70
    },
    {
        value: 'EG Library ID',
        width: 140
    }
];


// Options lists


// Library SF2 columns

// required

const yourLibraryID = {
    id: 'yourLibraryID',
    value: 'Your Library ID *',
    width: 335,
    validation: 'required'
};


const yourPoolID = {
    id: 'yourPoolID',
    value: 'Your Pool ID',
    width: 335,
    header: {
        tooltipText: 'Please use plain text ASCII characters for your sample names.',
        superscriptText: ''
    },
    dataKeysAsAutocompleteOptions: true,
    validation: 'required'
};


const speciesTaxonID = {
    id: 'speciesTaxonID',
    value: 'Species_TaxonID *',
    width: 400,
    header: {
        tooltipText: 'If there are multiple species, please provide multiple species names and NCBI IDs (link to Taxonomy ID presented here - provide further instructions). For unknown species please write "unknown". Additionally, if this is a metagenomics project, please select "metagenome".',
        superscriptText: '1'
    },
    validation: 'required',
    autocompleteOptions: genusSpeciesNCBITaxonID_options
};


const conc = {
    id: 'conc',
    value: 'Conc (ng/\u03BCl)',
    width: 120,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const volume = {
    id: 'volume',
    value: 'Volume (\u03BCl)',
    width: 120,
    header: {
        superscriptText: ''
    },
    validation: 'required,number'
};


const quantificationMethod = {
    id: 'quantificationMethod',
    value: 'Quantification Method *',
    width: 210,
    header: {
        tooltipText: 'We strongly recommend a flourometer or gel electrophoresis against a mass standard for quantification of nucleic acids; please supply twice the requested.',
        superscriptText: ''
    },
    validation: 'required',
    autocompleteOptions: quantificationMethod_options
};


const storageBuffer = {
    id: 'storageBuffer',
    value: 'Storage Buffer *',
    width: 144,
    header: {
        tooltipText: 'e.g. 10mM Tris',
        superscriptText: ''
    },
    validation: 'required',
    autocompleteOptions: storageBuffer_options
};


const libraryType = {
    id: 'libraryType',
    value: 'Library Type (please select) *',
    width: 250,
    validation: 'required',
    selectOptions: libraryType_options
};


const averageLibrarySize = {
    id: 'averageLibrarySize',
    value: 'Average Library Size (bp) *',
    width: 240,
    validation: 'required'
};


const firstIndexI7Sequence = {
    id: 'firstIndexI7Sequence',
    value: 'First Index (I7) Sequence *',
    width: 250,
    validation: 'required'
};


const secondIndexI5Sequence = {
    id: 'secondIndexI5Sequence',
    value: 'Second Index (I5) Sequence *',
    width: 250,
    validation: 'required'
};


const customPrimer = {
    id: 'customPrimer',
    value: 'Custom Primer *',
    width: 144,
    validation: 'required'
};


// optional

const imageAvailable = {
    id: 'imageAvailable',
    value: 'Image Available',
    width: 150,
    header: {
        tooltipText: 'Please provide a gel picture, Bioanalyser trace or equivalent for each sample.',
        superscriptText: ''
    },
    selectOptions: yesNo_options
};


const potentialBiologicalContaminants = {
    id: 'potentialBiologicalContaminants',
    value: 'Potential Biological Contaminants',
    width: 330,
    header: {
        superscriptText: ''
    }
};


const comments = {
    id: 'comments',
    value: 'Comments',
    width: 1005,
    header: {
        superscriptText: ''
    }
};


// Calculated columns

const egPoolIDCalc = {
    id: 'egPoolID',
    value: 'EG Pool ID',
    width: 335,
    formula: egPoolIDFormula,
    header: {
        superscriptText: '',
        required: true
    }
};


const poolSizeCalc = {
    id: 'poolSizeCalc',
    value: 'Pool Size',
    width: 120,
    formula: poolSizeFormulaV1,
    header: {
        superscriptText: '',
        required: true
    }
};


const estimatedMolarityCalc = {
    id: 'estimatedMolarityCalc',
    value: 'Estimated Molarity (nM)',
    width: 200,
    formula: estimatedMolarityFormulaV1,
    header: {
        superscriptText: '',
        required: true
    }
};


// Hidden columns

const sequencingType = {
    id: 'sequencingType',
    value: 'Sequencing Type',
    hidden: true,
    width: 200,
    header: {
        superscriptText: '',
        required: false
    },
    autocompleteOptions: sequencingType_options
};


const sequencingChemistry = {
    id: 'sequencingChemistry',
    value: 'Sequencing Chemistry',
    hidden: true,
    width: 200,
    header: {
        superscriptText: '',
        required: false
    },
    autocompleteOptions: sequencingChemistry_options
};


const platform = {
    id: 'platform',
    value: 'Platform',
    hidden: true,
    width: 200,
    header: {
        superscriptText: '',
        required: false
    },
    autocompleteOptions: platform_options
};


const numberOfLanes = {
    id: 'numberOfLanes',
    value: 'Number of Lanes',
    hidden: true,
    width: 200,
    header: {
        superscriptText: '',
        required: false
    },
    validation: 'number'
};


const qcWorkflow = {
    id: 'qcWorkflow',
    value: 'QC Workflow',
    hidden: true,
    width: 200,
    header: {
        superscriptText: '',
        required: false
    },
    autocompleteOptions: qcWorkflow_options
};


const userPreparedLibrary = {
    id: 'userPreparedLibrary',
    value: 'User Prepared Library',
    hidden: true,
    width: 250,
    header: {
        superscriptText: '',
        required: false
    },
    selectOptions: yesNo_options
};


export const libraryInformationColumns = [
    yourLibraryID,
    egPoolIDCalc,
    yourPoolID,
    poolSizeCalc,
    speciesTaxonID,
    conc,
    volume,
    quantificationMethod,
    imageAvailable,
    storageBuffer,
    libraryType,
    averageLibrarySize,
    estimatedMolarityCalc,
    firstIndexI7Sequence,
    secondIndexI5Sequence,
    customPrimer,
    potentialBiologicalContaminants,
    comments,
    sequencingType,
    sequencingChemistry,
    platform,
    numberOfLanes,
    qcWorkflow,
    userPreparedLibrary
];
