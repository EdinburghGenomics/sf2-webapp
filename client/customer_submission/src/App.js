// @flow
import React from 'react';

import Stage2Modal from './components/stage2/Stage2Modal';
import Stage2SF2Container from './components/stage2/Stage2SF2Container';

// App class
type AppProps = {};


type AppState = {
    stage2ModalIsActive: boolean
}


export default class App extends React.Component<AppProps, AppState> {
    state = {
        stage2ModalIsActive: false
    };

    handleStage2FormSubmission = () => {
        this.setState({stage2ModalIsActive: true});
    };

    render() {
        
        const queryString = "eyJwaWQiOiIyMTM1NF9hX2EiLCJzdCI6IkxpYnJhcnlWMiIsImN0IjoiVHViZSIsIm5zbCI6IiIsImRpIjp0cnVlLCJuYSI6ZmFsc2UsImhwIjp0cnVlLCJucCI6IjIiLCJoYyI6dHJ1ZSwibmMiOiIxIiwiaHVzbCI6dHJ1ZSwibnVzbCI6IjEiLCJuc2xwIjoie1wiMVwiOlwiMVwiLFwiMlwiOlwiMlwifSJ9";
        const stage3Path = '';

        return (
            
            <div style={{margin: 10}}>
                <Stage2SF2Container queryString={queryString} redirectToHome={()=>{}} handleSubmission={this.handleStage2FormSubmission} />
                <Stage2Modal redirectUrl={stage3Path} active={this.state.stage2ModalIsActive}/>
            </div>
        )
        
    };

};
