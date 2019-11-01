import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Stage2SF2Container from './Stage2SF2Container';


it('renders the Stage2SF2Container correctly with arguments', () => {

    const startIndices = {
        "sampleOrLibrary": "1",
        "unpooledSubmission": "1",
        "pool": "1",
        "container": "1"
    };

    const test_props = {
        initState: {st: "Library", pid: "12345_Test_Project", nslp: 1},
        initialSF2Data: {},
        handleSubmission: () => {},
        handleSave: () => {},
        handleDownload: () => {},
        startIndices: startIndices
    };
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<Stage2SF2Container {...test_props} />, { attachTo: div });
    expect(toJson(wrapper)).toMatchSnapshot();

});
