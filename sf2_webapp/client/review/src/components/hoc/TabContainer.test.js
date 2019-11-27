import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import TabContainer from './TabContainer';


it('renders the TabContainer correctly with required arguments', () => {

    const getChildComponent = (tabName, updateHasErrors) => <div>test</div>;

    const wrapper = mount(
        <TabContainer
            tabNames={['test']}
            getChildComponent={getChildComponent}
            updateSomeTabHasErrors={_=>{}}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
