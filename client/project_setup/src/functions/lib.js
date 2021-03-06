// @flow
// Helper functions for the SF2 webapp demo
import * as R from 'ramda';

import type { Columns, Grid, Row } from '../sf2datasheet/types/flowTypes';
import type { Grids, Table, Tables, SF2Data, AbbreviatedStage1FormState, Stage1FormState } from '../types/flowTypes';


export const isBase64Json = (str : string) : boolean => {

    try {
        return (btoa(JSON.stringify(JSON.parse(atob(str)))) === str);
    } catch (err) {
        return false;
    }

};


export const decodeQueryString = (queryString : string): ?Object => {

    // Redirect to homepage if query string is invalid
    if (isBase64Json(queryString)) {
        return (JSON.parse(atob(queryString)));
    } else {
        return undefined;
    }

};


export const decodeFormStateQueryString = (queryString : string) : Stage1FormState => {

    const decodedQueryString: ?AbbreviatedStage1FormState = decodeQueryString(queryString);

    // given a valid query string, parse out the relevant fields and construct a Stage1FormState
    // eslint-disable-next-line
    if (decodedQueryString != undefined) {  // using != rather than !== so that flow will infer type correctly

        const qsState: AbbreviatedStage1FormState = decodedQueryString;

        return {
            projectID: qsState.pid,
            sf2type: qsState.st,
            containerTypeIsPlate: qsState.ctp,
            numberOfSamplesOrLibraries: qsState.nsl,
            sf2IsDualIndex: qsState.di,
            barcodeSetIsNA: qsState.na,
            sf2HasPools: qsState.hp,
            numberOfPools: qsState.np,
            sf2HasCustomPrimers: qsState.hc,
            numberOfCustomPrimers: qsState.nc,
            sf2HasUnpooledSamplesOrLibraries: qsState.husl,
            numberOfUnpooledSamplesOrLibraries: qsState.nusl,
            numberOfSamplesOrLibrariesInPools: qsState.nslp
        };

    }

    // given an invalid query string, return a blank Stage1FormState
    return {
        projectID: undefined,
        sf2type: undefined,
        containerTypeIsPlate: undefined,
        numberOfSamplesOrLibraries: undefined,
        sf2IsDualIndex: undefined,
        barcodeSetIsNA: undefined,
        sf2HasPools: undefined,
        numberOfPools: undefined,
        sf2HasCustomPrimers: undefined,
        numberOfCustomPrimers: undefined
    };

};


export const calculateWellID = (rowNumber : number) : string => {

    const groupNumber = Math.floor(rowNumber / 8) + 1;
    const groupString = groupNumber < 10 ? '0' + groupNumber.toString() : groupNumber.toString();

    const numberWithinGroup = rowNumber % 8;
    const letterWithinGroup = String.fromCharCode(65 + numberWithinGroup);

    return letterWithinGroup + ':' + groupString;

};


export const eventTargetIsValid = (event : Object) => {
    return R.isNil(event.target.validity) ? false : (event.target.validity.valid === true);
};


export const calculateEGIDPrefix = (projectID : string) : string => {
    const projectIDRegex = /^(\d{5})_([^_])[^_]*_([^_])[^_]*$/;
    return R.pipe(
        R.match(projectIDRegex),
        R.slice(1,4),
        R.join(''),
        R.toUpper
    )(projectID);
};


export const calculateEGIDIndex = (rowIndex : number) : string => ('000' + rowIndex.toString()).slice(-4);


export const calculateEGSampleID = (egIDPrefix : string, egIDIndex : string) : string => egIDPrefix + egIDIndex;


export const calculateEGLibraryID = (egIDPrefix : string, egIDIndex : string) : string => egIDPrefix + egIDIndex + 'L01';


export const calculateEGPoolID = (egIDPrefix : string, egIDIndex : string) : string => egIDPrefix + 'pool' + egIDIndex.slice(-2);


export const calculateEGPrimerID = (egIDPrefix : string, egIDIndex : string) : string => egIDPrefix + 'primer' + egIDIndex.slice(-2);


