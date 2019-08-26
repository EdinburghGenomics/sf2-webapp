// @flow
import React, {PureComponent} from 'react';
import Select from 'react-select'

import {ENTER_KEY, TAB_KEY} from '../constants/keys';


// Flow type declarations ----

type OptionType = {
    label: string,
    value: string
};


type OptionValueType = string;


type EventType = {
    which: number,
    persist: () => void
};


type SelectEditorProps = {
    cell: Object,
    row: number,
    col: number,
    value: OptionValueType,
    onChange: () => void,
    onCommit: (OptionValueType, ?Object) => void,
    onRevert: () => void,
    onKeyDown: () => void,
    options: Array<string>,
    uuid: string
}


type SelectEditorState = { e?: ?Object};


// React component ----


export default class SelectEditor extends PureComponent<SelectEditorProps, SelectEditorState> {
    constructor (props : SelectEditorProps) {
        super(props);
        this.state = {};
    }

    handleChange  = (opt : OptionType) => {
        const {onCommit, onRevert} = this.props;
        if (!opt) {
            return onRevert()
        } else {
            const { e } = this.state;
            onCommit(opt.value, e);
        }
    };

    handleKeyDown  = (e : EventType) =>  {
        if (e.which === ENTER_KEY || e.which === TAB_KEY) {
            e.persist();
            this.setState({ e });
        } else {
            this.setState({ e: null })
        }
    };

    render () {
        return (
            <Select
                autoFocus
                openOnFocus
                closeOnSelect
                menuIsOpen={true}
                openMenuOnFocus={true}
                maxMenuHeight={120}
                value={{label: this.props.value, value: this.props.value}}
                onChange={this.handleChange}
                onInputKeyDown={this.handleKeyDown}
                options={this.props.options.map(val => {return {label: val, value: val}})}
            />
        )
    }
}
