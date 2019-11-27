import React from 'react';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';

import {withDownloadHandler} from './DownloadHandler';


it('renders the DownloadHandler correctly with required arguments', () => {

    const wrappedComponent = props => <div>test</div>;
    const fullComponentClass = withDownloadHandler(wrappedComponent);
    const fullComponentInstance = new fullComponentClass({});

    const wrapper = mount(fullComponentInstance.render());

    expect(toJson(wrapper)).toMatchSnapshot();

});
