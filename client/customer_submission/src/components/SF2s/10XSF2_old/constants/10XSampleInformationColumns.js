// 10X SF2 Library Information columns

import {
    genusSpeciesNCBITaxonID_options,
    quantificationMethod_options,
    storageBuffer_options,
    yesNo_options,
    gaBarcodeSet_options
} from "../../../../constants/options";

import { egPoolIDFormula, estimatedMolarityFormulaV1, poolSizeFormulaV1 } from "../../../../functions/formulae";


// Frozen columns

export const frozenTenXSampleInformationColumns = [
    {
        value: 'Well ID',
        width: 70
    },
    {
        value: 'EG 10X Sample ID',
        width: 140
    }
];


// Options lists

// Library SF2 columns

// required

const yourTenXSampleID = {
    id: 'yourTenXSampleID',
    value: 'Your 10X Sample ID *',
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


const genusSpeciesTaxonID = {
    id: 'genusSpeciesTaxonID',
    value: 'Genus_Species_TaxonID *',
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


const averageLibrarySize = {
    id: 'averageLibrarySize',
    value: 'Average Library Size (bp) *',
    width: 240,
    validation: 'required'
};


const barcodeSet = {
    id: 'barcodeSet',
    value: '10X Genomics Barcode Set *',
    width: 240,
    validation: 'required',
    selectOptions: gaBarcodeSet_options
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


export const libraryInformationColumns = [
    yourTenXSampleID,
    egPoolIDCalc,
    yourPoolID,
    poolSizeCalc,
    genusSpeciesTaxonID,
    conc,
    volume,
    quantificationMethod,
    imageAvailable,
    storageBuffer,
    averageLibrarySize,
    estimatedMolarityCalc,
    barcodeSet,
    potentialBiologicalContaminants,
    comments
];
