import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import UndoRedoPanel from "./UndoRedoPanel";


// Basic page logic

it('renders Undo Redo Panel correctly', () => {

    const wrapper = mount(<UndoRedoPanel
        uuid={"1"}
        onUndo={() => {}}
        onRedo={() => {}}
        redoEnabled={false}
        undoEnabled={false}
    />);

    expect(toJson(wrapper)).toMatchSnapshot();

});
