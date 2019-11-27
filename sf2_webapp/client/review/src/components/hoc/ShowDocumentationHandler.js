// @flow
import * as React from 'react';

import DocumentationModal from "../general/DocumentationModal";


type SF2Props = { showDocumentation: () => void }


export const SF2DefaultProps = {
    showDocumentation: () => {}
};


export const withShowDocumentationHandler = (WrappedSF2 : React.ComponentType<SF2Props>) : React.ComponentType<SF2Props> => {


    type ShowDocumentationHandlerState = {
        documentationModalActive: boolean
    };


    class ShowDocumentationHandler extends React.Component<SF2Props, ShowDocumentationHandlerState> {
        static defaultProps = SF2DefaultProps;

        constructor(props) {
            super(props);
            this.state = {
                documentationModalActive: false
            };
        }


        showDocumentation = () : void => {
            this.setState({
                documentationModalActive: true
            });
        };


        hideModals = () => {
            this.setState({
                documentationModalActive: false
            });
        };


        onCancel = () => {
            this.setState({
                documentationModalActive: false
            });
        };


        render() {

            const {
                showDocumentation,
                ...passThroughProps
            } = this.props;

            return (
                <div>
                <DocumentationModal onCancel={this.hideModals} active={this.state.documentationModalActive}/>
                <WrappedSF2
                    showDocumentation={this.showDocumentation}
                    {...passThroughProps}
                />
                </div>
            );

        }
    }

    return ShowDocumentationHandler;

};
