import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Stage1Modal from './Stage1Modal';


it('renders the stage1 form correctly when not active', () => {
    const wrapper = mount(<Stage1Modal formUrl="test" active={false}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
});


it('renders the stage1 form correctly when active', () => {
    const wrapper = mount(<Stage1Modal formUrl="test" active={true}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
});
