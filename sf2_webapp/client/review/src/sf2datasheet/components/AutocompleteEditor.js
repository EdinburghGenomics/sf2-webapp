// @flow
import React, {PureComponent} from 'react';
import Autocomplete from 'react-autocomplete'

import * as R from 'ramda';
import {ENTER_KEY, TAB_KEY} from '../constants/keys';


// Flow type declarations ----

type OptionValueType = string;


type EventType = {
    which: number,
    persist: () => void
};


type AutocompleteEditorProps = {
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


type AutocompleteEditorState = { e?: ?Object, value: string, selectedValue: string, lastPressedKey: number, selectionMade: boolean};


// React component ----

export default class AutocompleteEditor extends PureComponent<AutocompleteEditorProps, AutocompleteEditorState> {
    input: Autocomplete;


    constructor (props : AutocompleteEditorProps) {
        super(props);
        this.state = {
            value: '',
            selectedValue: '',
            lastPressedKey: -1,
            selectionMade: false
        };
        this.input = {focus: null, props: null};
    }


    commit = (value : string) => {

        const {onCommit, onRevert} = this.props;

        if (!value) {
            return onRevert()
        } else {
            const { e } = this.state;
            onCommit(value, e);
        }

    };


    handleSelect  = (value : string) => {

        // Logic to commit selected item via mouse click on menu option is handled here
        if(this.state.lastPressedKey !== ENTER_KEY && this.state.lastPressedKey !== TAB_KEY) {
            this.commit(value);
        } else {
            this.setState({
                selectedValue: value,
                selectionMade: true
            });
        }

    };

    getHighlightedItem = (value: string, options: Array<string>) : string => {
        const filteredOptions = R.filter(option => option.startsWith(value), options);
        return filteredOptions.length === 0 ? '' : filteredOptions[0];
    };


    handleKeyDown  = (e : EventType) : void =>  {

        this.setState({
            lastPressedKey: e.which
        });

    };

    componentDidMount() {

        if(this.input !== null && this.input !== undefined) {
            this.input.focus();
        }

    }

    // $FlowFixMe
    componentDidUpdate(prevProps, prevState) {

        // Logic to commit selected item via enter or tab key is handled here
        const highlightedItem = this.getHighlightedItem(this.state.value, this.props.options);

        if (
                (this.state.lastPressedKey === ENTER_KEY) ||
                (this.state.lastPressedKey === TAB_KEY && this.state.selectedValue === '' && highlightedItem === '')
        ) {
            this.commit(this.state.value);
        } else if (this.state.lastPressedKey === TAB_KEY && this.state.selectedValue !== '') {
            this.commit(this.state.selectedValue);
        }

    }


    render () {
        return (
            <span onKeyDown={this.handleKeyDown} style={{display: "flex", height: "100%"}}>
            <Autocomplete
                ref={el => this.input = el}
                items={this.props.options.map(val => {return {id: val, label: val}})}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={item => item.label}
                wrapperStyle={{ display: 'flex', width: "-webkit-fill-available" }}
                renderItem={(item, highlighted) =>
                    <div
                        key={item.id}
                        data-uuid={this.props.uuid}
                        style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                    >
                        {item.label}
                    </div>
                }
                renderInput={props => <input style={{ display: 'flex', width: "-webkit-fill-available" }} {...props} />}
                value={this.state.value}
                onChange={e => this.setState({ value: e.target.value })}
                onSelect={this.handleSelect}
                selectOnBlur={true}
                open={true}
                autoHighlight={true}
            /></span>
        )
    }
}