export const calculateEGID = (rowIndex : number, projectID : string, sf2type : string, tableType: string) : string => {

    const egIDPrefix = calculateEGIDPrefix(projectID);
    const egIDIndex = calculateEGIDIndex(rowIndex);

    if(R.isEmpty(egIDPrefix)) {
        // Failed to recognise Project ID
        return 'unknown';
    }

    let egID = '';

    if(sf2type === 'Sample' && tableType === 'SampleInformation') {
        egID = calculateEGSampleID(egIDPrefix, egIDIndex);
    } else if (sf2type === 'Library_old' && tableType === 'LibraryInformation') {
        egID = calculateEGLibraryID(egIDPrefix, egIDIndex);
    } else if(sf2type === 'Library_old' && tableType === 'PoolInformation') {
        egID = calculateEGPoolID(egIDPrefix, egIDIndex);
    } else if (sf2type === '10X_old' && tableType === '10XSampleInformation') {
        egID = calculateEGSampleID(egIDPrefix, egIDIndex);
    } else if(sf2type === '10X_old' && tableType === '10XPoolInformation') {
        egID = calculateEGPoolID(egIDPrefix, egIDIndex);
    } else if(sf2type === 'Library_old' && tableType === 'PrimerInformation') {
        egID = calculateEGPrimerID(egIDPrefix, egIDIndex);
    } else if(sf2type === 'Library' && tableType === 'PrimerInformation') {
        egID = calculateEGPrimerID(egIDPrefix, egIDIndex);
    } else {
        egID = 'Error: bad SF2 type';
    }

    return egID;

};


export const createFrozenGrid = (numberOfRows : number, frozenColumns : Columns, projectID : string, topRowNumber : number, sf2type : string, tableType : string, containerTypeIsPlate: boolean) : Grid => {

    let rows = [];

    for (let i = 0; i < numberOfRows; i++) {
        let newRow = [];

        if(tableType !== '10XPoolInformation' && tableType !== 'PrimerInformation' && tableType !== 'PoolInformation') {
            switch (containerTypeIsPlate) {
                case false:
                    newRow.push({value: i + 1});
                    break;
                case true:
                    newRow.push({value: calculateWellID(i)});
                    break;
                default:
                    break;
            }
        }

        newRow.push(
            {value: calculateEGID(i + topRowNumber, projectID, sf2type, tableType)}
        );

        rows.push(newRow);

    }

    return rows;

};


export const calculateRowID = (rowIndex : number, containerTypeIsPlate : boolean) : string => {
    return containerTypeIsPlate ? calculateWellID(rowIndex) : (rowIndex + 1).toString();
};


export const initialiseGrids = (numberOfSamplesOrLibraries : number, maxRowsPerGrid : number) : Grids => {

    const numberOfGrids = Math.ceil( numberOfSamplesOrLibraries / maxRowsPerGrid );
    const numberOfRowsInLastGrid = numberOfSamplesOrLibraries % maxRowsPerGrid;

    let gridSizes = R.repeat(maxRowsPerGrid, R.max(0, numberOfGrids-1));
    if(numberOfRowsInLastGrid > 0) {
        gridSizes.push(numberOfRowsInLastGrid);
    } else if(numberOfSamplesOrLibraries > 0) {
        // the number of samples or libraries is an exact multiple of the max number of rows per grid
        gridSizes.push(maxRowsPerGrid);
    }

    return R.map(x => R.repeat([], x))(gridSizes);

};


export const initialiseFrozenColumns = (frozenColumns : Columns, containerTypeIsPlate : boolean) : Columns => {

    let newColumns = frozenColumns;

    if(containerTypeIsPlate === false) {
        newColumns[0].value = 'Tube ID'
    }

    return newColumns;

};


export const getInitialGrids = (initialTables : Tables, tableType : string) : Grids => {
    const getGrids = R.pipe(R.filter(R.propEq('name', tableType)), R.map(R.propOr([], 'grids')));
    return Array.prototype.concat(...getGrids(initialTables));
};


export const updateTables = (table: Table, allTables : Tables) : Tables => {
    const hasOtherName = R.complement(R.propEq('name', table.name));
    const otherTables = R.filter(hasOtherName)(allTables);
    const newTables = R.concat(otherTables, [table]);
    return R.sortBy(R.prop('name'))(newTables);
};


export const getSF2 = (SF2Type : string, tables : Tables, frozenGrids : Grids) : SF2Data => {
    return {name: SF2Type, tables: tables, frozenGrids: frozenGrids};
};


export const getInitialTables = (props : {initialSF2Data: SF2Data}) : Tables => R.propOr([], 'tables')(props.initialSF2Data);


export const getNumSamplesOrLibrariesLabel = (sf2type : string) : string => {
    switch(sf2type) {
        case 'Sample':
            return 'Number of samples';
        case 'Library_old':
            return 'Number of libraries';
        case '10X_old':
            return 'Number of 10X samples';
        default:
            return 'Error: SF2 type not recognised';
    }
};


