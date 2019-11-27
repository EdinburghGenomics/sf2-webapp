import * as lib from './lib';


// isBase64Json tests

it('returns true given valid JSON base64 queryString (isBase64Json)', () => {
    const valid_query_string = btoa(JSON.stringify( { test: "test"} ));
    expect(lib.isBase64Json(valid_query_string)).toBe(true);
});


it('returns false given invalid JSON base64 queryString (isBase64Json)', () => {
    const invalid_query_string = "INVALID";
    expect(lib.isBase64Json(invalid_query_string)).toBe(false);
});


// decodeQueryString tests

it('successfully decodes a valid query string (decodeQueryString)', () => {
    const valid_query_string = btoa(JSON.stringify( { test: "test"} ));
    expect(lib.decodeQueryString(valid_query_string)).toEqual({ test: "test" });
});


it('returns undefined given a valid query string (decodeQueryString)', () => {
    const invalid_query_string = "INVALID";
    expect(lib.decodeQueryString(invalid_query_string)).toBe(undefined);
});


// decodeFormStateQueryString tests

it('returns the relevant Stage1FormState given a query string representing a valid AbbreviatedStage1FormState (decodeFormStateQueryString)', () => {
    const valid_input = btoa(JSON.stringify(
        {
            pid: "pid",
            st: "st",
            ctp: true,
            nsl: "2",
            di: true,
            na: true,
            hp: true,
            np: "1",
            hc: true,
            nc: "1",
            husl: true,
            nusl: "1",
            nslp: "1"
        }
    ));

    const expected_output = {
        projectID: "pid",
        sf2type: "st",
        containerTypeIsPlate: true,
        numberOfSamplesOrLibraries: "2",
        sf2IsDualIndex: true,
        barcodeSetIsNA: true,
        sf2HasPools: true,
        numberOfPools: "1",
        sf2HasCustomPrimers: true,
        numberOfCustomPrimers: "1",
        sf2HasUnpooledSamplesOrLibraries: true,
        numberOfUnpooledSamplesOrLibraries: "1",
        numberOfSamplesOrLibrariesInPools: "1"
    };

    expect(lib.decodeFormStateQueryString(valid_input)).toEqual(expected_output);
});


it('returns a blank Stage1FormState given a query string representing an invalid AbbreviatedStage1FormState (decodeFormStateQueryString)', () => {
    const invalid_input = btoa(JSON.stringify(
        {
            valid: false
        }
    ));

    const expected_output = {
        projectID: undefined,
        sf2type: undefined,
        containerTypeIsPlate: undefined,
        numberOfSamplesOrLibraries: undefined,
        sf2IsDualIndex: undefined,
        sf2HasPools: undefined,
        numberOfPools: undefined
    };

    expect(lib.decodeFormStateQueryString(invalid_input)).toEqual(expected_output);
});


it('returns a blank Stage1FormState given an invalid query string (decodeFormStateQueryString)', () => {
    const invalid_query_string = "INVALID";

    const expected_output = {
        projectID: undefined,
        sf2type: undefined,
        containerTypeIsPlate: undefined,
        numberOfSamplesOrLibraries: undefined,
        sf2IsDualIndex: undefined,
        sf2HasPools: undefined,
        numberOfPools: undefined
    };

    expect(lib.decodeFormStateQueryString(invalid_query_string)).toEqual(expected_output);
});


// calculateWellID tests

it('creates the correct Well ID for row 0 (calculateWellID)', () => {
    expect(lib.calculateWellID(0)).toEqual('A:01');
});


it('creates the correct Well ID for row 7 (calculateWellID)', () => {
    expect(lib.calculateWellID(7)).toEqual('H:01');
});


it('creates the correct Well ID for row 8 (calculateWellID)', () => {
    expect(lib.calculateWellID(8)).toEqual('A:02');
});


// eventTargetIsValid tests

it('responds appropriately when the event target is valid (eventTargetIsValid)', () => {
   expect(lib.eventTargetIsValid({'target': {'validity': {'valid': true}}})).toBe(true);
});


it('responds appropriately when the event target is invalid (eventTargetIsValid)', () => {
    expect(lib.eventTargetIsValid({'target': {'validity': {'valid': false}}})).toBe(false);
});


it('responds appropriately when the event target validity is missing (eventTargetIsValid)', () => {
    expect(lib.eventTargetIsValid({'target': {'validity': undefined}})).toBe(false);
});


