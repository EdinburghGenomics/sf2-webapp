import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SampleSF2 from './SampleSF2';


it('renders the Sample SF2 correctly with the required arguments', () => {

    const test_initialState = {
        projectID: "test",
        sf2type: "Sample",
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: "10",
        sf2IsDualIndex: false,
        sf2HasPools: false,
        numberOfPools: "5"
    };

    const startIndices = {
        "sampleOrLibrary": "1",
        "unpooledSubmission": "1",
        "pool": "1"
    };

    const test_props = {
        initialState: test_initialState,
        handleSubmission: () => {},
        handleSave: () => {},
        handleDownload: () => {},
        showDocumentation: () => {},
        showHiddenColumns: false,
        shouldDisableSubmit: true,
        shouldDisableSave: true,
        updateHasErrors: () => {},
        updateShouldDisableSave: () => {},
        startIndices: startIndices
    };

    // need to explicitly specify targets for UncontrolledTooltip for tests to pass
    // see https://github.com/reactstrap/reactstrap/issues/738
    const div0 = document.createElement('div');
    div0.setAttribute("id", "BodyHeader0_id");
    document.body.appendChild(div0);

    const div1 = document.createElement('div');
    div1.setAttribute("id", "BodyHeader1_id");
    document.body.appendChild(div1);

    const div5 = document.createElement('div');
    div5.setAttribute("id", "BodyHeader5_id");
    document.body.appendChild(div5);

    const div7 = document.createElement('div');
    div7.setAttribute("id", "BodyHeader7_id");
    document.body.appendChild(div7);

    const div8 = document.createElement('div');
    div8.setAttribute("id", "BodyHeader8_id");
    document.body.appendChild(div8);

    const div9 = document.createElement('div');
    div9.setAttribute("id", "BodyHeader9_id");
    document.body.appendChild(div9);

    const div10 = document.createElement('div');
    div10.setAttribute("id", "BodyHeader10_id");
    document.body.appendChild(div10);

    const div11 = document.createElement('div');
    div11.setAttribute("id", "BodyHeader11_id");
    document.body.appendChild(div11);

    const div12 = document.createElement('div');
    div12.setAttribute("id", "BodyHeader12_id");
    document.body.appendChild(div12);

    const div13 = document.createElement('div');
    div13.setAttribute("id", "BodyHeader13_id");
    document.body.appendChild(div13);

    const wrapper = mount(<SampleSF2 {...test_props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();

});
