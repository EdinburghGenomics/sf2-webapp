import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ControlPanel from "./ControlPanel";


// Basic page logic

it('renders Control Panel correctly', () => {

    const wrapper = mount(<ControlPanel disabled={false} uuid={"1"} onFillRow={up => {}} onFillCell={up => {}} showFillUp={true}/>);

    expect(toJson(wrapper)).toMatchSnapshot();

});
