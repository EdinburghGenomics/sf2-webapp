import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Stage2Modal from './Stage2Modal';


it('renders the Stage2 Modal correctly with required arguments', () => {

    const wrapper = mount(
        <Stage2Modal
            redirectURL='test'
            active={true}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
