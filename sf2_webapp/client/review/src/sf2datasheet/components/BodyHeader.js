// @flow
import React from 'react';
import * as R from 'ramda';

import { Columns } from '../types/flowTypes';
import { UncontrolledTooltip } from 'reactstrap';

// Flow type declarations ----

type BodyHeaderProps = {
    columns: Columns,
    bodyHeaderWidth: number
};


// React component ----

const BodyHeader = (props : BodyHeaderProps, ref : Object) => {

    return (
        <div ref={ref}
             style={{
                 border: "0px solid gray",
                 width: props.bodyHeaderWidth,
                 overflow: "hidden"
             }}>
                <span tabIndex = "0" className = "data-grid-container" >
                    <table className = "data-grid">
                        <thead>
                            <tr>
                                {props.columns.map((column, columnIndex) => {
                                    const colKey = 'BodyHeader' + columnIndex;
                                    const columnHasTooltip = R.has('header', column) &&
                                                             R.has('tooltipText', column.header) &&
                                                             !R.isNil(column.header.tooltipText) &&
                                                             !R.isEmpty(column.header.tooltipText);
                                    return (
                                        <th className="cell read-only" key={colKey}>
                                            {columnHasTooltip && <UncontrolledTooltip placement="top" target={colKey+'_id'}>
                                                {column.header.tooltipText}
                                            </UncontrolledTooltip>}
                                            <div id={colKey+'_id'} style={{ width: column.width - 1, height: "50px" }}>{column.value}</div>
                                        </th>
                                    );
                                })}
                            </tr >
                        </thead>
                    </table >
                </span>
        </div>
    )

};


//$FlowFixMe
export default React.forwardRef(BodyHeader);