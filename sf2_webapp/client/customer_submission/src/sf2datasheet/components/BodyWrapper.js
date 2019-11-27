// @flow
import React from 'react';
import * as R from 'ramda';

import { Columns, Grid, IntervalID, StringMap } from '../types/flowTypes';

import { MoveDirections } from '../constants/enums';

import Body from './Body';

import type { CellCoordinates } from "../types/flowTypes";


// Flow type declarations ----

type BodyWrapperProps = {
    id: number,
    uuid: string,
    columns: Columns,
    frozenGrid: ?Grid,
    data?: StringMap,
    initialBodyGrid: Grid,
    onUpdateBodyGrid: Grid => void,
    setScrollbarPresent: boolean => void,
    bodyHeight: number,
    bodyWidth: number,
    onTick: (number, number) => void,
    bottomPadding: number,
    scrollOnClick: boolean,
    disableUndo: () => void,
    disableRedo: () => void,
    enableUndo: () => void,
    enableRedo: () => void,
    rowColours: ?Array<string>
};


// React component ----

export default class BodyWrapper extends React.Component<BodyWrapperProps> {
    wrapperDiv: Object;
    bodyTable: Object;
    interval: ?IntervalID;
    data: ?StringMap;
    bodyHeight: ?number;


    constructor (props : BodyWrapperProps) : void {
        super(props);

        this.wrapperDiv = React.createRef();
        this.bodyTable = React.createRef();
        this.interval = null;
        this.data = null;
        this.bodyHeight = null;

    };


    componentDidMount () : void {

        // pass the scroll position to the parent every 10ms
        this.interval = setInterval(() => this.props.onTick(
            this.wrapperDiv.current.scrollLeft,
            this.wrapperDiv.current.scrollTop,
            this.bodyTable.current.getIndex()
        ), 10);

        // tell the parent whether the scrollbar is present
        this.props.setScrollbarPresent(this.verticalScrollbarPresent());

    };


    componentWillUnmount () : void {
        // clean up the timer
        if(this.interval !== null) {
            clearInterval(this.interval);
        }
    };

    shouldComponentUpdate (nextProps : ?Object,  nextState : ?Object) {

        // only re-render because of a state change in a parent component if data or body height has been updated
        const dataMatches = R.equals(this.data, nextProps.data);
        const bodyHeightMatches = R.equals(this.bodyHeight, nextProps.bodyHeight);

        return !dataMatches || !bodyHeightMatches;

    };

    componentDidUpdate (prevProps : ?Object) {
        this.props.setScrollbarPresent(this.verticalScrollbarPresent());
        this.data = prevProps.data;
        this.bodyHeight = prevProps.bodyHeight;
    }


    handleClick = (e: Object) : void => {

        if(this.props.scrollOnClick) {

            const node = this.wrapperDiv.current;

            // set horizontal scroll position
            const windowCentreX = window.innerWidth / 2;
            node.scrollLeft = Math.max(0, node.scrollLeft + e.clientX - windowCentreX);

            // set vertical scroll position
            const verticalOffset = this.props.bodyHeight * 2;
            node.scrollTop = Math.max(0, node.scrollTop + e.clientY - verticalOffset);

        }

    };


    updateHorizontalScrollPositionBasedOnColumnIndex = (columnIndex: number, direction: MoveDirections) : void => {

        const node = this.wrapperDiv.current;

        const offset = direction === MoveDirections.LEFT ? -1 : 1;

        const offsetIndex = (
            (offset === -1 && columnIndex < 1) || (offset === 1 && columnIndex >= this.props.columns.length - 1)
        ) ? columnIndex : columnIndex + offset;

        const cumulativeWidth = R.pipe(R.take(offsetIndex), R.pluck('width'), R.sum)(this.props.columns);
        const thisColumn = this.props.columns[offsetIndex];
        const thisColumnWidth = thisColumn.width;

        node.scrollLeft = cumulativeWidth - (this.props.bodyWidth / 2) + (thisColumnWidth / 2);

    };


    updateVerticalScrollPositionBasedOnRowIndex = (rowIndex: number , direction: MoveDirections) : void => {

        if(this.verticalScrollbarPresent()) {

            const node = this.wrapperDiv.current;

            const rowHeight = 30;
            const correctionFactor = this.props.bodyHeight / 2;

            const offset = direction === MoveDirections.UP ? -1 : 1;
            node.scrollTop = Math.max(0, (rowIndex + offset) * rowHeight - correctionFactor);

        }

    };


    onMove = (index: number, direction: MoveDirections) : void => {

        if (direction === MoveDirections.LEFT || direction === MoveDirections.RIGHT) {
            this.updateHorizontalScrollPositionBasedOnColumnIndex(index, direction);
        } else if (direction === MoveDirections.UP || direction === MoveDirections.DOWN) {
            this.updateVerticalScrollPositionBasedOnRowIndex(index, direction);
        }

    };


    verticalScrollbarPresent = () : boolean => {
        const node = this.wrapperDiv.current;
        return node.scrollHeight > node.clientHeight;
    };


    fillRow = (rowIndex : number, up : boolean) : void => {
        const node = this.bodyTable.current;
        node.fillRow(rowIndex, up);
    };


    fillCell = (selectedCell : CellCoordinates, up : boolean) : void => {
        const node = this.bodyTable.current;
        node.fillCell(selectedCell, up);
    };


    undo = () : void => {
        const node = this.bodyTable.current;
        node.undo();
    };


    redo = () : void => {
        const node = this.bodyTable.current;
        node.redo();
    };


    render () {
        return (
            <div
                id='bodyWrapper'
                ref={this.wrapperDiv}
                style={{width: this.props.bodyWidth, maxHeight: this.props.bodyHeight + this.props.bottomPadding, border: "0px solid grey", overflow: "auto"}}
                onClick={this.handleClick}
            >
                <Body
                    ref={this.bodyTable}
                    id={this.props.id}
                    uuid={this.props.uuid}
                    columns={this.props.columns}
                    data={this.props.data}
                    initialBodyGrid={this.props.initialBodyGrid}
                    frozenGrid={this.props.frozenGrid}
                    onUpdateBodyGrid={this.props.onUpdateBodyGrid}
                    onMove={this.onMove}
                    bottomPadding={this.props.bottomPadding}
                    disableUndo={this.props.disableUndo}
                    disableRedo={this.props.disableRedo}
                    enableUndo={this.props.enableUndo}
                    enableRedo={this.props.enableRedo}
                    rowColours={this.props.rowColours}
                />
            </div>
        )
    }
}
