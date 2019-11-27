import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SF2DataSheetWrapper from './SF2DataSheetWrapper';


it('renders the SF2DataSheetWrapper correctly with required arguments', () => {

    const columns = [
        {"id": "yourPoolID", "value": "Your Pool ID", "width": 335, "validation": "required"}
    ];

    const wrapper = mount(
        <SF2DataSheetWrapper
            id={1}
            columns={columns}
            initialGrid={[[]]}
            onUpdateGrid={() => {}}
            showHiddenColumns={true}
            frozenColumns={columns}
            projectID={'test'}
            topRowNumber={1}
            sf2type={'Sample'}
            tableType={'SampleInformation'}
            containerTypeIsPlate={false}
        />

    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
