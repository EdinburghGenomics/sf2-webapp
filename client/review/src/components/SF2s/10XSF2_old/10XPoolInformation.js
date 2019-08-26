// @flow
import React from 'react';

import InformationTable from "../../general/InformationTable";
import { poolInformationColumns, frozenPoolInformationColumns } from './constants/10XPoolInformationColumns';

import type { GeneralInformationTableProps } from '../../general/InformationTable';


const TenXPoolInformation = (props : GeneralInformationTableProps) => (
    <InformationTable
        tableType='10XPoolInformation'
        columns={poolInformationColumns}
        frozenColumns={frozenPoolInformationColumns}
        numberOfRows={props.initialState.numberOfPools}
        {...props}
    />
);


export default TenXPoolInformation;
