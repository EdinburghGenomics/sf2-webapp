import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import BodyWrapper from './BodyWrapper';


// Basic page logic

it('renders BodyWrapper correctly', () => {

    const testCols = [{value: 'Your Sample ID', width: 335}];

    const wrapper = mount(
        <BodyWrapper
            id={0}
            uuid={"test"}
            columns={testCols}
            frozenGrid={[[]]}
            initialBodyGrid={[[]]}
            onUpdateBodyGrid={() => {}}
            setScrollbarPresent={() => {}}
            bodyHeight={100}
            bodyWidth={100}
            onTick={(x,y) => {}}
            bottomPadding={140}
            scrollOnClick={false}
            disableRedo={()=>{}}
            disableUndo={()=>{}}
            enableRedo={()=>{}}
            enableUndo={()=>{}}
            rowColours={null}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});