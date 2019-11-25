// Sample SF2 Sample Information columns
import React from 'react';

import SF2HeaderTooltip from '../../../general/SF2HeaderTooltip';

import {
    genusSpeciesNCBITaxonID_options,
    quantificationMethod_options,
    storageBuffer_options,
    referenceGenome_options,
    yesNo_options,
    sampleType_options,
    sequencingType_options,
    qcWorkflow_options
} from "../../../../constants/options";

import { yieldCalcFormula } from "../../../../functions/formulae";


// Select and autocomplete options

const libraryType_options = [
    'Total Stranded RNA-seq',
    'mRNA Stranded RNAseq',
    'smRNA',
    'DNA PCR-Free_350bp',
    'DNA PCR-Free_550bp',
    'DNA Nano_350 bp',
    'DNA Nano_550 bp',
    'NEB ChIP seq',
    'cDNA',
    'Nextera DNA',
    'Nextera DNA XT'
];


const sequencingChemistry_options = [
    'MS v2',
    'MS v3',
    'High Output',
    'Rapid cBot',
    'Rapid OBC',
    'S1',
    'S2',
    'S4'
];


const platform_options = [
    'MiSeq',
    'HiSeq 2500',
    'HiSeq 4000',
    'HiSeq X',
    'NovaSeq',
    'PacBio'
];


// Frozen columns

export const frozenSampleInformationColumns = [
    {
        value: 'EG Sample ID',
        width: 130
    }
];


// Sample SF2 columns

// required

const yourSampleID = {
    id: 'yourSampleID',
    value: 'Your Sample ID *',
    width: 250,
    header: {
        tooltipText: 'Please use plain text ASCII characters for your sample names.',
        superscriptText: ''
    },
    validation: 'required'
};


const genusSpeciesNCBITaxonID = {
    id: 'genusSpeciesNCBITaxonID',
    value: 'Genus_Species_NCBITaxonID *',
    width: 370,
    header: {
        tooltipText: 'If there are multiple species, please provide multiple species names and NCBI IDs, separated by commas. For unknown species please enter "unknown". Additionally, if this is a metagenomics project, please select "metagenome_0".',
        superscriptText: '1'
    },
    validation: 'required',
    autocompleteOptions: genusSpeciesNCBITaxonID_options
};


const conc = {
    id: 'conc',
    value: 'Conc (ng/\u03BCl) *',
    width: 70,
    header: {
        superscriptText: ''
    },
    validation: 'required,number'
};


