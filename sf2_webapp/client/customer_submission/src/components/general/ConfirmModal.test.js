import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ConfirmModal from './ConfirmModal';


it('renders the Confirm Modal correctly with required arguments', () => {

    const wrapper = mount(
        <ConfirmModal
            onConfirm={() => {}}
            onCancel={() => {}}
            active={true}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
