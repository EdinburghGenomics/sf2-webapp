// @flow
import React from 'react';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';


type TabContainerProps = {
    tabNames: Array<string>,
    tabHasErrors: Map<number, boolean>,
    getChildComponent: string => Object
};


type TabContainerState = {
    activeTab: number
};


export default class TabContainer extends React.Component<TabContainerProps, TabContainerState> {


    constructor (props : Object) {
        super(props);

        this.state = {
            activeTab: 0
        };

    };


    setActiveTab = (tabIndex : number) : void => {
        if (this.state.activeTab !== tabIndex) {
            this.setState({
                activeTab: tabIndex
            });
        }
    };


    createNavItem = (tabName: string, tabIndex: number): Object => {

        const key = "navItem" + tabIndex.toString();
        const textColour = this.props.tabHasErrors.get(tabIndex) ? 'red' : 'green';

        const tick = '\u2713';
        const cross = '\u2717';
        const textPrefix = this.props.tabHasErrors.get(tabIndex) ? cross : tick;
        const fullTabName = textPrefix + ' ' + tabName;

        return (
            <NavItem key={key}>
                <NavLink
                    className={this.state.activeTab === tabIndex ? 'active' : ''}
                    onClick={() => {
                        this.setActiveTab(tabIndex);
                    }}
                >
                    <span style={{color: textColour}}>{fullTabName}</span>
                </NavLink>
            </NavItem>
        );

    };


    createTabPane = (tabName: string, tabIndex: number): Object => {

        if (this.props.tabNames === undefined) {
            return (<div key={tabName}>Error: no tabs to display</div>)
        } else {
            return (
                <TabPane tabId={tabIndex} key={tabName}>
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
