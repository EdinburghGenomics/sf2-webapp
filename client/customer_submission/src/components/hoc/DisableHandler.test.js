import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { withDisableHandler } from './DisableHandler';


it('renders the DisableHandler correctly with required arguments', () => {

    const wrappedComponent = props => <div>test</div>;
    const fullComponentClass = withDisableHandler(wrappedComponent);
    const fullComponentInstance = new fullComponentClass({});

    const wrapper = mount(fullComponentInstance.render());

    expect(toJson(wrapper)).toMatchSnapshot();

});
