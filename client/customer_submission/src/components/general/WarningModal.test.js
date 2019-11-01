import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import WarningModal from './WarningModal';


it('renders the Warning Modal correctly with required arguments', () => {

    const wrapper = mount(
        <WarningModal
            onConfirm={() => {}}
            onCancel={() => {}}
            active={true}
            warnings={[]}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
