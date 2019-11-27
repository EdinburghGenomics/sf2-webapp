import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SelectEditor from './SelectEditor';


// Basic page logic

it('renders SelectEditor correctly', () => {

    const wrapper = mount(
        <SelectEditor
            cell={{}}
            row={1}
            col={1}
            value='test'
            onChange={() => {}}
            onCommit={(test, e) => {}}
            onRevert={() => {}}
            onKeyDown={() => {}}
            options={['one', 'two']}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
