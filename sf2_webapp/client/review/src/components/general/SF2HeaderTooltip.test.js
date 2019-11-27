import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SF2HeaderTooltip from './SF2HeaderTooltip';


it('renders the header tooltip correctly with required arguments', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(<SF2HeaderTooltip headerText="test" tooltipText="test" headerTooltipID="test"/>, { attachTo: div });
    expect(toJson(wrapper)).toMatchSnapshot();
});
