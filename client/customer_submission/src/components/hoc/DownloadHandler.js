// @flow
import * as React from 'react';

import type { SF2Data } from '../../types/flowTypes';


type SF2Props = {
    handleDownload: SF2Data => void
}


export const SF2DefaultProps = {
    handleDownload: () => {}
};


export const withDownloadHandler = (WrappedSF2 : React.ComponentType<SF2Props>) : React.ComponentType<SF2Props> => {


    type DownloadHandlerState = {
        tables: SF2Data
    };


    class DownloadHandler extends React.Component<SF2Props, DownloadHandlerState> {
        static defaultProps = SF2DefaultProps;

        constructor(props) {
            super(props);
            this.state = {
                tables: []
            };
        }


        handleDownload = (tables : SF2Data) : void => {
            alert('downloading csv');
        };


        render() {

            const {
                handleDownload,
                ...passThroughProps
            } = this.props;

            return (
                <WrappedSF2
                    handleDownload={this.handleDownload}
                    {...passThroughProps}
                />
            );

        }
    }

    return DownloadHandler;

};
