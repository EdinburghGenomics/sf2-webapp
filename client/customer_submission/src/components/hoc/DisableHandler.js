// @flow
import * as React from 'react';
import * as R from 'ramda';

import type { Tables } from '../../types/flowTypes';


type SF2Props = {
    shouldDisableSubmit?: boolean,
    shouldDisableSave?: boolean,
    updateShouldDisableSubmit?: (string, boolean) => void,
    updateShouldDisableSave?: (string, boolean) => void
}


export const SF2DefaultProps = {
    shouldDisableSubmit: true,
    shouldDisableSave: true,
    updateShouldDisableSubmit: () => {},
    updateShouldDisableSave: () => {}
};


export const withDisableHandler = (WrappedSF2 : React.ComponentType<SF2Props>) : React.ComponentType<SF2Props> => {


    type DisableHandlerState = {
        shouldDisableSave: boolean,
        shouldDisableSubmitForTable: Object
    };


    class DisableHandler extends React.Component<SF2Props, DisableHandlerState> {
        static defaultProps = SF2DefaultProps;

        lastSavedTables = [];

        constructor(props) {
            super(props);
            this.state = {
                shouldDisableSave: true,
                shouldDisableSubmitForTable: {}
            };
        }


        getShouldDisableSubmit = () : boolean => {
            return R.pipe(
                R.values,
                R.any(R.identity)
            )(this.state.shouldDisableSubmitForTable);
        };


        disableSaveButton = (newTables : Tables) : void => {
            console.log('disable save button');
            if (this.state.shouldDisableSave === false) {
                this.setState({shouldDisableSave: true}, () => {
                    console.log('disabling save button');
                });
            }
            this.lastSavedTables = R.clone(newTables);
        };


        updateSaveDisabled = (newTables : Tables) : void => {
            if (!R.equals(this.lastSavedTables, newTables) && this.state.shouldDisableSave === true){
                this.setState({shouldDisableSave: false});
            } else if (R.equals(this.lastSavedTables, newTables) && this.state.shouldDisableSave === false) {
                this.setState({shouldDisableSave: true});
            }
        };


        updateShouldDisableSubmit = (tableName : string, shouldDisableSubmit : boolean) : void => {
            const newDisableSubmitForTable = R.assoc(tableName, shouldDisableSubmit, this.state.shouldDisableSubmitForTable);
            if(!R.equals(newDisableSubmitForTable, this.state.shouldDisableSubmitForTable)) {
                this.setState({shouldDisableSubmitForTable: newDisableSubmitForTable});
            }
        };


        render() {

            const {
                shouldDisableSave,
                shouldDisableSubmit,
                updateShouldDisableSave,
                updateShouldDisableSubmit,
                ...passThroughProps
            } = this.props;

            return (
                <WrappedSF2
                    shouldDisableSave={this.state.shouldDisableSave}
                    shouldDisableSubmit={this.getShouldDisableSubmit()}
                    disableSaveButton={this.disableSaveButton}
                    updateSaveDisabled={this.updateSaveDisabled}
                    updateShouldDisableSubmit={this.updateShouldDisableSubmit}
                    {...passThroughProps}
                />
            );

        }
    }

    return DisableHandler;

};
