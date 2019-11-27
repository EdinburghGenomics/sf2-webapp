import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import AutocompleteEditor from './AutocompleteEditor';


// Basic page logic

it('renders AutocompleteEditor correctly', () => {

    const wrapper = mount(
        <AutocompleteEditor
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