// calculateEGIDPrefix tests

it('calculates the EG ID prefix correctly when the Project ID is well formed (calculateEGIDPrefix)', () => {
    expect(lib.calculateEGIDPrefix('12345_Dunn-Davies_Hywel Robert')).toEqual('12345DH');
});


// calculateEGIDIndex tests

it('calculates the EG ID index correctly (calculateEGIDIndex)', () => {
    expect(lib.calculateEGIDIndex(1)).toEqual('0001');
});


// calculateEGSampleID tests

it('calculates the EG Sample ID correctly (calculateEGSampleID)', () => {
    expect(lib.calculateEGSampleID('12345DH', '0001')).toEqual('12345DH0001');
});


// calculateEGLibraryID tests

it('calculates the EG Library ID correctly (calculateEGLibraryID)', () => {
    expect(lib.calculateEGLibraryID('12345DH', '0001')).toEqual('12345DH0001L01');
});


// calculateEGPoolID tests

it('calculates the EG Pool ID correctly (calculateEGPoolID)', () => {
    expect(lib.calculateEGPoolID('12345DH', '0001')).toEqual('12345DHpool01');
});


// calculateEGPrimerID tests

it('calculates the EG Primer ID correctly (calculateEGPrimerID)', () => {
    expect(lib.calculateEGPrimerID('12345DH', '0001')).toEqual('12345DHprimer01');
});


// calculateEGID tests

it('calculates the EG Sample ID correctly when the Project ID is well formed (calculateEGID)', () => {
   expect(lib.calculateEGID(1, '12345_Dunn-Davies_Hywel Robert', 'Sample', 'SampleInformation')).toEqual('12345DH0001');
});


it('calculates the EG Sample ID correctly when the Project ID is ill formed (calculateEGID)', () => {
    expect(lib.calculateEGID(1, '12345_Dunn-Davies', 'Sample', 'SampleInformation')).toEqual('unknown');
});


it('calculates the EG Library ID correctly when the Project ID is well formed (calculateEGID)', () => {
    expect(lib.calculateEGID(1, '12345_Dunn-Davies_Hywel Robert', 'Library_old', 'LibraryInformation')).toEqual('12345DH0001L01');
});


it('calculates the EG Library ID correctly when the Project ID is ill formed (calculateEGID)', () => {
    expect(lib.calculateEGID(1, '12345_Dunn-Davies', 'Library_old', 'LibraryInformation')).toEqual('unknown');
});


it('calculates the EG Pool ID correctly when the Project ID is well formed (calculateEGID)', () => {
    expect(lib.calculateEGID(1, '12345_Dunn-Davies_Hywel Robert', 'Library_old', 'PoolInformation')).toEqual('12345DHpool01');
});


it('calculates the EG Pool ID correctly when the Project ID is ill formed (calculateEGID)', () => {
    expect(lib.calculateEGID(1, '12345_Dunn-Davies', 'Library_old', 'PoolInformation')).toEqual('unknown');
});


// calculateFrozenGrid tests

