import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ErrorModal from './ErrorModal';


it('renders the Error Modal correctly with required arguments', () => {

    const wrapper = mount(
        <ErrorModal
            onOK={() => {}}
            active={true}
        />
    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
