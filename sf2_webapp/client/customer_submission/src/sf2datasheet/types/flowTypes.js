export type Cell = Object;
export type Row = Array<Cell>;
export type Grid = Array<Row>;
export type Columns = Array<Object>;
export type IntervalID = number;
export type StringMap = Map<string, string>;
export type Changes = Array<Object>;
export type Formula = (grid : Grid, row : Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid) => {}
export type CellCoordinates = {i: number, j: number};