it('creates the frozen grid correctly for plates in Sample Information table (calculateFrozenGrid)', () => {
   const frozenSampleSF2Columns = [{ value: 'Well ID' }, { value: 'EG Sample ID' }];
   const testOutput = [[{"value": "A:01"}, {"value": "12345DH0001"}], [{"value": "B:01"}, {"value": "12345DH0002"}]];
   expect(lib.createFrozenGrid(2, frozenSampleSF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Sample', 'SampleInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for plates with top row number 97 in Sample Information table (calculateFrozenGrid)', () => {
    const frozenSampleSF2Columns = [{ value: 'Well ID' }, { value: 'EG Sample ID' }];
    const testOutput = [[{"value": "A:01"}, {"value": "12345DH0097"}], [{"value": "B:01"}, {"value": "12345DH0098"}]];
    expect(lib.createFrozenGrid(2, frozenSampleSF2Columns, '12345_Dunn-Davies_Hywel', 97, 'Sample', 'SampleInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for tubes in Sample Information table (calculateFrozenGrid)', () => {
    const frozenSampleSF2Columns = [{ value: 'Tube ID' }, { value: 'EG Sample ID' }];
    const testOutput = [[{"value": 1}, {"value": "12345DH0001"}], [{"value": 2}, {"value": "12345DH0002"}]];
    expect(lib.createFrozenGrid(2, frozenSampleSF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Sample', 'SampleInformation', false)).toEqual(testOutput);
});


it('creates the frozen grid correctly for plates in Library Information table (calculateFrozenGrid)', () => {
    const frozenLibrarySF2Columns = [{ value: 'Well ID' }, { value: 'EG Library ID' }];
    const testOutput = [[{"value": "A:01"}, {"value": "12345DH0001L01"}], [{"value": "B:01"}, {"value": "12345DH0002L01"}]];
    expect(lib.createFrozenGrid(2, frozenLibrarySF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Library_old', 'LibraryInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for plates with top row number 97 in Library Information table (calculateFrozenGrid)', () => {
    const frozenLibrarySF2Columns = [{ value: 'Well ID' }, { value: 'EG Library ID' }];
    const testOutput = [[{"value": "A:01"}, {"value": "12345DH0097L01"}], [{"value": "B:01"}, {"value": "12345DH0098L01"}]];
    expect(lib.createFrozenGrid(2, frozenLibrarySF2Columns, '12345_Dunn-Davies_Hywel', 97, 'Library_old', 'LibraryInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for tubes in Library Information table (calculateFrozenGrid)', () => {
    const frozenLibrarySF2Columns = [{ value: 'Tube ID' }, { value: 'EG Library ID' }];
    const testOutput = [[{"value": 1}, {"value": "12345DH0001L01"}], [{"value": 2}, {"value": "12345DH0002L01"}]];
    expect(lib.createFrozenGrid(2, frozenLibrarySF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Library_old', 'LibraryInformation', false)).toEqual(testOutput);
});


it('creates the frozen grid correctly for plates in Pool Information table (calculateFrozenGrid)', () => {
    const frozenPoolSF2Columns = [{ value: 'EG Pool ID' }];
    const testOutput = [[{"value": "12345DHpool01"}], [{"value": "12345DHpool02"}]];
    expect(lib.createFrozenGrid(2, frozenPoolSF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Library_old', 'PoolInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for plates with top row number 97 in Pool Information table (calculateFrozenGrid)', () => {
    const frozenPoolSF2Columns = [{ value: 'EG Pool ID' }];
    const testOutput = [[{"value": "12345DHpool97"}], [{"value": "12345DHpool98"}]];
    expect(lib.createFrozenGrid(2, frozenPoolSF2Columns, '12345_Dunn-Davies_Hywel', 97, 'Library_old', 'PoolInformation', true)).toEqual(testOutput);
});


it('creates the frozen grid correctly for tubes in Pool Information table (calculateFrozenGrid)', () => {
    const frozenPoolSF2Columns = [{ value: 'EG Pool ID' }];
    const testOutput = [[{"value": "12345DHpool01"}], [{"value": "12345DHpool02"}]];
    expect(lib.createFrozenGrid(2, frozenPoolSF2Columns, '12345_Dunn-Davies_Hywel', 1, 'Library_old', 'PoolInformation', false)).toEqual(testOutput);
});


// calculateRowID tests

it('calculates the row ID correctly when the container type is Tube', () => {
   expect(lib.calculateRowID(0, false)).toEqual('1');
});


it('calculates the row ID correctly when the container type is Plate', () => {
    expect(lib.calculateRowID(0, true)).toEqual('A:01');
});


// initialiseGrids tests

it('creates the correct initial grid when the number of samples or libraries is below 96 (initialiseGrids)', () => {
    const testOutput = [[[], []]];
    expect(lib.initialiseGrids(2, 96)).toEqual(testOutput);
});


it('creates the correct initial grid when the number of samples or libraries is above 96 (initialiseGrids)', () => {
    const testOutput = [[[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], [[], [], [], []]];
    expect(lib.initialiseGrids(100, 96)).toEqual(testOutput);
});


it('creates the correct initial grid when the number of samples or libraries is exactly 96 (initialiseGrids)', () => {
    const testOutput = [[[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]];
    expect(lib.initialiseGrids(96, 96)).toEqual(testOutput);
});


// initialiseFrozenColumns tests

it('initialises the frozen columns correctly when the container type is Tube (initialiseFrozenColumns)', () => {

    const testColumns = [
        {
            value: 'Well ID',
            width: 70
        },
        {
            value: 'EG Sample ID',
            width: 140
        }
    ];

    const expectedColumns = [
        {
            value: 'Tube ID',
            width: 70
        },
        {
            value: 'EG Sample ID',
            width: 140
        }
    ];

    expect(lib.initialiseFrozenColumns(testColumns, false)).toEqual(expectedColumns);

});


// getInitialGrids tests

it('retrieves the initial gridWithIDs correctly when there are gridWithIDs present (getInitialGrids)', () => {

    const testJSON = {
        name: 'test name',
        grids: ['test grid']
    };

    expect(lib.getInitialGrids([testJSON], 'test name')).toEqual(['test grid']);

});


it('retrieves the initial gridWithIDs correctly when there are no gridWithIDs present (getInitialGrids)', () => {

    const testJSON = {
        name: 'test name',
        grids: []
    };

    expect(lib.getInitialGrids([testJSON], 'test name')).toEqual([]);

});


// updateTables tests

it('updates the tables correctly (updateTables)', () => {

    const thisTable = {name: 'this table', grids: []};
    const otherTable = {name: 'other table', grids: []};

    const allTables = [otherTable, thisTable];

    expect(lib.updateTables(thisTable, allTables)).toEqual(allTables);

});


// getSF2 tests

it('gets the SF2 correctly (getSF2)', () => {

    const name = 'testName';
    const tables = [{name: 'test', grids: [],}];
    const frozenGrids = [];
    const sf2Data = {name: name, tables: tables, frozenGrids: frozenGrids};

    expect(lib.getSF2(name, tables, frozenGrids)).toEqual(sf2Data);

});


// getInitialTables tests

it('gets the initial tables correctly when there are tables present (getInitialTables)', () => {

    const name = 'testName';
    const tables = [{grids: [], name: 'test'}];
    const sf2Data = {name: name, tables: tables};
    const props = {initialSF2Data: sf2Data};

    expect(lib.getInitialTables(props)).toEqual(tables);

});


it('gets the initial tables correctly when there are no tables present (getInitialTables)', () => {

    const name = 'testName';
    const tables = [];
    const sf2Data = {name: name, tables: tables};
    const props = {initialSF2Data: sf2Data};

    expect(lib.getInitialTables(props)).toEqual(tables);

});


// getDuplicateMessage tests

it('creates a duplicate message correctly (getDuplicateMessage)', () => {

    const id = 'id';
    const row = 'row';
    const column = 'column';

    const duplicateMessage = "Duplicate ID 'id' in row 'row', column 'column'";

    expect(lib.getDuplicateMessage(id, row, column)).toEqual(duplicateMessage);

});


it('gets repeated keys correctly when there are repeated keys (getRepeatedKeys)', () => {

    const colIndex = 0;
    const grid = [[{value: 'test1'}], [{value: 'test1'}]];

    const repeatedKeys = ['test1'];

    expect(lib.getRepeatedKeys(colIndex, grid)).toEqual(repeatedKeys);

});


it('gets repeated keys correctly when there are no repeated keys (getRepeatedKeys)', () => {

    const colIndex = 0;
    const grid = [[{value: 'test1'}], [{value: 'test2'}]];

    const repeatedKeys = [];

    expect(lib.getRepeatedKeys(colIndex, grid)).toEqual(repeatedKeys);

});


it('gets the row ID correctly when the grid exists (getRowID)', () => {

    const rowIndex = 0;
    const colIndex = 0;

    const grid = [[{value: 'test'}]];

    expect(lib.getRowID(rowIndex, colIndex, grid)).toEqual('test');

});


it('gets the row ID correctly when the grid is null (getRowID)', () => {

    const rowIndex = 0;
    const colIndex = 0;

    const grid = null;

    expect(lib.getRowID(rowIndex, colIndex, grid)).toEqual('1');

});


it('gets the duplicate warnings (getDuplicateWarnings)', () => {

    const colIndex = 0;
    const columns = [{value: 'testCol'}];
    const grid = [[{value: 'testCell'}, {value: 'testCell'}]];
    const frozenGrid = [[{value: 'testRow'}]];
    const repeatedKeys = ['testCell'];
    const row = 'testRow';
    const message = "Duplicate ID 'testCell' in row 'testRow', column 'testCol'";
    const duplicateWarnings = [{row: row, message: message}];

    expect(lib.getDuplicateWarnings(colIndex, columns, grid, frozenGrid, repeatedKeys)).toEqual(duplicateWarnings);

});


// generatePlateID tests

it('generates a plate ID correctly (generatePlateID)', () => {

    const projectID = '12345_A_A';
    const plateIndex = 0;
    const plateID = "12345AAPLATE01";

    expect(lib.generatePlateID(projectID, plateIndex)).toEqual(plateID);

});


// getAllRowsWithSampleAndLibraryIDs tests

it('gets all rows with Sample and Library IDs correctly (getAllRowsWithSampleAndLibraryIDs)', () => {

    const initialState = {
        "projectID":"12345_a_a",
        "sf2type":"10X",
        "containerTypeIsPlate":false,
        "numberOfSamplesOrLibraries":"",
        "sf2IsDualIndex":true,
        "barcodeSetIsNA":false,
        "sf2HasPools":true,
        "numberOfPools":"2",
        "sf2HasCustomPrimers":false,
        "numberOfCustomPrimers":"",
        "sf2HasUnpooledSamplesOrLibraries":true,
        "numberOfUnpooledSamplesOrLibraries":"2",
        "numberOfSamplesOrLibrariesInPools":"{\"1\":\"2\",\"2\":\"2\"}"
    };

    const startIndices = {
        "sampleOrLibrary": "1",
        "unpooledSubmission": "1",
        "pool": "1"
    };

    const expectedResult = [
        {
            index: 1,
            name: 'unpooled-1',
            egSubmissionID: '12345AA0001',
            wellIndex: 1,
            egWellID: 'A:01',
            egLibraryID: '12345AA0001L01',
            egSampleID: '12345AA0001'
        },
        {
            index: 2,
            name: 'unpooled-2',
            egSubmissionID: '12345AA0002',
            wellIndex: 2,
            egWellID: 'B:01',
            egLibraryID: '12345AA0002L01',
            egSampleID: '12345AA0002'
        },
        {
            index: 1,
            name: 'pool1-1',
            egSubmissionID: '12345AApool01',
            wellIndex: 3,
            egWellID: 'C:01',
            egLibraryID: '12345AA0003L01',
            egSampleID: '12345AA0003'
        },
        {
            index: 2,
            name: 'pool1-2',
            egSubmissionID: '12345AApool01',
            wellIndex: 3,
            egWellID: 'C:01',
            egLibraryID: '12345AA0004L01',
            egSampleID: '12345AA0004'
        },
        {
            index: 1,
            name: 'pool2-1',
            egSubmissionID: '12345AApool02',
            wellIndex: 4,
            egWellID: 'D:01',
            egLibraryID: '12345AA0005L01',
            egSampleID: '12345AA0005'
        },
        {
            index: 2,
            name: 'pool2-2',
            egSubmissionID: '12345AApool02',
            wellIndex: 4,
            egWellID: 'D:01',
            egLibraryID: '12345AA0006L01',
            egSampleID: '12345AA0006'
        }
    ];

    const allRows = lib.getAllRowsWithSampleAndLibraryIDs(initialState, startIndices);

    expect(allRows).toEqual(expectedResult);

});


it('gets all rows with Sample and Library IDs correctly with specified start indices for Sample SF2 (getAllRowsWithSampleAndLibraryIDs)', () => {

    const initialState = {
        "projectID":"12345_a_a",
        "sf2type":"Sample",
        "containerTypeIsPlate":false,
        "numberOfSamplesOrLibraries":"2",
        "sf2IsDualIndex":true,
        "barcodeSetIsNA":false,
        "sf2HasPools":true,
        "numberOfPools":"2",
        "sf2HasCustomPrimers":false,
        "numberOfCustomPrimers":"",
        "sf2HasUnpooledSamplesOrLibraries":true,
        "numberOfUnpooledSamplesOrLibraries":""
    };

    const startIndices = {
        "sampleOrLibrary": "2",
        "unpooledSubmission": "2",
        "pool": "2"
    };

    const expectedResult = [
        {
            index: 2,
            name: 'unpooled-2',
            egSubmissionID: '12345AA0002',
            wellIndex: 1,
            egWellID: 'A:01',
            egLibraryID: '12345AA0002L01',
            egSampleID: '12345AA0002'
        },
        {
            index: 3,
            name: 'unpooled-3',
            egSubmissionID: '12345AA0003',
            wellIndex: 2,
            egWellID: 'B:01',
            egLibraryID: '12345AA0003L01',
            egSampleID: '12345AA0003'
        }
    ]

    const allRows = lib.getAllRowsWithSampleAndLibraryIDs(initialState, startIndices);

    expect(allRows).toEqual(expectedResult);

});


it('gets all rows with Sample and Library IDs correctly with specified start indices for 10X SF2 (getAllRowsWithSampleAndLibraryIDs)', () => {

    const initialState = {
        "projectID":"12345_a_a",
        "sf2type":"10X",
        "containerTypeIsPlate":false,
        "numberOfSamplesOrLibraries":"",
        "sf2IsDualIndex":true,
        "barcodeSetIsNA":false,
        "sf2HasPools":true,
        "numberOfPools":"2",
        "sf2HasCustomPrimers":false,
        "numberOfCustomPrimers":"",
        "sf2HasUnpooledSamplesOrLibraries":true,
        "numberOfUnpooledSamplesOrLibraries":"2",
        "numberOfSamplesOrLibrariesInPools":"{\"1\":\"2\",\"2\":\"2\"}"
    };

    const startIndices = {
        "sampleOrLibrary": "2",
        "unpooledSubmission": "2",
        "pool": "2"
    };

    const expectedResult = [
        {
            index: 2,
            name: 'unpooled-2',
            egSubmissionID: '12345AA0002',
            wellIndex: 1,
            egWellID: 'A:01',
            egLibraryID: '12345AA0002L01',
            egSampleID: '12345AA0002'
        },
        {
            index: 3,
            name: 'unpooled-3',
            egSubmissionID: '12345AA0003',
            wellIndex: 2,
            egWellID: 'B:01',
            egLibraryID: '12345AA0003L01',
            egSampleID: '12345AA0003'
        },
        {
            index: 1,
            name: 'pool2-1',
            egSubmissionID: '12345AApool02',
            wellIndex: 3,
            egWellID: 'C:01',
            egLibraryID: '12345AA0004L01',
            egSampleID: '12345AA0004'
        },
        {
            index: 2,
            name: 'pool2-2',
            egSubmissionID: '12345AApool02',
            wellIndex: 3,
            egWellID: 'C:01',
            egLibraryID: '12345AA0005L01',
            egSampleID: '12345AA0005'
        },
        {
            index: 1,
            name: 'pool3-1',
            egSubmissionID: '12345AApool03',
            wellIndex: 4,
            egWellID: 'D:01',
            egLibraryID: '12345AA0006L01',
            egSampleID: '12345AA0006'
        },
        {
            index: 2,
            name: 'pool3-2',
            egSubmissionID: '12345AApool03',
            wellIndex: 4,
            egWellID: 'D:01',
            egLibraryID: '12345AA0007L01',
            egSampleID: '12345AA0007'
        }
    ];

    const allRows = lib.getAllRowsWithSampleAndLibraryIDs(initialState, startIndices);

    expect(allRows).toEqual(expectedResult);

});


// generateContainerOffset tests

it('generates the right container offset (generateContainerOffset)', () => {
    expect(lib.generateContainerOffset('2')).toEqual(1);
});


// addContainerIDs tests

it('adds the right container IDs (addContainerIDs)', () => {
    const containerIDs = ["1", "2"];
    const grids = [[],[]];
    const result = [{"grid": [], "id": "1"}, {"grid": [], "id": "2"}];
    expect(lib.addContainerIDs(containerIDs, grids)).toEqual(result);
});


// getContainerIDs tests

it('returns the right container IDs for tubes (getContainerIDs)', () => {
    const frozenGrids = [{}, {}];
    const containerStartIndex = 1;
    const containerTypeIsPlate = false;
    const projectID = "12345_Test_Project";
    const result = ["0", "1"];
    expect(lib.getContainerIDs(
        frozenGrids,
        containerStartIndex,
        containerTypeIsPlate,
        projectID)
    ).toEqual(result);
});


it('returns the right container IDs for plates (getContainerIDs)', () => {
    const frozenGrids = [{}, {}];
    const containerStartIndex = 1;
    const containerTypeIsPlate = true;
    const projectID = "12345_Test_Project";
    const result = ["12345TPPLATE01", "12345TPPLATE02"];
    expect(lib.getContainerIDs(
        frozenGrids,
        containerStartIndex,
        containerTypeIsPlate,
        projectID)
    ).toEqual(result);
});


// getCallbackHref tests

it('returns the right callback href (getCallbackHref)', () => {
    expect(lib.getCallbackHref(
        {port: "3000", href: "test"}
    )).toEqual("http://localhost:8000/");
});

