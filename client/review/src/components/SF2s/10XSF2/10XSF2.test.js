import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import TenXSF2 from './10XSF2';


it('renders the 10X SF2 correctly with required arguments', () => {

    const test_initialState = {
        projectID: "12345_A_A",
        sf2type: "10X",
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: "10",
        sf2IsDualIndex: false,
        sf2HasPools: false,
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
        updateShouldDisableSubmit: () => {},
        updateShouldDisableSave: () => {},
        disableSaveButton: () => {},
        startIndices: startIndices
    };

    // need to explicitly specify targets for UncontrolledTooltip for tests to pass
    // see https://github.com/reactstrap/reactstrap/issues/738
    const div4 = document.createElement('div');
    div4.setAttribute("id", "BodyHeader4_id");
    document.body.appendChild(div4);

    const div5 = document.createElement('div');
    div5.setAttribute("id", "BodyHeader5_id");
    document.body.appendChild(div5);

    const div6 = document.createElement('div');
    div6.setAttribute("id", "BodyHeader6_id");
    document.body.appendChild(div6);

    const div7 = document.createElement('div');
    div7.setAttribute("id", "BodyHeader7_id");
    document.body.appendChild(div7);

    const wrapper = mount(<TenXSF2 {...test_props}/>);
    expect(toJson(wrapper)).toMatchSnapshot();

});
