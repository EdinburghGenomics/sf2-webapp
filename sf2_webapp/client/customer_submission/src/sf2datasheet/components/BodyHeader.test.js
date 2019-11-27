import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import BodyHeader from './BodyHeader';


// Basic page logic

it('renders Body Header correctly', () => {

    const testCols = [{value: 'Your Sample ID', width: 335}];


    const wrapper = mount(
        <BodyHeader
            columns={testCols}
            scrollLeft={0}
            bodyWidth={100}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
