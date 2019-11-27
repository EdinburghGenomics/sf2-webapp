import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SF2DataSheet from './SF2DataSheet';


// Basic page logic

it('renders SF2 DataSheet correctly', () => {

    const testCols = [{value: 'Test column', width: 335}];

    const frozenColumns = testCols;

    const initialBodyGrid = [[{value: 'test1'}], [{value: 'test2'}]];

    const frozenGrid = initialBodyGrid;

    const wrapper = mount(
        <SF2DataSheet
            columns={testCols}
            initialBodyGrid={initialBodyGrid}
            onUpdateBodyGrid={() => {}}
            bodyHeight={250}
            frozenColumns={frozenColumns}
            frozenGrid={frozenGrid}
            width={"100%"}
            bottomPadding={140}
            showHiddenColumns={false}
            uuid="0"
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});


it('renders SF2 DataSheet correctly with hidden column set to hidden', () => {

    const testCols = [{value: 'Test column', width: 335}, {value: 'Test hidden column', width: 335}];

    const frozenColumns = testCols;

    const initialBodyGrid = [[{value: 'visible 1'}, {value: 'hidden 1'}], [{value: 'visible 2'}, {value: 'hidden 2'}]];

    const frozenGrid = initialBodyGrid;

    const wrapper = mount(
        <SF2DataSheet
            columns={testCols}
            initialBodyGrid={initialBodyGrid}
            onUpdateBodyGrid={() => {}}
            bodyHeight={250}
            frozenColumns={frozenColumns}
            frozenGrid={frozenGrid}
            width={"100%"}
            showHiddenColumns={false}
            uuid={"0"}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});


it('renders SF2 DataSheet correctly with hidden column set to visible', () => {

    const testCols = [{value: 'Test column', width: 335}, {value: 'Test hidden column', width: 335}];

    const frozenColumns = testCols;

    const initialBodyGrid = [[{value: 'visible 1'}, {value: 'hidden 1'}], [{value: 'visible 2'}, {value: 'hidden 2'}]];

    const frozenGrid = initialBodyGrid;

    const wrapper = mount(
        <SF2DataSheet
            columns={testCols}
            initialBodyGrid={initialBodyGrid}
            onUpdateBodyGrid={()=>{}}
            bodyHeight={250}
            frozenColumns={frozenColumns}
            frozenGrid={frozenGrid}
            width={"100%"}
            showHiddenColumns={true}
            uuid={"0"}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});