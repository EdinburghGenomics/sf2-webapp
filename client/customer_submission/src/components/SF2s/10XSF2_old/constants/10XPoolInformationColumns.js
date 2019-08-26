// 10X Pool SF2 columns

import { quantificationMethod_options, storageBuffer_options, yesNo_options } from "../../../../constants/options";

import {estimatedConcentrationFormula} from "../../../../functions/formulae";


// Frozen columns

export const frozenPoolInformationColumns = [
    {
        value: 'EG Pool ID',
        width: 140
    }
];


// Pool SF2 columns

// required

const yourPoolID = {
    id: 'yourPoolID',
    value: 'Your Pool ID *',
    width: 335,
    validation: 'required'
};


const conc = {
    id: 'conc',
    value: 'Concentration of Pool (ng/\u03BCl) *',
    width: 275,
    header: {
        superscriptText: '',
        required: true
    },
    validation: 'required,number'
};


const volume = {
    id: 'volume',
    value: 'Volume of Pool (\u03BCl) *',
    width: 250,
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


const averageFragmentSize = {
    id: 'averageFragmentSize',
    value: 'Average Fragment Size (bp)',
    width: 240,
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


const comments = {
    id: 'comments',
    value: 'Comments',
    width: 1005,
    header: {
        superscriptText: ''
    }
};


// Calculated columns

const estimatedConcentrationCalc = {
    id: 'estimatedConcentrationCalc',
    value: 'Estimated Concentration (nM)',
    width: 250,
    formula: estimatedConcentrationFormula,
    header: {
        superscriptText: '',
        required: true
    }
};


export const poolInformationColumns = [
    yourPoolID,
    quantificationMethod,
    conc,
    volume,
    imageAvailable,
    storageBuffer,
    averageFragmentSize,
    estimatedConcentrationCalc,
    comments
];

