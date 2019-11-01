import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { withConfirmHandler } from './ConfirmHandler';


it('renders the ConfirmHandler correctly with required arguments', () => {

    const wrappedComponent = props => <div>test</div>;
    const fullComponentClass = withConfirmHandler(wrappedComponent);
    const fullComponentInstance = new fullComponentClass({});

    const wrapper = mount(fullComponentInstance.render());

    expect(toJson(wrapper)).toMatchSnapshot();

});
