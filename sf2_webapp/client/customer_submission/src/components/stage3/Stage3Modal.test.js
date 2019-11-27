import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Stage3Modal from './Stage3Modal';


it('renders the Stage3 Modal correctly with required arguments', () => {

    const wrapper = mount(
        <Stage3Modal
            redirectURL='test'
            active={true}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
