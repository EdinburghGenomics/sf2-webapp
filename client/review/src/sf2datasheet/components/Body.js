// @flow
import React from 'react';
import * as R from 'ramda';

import ReactDataSheet from 'react-datasheet';

import './Body.css';
import { Cell, Row, Grid, Columns, StringMap, Changes, Formula } from '../types/flowTypes';
import { MoveDirections } from '../constants/enums';

import SelectEditor from './SelectEditor';
import AutocompleteEditor from './AutocompleteEditor';

import type { CellCoordinates } from "../types/flowTypes";


// Flow type declarations ----

type BodyProps = {
    id: number,
    uuid: string,
    columns: Columns,
    frozenGrid: ?Grid,
    data?: StringMap,
    initialBodyGrid: Grid,
    onUpdateBodyGrid: Grid => void,
    onMove: (number, MoveDirections) => void,
    bottomPadding: number,
    disableUndo: () => void,
    disableRedo: () => void,
    enableUndo: () => void,
    enableRedo: () => void,
    rowColours: ?Array<string>
};

type BodyState = {
    grid: Grid,
    columns: Columns
}


// Helper Functions ----

const addDataEditors = (columns : Columns, grid : Grid) : Grid => {

    return grid.map(row => {
       return row.map((cell, cellIndex) => {
           const col = columns[cellIndex];
           if(!R.isNil(col) && R.has('selectOptions')(col)) {
               return R.assoc('dataEditor', SelectEditor, cell);
           } else if(!R.isNil(col) && R.has('autocompleteOptions')(col)) {
               return R.assoc('dataEditor', AutocompleteEditor, cell);
           } else {
               return cell;
           }
       });
    });

};


const fillEmptyColumns = (row : Row, columns : Columns) => {

    const rowLength = row.length;

    for (let i = rowLength; i < columns.length; i++) {
        let blankCell = {value: "", readonly: false};
        row.push(blankCell);
    }

    return row;

};


const fillSF2Grid = (columns : Columns, initialGrid : Grid) : Grid => {
    return initialGrid.map(initialRow => fillEmptyColumns(initialRow, columns));
};


const updateCellValueBasedOnFormula = (grid : Grid, cell : Cell, row: Row, data: StringMap, latestChanges: ?Changes, rowIndex: number, frozenGrid: Grid, formula: Formula) => {

    if(R.isNil(data)) {
        data = new Map();
    }

    //$FlowFixMe
    const calculatedValue = formula(grid, row, data, latestChanges, rowIndex, frozenGrid);
    let calculatedValueString = calculatedValue === undefined ? '' : calculatedValue.toString();

    if (calculatedValueString === 'NaN' || calculatedValueString === 'Infinity') {
        calculatedValueString = 'NA';
    }

    return R.assoc('value', calculatedValueString, cell);

};


const updateCalculatedCells = (grid : Grid, columns : Columns, data: StringMap, latestChanges: ?Changes, frozenGrid: Grid) : Grid => {

    return grid.map(
        (row, rowIndex) => row.map(
            (cell, cellIndex) => {

                const colIDs = R.pluck('id', columns);
                const rowValues = R.pluck('value', row);
                const rowMap = new Map(R.zip(colIDs, rowValues));

                const formula = R.props(['formula'], columns[cellIndex])[0];

                if(R.isNil(formula)) {
                    return cell;
                } else {
                    return updateCellValueBasedOnFormula(grid, cell, rowMap, data, latestChanges, rowIndex, frozenGrid, formula);
                }
            }
        )
    );

};