export const getNumSamplesOrLibrariesPlaceholder = (sf2type : string) : string => {
    switch(sf2type) {
        case 'Sample':
            return 'Enter the number of samples here';
        case 'Library_old':
            return 'Enter the number of libraries here';
        case '10X_old':
            return 'Enter the number of 10X samples here';
        default:
            return 'Error: SF2 type not recognised';
    }
};


export const getDuplicateMessage = (id : string, row : string, column : string) : string => {
    return "Duplicate ID '" + id + "' in row '" + row + "', column '" + column + "'";
};


export const getRepeatedKeys = (colIndex: number, grid : Grid) : Array<string> => {

    const yourIDs = grid.map(x => x[colIndex].value);
    const yourIDCounts = R.countBy(R.identity)(yourIDs);

    return R.pipe(
        R.pickBy((v,_) => (v>1)),
        R.keys
    )(yourIDCounts);

};


export const getRowID = (rowIndex : number, colIndex : number, grid : Grid) : string => {

    if (R.isNil(grid) || R.isNil(grid[rowIndex])) {
        return (rowIndex + 1).toString();
    } else {
        return grid[rowIndex][colIndex].value;
    }

};


export const getDuplicateWarnings = (colIndex : number, columns : Columns, grid : Grid, frozenGrid : Grid, repeatedKeys : Array<string>) : Array<string> => {

    let warnings = [];

    if (!R.isNil(repeatedKeys) && repeatedKeys.length > 0) {

        const idColumn = grid.map(x => x[colIndex]);
        const colName = columns[colIndex].value;

        idColumn.forEach((id, idIndex) => {

            if(R.contains(id.value, repeatedKeys)){

                const rowID = getRowID(idIndex, colIndex, frozenGrid);
                const duplicateMessage = getDuplicateMessage(id.value, rowID, colName);

                warnings.push({row: rowID, message: duplicateMessage});

            }

        });

    }

    return warnings;

};


export const getInitialInformationTableGrids = (initialTables : Tables, frozenGrids : Grids, tableName : string) : Grids => {

    const getMatchingTable = tables => R.find(R.propEq('name', tableName), tables);

    const matchingTable = getMatchingTable(initialTables);
    const matchingFrozenGrid = getMatchingTable(frozenGrids);

    if(!R.isNil(matchingTable)) {
        return matchingTable.grids.map(x=>x.grid);
    } else if (matchingFrozenGrid.grids[0].length === 0) {
        return [];
    } else {
        const frozenGridContents = matchingFrozenGrid.grids.map(x=>x.grid);
        return frozenGridContents.map(frozenGrid => R.repeat([], frozenGrid.length));
    }

};


export const updateRow = (currentWellOffset : number, row : Row) : Row => {

    const newWellIndex = row.wellIndex - currentWellOffset;
    const newWellID = calculateWellID(newWellIndex-1);

    return R.pipe(
        R.assoc('wellIndex', newWellIndex),
        R.assoc('egWellID', newWellID)
    )(row);

};


export const splitRows = (wellsPerPlate : number, rows : Grid) : Grids => {

    const sortedRows = R.sort((a, b) => a.wellIndex - b.wellIndex)(rows);

    let splitRows = [];
    let currentPlate = [];
    let currentWellOffset = 0;
    let currentPlateMaximum = wellsPerPlate;

    sortedRows.forEach(row => {

        if (row.wellIndex > currentPlateMaximum) {
            currentWellOffset = currentPlateMaximum;
            currentPlateMaximum += wellsPerPlate;
            splitRows = splitRows.concat([currentPlate]);
            currentPlate = [updateRow(currentWellOffset, row)];
        } else {
            currentPlate = currentPlate.concat([updateRow(currentWellOffset, row)]);
        }
    });

    splitRows = splitRows.concat([currentPlate]);

    return splitRows;

};


export const calculateFrozenGrids = (allRowsWithIDs : Object, containerTypeIsPlate : boolean, getRowsToReturn : (Array<Object>) => Array<Object>) : Grids => {

    let frozenGrids = [];

    if(containerTypeIsPlate) {
        frozenGrids = R.pipe(
            R.curry(splitRows)(96),
            R.map(getRowsToReturn)
        )(allRowsWithIDs);
    } else {
        frozenGrids = [getRowsToReturn(allRowsWithIDs)];
    }

    return frozenGrids;

};


export const generatePlateID = (projectID, plateIndex) => {
    const platePrefix = calculateEGIDPrefix(projectID);
    const plateIndexString = (plateIndex + 1).toString().padStart(2, '0');
    return(platePrefix + 'PLATE' + plateIndexString);
};


