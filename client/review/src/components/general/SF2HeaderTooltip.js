// @flow
import React from 'react';
import { Tooltip } from 'reactstrap';

type SF2HeaderTooltipState = {
    tooltipOpen: boolean
}


type SF2HeaderTooltipProps = {
    headerTooltipID: string,
    headerText: string,
    tooltipText: string,
    superscriptText: ?string,
    required: ?boolean
};


export default class SF2HeaderTooltip extends React.Component<SF2HeaderTooltipProps, SF2HeaderTooltipState> {
    state = {tooltipOpen: false};

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    };

    render() {
        // alert(JSON.stringify(this.props));
        return(
            <div>
                {/*<div id="TooltipExample">testing</div>*/}
                <div>{this.props.headerText}<sup>{this.props.superscriptText}</sup> {this.props.required === true && "* "}<span id={this.props.headerTooltipID} style={{fontSize: "x-small"}}><sup>{String.fromCharCode(9432)}</sup></span></div>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={this.props.headerTooltipID} toggle={this.toggle}>
                    {this.props.tooltipText}
                </Tooltip>
            </div>
        );
    };

};
