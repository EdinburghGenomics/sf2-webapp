import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import DocumentationModal from './DocumentationModal';


it('renders the Documentation Modal correctly with required arguments', () => {

    const wrapper = mount(
        <DocumentationModal
            onCancel={() => {}}
            active={true}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