export const getAllRowsWithSampleAndLibraryIDs = (initialState, startIndices) => {

    const egIDPrefix = calculateEGIDPrefix(initialState.projectID);

    const parseIntDefaultZero = x => parseInt(x, 10) || 0;

    const numUnpooledSamplesOrLibraries =
        parseIntDefaultZero(initialState.numberOfUnpooledSamplesOrLibraries) +
        parseIntDefaultZero(initialState.numberOfSamplesOrLibraries);

    const numPools = parseIntDefaultZero(initialState.numberOfPools);

    const numSamplesOrLibrariesInPools = R.map(
        parseIntDefaultZero
    )(JSON.parse(R.propOr("{}", "numberOfSamplesOrLibrariesInPools")(initialState)));

    const sampleOrLibraryStart = parseIntDefaultZero(startIndices.sampleOrLibrary);
    const unpooledSubmissionStart = parseIntDefaultZero(startIndices.unpooledSubmission);
    const poolStart = parseIntDefaultZero(startIndices.pool);

    const unpooledSampleIndices = R.range(
        unpooledSubmissionStart,
        unpooledSubmissionStart + numUnpooledSamplesOrLibraries
    );

    const unpooledSampleRows = unpooledSampleIndices.map(i => {

        const egIDIndex = calculateEGIDIndex(i);
        const wellIndex = i - unpooledSubmissionStart + 1;
        const unpooledCell = {
            'index': i,
            'name': 'unpooled-'+i.toString(),
            'egSubmissionID': calculateEGSampleID(egIDPrefix, egIDIndex),
            'wellIndex': wellIndex,
            'egWellID': calculateWellID(wellIndex-1)
        };

        return(unpooledCell);

    });

    const poolIndices = R.range(
        poolStart,
        poolStart + numPools
    );

    const pooledSampleRows = poolIndices.map(
        p => {
            const sampleIndicesInPool = R.range(1, numSamplesOrLibrariesInPools[p - poolStart + 1] + 1);
            return sampleIndicesInPool.map(
                i => {
                    const wellIndex = p + numUnpooledSamplesOrLibraries - poolStart + 1;
                    const egIDIndex = calculateEGIDIndex(p);
                    const pooledCell = {
                        'index': i,
                        'name': 'pool' + p.toString() + '-' + i.toString(),
                        'egSubmissionID': calculateEGPoolID(egIDPrefix, egIDIndex),
                        'wellIndex': wellIndex,
                        'egWellID': calculateWellID(wellIndex-1)
                    };
                    return(pooledCell);
                }
            );
        }
    );

    const allRows = R.flatten([unpooledSampleRows, pooledSampleRows]);

    const allRowsWithSampleAndLibraryIDs = allRows.map((r, i) => {
        const egIDIndex = calculateEGIDIndex(i + sampleOrLibraryStart);
        return R.pipe(
            R.assoc('egLibraryID', calculateEGLibraryID(egIDPrefix, egIDIndex)),
            R.assoc('egSampleID', calculateEGSampleID(egIDPrefix, egIDIndex))
        )(r)
    });

    return(allRowsWithSampleAndLibraryIDs);

};


export const generateContainerOffset = containerStartIndex => {
    return R.isNil(containerStartIndex) ? 0 :
        parseInt(containerStartIndex, 10) - 1;
};


export const addContainerIDs = (containerIDs, grids) => {
    return R.zip(containerIDs, grids)
        .map(x => {return{id: x[0], grid: x[1]}});
};


export const getContainerIDs = (frozenGrids, containerStartIndex, containerTypeIsPlate, projectID) => {

    const getContainerID = (grid, gridIndex) => {
        const adjustedGridIndex = gridIndex + parseInt(containerStartIndex, 10) - 1;
        return containerTypeIsPlate ? generatePlateID(projectID, adjustedGridIndex) : gridIndex.toString();
    };

    return frozenGrids.map(getContainerID);

};


export const getCallbackHref = (location : Object) : string => {

    // work out web service url
    let href = '';
    const port = parseInt(location.port, 10);

    // dev environment uses port 3000, 3001, 3002, prod uses 8000, 8001, 8002
    if(port < 4000) {
        // running in dev environment, need to infer the web service port
        const servPort = (port + 5000).toString();
        href = "http://localhost:" + servPort + "/";
    } else {
        // running in test / production, get url from window.location
        href = location.href;
    }

    return href;

};