const CellRenderer = (props : Object) => {

    const thisColumn = props.columns[props.col];

    const dimensions = {
        width: thisColumn.width,
        height: 20
    };

    const styleElements = R.isNil(props.rowColours) ?
        dimensions :
        R.assoc('backgroundColor', props.rowColours[props.row], dimensions);

    const addAdditionalElementsToStyle = R.assoc('style', styleElements);

    const convertBoolPropToString = propName => R.assoc(propName, props[propName].toString());

    const attributes = R.compose(
        addAdditionalElementsToStyle,
        convertBoolPropToString('editing'),
        convertBoolPropToString('updated'),
        R.dissoc('attributesRenderer'),
        R.dissoc('columns'),
        R.dissoc('id'),
        R.dissoc('uuid'),
        R.dissoc('rowColours')
    )(props);

    // need to inject options to be picked up by select editor
    let newChildren = props.children;

    if(R.has('selectOptions')(thisColumn)) {

        const newChildrenProps = R.pipe(
            R.assoc('options', thisColumn.selectOptions),
            R.assoc('uuid', props.uuid)
        )(props.children.props);

        newChildren = R.assoc('props', newChildrenProps, props.children);

    } else if(R.has('autocompleteOptions')(thisColumn)) {

        const newChildrenProps = R.pipe(
            R.assoc('options', thisColumn.autocompleteOptions),
            R.assoc('uuid', props.uuid)
        )(props.children.props);

        newChildren = R.assoc('props', newChildrenProps, props.children);

    }

    const cellKey = R.join('_', ['dsCell', props.id, props.row, props.col]);

    return (
        <td key={cellKey} {...attributes}>
            {newChildren}
        </td>
    )

};


const updateAutocompleteOptionsFromData = (data, column) => {

    if (R.propEq('dataKeysAsAutocompleteOptions', true)(column)) {
        column.autocompleteOptions = Array.from(data.keys())
    }

    return column;

};


const updateColumnsFromData = (columns : Columns, data : StringMap) : Columns => {
    return R.map(R.curry(updateAutocompleteOptionsFromData)(data), columns);
};


// React component ----

export default class Body extends React.Component<BodyProps, BodyState> {
    totalWidth: number;
    rds: ?Object;
    latestChanges: ?Changes;
    undoStack: Array<Grid>;
    redoStack: Array<Grid>;


    constructor (props : BodyProps) {

        super(props);

        const columns = updateColumnsFromData(props.columns, props.data);

        const initialGrid = R.pipe(
            R.curry(fillSF2Grid)(columns),
            R.curry(addDataEditors)(columns)
        )(props.initialBodyGrid);

        this.totalWidth = R.sum(props.columns.map(R.prop('width')));

        this.rds = null;
        this.latestChanges = null;

        this.undoStack = [initialGrid];
        this.redoStack = [];

        this.state = {
            grid: initialGrid,
            columns: columns
        };

    };


    static getDerivedStateFromProps(nextProps : Object, prevState : Object) : ?Object {

        const newColumns = updateColumnsFromData(nextProps.columns, nextProps.data);

        const columnsUpdated = !R.equals(prevState.columns, newColumns);

        if (columnsUpdated) {
            return {
                grid: prevState.grid,
                columns: newColumns
            }
        } else {
            return null;
        }

    };


    componentDidUpdate () {

        const newGrid = updateCalculatedCells(this.state.grid, this.props.columns, this.props.data, this.latestChanges, this.props.frozenGrid);

        this.props.onUpdateBodyGrid(newGrid);

        if(!R.equals(this.state.grid, newGrid)) {
            this.setState({'grid': newGrid});
        }

    }


    updateIndex = () => {
        //$FlowFixMe
        this.index = this.rds.state.start;
    };


    getIndex = () => {
        const start = this.rds.state.start;
        return {i: start.i, j: start.j};
    };


    handleKeyDown = (e: Object) => {

        const kc = e.nativeEvent.keyCode;

        this.updateIndex();

        // if the key press triggers movement pass the new index and direction of movement up to the parent
        if (kc === 37) {
            // 37 = left arrow
            this.props.onMove(this.index.j, MoveDirections.LEFT);
        } else if (kc === 9 || kc === 39) {
            // 9 = tab, 39 = right arrow
            this.props.onMove(this.index.j, MoveDirections.RIGHT);
        } else if (kc === 38) {
            // 38 = up arrow
            this.props.onMove(this.index.i, MoveDirections.UP);
        } else if (kc === 13 || kc === 40) {
            // 40 = down arrow, 13 = enter
            this.props.onMove(this.index.i, MoveDirections.DOWN);
        }

    };


