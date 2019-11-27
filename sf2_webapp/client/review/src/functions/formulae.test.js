import * as formulae from './formulae';


// yieldCalcFormula tests

it('returns the yield calculation value correctly (yieldCalcFormula)', () => {
    const row = new Map([["conc", "4"],["volume", "5"]]);
    expect(formulae.yieldCalcFormula(null, row, null, null, null, null)).toEqual("20");
});


// egPoolIDFormula tests

it('returns the EG Pool ID value correctly (egPoolIDFormula)', () => {
    const row = new Map([["yourPoolID", "my-pool"]]);
    const data = new Map([["my-pool", "12345AApool01"]]);
    expect(formulae.egPoolIDFormula(null, row, data, null, null, null)).toEqual("12345AApool01");
});


// poolSizeFormulaV1 tests

it('returns the pool size value correctly (poolSizeFormulaV1)', () => {
    const row = new Map([["yourPoolID", "my-pool"]]);
    const grid = [[{value: ""}, {value: ""}, {value: "my-pool"}]];
    expect(formulae.poolSizeFormulaV1(grid, row, null, null, null, null)).toEqual("1");
});


// estimatedMolarityFormulaV1 tests

it('returns the estimated molarity (v1) correctly (estimatedMolarityFormulaV1)', () => {
    const row = new Map([["conc", "4"], ["averageLibrarySize", "5"]]);
    expect(formulae.estimatedMolarityFormulaV1(null, row, null, null, null, null)).toEqual("1230.8");
});


// estimatedConcentrationFormula tests

it('returns the estimated concentration correctly (estimatedConcentrationFormula)', () => {
    const row = new Map([["conc", "4"], ["averageFragmentSize", "5"]]);
    expect(formulae.estimatedConcentrationFormula(null, row, null, null, null, null)).toEqual("1230.8");
});


// poolConcFormula tests

it('returns the pool concentrations correctly with no latestChanges and one unpooled sample (poolConcFormula)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AA0001"}]];
    const grid = [[{value: ""}, {value: ""}, {value: ""}, {value: "5"}]];
    expect(formulae.poolConcFormula(grid, null, null, null, rowIndex, frozenGrid)).toEqual("NA");
});


it('returns the pool concentrations correctly with no latestChanges and one pool (poolConcFormula)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AApool01"}]];
    const grid = [[{value: ""}, {value: ""}, {value: ""}, {value: "5"}]];
    expect(formulae.poolConcFormula(grid, null, null, null, rowIndex, frozenGrid)).toEqual("5");
});


it('returns the pool concentrations correctly with latestChanges and one unpooled sample (poolConcFormula)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AA0001"}]];
    const grid = [[{value: ""}, {value: ""}, {value: ""}, {value: "5"}]];
    const latestChanges = [{col: 3, row: 0, value: "4"}];
    expect(formulae.poolConcFormula(grid, null, null, latestChanges, rowIndex, frozenGrid)).toEqual("NA");
});


it('returns the pool concentrations correctly with latestChanges and one pool (poolConcFormula)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AApool01"}]];
    const grid = [[{value: ""}, {value: ""}, {value: ""}, {value: "5"}]];
    const latestChanges = [{col: 3, row: 0, value: "4"}];
    expect(formulae.poolConcFormula(grid, null, null, latestChanges, rowIndex, frozenGrid)).toEqual("4");
});


// poolSizeFormulaV2 tests

it('returns the pool size value correctly with one pool (poolSizeFormulaV2)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AApool01"}]];
    expect(formulae.poolSizeFormulaV2(null, null, null, null, rowIndex, frozenGrid)).toEqual("1");
});


it('returns the pool size value correctly with one unpooled sample (poolSizeFormulaV2)', () => {
    const rowIndex = 0;
    const frozenGrid = [[{value: ""},{value: "12345AA0001"}]];
    expect(formulae.poolSizeFormulaV2(null, null, null, null, rowIndex, frozenGrid)).toEqual("NA");
});

// estimatedMolarityFormulaV2 tests

it('returns the estimated molarity (v2) correctly (estimatedMolarityFormulaV2)', () => {
    const row = new Map([["tenXSampleConcentration", "4"], ["averageTenXSampleSize", "5"]]);
    expect(formulae.estimatedMolarityFormulaV2(null, row, null, null, null, null)).toEqual("1230.8");
});
