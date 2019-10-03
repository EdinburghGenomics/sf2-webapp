// @flow
import React from 'react';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import { generatePlateID } from "../../functions/lib";


type TabContainerProps = {
    tabNames: Array<string>,
    tabHasErrors: Map<string, boolean>,
    getChildComponent: string => Object
};


type TabContainerState = {
    activeTab: string
};


export default class TabContainer extends React.Component<TabContainerProps, TabContainerState> {


    constructor (props : Object) {
        super(props);

        this.state = {
            activeTab: this.props.tabNames[0]
        };

    };


    setActiveTab = (tabName : string) : void => {
        if (this.state.activeTab !== tabName) {
            this.setState({
                activeTab: tabName
            });
        }
    };


    createNavItem = (tabName: string): Object => {

        const key = "navItem" + tabName;
        const textColour = this.props.tabHasErrors.get(tabName) ? 'red' : 'green';

        const tick = '\u2713';
        const cross = '\u2717';
        const textPrefix = this.props.tabHasErrors.get(tabName) ? cross : tick;
        const fullTabName = textPrefix + ' ' + tabName;

        return (
            <NavItem key={key}>
                <NavLink
                    className={this.state.activeTab === tabName ? 'active' : ''}
                    onClick={() => {
                        this.setActiveTab(tabName);
                    }}
                >
                    <span style={{color: textColour}}>{fullTabName}</span>
                </NavLink>
            </NavItem>
        );

    };


    createTabPane = (tabName: string): Object => {

        if (this.props.tabNames === undefined) {
            return (<div key={tabName}>Error: no tabs to display</div>)
        } else {
            return (
                <TabPane tabId={tabName} key={tabName}>
                    <Row>
                        <Col sm="12">
                            {this.props.getChildComponent(tabName)}
                        </Col>
                    </Row>
                </TabPane>
            );
        }

    };


    createTabContainer = () => {

        if (this.props.tabNames === undefined) {

            return (<div>Error: no tabs to display</div>);

        } else if (this.props.tabNames.length === 1) {

            // don't display tabs if there is only one thing to display
            const firstTabName = this.props.tabNames[0];
            return (this.props.getChildComponent(firstTabName));

        } else {

            return (
                <div>
                    <Nav tabs>
                        {
                            this.props.tabNames.map((tabName, tabIndex) => this.createNavItem(tabName, tabIndex))
                        }
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        {
                            this.props.tabNames.map((tabName, tabIndex) => this.createTabPane(tabName, tabIndex))
                        }
                    </TabContent>
                </div>
            );

        }

    };


    render() {
        return (this.createTabContainer());
    };
}
