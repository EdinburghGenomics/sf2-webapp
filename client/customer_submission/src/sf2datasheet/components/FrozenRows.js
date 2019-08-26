// @flow
import React from 'react';
import type { Grid, Columns } from '../types/flowTypes';


// Flow type declarations ----

type FrozenRowsProps = {
    frozenColumns: Columns,
    frozenGrid: Grid,
    frozenRowsWidth: number,
    maxHeight: ?number,
    bottomPadding: number
};


// React component ----

const FrozenRows = (props : FrozenRowsProps, ref : Object) => {

    return (
        <div
            ref={ref}
            style={{
                border: "0px solid gray",
                maxHeight: props.maxHeight,
                width: props.frozenRowsWidth,
                overflow: "hidden",
            }}
        >
            <div style={{paddingBottom: 16 + props.bottomPadding}}>
                <span tabIndex="0" className="data-grid-container">
                    <table className="data-grid">
                        <tbody>
                        {props.frozenGrid.map((row, rowIndex) => {
                            return (
                                <tr className="cell read-only row-handle" key={'FrozenRow' + rowIndex}>
                                    {props.frozenColumns.map((column, columnIndex) => {
                                        return (
                                            <td key={columnIndex}>
                                                <span>
                                                    <span className="value-viewer"
                                                          style={{width: props.frozenColumns[columnIndex].width}}>
                                                        {row[columnIndex].value}
                                                    </span>
                                                </span>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </span>
            </div>
        </div>
    );
};


//$FlowFixMe
export default React.forwardRef(FrozenRows);
