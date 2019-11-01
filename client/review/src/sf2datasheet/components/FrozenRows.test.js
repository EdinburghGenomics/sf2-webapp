import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import FrozenRows from './FrozenRows';


// Basic page logic

it('renders Frozen Rows correctly', () => {

    const testCols = [{value: 'Your Sample ID', width: 335}];


    const wrapper = mount(
        <FrozenRows
            frozenColumns={testCols}
            frozenGrid={[[{value: 'test1'}],[{value: 'test2'}]]}
            frozenRowsWidth={100}
            bodyHeight={100}
            scrollTop={0}
            bottomPadding={140}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
