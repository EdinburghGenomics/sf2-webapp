// @flow
import React from 'react';

import InformationTable from "../../general/InformationTable";
import { sampleInformationColumns, frozenSampleInformationColumns } from './constants/SampleInformationColumns';
import { initialiseFrozenColumns } from '../../../functions/lib';

import type { GeneralInformationTableProps } from '../../general/InformationTable';


const SampleInformation = (props : GeneralInformationTableProps) => (
    <InformationTable
        tableType='SampleInformation'
        columns={sampleInformationColumns}
        frozenColumns={initialiseFrozenColumns(frozenSampleInformationColumns, props.initialState.containerTypeIsPlate)}
        numberOfRows={props.initialState.numberOfSamplesOrLibraries}
        {...props}
    />
);


export default SampleInformation;
