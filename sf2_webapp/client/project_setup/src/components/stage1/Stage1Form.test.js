import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Stage1Form from './Stage1Form';


// Basic page logic
it('renders the stage1 form correctly with no arguments', () => {
    const wrapper = mount(<Stage1Form setFormUrl={() => {}}/>);
    expect(toJson(wrapper)).toMatchSnapshot();
});


it('shows the library options when the SF2 type of library is selected', () => {
    const wrapper = mount(<Stage1Form setFormUrl={() => {}}/>);

    const sf2_type_selector = wrapper.find('select#sf2TypeSelector');
    expect(sf2_type_selector.length).toBe(1);

    sf2_type_selector.simulate('change', { target: { value : 'Library'}});
    expect(toJson(wrapper)).toMatchSnapshot();
});


it('shows number of pools input when the SF2 type of library is selected and library has pools is selected', () => {
    const wrapper = mount(<Stage1Form setFormUrl={() => {}}/>);

    // Select library so that library has pools checkbox appears
    const sf2_type_selector = wrapper.find('select#sf2TypeSelector');
    expect(sf2_type_selector.length).toBe(1);
    sf2_type_selector.simulate('change', { target: { value : 'Library'}});

    // Locate the library has pools checkbox
    const library_has_pools_checkbox = wrapper.find('input#poolCheck');
    expect(library_has_pools_checkbox.length).toBe(1);

    // Check the checkbox and verify the state has changed
    expect(wrapper.state('sf2HasPools')).toEqual(false);
    library_has_pools_checkbox.simulate('change', { target: { checked: true } });
    expect(wrapper.state('sf2HasPools')).toEqual(true);

    // Verify that the number of pools input is shown
    const number_of_pools_input = wrapper.find('input#numPools');
    expect(number_of_pools_input.length).toBe(1);
    expect(toJson(wrapper)).toMatchSnapshot();
});


// Form validation logic
it('shows a visual warning when the form is submitted with an empty project ID', () => {
    const wrapper = mount(<Stage1Form setFormUrl={() => {}}/>);

    // Find the project ID input and set its value to empty
    const projectID_input = wrapper.find('input#projectID');
    expect(projectID_input.length).toBe(1);
    projectID_input.simulate('change', { target: { value : ''}});

    // Submit the form
    wrapper.find('form').simulate('submit');
    expect(toJson(wrapper)).toMatchSnapshot();
});


it('shows a visual warning when the form is submitted with an empty number of Samples or Libraries', () => {
    const wrapper = mount(<Stage1Form setFormUrl={() => {}}/>);

    // Find the project ID input and set its value to empty
    const numSamplesOrLibraries_input = wrapper.find('input#numSamplesOrLibraries');
    expect(numSamplesOrLibraries_input.length).toBe(1);
    numSamplesOrLibraries_input.simulate('change', { target: { value : ''}});

    // Submit the form
    wrapper.find('form').simulate('submit');
    expect(toJson(wrapper)).toMatchSnapshot();
});
