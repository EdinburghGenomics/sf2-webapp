import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { withShowDocumentationHandler } from './ShowDocumentationHandler';


it('renders the DocumentationViewer correctly with required arguments', () => {

    const wrappedComponent = props => <div>test</div>;
    const fullComponentClass = withShowDocumentationHandler(wrappedComponent);
    const fullComponentInstance = new fullComponentClass({});

    const wrapper = mount(fullComponentInstance.render());

    expect(toJson(wrapper)).toMatchSnapshot();

});
