// @flow
import React from 'react';
import * as R from 'ramda';

import InformationTable from "../../general/InformationTable";
import { libraryInformationColumns, frozenLibraryInformationColumns } from './constants/LibraryInformationColumns';
import { initialiseFrozenColumns } from '../../../functions/lib';

import type { GeneralInformationTableProps } from '../../general/InformationTable';
import type { Columns } from "../../../sf2datasheet/types/flowTypes";


const LibraryInformation = (props: GeneralInformationTableProps) => {


    const getFilteredColumns = (initialState : Object) : Columns => {
        let filteredColumns = libraryInformationColumns;
        filteredColumns = initialState.sf2IsDualIndex ? filteredColumns : R.remove(14, 1, filteredColumns);
        filteredColumns = initialState.sf2HasPools ? filteredColumns : R.remove(1, 3, filteredColumns);
        return filteredColumns;
    };


    return (
        <InformationTable
            tableType='LibraryInformation'
            columns={getFilteredColumns(props.initialState)}
            frozenColumns={initialiseFrozenColumns(frozenLibraryInformationColumns, props.initialState.containerTypeIsPlate)}
            numberOfRows={props.initialState.numberOfSamplesOrLibraries}
            {...props}
        />
    )

};


export default LibraryInformation;
