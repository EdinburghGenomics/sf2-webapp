import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Stage1FormStateSummary from './Stage1FormStateSummary';


// Basic page logic
it('renders the Stage1FormStateSummary correctly with no arguments', () => {
    const wrapper = mount(<Stage1FormStateSummary/>);
    expect(toJson(wrapper)).toMatchSnapshot();
});


it('renders the Stage1FormStateSummary correctly with arguments', () => {
    const test_props= {
        projectID: "test",
        sf2type: "Library",
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: "10",
        sf2IsDualIndex: true,
        sf2HasPools: true,
        numberOfPools: "5"
    };
    const wrapper = mount(<Stage1FormStateSummary {...test_props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
});
