// @flow
import React from 'react';
import * as R from 'ramda';

import { ResizableBox } from 'react-resizable';
import './react-resizable.css';

import BodyWrapper from './BodyWrapper';
import BodyHeader from './BodyHeader';
import FrozenRows from './FrozenRows';
import FrozenColumns from './FrozenColumns';
import ControlPanel from "./ControlPanel";

import type { Grid, Columns, StringMap, CellCoordinates } from '../types/flowTypes';
import UndoRedoPanel from "./UndoRedoPanel";


// Flow type declarations ----

type SF2DataSheetProps = {
    id?: number,
    columns: Columns,
    data?: StringMap,
    initialBodyGrid: Grid,
    onUpdateBodyGrid: Grid => void,
    bodyHeight: number,
    frozenColumns: Columns,
    frozenGrid: Grid,
    width: string,
    showHiddenColumns: boolean,
    bottomPadding?: number,
    scrollOnClick?: boolean,
    uuid?: string,
    showFillUp?: boolean,
    rowColours?: ?Array<string>
};


type SF2DataSheetState = {
    bodyWidth: number,
    bodyHeight: number,
    scrollbarIsPresent: boolean,
    controlPanelDisabled: boolean,
    undoEnabled: boolean,
    redoEnabled: boolean
};


// React component ----

export default class SF2DataSheet extends React.Component<SF2DataSheetProps, SF2DataSheetState> {
    id: number;
    uuid: string;
    frozenRowsWidth: number;
    totalBodyHeight: number;
    columns: Columns;
    totalWidth: number;
    bottomPadding: number;
    scrollOnClick: boolean;
    lastSelectedCell: CellCoordinates;

    wrapperDiv: Object;
    bodyWrapper: Object;
    bodyHeaderRef: Object;
    frozenRowsRef: Object;


    constructor(props: SF2DataSheetProps) {

        super(props);

        this.id = this.props.id === undefined ? 0 : this.props.id;

        this.bottomPadding = this.props.bottomPadding === undefined ? 0 : this.props.bottomPadding;
        this.scrollOnClick = this.props.scrollOnClick === undefined ? false : this.props.scrollOnClick;

        this.initialiseColumns();
        this.initialiseRefs();
        this.initialiseDimensions();

        if(this.props.uuid === undefined) {
            this.uuid = Math.floor(Math.random() * 10000).toString() + Date.now().toString();
        } else {
            this.uuid = this.props.uuid;
        }

        this.state = {
            bodyWidth: this.getBodyWidth(),
            bodyHeight: 50,
            scrollbarIsPresent: false,
            controlPanelDisabled: true,
            undoEnabled: false,
            redoEnabled: false
        };

        this.lastSelectedCell = {i: null, j: null};

    };


    initialiseRefs = () : void => {

        this.wrapperDiv = React.createRef();
        this.bodyHeaderRef = React.createRef();
        this.frozenRowsRef = React.createRef();
        this.bodyWrapper = React.createRef();

    };


    initialiseColumns = () : void => {

        const noHiddenColumns = R.compose(R.not, R.propOr(false, 'hidden'));
        this.columns = this.props.showHiddenColumns ?
            this.props.columns :
            R.filter(noHiddenColumns, this.props.columns);

    };


    initialiseDimensions = () : void => {

        const heightOfOneRow = 30;
        const numberOfRows = this.props.initialBodyGrid.length;
        this.frozenRowsWidth = R.sum(this.props.frozenColumns.map(R.prop('width')));
        this.totalBodyHeight = numberOfRows * heightOfOneRow + 17;
        this.totalWidth = window.innerWidth - 20;

    };


    updateScrollPosition = (scrollX: number, scrollY: number) => {

        this.bodyHeaderRef.current.scrollLeft = scrollX;
        this.frozenRowsRef.current.scrollTop = scrollY;

    };


    getBodyHeaderWidth = () => {

        const scrollbarCorrectionFactor = this.state.scrollbarIsPresent ? 17 : 0;
        return (this.state.bodyWidth - scrollbarCorrectionFactor);

    };


    getMaxHeight = () => {
        return (this.state.bodyHeight + this.bottomPadding - 15);
    };


    pageClick = e => {

        const targetUUID = e.target.getAttribute('data-uuid');
        const targetHasCorrectUUID = targetUUID === this.uuid;
        const targetIsSelectOption = e.target.nodeName === 'DIV' && e.target.getAttribute('role') === 'option';

        if (targetHasCorrectUUID) {
            this.updateBodyFocus(true);
        } else if(!targetIsSelectOption) {
            this.updateBodyFocus(false);
        }

    };


