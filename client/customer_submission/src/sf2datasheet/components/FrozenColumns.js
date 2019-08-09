// @flow
import React from 'react';
import type { Columns } from '../types/flowTypes';


// Flow type declarations ----

type FrozenColumnsProps = {
    frozenColumns: Columns,
    frozenRowsWidth: number,
};


// React component ----

const FrozenColumns = (props: FrozenColumnsProps)  => {
    return (
        <div
            style={{
                border: "0px solid gray",
                width: props.frozenRowsWidth,
                overflow: "hidden",
            }}
        >
            <span tabIndex="0" className="data-grid-container">
                <table className="data-grid">
                    <tbody>
                        <tr>
                            {props.frozenColumns.map((column, columnIndex) => {
                                return (
                                    <th className="cell read-only" key={'FrozenColumn' + columnIndex}>
                                        <div style={{ width: column.width, height: "50px" }}>{column.value}</div>
                                    </th>
                                );
                            })}
                        </tr >
                    </tbody>
                </table>
            </span>
        </div>
    )
};


export default FrozenColumns;
