// @flow
import React from 'react';


// Flow type declarations ----

type UndoRedoPanelProps = {
    uuid: string,
    onUndo: () => void,
    onRedo: () => void,
    undoEnabled: boolean,
    redoEnabled: boolean
};


// React component ----

const UndoRedoPanel = (props : UndoRedoPanelProps) => {


    const handleUndoClick = e => {
        e.preventDefault();
        props.onUndo();
    };


    const handleRedoClick = e => {
        e.preventDefault();
        props.onRedo();
    };

    return (
        <div>
            <button disabled={!props.undoEnabled} data-uuid={props.uuid} onClick={handleUndoClick}>Undo</button>
            <button disabled={!props.redoEnabled} data-uuid={props.uuid} onClick={handleRedoClick}>Redo</button>
        </div>
    );

};


//$FlowFixMe
export default UndoRedoPanel;
