import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SF2Validator from './SF2Validator';


it('renders the SF2Validator correctly with required arguments', () => {

    const columns = [
        {"id": "yourSampleID", "value": "Your Sample ID", "width": 335, "validation": "required"}
    ];

    const initialState = {projectID: 'test', sf2type: 'Sample', containerTypeIsPlate: false};

    const wrapper = mount(
        <SF2Validator
            id={"0"}
            columns={columns}
            frozenColumns={columns}
            initialGrid={[[]]}
            frozenGrid={[[{'value': 'test'}]]}
            initialState={initialState}
            handleSubmission={() => {}}
            handleSave={() => {}}
            handleDownload={() => {}}
            showDocumentation={() => {}}
            updateHasErrors={(x,y) => {}}
            updateGrids={x => {}}
            showHiddenColumns={true}
            topRowNumber={1}
            submitDisabled={true}
            saveDisabled={true}
            tableType={'SampleInformation'}
        />

    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
