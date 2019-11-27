import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import LibrarySF2 from './LibrarySF2';


it('renders the Library SF2 correctly with required arguments', () => {

    const test_initialState = {
        projectID: "12345_A_A",
        sf2type: "Library",
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: "2",
        sf2IsDualIndex: false,
        sf2HasPools: true,
        numberOfPools: "1",
        barcodeSetIsNA: true,
        sf2HasCustomPrimers: false,
        numberOfCustomPrimers: "0",
        sf2HasUnpooledSamplesOrLibraries: true,
        numberOfUnpooledSamplesOrLibraries: "1",
        numberOfSamplesOrLibrariesInPools: '{"1":"1"}'
    };

    const startIndices = {
        "sampleOrLibrary": "1",
        "unpooledSubmission": "1",
        "pool": "1",
        "container": "1"
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
        updateShouldDisableSubmit: () => {},
        updateShouldDisableSave: () => {},
        disableSaveButton: () => {},
        startIndices: startIndices
    };

    // need to explicitly specify targets for UncontrolledTooltip for tests to pass
    // see https://github.com/reactstrap/reactstrap/issues/738
    const div1 = document.createElement('div');
    div1.setAttribute("id", "BodyHeader1_id");
    document.body.appendChild(div1);

    const div6 = document.createElement('div');
    div6.setAttribute("id", "BodyHeader6_id");
    document.body.appendChild(div6);

    const div7 = document.createElement('div');
    div7.setAttribute("id", "BodyHeader7_id");
    document.body.appendChild(div7);

    const div8 = document.createElement('div');
    div8.setAttribute("id", "BodyHeader8_id");
    document.body.appendChild(div8);

    const wrapper = mount(<LibrarySF2 {...test_props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();

});
