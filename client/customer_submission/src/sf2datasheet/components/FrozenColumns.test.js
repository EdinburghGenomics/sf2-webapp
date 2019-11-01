import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import FrozenColumns from './FrozenColumns';


// Basic page logic

it('renders Frozen Columns correctly', () => {

    const testCols = [{value: 'Your Sample ID', width: 335}];


    const wrapper = mount(
        <FrozenColumns
            frozenColumns={testCols}
            frozenRowsWidth={335}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
