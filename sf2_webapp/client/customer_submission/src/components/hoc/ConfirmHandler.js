// @flow
import * as React from 'react';
import * as R from 'ramda';

import type { SF2Data } from '../../types/flowTypes';
import ConfirmModal from "../general/ConfirmModal";
import WarningModal from "../general/WarningModal";


type SF2Props = {
    handleSubmission: SF2Data => void
}


export const SF2DefaultProps = {
    handleSubmission: () => {}
};


export const withConfirmHandler = (WrappedSF2 : React.ComponentType<SF2Props>) : React.ComponentType<SF2Props> => {


    type ConfirmHandlerState = {
        confirmActive: boolean,
        warningActive: boolean,
        tables: SF2Data,
        warnings: Array<any>
    };


    class ConfirmHandler extends React.Component<SF2Props, ConfirmHandlerState> {
        static defaultProps = SF2DefaultProps;

        constructor(props) {
            super(props);
            this.state = {
                confirmActive: false,
                warningActive: false,
                tables: [],
                warnings: []
            };
        }


        handleSubmission = (tables : SF2Data, warnings: Array<any>) : void => {

            if(R.isNil(warnings) || warnings.length === 0) {
                this.setState({
                    tables: tables,
                    warnings: warnings,
                    warningActive: false,
                    confirmActive: true
                });
            } else {
                this.setState({
                    tables: tables,
                    warnings: warnings,
                    warningActive: true,
                    confirmActive: false
                });

            }


        };


        hideModals = () => {
            this.setState({
                confirmActive: false,
                warningActive: false
            });
        };


        onConfirm = () => {
            this.hideModals();
            document.getElementById("submittedAt").textContent = "Submitting...";
            this.props.handleSubmission(this.state.tables);
        };


        onCancel = () => {
            this.setState({
                confirmActive: false,
                warningActive: false
            });
        };


        render() {

            const {
                handleSubmission,
                ...passThroughProps
            } = this.props;

            return (
                <div>
                <WarningModal onConfirm={this.onConfirm} onCancel={this.hideModals} warnings={this.state.warnings} active={this.state.warningActive}/>
                <ConfirmModal onConfirm={this.onConfirm} onCancel={this.hideModals} active={this.state.confirmActive}/>
                <WrappedSF2
                    handleSubmission={this.handleSubmission}
                    {...passThroughProps}
                />
                </div>
            );

        }
    }

    return ConfirmHandler;

};
