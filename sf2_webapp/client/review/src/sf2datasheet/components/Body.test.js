import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Body from './Body';


// Basic page logic

it('renders Body correctly', () => {

    const testCols = [{value: 'Your Sample ID', width: 335}];


    const wrapper = mount(
        <Body
            id={0}
            uuid={"test"}
            columns={testCols}
            frozenGrid={[[]]}
            initialBodyGrid={[[]]}
            onUpdateBodyGrid={()=>{}}
            onMove={()=>{}}
            bottomPadding={140}
            disableRedo={()=>{}}
            disableUndo={()=>{}}
            enableRedo={()=>{}}
            enableUndo={()=>{}}
            rowColours={null}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