const volume = {
    id: 'volume',
    value: 'Volume (\u03BCl) *',
    width: 70,
    header: {
        superscriptText: '',
    },
    validation: 'required,number'
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


// optional

const referenceGenome = {
    id: 'referenceGenome',
    value: 'Reference Genome',
    width: 500,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: referenceGenome_options
};


const imageAvailable = {
    id: 'imageAvailable',
    value: 'Image Available',
    width: 75,
    header: {
        tooltipText: 'Please provide a gel picture, Bioanalyser trace or equivalent for each sample.',
        superscriptText: ''
    },
    validation: 'yesOrNo',
    selectOptions: yesNo_options
};


const dinRinValue = {
    id: 'dinRinValue',
    value: 'DIN / RIN Value',
    width: 100,
    header: {
        tooltipText: 'e.g. 7',
        superscriptText: ''
    }
};


const ratio260_280 = {
    id: 'ratio260_280',
    value: '260 / 280nm Ratio',
    width: 100,
    header: {
        tooltipText: 'e.g. 1.87',
        superscriptText: ''
    }
};


const sampleType = {
    id: 'sampleType',
    value: 'Sample Type',
    width: 160,
    header: {
        tooltipText: 'e.g. Genomic DNA',
        superscriptText: ''
    },
    autocompleteOptions: sampleType_options
};


const tissue = {
    id: 'tissue',
    value: 'Tissue',
    width: 120,
    header: {
        tooltipText: 'e.g. heart',
        superscriptText: ''
    }
};


const extractionMethod = {
    id: 'extractionMethod',
    value: 'Extraction Method',
    width: 120,
    header: {
        tooltipText: 'e.g. qiagen',
        superscriptText: ''
    }
};


const pcrProductLength = {
    id: 'pcrProductLength',
    value: 'PCR Product Length (bp)',
    width: 150,
    header: {
        superscriptText: ''
    }
};


const fragmentSize = {
    id: 'fragmentSize',
    value: 'Fragment Size (sheared only) (bp)',
    width: 180,
    header: {
        superscriptText: ''
    }
};


const potentialBiologicalContaminants = {
    id: 'potentialBiologicalContaminants',
    value: 'Potential Biological Contaminants',
    width: 250,
    header: {
    superscriptText: '',
        required: false
    }
};


const dnaseTreated = {
    id: 'dnaseTreated',
    value: 'DNAse Treated?',
    width: 80,
    header: {
        superscriptText: ''
    },
    validation: 'yesOrNo',
    selectOptions: yesNo_options
};


const rnaseTreated = {
    id: 'rnaseTreated',
    value: 'RNAse Treated?',
    width: 80,
    header: {
    superscriptText: '',
        required: false
    },
    validation: 'yesOrNo',
    selectOptions: yesNo_options
};


const rnaseType = {
    id: 'rnaseType',
    value: 'Type of RNAse used?',
    width: 200,
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

const yieldCalc = {
    id: 'yield',
    value: 'Yield (ng)',
    width: 70,
    formula: yieldCalcFormula,
    header: {
        superscriptText: '',
        required: true
    }
};


// Hidden columns

const libraryType = {
    id: 'libraryType',
    value: 'Library Type',
    hidden: true,
    width: 250,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: libraryType_options
};


const sequencingType = {
    id: 'sequencingType',
    value: 'Sequencing Type',
    hidden: true,
    width: 200,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: sequencingType_options
};


const sequencingChemistry = {
    id: 'sequencingChemistry',
    value: 'Sequencing Chemistry',
    hidden: true,
    width: 200,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: sequencingChemistry_options
};


const platform = {
    id: 'platform',
    value: 'Platform',
    hidden: true,
    width: 200,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: platform_options
};


const numberOfLanes = {
    id: 'numberOfLanes',
    value: 'Number of Lanes',
    hidden: true,
    width: 200,
    header: {
        superscriptText: ''
    },
    validation: 'number'
};


const qcWorkflow = {
    id: 'qcWorkflow',
    value: 'QC Workflow',
    hidden: true,
    width: 200,
    header: {
        superscriptText: ''
    },
    autocompleteOptions: qcWorkflow_options
};


export const sampleInformationColumns = [
    yourSampleID,
    genusSpeciesNCBITaxonID,
    referenceGenome,
    conc,
    volume,
    quantificationMethod,
    yieldCalc,
    imageAvailable,
    storageBuffer,
    dinRinValue,
    ratio260_280,
    sampleType,
    tissue,
    extractionMethod,
    pcrProductLength,
    fragmentSize,
    potentialBiologicalContaminants,
    dnaseTreated,
    rnaseTreated,
    rnaseType,
    comments,
    libraryType,
    sequencingType,
    sequencingChemistry,
    platform,
    numberOfLanes,
    qcWorkflow
];


// legacy for reference

const requiredSampleSF2Columns1 = [
    {
        key: 'wellID',
        name: 'Well ID',
        width: 80,
        editable: false,
        locked: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol0'
            headerText='Well ID'
            tooltipText='This field cannot be edited.'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'yourSampleID',
        name: 'Your Sample ID',
        width: 335,
        editable: true,
        locked: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol1'
            headerText='Your Sample ID'
            tooltipText='Please use plain text ASCII characters for your sample names.'
            superscriptText=''
            required={true}
        />
    },
    {
        key: 'genusSpeciesNCBITaxonID',
        name: 'Genus_Species_NCBITaxonID',
        width: 380,
        // editable: true,
        // editor: GenusEditor,
        // formatter: GenusFormatter
        // editor: GenusAutoComplete,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol2'
            headerText='Genus_Species_NCBITaxonID'
            tooltipText='If there are multiple species, please provide multiple species names and NCBI IDs, separated by commas. For unknown species please enter "unknown". Additionally, if this is a metagenomics project, please select "metagenome_0".'
            superscriptText='1'
            required={true}
        />
    },
    {
        key: 'conc',
        name: 'Conc (ng/\u03BCl) *',
        width: 120,
        editable: true
    },
    {
        key: 'Volume',
        name: 'Volume (\u03BCl) *',
        width: 120,
        editable: true
    },
    {
        key: 'quantificationMethod',
        name: 'Quantification Method',
        width: 210,
        // editor: QuantificationAutoComplete,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol3'
            headerText='Quantification Method'
            tooltipText='We strongly recommend a flourometer or gel electrophoresis against a mass standard for quantification of nucleic acids; please supply twice the requested.'
            superscriptText=''
            required={true}
        />
    },
    {
        key: 'storageBuffer',
        name: 'Storage Buffer',
        width: 180,
        // editor: StorageBuffersAutoComplete,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol4'
            headerText='Storage Buffer'
            tooltipText='e.g. 10mM Tris'
            superscriptText=''
            required={true}
        />
    }
];


const optionalSampleSF2Columns1 = [
    {
        key: 'referenceGenome',
        name: 'Reference Genome',
        width: 500,
        // editor: ReferenceGenomeAutoComplete
    },
    {
        key: 'imageAvailable',
        name: 'Image Available',
        width: 150,
        // editor: YesNoEditor,
        // formatter: YesNoFormatter,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol5'
            headerText='Image Available'
            tooltipText='Please provide a gel picture, Bioanalyser trace or equivalent for each sample.'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'dinRinValue',
        name: 'DIN / RIN Value',
        width: 150,
        editable: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol6'
            headerText='DIN / RIN Value'
            tooltipText='e.g. 7'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'ratio260_280nm',
        name: '260 / 280nm Ratio',
        width: 160,
        editable: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol7'
            headerText='260 / 280nm Ratio'
            tooltipText='e.g. 1.87'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'sampleType',
        name: 'Sample Type',
        width: 180,
        // editor: SampleTypeAutoComplete,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol8'
            headerText='Sample Type'
            tooltipText='e.g. Genomic DNA'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'tissue',
        name: 'Tissue',
        width: 150,
        editable: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol9'
            headerText='Tissue'
            tooltipText='e.g. heart'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'extractionMethod',
        name: 'Extraction Method',
        width: 180,
        editable: true,
        headerRenderer: <SF2HeaderTooltip
            headerTooltipID='headerTooltipCol10'
            headerText='Extraction Method'
            tooltipText='e.g. qiagen'
            superscriptText=''
            required={false}
        />
    },
    {
        key: 'pcrProductLength',
        name: 'PCR Product Length bp (if applicable)',
        width: 330,
        editable: true
    },
    {
        key: 'fragmentSize',
        name: 'Fragment Size (sheared samples only) bp',
        width: 330,
        editable: true
    },
    {
        key: 'potentialBiologicalContaminants',
        name: 'Potential Biological Contaminants',
        width: 330,
        editable: true
    },
    {
        key: 'dnaseTreated',
        name: 'DNAse Treated?',
        width: 150,
        // editor: YesNoEditor,
        // formatter: YesNoFormatter
    },
    {
        key: 'rnaseTreated',
        name: 'RNAse Treated?',
        width: 150,
        // editor: YesNoEditor,
        // formatter: YesNoFormatter
    },
    {
        key: 'rnaseType',
        name: 'Type of RNAse used?',
        width: 330,
        editable: true
    },
    {
        key: 'comments',
        name: 'Comments',
        width: 1005,
        editable: true
    },
];
