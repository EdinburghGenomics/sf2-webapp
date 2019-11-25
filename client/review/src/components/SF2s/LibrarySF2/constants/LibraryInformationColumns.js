// Library SF2 Library Information columns

import {
    genusSpeciesNCBITaxonID_options,
    quantificationMethod_options,
    yesNo_options,
    storageBuffer_options
} from "../../../../constants/options";


import { poolConcFormula, estimatedMolarityFormulaV1, poolSizeFormulaV2 } from "../../../../functions/formulae";


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

// Frozen columns

export const frozenLibraryInformationColumns = [
    {
        value: 'EG Library ID',
        width: 130
    },
    {
        value: 'EG Submission ID',
        width: 150,
        isSubmissionID: true
    }
];


// Main columns

const yourLibraryID = {
    id: 'yourLibraryID',
    value: 'Your Library ID *',
    width: 250,
    validation: 'required'
};


const speciesTaxonID = {
    id: 'speciesTaxonID',
    value: 'Species_TaxonID *',
    width: 370,
    header: {
        tooltipText: 'If there are multiple species, please provide multiple species names and NCBI IDs (link to Taxonomy ID presented here - provide further instructions). For unknown species please write "unknown". Additionally, if this is a metagenomics project, please select "metagenome".',
        superscriptText: '1'
    },
    validation: 'required',
    autocompleteOptions: genusSpeciesNCBITaxonID_options
};


const libraryConcentration = {
    id: 'conc',
    value: 'Library Conc. (ng/\u03BCl) *',
    width: 120,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const libraryVolume = {
    id: 'libraryVolume',
    value: 'Library Vol. (\u03BCl) *',
    width: 100,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const genusSpeciesTaxonID = {
    id: 'genusSpeciesTaxonID',
    value: 'Genus_Species_TaxonID *',
    width: 370,
    header: {
        tooltipText: 'If there are multiple species, please provide multiple species names and NCBI IDs (link to Taxonomy ID presented here - provide further instructions). For unknown species please write "unknown". Additionally, if this is a metagenomics project, please select "metagenome".',
        superscriptText: '1'
    },
    validation: 'required',
    autocompleteOptions: genusSpeciesNCBITaxonID_options
};


const quantificationMethod = {
    id: 'quantificationMethod',
    value: 'Quantification Method *',
    width: 150,
    header: {
        tooltipText: 'We strongly recommend a flourometer or gel electrophoresis against a mass standard for quantification of nucleic acids; please supply twice the requested.',
        superscriptText: ''
    },
    validation: 'required',
    autocompleteOptions: quantificationMethod_options
};


const imageAvailable = {
    id: 'imageAvailable',
    value: 'Image Available',
    width: 75,
    header: {
        tooltipText: 'Please provide a gel picture, Bioanalyser trace or equivalent for each sample.',
        superscriptText: ''
    },
    selectOptions: yesNo_options
};


const storageBuffer = {
    id: 'storageBuffer',
    value: 'Storage Buffer *',
    width: 125,
    header: {
        tooltipText: 'e.g. 10mM Tris',
        superscriptText: ''
    },
    validation: 'required',
    autocompleteOptions: storageBuffer_options
};


const libraryType = {
    id: 'libraryType',
    value: 'Library Type *',
    width: 180,
    validation: 'required',
    selectOptions: libraryType_options
};


const averageLibrarySize = {
    id: 'averageLibrarySize',
    value: 'Average Library Size (bp) *',
    width: 140,
    validation: 'required'
};


const firstIndexI7Sequence = {
    id: 'firstIndexI7Sequence',
    value: 'First Index (I7) Sequence *',
    width: 140,
    validation: 'required,nucleotideSequence'
};


const secondIndexI5Sequence = {
    id: 'secondIndexI5Sequence',
    value: 'Second Index (I5) Sequence',
    width: 140,
    validation: 'nucleotideSequence'
};


const customPrimer = {
    id: 'customPrimer',
    value: 'Custom Primer *',
    width: 144,
    dataKeysAsAutocompleteOptions: true,
    validation: 'required'
};


const potentialBiologicalContaminants = {
    id: 'potentialBiologicalContaminants',
    value: 'Potential Biological Contaminants',
    width: 250,
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

const poolConcCalc = {
    id: 'poolConcCalc',
    value: 'Pool Concentration',
    width: 200,
    formula: poolConcFormula,
    header: {
        superscriptText: '',
        required: true
    }
};


const poolSizeCalc = {
    id: 'poolSizeCalc',
    value: 'Pool Size',
    width: 120,
    formula: poolSizeFormulaV2,
    header: {
        superscriptText: '',
        required: true
    }
};


const estimatedMolarityCalc = {
    id: 'estimatedMolarityCalc',
    value: 'Estimated Molarity (nM)',
    width: 120,
    formula: estimatedMolarityFormulaV1,
    header: {
        superscriptText: '',
        required: true
    }
};


export const libraryInformationColumns = [
    yourLibraryID,
    speciesTaxonID,
    libraryConcentration,
    poolConcCalc,
    poolSizeCalc,
    libraryVolume,
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
    comments
];