    componentDidMount() {

        this.updateBodyWidthBasedOnWindowSize();

        window.addEventListener("resize", this.updateBodyWidthBasedOnWindowSize.bind(this));
        document.addEventListener("mousedown", this.pageClick.bind(this));

    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateBodyWidthBasedOnWindowSize.bind(this));
        document.removeEventListener("mousedown", this.pageClick.bind(this));
    }


    getBodyWidth = () => {
        return (this.totalWidth - this.frozenRowsWidth - 32);
    };


    updateBodyWidthBasedOnWindowSize = () => {
        const newBodyWidth = this.getBodyWidth();
        this.setState({bodyWidth: newBodyWidth});
    };


    setScrollbarPresent = (scrollbarIsPresent: boolean) => {
        if (this.state.scrollbarIsPresent !== scrollbarIsPresent) {
            this.setState({"scrollbarIsPresent": scrollbarIsPresent})
        }
    };


    onResize = (e: Object, data: Object): void => {

        const height = this.wrapperDiv.current.offsetHeight - this.bottomPadding - 42;

        if(!R.equals(height, this.state.bodyHeight)) {
            this.setState({"bodyHeight": height});
        }
    };


    fillRow = (up : boolean) => {

        const node = this.bodyWrapper.current;

        if(!R.isNil(this.lastSelectedCell.i)) {
            node.fillRow(this.lastSelectedCell.i, up);
        } else if (this.lastSelectedCell.i === null && up) {
            node.fillRow(this.props.initialBodyGrid.length-1, true)
        } else if (this.lastSelectedCell.i === null && !up) {
            node.fillRow(0, false);
        }

        if(!this.state.controlPanelDisabled) {this.setState({controlPanelDisabled: true})}

    };


    fillCell = (up : boolean) => {

        const node = this.bodyWrapper.current;

        if (!R.isNil(this.lastSelectedCell.i) && !R.isNil(this.lastSelectedCell.j)) {
            node.fillCell(this.lastSelectedCell, up);
        }

        if(!this.state.controlPanelDisabled) {
            this.setState({controlPanelDisabled: true});
        }

    };


    onTick = (scrollX: number, scrollY: number, selectedCell: ?Object) => {

        this.updateScrollPosition(scrollX, scrollY);

        if(!R.isNil(selectedCell.i)&&!R.isNil(selectedCell.j)) {
            this.lastSelectedCell = selectedCell;
        }

    };


    updateBodyFocus = (bodyHasFocus) => {

        if(bodyHasFocus && this.state.controlPanelDisabled) {
            this.setState({controlPanelDisabled: false});
        } else if(!bodyHasFocus && !this.state.controlPanelDisabled) {
            this.setState({controlPanelDisabled: true});
        }

    };


    handleUndo = () => this.bodyWrapper.current.undo();


    handleRedo = () => this.bodyWrapper.current.redo();


    render() {
        return (
            <div ref={this.wrapperDiv}
                 style={
                     {
                         'height': 'auto',
                         'overflow': 'hidden',
                         'width': this.totalWidth - 15
                     }
                 }
            >
                <span>
                    <UndoRedoPanel
                        uuid={'undoRedo'}
                        onUndo={this.handleUndo}
                        onRedo={this.handleRedo}
                        undoEnabled={this.state.undoEnabled}
                        redoEnabled={this.state.redoEnabled}
                    />
                    <ControlPanel
                        uuid={this.uuid}
                        onFillRow={this.fillRow}
                        onFillCell={this.fillCell}
                        disabled={this.state.controlPanelDisabled}
                        showFillUp={this.props.showFillUp}
                    />
                </span>
                <ResizableBox
                    className="box"
                    width={this.state.bodyWidth + this.frozenRowsWidth + 17}
                    height={this.state.bodyHeight + this.bottomPadding + 60}
                    minConstraints={[0, 80 + this.bottomPadding]}
                    maxConstraints={[0, this.totalBodyHeight + this.bottomPadding + 42]}
                    axis="y"
                    onResize={this.onResize}
                >
                    <table style={{border: '0px solid grey'}}>
                        <tbody>
                        <tr>
                            <td style={{verticalAlign: "top"}}>
                                <div style={{border: "0px solid grey"}}>
                                    <FrozenColumns
                                        frozenColumns={this.props.frozenColumns}
                                        frozenRowsWidth={this.frozenRowsWidth}
                                    />
                                </div>
                            </td>
                            <td style={{verticalAlign: "top"}}>
                                <div style={{border: "0px solid grey"}}>
                                    <BodyHeader
                                        ref={this.bodyHeaderRef}
                                        columns={this.columns}
                                        bodyHeaderWidth={this.getBodyHeaderWidth()}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{verticalAlign: "top"}}>
                                <div style={{border: "0px solid grey"}}>
                                    <FrozenRows
                                        ref={this.frozenRowsRef}
                                        frozenColumns={this.props.frozenColumns}
                                        frozenGrid={this.props.frozenGrid}
                                        frozenRowsWidth={this.frozenRowsWidth}
                                        maxHeight={this.getMaxHeight()}
                                        bottomPadding={this.bottomPadding}
                                    />
                                </div>
                            </td>
                            <td style={{verticalAlign: "top"}}>
                                <div style={{border: "0px solid grey"}}>
                                    <BodyWrapper
                                        ref={this.bodyWrapper}
                                        id={this.id}
                                        uuid={this.uuid}
                                        columns={this.columns}
                                        data={this.props.data}
                                        initialBodyGrid={this.props.initialBodyGrid}
                                        onUpdateBodyGrid={this.props.onUpdateBodyGrid}
                                        frozenGrid={this.props.frozenGrid}
                                        setScrollbarPresent={this.setScrollbarPresent}
                                        bodyHeight={this.state.bodyHeight}
                                        onTick={this.onTick}
                                        bodyWidth={this.state.bodyWidth}
                                        bottomPadding={this.bottomPadding}
                                        scrollOnClick={this.scrollOnClick}
                                        updateBodyFocus={this.updateBodyFocus}
                                        disableUndo={()=>this.setState({undoEnabled: false})}
                                        disableRedo={()=>this.setState({redoEnabled: false})}
                                        enableUndo={()=>this.setState({undoEnabled: true})}
                                        enableRedo={()=>this.setState({redoEnabled: true})}
                                        rowColours={this.props.rowColours}
                                    />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </ResizableBox>
            </div>
        )
    }
}