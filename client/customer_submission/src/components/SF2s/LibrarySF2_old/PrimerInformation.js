// @flow
import React from 'react';

import InformationTable from "../../general/InformationTable";
import { primerInformationColumns, frozenPrimerInformationColumns } from './constants/PrimerInformationColumns';

import type { GeneralInformationTableProps } from '../../general/InformationTable';


const PrimerInformation = (props : GeneralInformationTableProps) => (
    <InformationTable
        tableType='PrimerInformation'
        columns={primerInformationColumns}
        frozenColumns={frozenPrimerInformationColumns}
        numberOfRows={props.initialState.numberOfCustomPrimers}
        {...props}
    />
);


export default PrimerInformation;
