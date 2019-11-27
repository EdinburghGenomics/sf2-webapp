// @flow
import React from 'react';
import * as R from 'ramda';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';


type TabContainerProps = {
    tabNames: Array<string>,
    getChildComponent: (string, (string, boolean) => void) => Object,
    updateSomeTabHasErrors: boolean => void
};


type TabContainerState = {
    activeTab: string
};


export default class TabContainer extends React.Component<TabContainerProps, TabContainerState> {
    tabErrors: Object;


    constructor (props : Object) {
        super(props);

        const initialTabErrors = R.fromPairs(this.props.tabNames.map(x => [x, true]));

        this.state = {
            activeTab: this.props.tabNames[0],
            tabErrors: initialTabErrors
        };

        // why do we have both this.state.tabErrors and this.tabErrors?
        // we need to update this.state.tabErrors to tell the react component to update the UI
        // we also need this.tabErrors to handle the case where updateHasErrors is called twice
        // in quick succession (i.e. during initialisation) and the second call comes while the
        // state update triggered by the first call is still in progress, leading to an inaccurate
        // value in this.state.tabErrors
        this.tabErrors = initialTabErrors;

    };


    updateHasErrors = (id : string, hasErrors : boolean) : void => {

        this.tabErrors = R.assoc(id, hasErrors, this.tabErrors);

        const updateSomeTabHasErrors = () => {
            this.props.updateSomeTabHasErrors(
                R.any(R.identity, R.values(this.tabErrors))
            );
        };

        this.setState({tabErrors: this.tabErrors}, updateSomeTabHasErrors);

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
        const textColour = this.tabErrors[tabName] ? 'red' : 'green';

        const tick = '\u2713';
        const cross = '\u2717';
        const textPrefix = this.tabErrors[tabName] ? cross : tick;
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
                            {this.props.getChildComponent(tabName, this.updateHasErrors)}
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
            return (this.props.getChildComponent(firstTabName, this.updateHasErrors));

        } else {

            const tabPanes = this.props.tabNames.map((tabName) => this.createTabPane(tabName));
            const navItems = this.props.tabNames.map((tabName) => this.createNavItem(tabName));

            return (
                <div>
                    <Nav tabs>{navItems}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        {tabPanes}
                    </TabContent>
                </div>
            );

        }

    };


    render() {
        return (this.createTabContainer());
    };
}
