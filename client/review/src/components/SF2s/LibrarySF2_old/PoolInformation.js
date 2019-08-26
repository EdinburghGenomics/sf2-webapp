// @flow
import React from 'react';

import InformationTable from "../../general/InformationTable";
import { poolInformationColumns, frozenPoolInformationColumns } from './constants/PoolInformationColumns';

import type { GeneralInformationTableProps } from '../../general/InformationTable';


const PoolInformation = (props : GeneralInformationTableProps) => (
    <InformationTable
        tableType='PoolInformation'
        columns={poolInformationColumns}
        frozenColumns={frozenPoolInformationColumns}
        numberOfRows={props.initialState.numberOfPools}
        {...props}
    />
);


export default PoolInformation;
