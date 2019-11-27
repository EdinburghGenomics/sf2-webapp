// 10X SF2 Sample Information columns

import {
    gaBarcodeSet_options,
    genusSpeciesNCBITaxonID_options,
    quantificationMethod_options,
    yesNo_options,
    storageBuffer_options
} from "../../../../constants/options";

import { poolConcFormula, estimatedMolarityFormulaV2, poolSizeFormulaV2 } from "../../../../functions/formulae";


// Frozen columns

export const frozenTenXSampleInformationColumns = [
    {
        value: 'EG 10X Sample ID',
        width: 110
    },
    {
        value: 'EG 10X Submission ID',
        width: 150,
        isSubmissionID: true
    }
];


// Main columns

export const yourTenXSampleID = {
    id: 'yourTenXSampleID',
    value: 'Your 10X Sample ID *',
    width: 250,
    validation: 'required'
};


const barcodeSet = {
    id: 'barcodeSet',
    value: '10X Genomics Barcode Set *',
    width: 120,
    validation: 'required',
    selectOptions: gaBarcodeSet_options
};


const tenXSampleConcentration = {
    id: 'tenXSampleConcentration',
    value: '10X Sample Conc. (ng/\u03BCl) *',
    width: 120,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const tenXSampleVolume = {
    id: 'tenXSampleVolume',
    value: '10X Sample Vol. (\u03BCl) *',
    width: 120,
    header: {
        superscriptText: ''
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


const averageTenXSampleSize = {
    id: 'averageTenXSampleSize',
    value: 'Average 10X Sample Size (bp) *',
    width: 140,
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
    formula: estimatedMolarityFormulaV2,
    header: {
        superscriptText: '',
        required: true
    }
};


export const tenXSampleInformationColumns = [
    yourTenXSampleID,
    barcodeSet,
    tenXSampleConcentration,
    poolConcCalc,
    poolSizeCalc,
    tenXSampleVolume,
    genusSpeciesTaxonID,
    quantificationMethod,
    imageAvailable,
    storageBuffer,
    averageTenXSampleSize,
    estimatedMolarityCalc,
    potentialBiologicalContaminants,
    comments
];
