import React from 'react';
import Paginator from './Paginator';
import renderer from 'react-test-renderer';


it('renders the paginator correctly with no arguments', () => {
    const tree = renderer
        .create(<Paginator/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});


it('renders the paginator correctly with stage set to 1', () => {
    const tree = renderer
        .create(<Paginator stage={1}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});


it('renders the paginator correctly with stage set to 2', () => {
    const tree = renderer
        .create(<Paginator stage={2}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});


it('renders the paginator correctly with stage set to 3', () => {
    const tree = renderer
        .create(<Paginator stage={3}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
