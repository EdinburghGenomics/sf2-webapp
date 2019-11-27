// @flow
import React from 'react';


// Flow type declarations ----

type ControlPanelProps = {
    uuid: string,
    onFillRow: (up: boolean) => void,
    onFillCell: (up: boolean) => void,
    disabled: boolean,
    showFillUp: boolean
};


// React component ----

const ControlPanel = (props : ControlPanelProps) => {


    const handleFillDownRowClick = e => {
        e.preventDefault();
        props.onFillRow(false);
    };


    const handleFillDownCellClick = e => {
        e.preventDefault();
        props.onFillCell(false);
    };


    const handleFillUpRowClick = e => {
        e.preventDefault();
        props.onFillRow(true);
    };


    const handleFillUpCellClick = e => {
        e.preventDefault();
        props.onFillCell(true);
    };


    return (
        <div>
            <button disabled={props.disabled} data-uuid={props.uuid} onClick={handleFillDownRowClick}>Fill down row</button>
            <button disabled={props.disabled} data-uuid={props.uuid} onClick={handleFillDownCellClick}>Fill down cell</button>
            {props.showFillUp && <button disabled={props.disabled} data-uuid={props.uuid} onClick={handleFillUpRowClick}>Fill up row</button>}
            {props.showFillUp && <button disabled={props.disabled} data-uuid={props.uuid} onClick={handleFillUpCellClick}>Fill up cell</button>}
        </div>
    );

};


//$FlowFixMe
export default ControlPanel;