    updateGrid = grid => {

        if(!R.equals(this.state.grid, grid)) {

            this.pushGridToUndoStack(grid);
            this.props.enableUndo();
            this.redoStack = [];
            this.props.disableRedo();

            this.setState({'grid': grid});
        }

    };


    handleCellsChanged = (changes : Changes) => {

        const grid = this.state.grid.map(row => [...row]);

        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
        });

        this.latestChanges = changes;

        this.updateGrid(grid);

    };


    valueRenderer = (cell : Object) => cell.value;


    fillRow = (rowIndex :  number, up : boolean) : void => {

        const comp = up ? R.gt : R.lt;

        if(!R.isNil(rowIndex)) {
            const rowToRepeat = this.state.grid[rowIndex];
            const newGrid = this.state.grid.map((row, ix) => comp(ix, rowIndex) ? row : rowToRepeat);
            this.updateGrid(newGrid);
        }

    };


    fillCell = (selectedCell :  CellCoordinates, up : boolean) : void => {

        const comp = up ? R.gt : R.lt;

        if(!R.isNil(selectedCell.i)&&!R.isNil(selectedCell.j)) {
            const cellToRepeat = this.state.grid[selectedCell.i][selectedCell.j];
            const cellLens = R.lensIndex(selectedCell.j);
            const newGrid = this.state.grid.map((row, ix) => comp(ix, selectedCell.i) ?
                row :
                R.set(cellLens, cellToRepeat, row)
            );
            this.updateGrid(newGrid);
        }

    };


    undo = () : void => {

        if(this.undoStack.length>1) {

            const currentGrid = this.undoStack.pop();
            this.pushGridToRedoStack(currentGrid);
            this.props.enableRedo();

            const prevGrid = R.last(this.undoStack);

            if(!R.equals(this.state.grid, prevGrid)) {
                this.setState({grid: prevGrid});
            }
        }

        if(this.undoStack.length<2) {
            this.props.disableUndo();
        }

    };


    redo = () : void => {

        if(this.redoStack.length>0) {
            const nextGrid = this.redoStack.pop();
            this.pushGridToUndoStack(nextGrid);
            this.props.enableUndo();
            if(!R.equals(this.state.grid, nextGrid)) {
                this.setState({grid: nextGrid});
            }
        }

        if(this.redoStack.length===0) {
            this.props.disableRedo();
        }

    };


    pushGridToStack = (redoStack : boolean, grid : Grid) : void => {

        const gridMatchesLastGridInStack = R.equals(
            grid,
            R.last(redoStack ? this.redoStack : this.undoStack)
        );

        if(!gridMatchesLastGridInStack && redoStack) {
            this.redoStack.push(grid);
        } else if (!gridMatchesLastGridInStack) {
            this.undoStack.push(grid);
        }

    };


    pushGridToUndoStack = R.curry(this.pushGridToStack)(false);


    pushGridToRedoStack = R.curry(this.pushGridToStack)(true);


    render () {

        return (
            <div
                style={{paddingBottom: this.props.bottomPadding, width: this.totalWidth}}
                onKeyDown={this.handleKeyDown}
            >
                <ReactDataSheet
                    ref={(rds) => { this.rds = rds }}
                    data={this.state.grid}
                    valueRenderer={this.valueRenderer}
                    sheetRenderer={props => <table key={R.join('_', ['dsTable', props.id])} className={props.className}><tbody>{props.children}</tbody></table>}
                    rowRenderer={props => <tr key={R.join('_', ['dsRow', props.id, props.row])} className={"cell"}>{props.children}</tr>}
                    cellRenderer={props => <CellRenderer id={this.props.id} columns={this.state.columns} data-uuid={this.props.uuid} rowColours={this.props.rowColours} uuid={this.props.uuid} {...props} />}
                    onCellsChanged={this.handleCellsChanged}
                    valueViewer={props => <span data-uuid={this.props.uuid} className='value-viewer'>{props.value}</span>}
                />
            </div>
        )

    }

}

