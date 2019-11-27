import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import PlateTabContainer from "./PlateTabContainer";


it('renders the PlateTabContainer correctly with required arguments', () => {

    const columns = [
        {"id": "yourPoolID", "value": "Your Pool ID", "width": 335, "validation": "required"}
    ];

    const frozenLibraryInformationColumns = [
        {
            value: 'EG Library ID',
            width: 150
        }
    ];

    const initialState = {
        projectID: 'test',
        sf2type: 'Library',
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: 1
    };

    const cell = {value: 'test', readonly: false};

    const gridWithIDs = [
        {id: 'plate1', grid: [[cell]]}, {id: 'plate2', grid: [[cell]]}
    ];

    const wrapper = mount(
        <PlateTabContainer
            columns={columns}
            frozenColumns={frozenLibraryInformationColumns}
            frozenGridWithIDs={gridWithIDs}
            initialGridWithIDs={gridWithIDs}
            initialState={initialState}
            numberOfRows={1}
            handleSubmission={() => {}}
            handleSave={() => {}}
            handleDownload={() => {}}
            showDocumentation={() => {}}
            showHiddenColumns={true}
            updateGridWithIDs={x => {}}
            shouldDisableSave={true}
            shouldDisableSubmit={true}
            updateShouldDisableSave={x => {}}
            updateHasErrors={x => {}}
            tableType={'LibraryInformation'}
        />

    );

    expect(toJson(wrapper)).toMatchSnapshot();

});
