// @flow
import React from 'react';
import * as R from 'ramda';

import InformationTable from "../../general/InformationTable";

import {
    libraryInformationColumns,
    frozenLibraryInformationColumns,
    frozenTenXSampleInformationColumns
} from './constants/10XSampleInformationColumns';

import {
    naBarcodeSet_options
} from '../../../constants/options';


import { initialiseFrozenColumns } from '../../../functions/lib';

import type { GeneralInformationTableProps } from '../../general/InformationTable';
import type { Columns } from "../../../sf2datasheet/types/flowTypes";


const TenXSampleInformation = (props: GeneralInformationTableProps) => {


    const initialiseColumns = (initialState : Object) : Columns => {
        const filteredColumns = initialState.sf2HasPools ? libraryInformationColumns : R.remove(1, 3, libraryInformationColumns);
        return filteredColumns.map(
            col => col.id === 'barcodeSet' && initialState.barcodeSetIsNA === true ?
                R.assoc('selectOptions', naBarcodeSet_options)(col) :
                col
        );
    };


    return (
        <InformationTable
            tableType='10XSampleInformation'
            columns={initialiseColumns(props.initialState)}
            frozenColumns={initialiseFrozenColumns(frozenTenXSampleInformationColumns, props.initialState.containerTypeIsPlate)}
            numberOfRows={props.initialState.numberOfSamplesOrLibraries}
            {...props}
        />
    )

};


export default TenXSampleInformation;
