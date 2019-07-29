// @flow
import React from 'react';
import * as R from 'ramda';

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { Stage1FormState } from '../../types/flowTypes';
import { eventTargetIsValid, getNumSamplesOrLibrariesLabel, getNumSamplesOrLibrariesPlaceholder,
getCallbackHref } from '../../functions/lib';


type Stage1FormProps = {
    submitData: (string) => void,
    reissueProject: (string, string) => void
};


export default class Stage1Form extends React.Component<Stage1FormProps, Stage1FormState> {
    state = {
        projectID: '',
        sf2type: 'Sample',
        containerTypeIsPlate: false,
        numberOfSamplesOrLibraries: '',
        sf2IsDualIndex: true,
        barcodeSetIsNA: false,
        sf2HasPools: false,
        sf2HasUnpooledSamplesOrLibraries: false,
        sf2HasCustomPrimers: false,
        numberOfPools: '',
        numberOfCustomPrimers: '',
        numberOfUnpooledSamplesOrLibraries: '',
        numberOfSamplesOrLibrariesInPool: {},
        projectIDIsInvalid: false,
        numPoolsIsInvalid: false,
        numCustomPrimersIsInvalid: false,
        numSamplesOrLibrariesIsInvalid: false,
        numUnpooledSamplesOrLibrariesIsInvalid: false,
        numberOfSamplesOrLibrariesInPoolIsInvalid: {},
        numberOfPoolsAndUnpooledSamplesIsInvalid: false,
        comments: '',
        reissueIsEnabled: false
    };


    // Helper functions for event handlers

    updateStateField = (key : string, value : any) => {
        let stateElement = {};
        stateElement[key] = value;
        this.setState(stateElement);
    };


    handleChange = (event : SyntheticInputEvent<HTMLInputElement>, key: string) => {
        this.updateStateField(key, event.target.value);
    };


    handleInputChange = (event : SyntheticInputEvent<HTMLInputElement>, field : string, invalidField : string) => {
        this.updateStateField(field, event.target.value);
        this.updateStateField(invalidField, !eventTargetIsValid(event));
    };


    handleNumericInputChange = (event : SyntheticInputEvent<HTMLInputElement>, field : string, invalidField : string) => {

        // reset value if it's invalid (handles e, E, +, ., or - etc.)
        if (!eventTargetIsValid(event)) {
            event.target.value = this.state[field];
        }

        this.handleInputChange(event, field, invalidField);

    };


    enableReissueIfAppropriate = (projectID : string) => {

        console.log('Enabling reissue if appropriate for project ID: ', projectID);

        const check_url = getCallbackHref(window.location).concat("check/");

        fetch(check_url, {
          method: 'POST',
          mode: 'cors',
          body: projectID,
          headers:{
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(
            json => {
                const jsonBool = R.equals(JSON.stringify(json), 'true');
                this.updateStateField('reissueIsEnabled', jsonBool);
            }).catch(error => {
                console.error('Error (check):', error);
            });

    }


    // event handlers to manage the state of the form component

    handleProjectIDChange = (event : SyntheticInputEvent<HTMLInputElement>) => {

        let newEvent = event;

        if(!R.test(/^\d{5}_[^_]+_[^_]+$/)(event.target.value)) {
            const newEventTarget = R.assoc('validity', {'valid': false}, event.target);
            newEvent = R.assoc('target', newEventTarget, event);
        } else {
            this.enableReissueIfAppropriate(event.target.value);
        }

        this.handleInputChange(newEvent, 'projectID', 'projectIDIsInvalid');

    };


    handleCommentsChange = (event : SyntheticInputEvent<HTMLInputElement>) => {
        this.updateStateField('comments', event.target.value);
    };


    handleSF2TypeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleChange(event, 'sf2type');
    };


    handleContainerTypeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        if(event.target.value === 'Plate' && this.state.containerTypeIsPlate === false) {
            this.setState({'containerTypeIsPlate': true});
        } else if(event.target.value === 'Tube' && this.state.containerTypeIsPlate === true) {
            this.setState({'containerTypeIsPlate': false});
        }
    };


    handleNumberOfSamplesOrLibrariesChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleNumericInputChange(event, 'numberOfSamplesOrLibraries', 'numSamplesOrLibrariesIsInvalid');
    };


    toggleIsDualIndex = () => {
        this.setState({
            sf2IsDualIndex: !this.state.sf2IsDualIndex
        });
    };


    toggleBarcodeSetIsNA = () => {
        this.setState({
            barcodeSetIsNA: !this.state.barcodeSetIsNA
        });
    };


    toggleHasPools = () => {
        this.setState({
            sf2HasPools: !this.state.sf2HasPools,
            numberOfPoolsAndUnpooledSamplesIsInvalid: false
        });
    };


    toggleContainerTypeIsPlate = () => {
        this.setState({
            containerTypeIsPlate: !this.state.containerTypeIsPlate
        });
    };


    toggleHasUnpooledSamplesOrLibraries = () => {
        this.setState({
            sf2HasUnpooledSamplesOrLibraries: !this.state.sf2HasUnpooledSamplesOrLibraries,
            numberOfPoolsAndUnpooledSamplesIsInvalid: false
        });
    };


    handleNumberOfPoolsChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleNumericInputChange(event, 'numberOfPools', 'numPoolsIsInvalid');
    };


    toggleHasCustomPrimers = () => {
        this.setState({
            sf2HasCustomPrimers: !this.state.sf2HasCustomPrimers
        });
    };


    handleNumberOfCustomPrimersChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleNumericInputChange(event, 'numberOfCustomPrimers', 'numCustomPrimersIsInvalid');
    };


    handleNumberOfUnpooledSamplesOrLibrariesChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleNumericInputChange(event, 'numberOfUnpooledSamplesOrLibraries', 'numUnpooledSamplesOrLibrariesIsInvalid');
    };


    handleNumberOf10XSamplesInPoolChange = (poolNumber : number, event: SyntheticInputEvent<HTMLInputElement>) => {

        const currentValue = this.state.numberOfSamplesOrLibrariesInPool[poolNumber];

        if (!eventTargetIsValid(event)) {
            event.target.value = currentValue;
        }

        const newNumberOfTenXSamplesInPool = R.assoc(poolNumber, event.target.value, this.state.numberOfSamplesOrLibrariesInPool);
        this.updateStateField('numberOfSamplesOrLibrariesInPool', newNumberOfTenXSamplesInPool);

        const newNumberOfTenXSamplesInPoolIsInvalid = R.assoc(poolNumber, !eventTargetIsValid(event), this.state.numberOfSamplesOrLibrariesInPoolIsInvalid);
        this.updateStateField('numberOfSamplesOrLibrariesInPoolIsInvalid', newNumberOfTenXSamplesInPoolIsInvalid);

    };


    handleNumberOfLibrariesInPoolChange = (poolNumber : number, event: SyntheticInputEvent<HTMLInputElement>) => {

        const currentValue = this.state.numberOfSamplesOrLibrariesInPool[poolNumber];

        if (!eventTargetIsValid(event)) {
            event.target.value = currentValue;
        }

        const newNumberOfLibrariesInPool = R.assoc(poolNumber, event.target.value, this.state.numberOfSamplesOrLibrariesInPool);
        this.updateStateField('numberOfSamplesOrLibrariesInPool', newNumberOfLibrariesInPool);

        const newNumberOfLibrariesInPoolIsInvalid = R.assoc(poolNumber, !eventTargetIsValid(event), this.state.numberOfSamplesOrLibrariesInPoolIsInvalid);
        this.updateStateField('numberOfSamplesOrLibrariesInPoolIsInvalid', newNumberOfLibrariesInPoolIsInvalid);

    };


    getNumberOfSamplesOrLibrariesInPool = (poolNumber : number) : number => {
        return this.state.numberOfSamplesOrLibrariesInPool[poolNumber];
    };


    getNumSamplesOrLibrariesInPoolIsInvalid = (poolNumber: number) : boolean => {
        return this.state.numberOfSamplesOrLibrariesInPoolIsInvalid[poolNumber];
    };


    getPoolKeys = () => R.range(1, parseInt(this.state.numberOfPools, 10) + 1);


    // Form validation method

    formIsValid = () => {

        let isValid = true;

        // The project ID cannot be empty
        if(this.state.projectID.length<1) {
            this.setState({projectIDIsInvalid: true});
            this.forceUpdate();
            isValid = false;
        }

        // The number of samples or libraries cannot be empty
        if(this.state.sf2type !== '10X' && this.state.sf2type !== 'Library' && this.state.numberOfSamplesOrLibraries.length<1) {
            this.setState({numSamplesOrLibrariesIsInvalid: true});
            this.forceUpdate();
            isValid = false;
        }

        // If the SF2 has pools the number of pools cannot be empty
        if(this.state.sf2HasPools && this.state.numberOfPools.length<1) {
            this.setState({numPoolsIsInvalid: true});
            this.forceUpdate();
            isValid = false;
        }

        // If the SF2 has custom primers the number of custom primers cannot be empty
        if(this.state.sf2HasCustomPrimers && this.state.numberOfCustomPrimers.length<1) {
            this.setState({numCustomPrimersIsInvalid: true});
            this.forceUpdate();
            isValid = false;
        }

        // If the SF2 has unpooled samples or libraries the number of unpooled 10X samples or libraries cannot be empty
        if(this.state.sf2HasUnpooledSamplesOrLibraries && this.state.numberOfUnpooledSamplesOrLibraries.length<1) {
            this.setState({numUnpooledSamplesOrLibrariesIsInvalid: true});
            this.forceUpdate();
            isValid = false;
        }

        // If the SF2 is 10X or Library and has pools, the number of 10X samples or libraries in each pool cannot be empty
        if((this.state.sf2type === '10X' || this.state.sf2type === 'Library') && this.state.sf2HasPools) {
            let newNumberOfSamplesOrLibrariesInPoolIsInvalid = {};
            this.getPoolKeys().forEach(x => {
                const thisPool = this.state.numberOfSamplesOrLibrariesInPool[x] || '';
                newNumberOfSamplesOrLibrariesInPoolIsInvalid[x] = (thisPool.length < 1);
            });
            if(!R.equals(newNumberOfSamplesOrLibrariesInPoolIsInvalid, this.state.numberOfSamplesOrLibrariesInPoolIsInvalid)) {
                this.setState({
                    numberOfSamplesOrLibrariesInPoolIsInvalid: newNumberOfSamplesOrLibrariesInPoolIsInvalid
                });
                this.forceUpdate();
            }
            isValid = isValid ? R.compose(R.none(R.identity), R.values)(newNumberOfSamplesOrLibrariesInPoolIsInvalid) : false;

        }

        // If the SF2 is 10X or Library and there are no pools and no unpooled samples, the form is invalid
        if((this.state.sf2type === '10X' || this.state.sf2type === 'Library') && !this.state.sf2HasPools && !this.state.sf2HasUnpooledSamplesOrLibraries) {
            this.setState({
                numberOfPoolsAndUnpooledSamplesIsInvalid: true
            });
            this.forceUpdate();
            isValid = false;
        }

        return(isValid);

    };


    // Handler for the submission logic
    handleSubmit = (event: SyntheticInputEvent<HTMLInputElement>) => {

        let numberOfSamplesOrLibrariesInPools = '{}';
        if(this.state.sf2type === '10X' || this.state.sf2type === 'Library') {
            numberOfSamplesOrLibrariesInPools = JSON.stringify(
                R.filter(x => R.any(y => R.equals(x,y)(this.getPoolKeys())), this.state.numberOfSamplesOrLibrariesInPool)
            );
        }

        if(this.formIsValid()) {

            const project_data = JSON.stringify({
                pid: this.state.projectID,
                st: this.state.sf2type,
                ctp: this.state.containerTypeIsPlate,
                nsl: this.state.numberOfSamplesOrLibraries,
                di: this.state.sf2IsDualIndex,
                na: this.state.barcodeSetIsNA,
                hp: this.state.sf2HasPools,
                np: this.state.numberOfPools,
                hc: this.state.sf2HasCustomPrimers,
                nc: this.state.numberOfCustomPrimers,
                husl: this.state.sf2HasUnpooledSamplesOrLibraries,
                nusl: this.state.numberOfUnpooledSamplesOrLibraries,
                nslp: numberOfSamplesOrLibrariesInPools,
                cm: this.state.comments
            });

            this.props.submitData(project_data);

        } else {
            alert('Form contains errors. Please fix these before submitting.');
        }

    };


    handleReissue = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.reissueProject(this.state.projectID, this.state.comments);
    }


    // UI components

    // General

    renderHasPoolsCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="poolCheck"
                id="poolCheck"
                checked={this.state.sf2HasPools}
                onChange={this.toggleHasPools}
            />{' '}
            SF2 has pools
        </Label>
    </FormGroup>;


    renderNumberOfPoolsInput = () => {

        if(this.state.sf2HasPools === true) {
            return(<FormGroup><div style={{"marginTop": "10px"}}>
                <Label for="numPools">Number of Pools</Label>
                <Input type="number"
                       name="numPools"
                       id="numPools"
                       min="0"
                       step="1"
                       onChange={this.handleNumberOfPoolsChange}
                       placeholder="Enter the number of pools here"
                       style={this.state.numPoolsIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
                />

                {this.state.numPoolsIsInvalid &&
                <span style={{color: "#f83244"}} >Number of Pools is a required field when the SF2 has pools, and must be a positive integer.</span>
                }
            </div></FormGroup>);
        } else {
           return('');
        }

    };


    renderContainerTypeDropdown = () => <FormGroup>
        <Label for="containerType">Container Type</Label>
        <Input type="select" name="containerType" id="containerType"
               onChange={this.handleContainerTypeChange}>
            <option value="Tube">Tube</option>
            <option value="Plate">Plate</option>
        </Input>
    </FormGroup>;


    renderNumberOfSamplesOrLibrariesInput = () => <FormGroup>
            <Label for="numSamplesOrLibraries">{getNumSamplesOrLibrariesLabel(this.state.sf2type)}</Label>
            <Input type="number"
                   name="numSamplesOrLibraries"
                   id="numSamplesOrLibraries"
                   min="0"
                   step="1"
                   onChange={this.handleNumberOfSamplesOrLibrariesChange}
                   onInput={this.handleNumberOfSamplesOrLibrariesChange}
                   value={this.state.numberOfSamplesOrLibraries}
                   placeholder={getNumSamplesOrLibrariesPlaceholder(this.state.sf2type)}
                   style={this.state.numSamplesOrLibrariesIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
            />

            {this.state.numSamplesOrLibrariesIsInvalid &&
                <span style={{color: "#f83244"}} >{this.state.numSamplesOrLibrariesLabel} is a required field, and must be a positive integer.</span>
            }
        </FormGroup>;


    // Library SF2

    renderDualIndexCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="dualIndexCheck"
                id="dualIndexCheck"
                checked={this.state.sf2IsDualIndex}
                onChange={this.toggleIsDualIndex}
            />{' '}
            SF2 is dual index (leave unchecked for a single index SF2)
            </Label>
        </FormGroup>;


    renderHasCustomPrimersCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="primerCheck"
                id="primerCheck"
                checked={this.state.sf2HasCustomPrimers}
                onChange={this.toggleHasCustomPrimers}
            />{' '}
            SF2 has custom primers
        </Label>
    </FormGroup>;


    renderNumberOfCustomPrimersInput = () => {
        if(this.state.sf2HasCustomPrimers === true) {
            return(
                <FormGroup><div style={{"marginTop": "10px"}}>
                    <Label for="numCustomPrimers">Number of Custom Primers</Label>
                    <Input type="number"
                           name="numCustomPrimers"
                           id="numCustomPrimers"
                           min="0"
                           step="1"
                           onChange={this.handleNumberOfCustomPrimersChange}
                           placeholder="Enter the number of custom primers here"
                           style={this.state.numCustomPrimersIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
                    />

                    {this.state.numCustomPrimersIsInvalid &&
                        <span style={{color: "#f83244"}} >Number of Custom Primers is a required field when the library has custom primers, and must be a positive integer.</span>
                    }
                </div></FormGroup>
            );
        } else {
            return('');
        }
    };

    // 10X SF2

    renderBarcodeSetCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="barcodeSetCheck"
                id="barcodeSetCheck"
                checked={this.state.barcodeSetIsNA}
                onChange={this.toggleBarcodeSetIsNA}
            />{' '}
            SF2 uses NA barcode set (leave unchecked to use GA barcode set)
        </Label>
    </FormGroup>;


    renderHasUnpooledSamplesCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="unpooledCheckTenX"
                id="unpooledCheckTenX"
                checked={this.state.sf2HasUnpooledSamplesOrLibraries}
                onChange={this.toggleHasUnpooledSamplesOrLibraries}
            />{' '}
            SF2 has unpooled samples
        </Label>
    </FormGroup>;


    renderNumberOfUnpooledSamplesInput = () => {

        if(this.state.sf2HasUnpooledSamplesOrLibraries === true) {
            return(<FormGroup><div style={{"marginTop": "10px"}}>
                <Label for="numUnpooledTenXSamples">Number of Unpooled 10X Samples</Label>
                <Input type="number"
                       name="numUnpooledTenXSamples"
                       id="numUnpooledTenXSamples"
                       min="0"
                       step="1"
                       onChange={this.handleNumberOfUnpooledSamplesOrLibrariesChange}
                       onInput={this.handleNumberOfUnpooledSamplesOrLibrariesChange}
                       value={this.state.numberOfUnpooledSamplesOrLibraries}
                       placeholder="Enter the number of unpooled 10X samples here"
                       style={this.state.numUnpooledSamplesOrLibrariesIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
                />
                {this.state.numUnpooledSamplesOrLibrariesIsInvalid &&
                    <span style={{color: "#f83244"}} >Number of unpooled 10X samples is a required field when the SF2 has unpooled samples, and must be a positive integer.</span>
                }
            </div></FormGroup>);
        } else {
            return('');
        }

    };


    renderNumberOf10XSamplesInPoolInput = (poolNumber : number) => {

        const inputName = "num10XSamplesInPool" + poolNumber.toString();
        const inputPlaceHolder = "Enter the number of 10X samples in pool " + poolNumber.toString() + " here";

        const handleNumberOf10XSamplesInThisPoolChange = R.curry(this.handleNumberOf10XSamplesInPoolChange)(poolNumber);

        return(
            <FormGroup key={inputName + 'FormGroup'}>
                <Label for={inputName}>Number of 10X Samples in Pool {poolNumber}</Label>
                <Input type="number"
                       key={inputName + 'Input'}
                       name={inputName}
                       id={inputName}
                       min="0"
                       step="1"
                       onChange={handleNumberOf10XSamplesInThisPoolChange}
                       onInput={handleNumberOf10XSamplesInThisPoolChange}
                       value={this.getNumberOfSamplesOrLibrariesInPool(poolNumber) || ''}
                       placeholder={inputPlaceHolder}
                       style={this.getNumSamplesOrLibrariesInPoolIsInvalid(poolNumber) ? {backgroundColor: "#f8d7da"} : {}}
                />
                {this.getNumSamplesOrLibrariesInPoolIsInvalid(poolNumber) &&
                    <span style={{color: "#f83244"}} >Number of 10X samples in pool {poolNumber} is a required field when the SF2 has {poolNumber} or more pools, and must be a positive integer.</span>
                }
            </FormGroup>
        );

    };


    renderNumberOf10XSamplesInPoolsInputs = () => {
        if(this.state.sf2HasPools === true && this.state.numberOfPools > 0) {
            console.log(parseInt(this.state.numberOfPools, 10));
            console.log(typeof(this.state.numberOfPools));
            return(
                <FormGroup>
                    {R.range(1, parseInt(this.state.numberOfPools, 10) + 1).map(
                        x => this.renderNumberOf10XSamplesInPoolInput(x)
                    )}
                </FormGroup>
            );
        } else {
            return('');
        }
    };


    // Library SF2

    renderCustomerIsSendingPlatesCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="platesCheckLibrary"
                id="platesCheckLibrary"
                checked={this.state.containerTypeIsPlate}
                onChange={this.toggleContainerTypeIsPlate}
            />{' '}
            Customer is sending plates (leave unchecked if customer is sending tubes)
        </Label>
    </FormGroup>;


    renderHasUnpooledLibrariesCheckbox = () => <FormGroup check>
        <Label check>
            <Input
                type="checkbox"
                name="unpooledCheckLibrary"
                id="unpooledCheckLibrary"
                checked={this.state.sf2HasUnpooledSamplesOrLibraries}
                onChange={this.toggleHasUnpooledSamplesOrLibraries}
            />{' '}
            SF2 has unpooled libraries
        </Label>
    </FormGroup>;


    renderNumberOfUnpooledLibrariesInput = () => {

        if(this.state.sf2HasUnpooledSamplesOrLibraries === true) {
            return(<FormGroup><div style={{"marginTop": "10px"}}>
                <Label for="numUnpooledLibraries">Number of Unpooled Libraries</Label>
                <Input type="number"
                       name="numUnpooledLibraries"
                       id="numUnpooledLibraries"
                       min="0"
                       step="1"
                       onChange={this.handleNumberOfUnpooledSamplesOrLibrariesChange}
                       onInput={this.handleNumberOfUnpooledSamplesOrLibrariesChange}
                       value={this.state.numberOfUnpooledSamplesOrLibraries}
                       placeholder="Enter the number of unpooled libraries here"
                       style={this.state.numUnpooledSamplesOrLibrariesIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
                />
                {this.state.numUnpooledSamplesOrLibrariesIsInvalid &&
                <span style={{color: "#f83244"}} >Number of unpooled libraries is a required field when the SF2 has unpooled libraries, and must be a positive integer.</span>
                }
            </div></FormGroup>);
        } else {
            return('');
        }

    };


    renderNumberOfLibrariesInPoolInput = (poolNumber : number) => {

        const inputName = "numLibrariesInPool" + poolNumber.toString();
        const inputPlaceHolder = "Enter the number of libraries in pool " + poolNumber.toString() + " here";

        const handleNumberOfLibrariesInThisPoolChange = R.curry(this.handleNumberOfLibrariesInPoolChange)(poolNumber);

        return(
            <FormGroup key={inputName + 'FormGroup'}>
                <Label for={inputName}>Number of Samples in Pool {poolNumber}</Label>
                <Input type="number"
                       key={inputName + 'Input'}
                       name={inputName}
                       id={inputName}
                       min="0"
                       step="1"
                       onChange={handleNumberOfLibrariesInThisPoolChange}
                       onInput={handleNumberOfLibrariesInThisPoolChange}
                       value={this.getNumberOfSamplesOrLibrariesInPool(poolNumber) || ''}
                       placeholder={inputPlaceHolder}
                       style={this.getNumSamplesOrLibrariesInPoolIsInvalid(poolNumber) ? {backgroundColor: "#f8d7da"} : {}}
                />
                {this.getNumSamplesOrLibrariesInPoolIsInvalid(poolNumber) &&
                <span style={{color: "#f83244"}} >Number of libraries in pool {poolNumber} is a required field when the SF2 has {poolNumber} or more pools, and must be a positive integer.</span>
                }
            </FormGroup>
        );

    };


    renderNumberOfLibrariesInPoolsInputs = () => {
        if(this.state.sf2HasPools === true && this.state.numberOfPools > 0) {
            console.log(parseInt(this.state.numberOfPools, 10));
            console.log(typeof(this.state.numberOfPools));
            return(
                <FormGroup>
                    {R.range(1, parseInt(this.state.numberOfPools, 10) + 1).map(
                        x => this.renderNumberOfLibrariesInPoolInput(x)
                    )}
                </FormGroup>
            );
        } else {
            return('');
        }
    };


    // Main render function

    render () {
        return (
            <div style={{maxWidth: "640px"}}>
                <h2>Project Setup</h2>
                <br/>
                <Form onSubmit={e=>{e.preventDefault()}}>
                    <FormGroup>
                        <Label for="projectID">Project ID</Label>
                        <Input type="text"
                               name="projectID"
                               id="projectID"
                               placeholder="Enter the ID for the new project here"
                               autoComplete="off"
                               onChange={this.handleProjectIDChange}
                               onInput={this.handleProjectIDChange}
                               value={this.state.projectID}
                               style={this.state.projectIDIsInvalid ? {backgroundColor: "#f8d7da"} : {}}
                        />
                        {this.state.projectIDIsInvalid && <span style={{color: "#f83244"}} >Project ID is a required field, and must take the form 12345_Surname_Forename.</span>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="sf2Type">SF2 Type</Label>
                        <Input type="select" name="sf2Type" id="sf2TypeSelector" onChange={this.handleSF2TypeChange}>
                            <option value="Sample">Sample</option>
                            <option value="Library">Library</option>
                            {/*<option value="Library_old">Library (old)</option>*/}
                            <option value="10X">10X</option>
                            {/*<option value="10X_old">10X (old)</option>*/}
                        </Input>
                    </FormGroup>
                    {this.state.sf2type === "Sample" &&
                    <FormGroup>
                        <Label>Sample SF2 Options</Label>

                        {this.renderContainerTypeDropdown()}
                        {this.renderNumberOfSamplesOrLibrariesInput()}

                    </FormGroup>
                    }
                    {this.state.sf2type === "Library_old" &&
                    <FormGroup>
                        <Label>Library SF2 Options (old)</Label>

                        <FormGroup>
                            {this.renderDualIndexCheckbox()}
                            {this.renderHasPoolsCheckbox()}
                            {this.renderHasCustomPrimersCheckbox()}
                            {this.renderNumberOfPoolsInput()}
                            {this.renderNumberOfCustomPrimersInput()}
                        </FormGroup>

                        {this.renderContainerTypeDropdown()}
                        {this.renderNumberOfSamplesOrLibrariesInput()}

                    </FormGroup>
                    }
                    {this.state.sf2type === "10X_old" &&
                    <FormGroup>
                        <Label>10X SF2 Options (old)</Label>

                        <FormGroup>
                            {this.renderBarcodeSetCheckbox()}
                            {this.renderHasPoolsCheckbox()}
                            {this.renderNumberOfPoolsInput()}
                        </FormGroup>

                        {this.renderContainerTypeDropdown()}
                        {this.renderNumberOfSamplesOrLibrariesInput()}

                    </FormGroup>}
                    {this.state.sf2type === "10X" &&
                    <FormGroup>
                        <Label>10X SF2 Options</Label>

                        <FormGroup>
                            {this.renderBarcodeSetCheckbox()}
                            {this.renderHasUnpooledSamplesCheckbox()}
                            {this.renderNumberOfUnpooledSamplesInput()}
                            {this.renderHasPoolsCheckbox()}
                            {this.renderNumberOfPoolsInput()}
                            {this.renderNumberOf10XSamplesInPoolsInputs()}
                            {this.state.numberOfPoolsAndUnpooledSamplesIsInvalid &&
                                <span style={{color: "#f83244"}} >Cannot create an SF2 with no pools and no unpooled samples.</span>
                            }
                        </FormGroup>
                    </FormGroup>
                    }
                    {this.state.sf2type === "Library" &&
                    <FormGroup>
                        <Label>Library SF2 Options</Label>

                        <FormGroup>
                            {this.renderCustomerIsSendingPlatesCheckbox()}
                            {this.renderHasCustomPrimersCheckbox()}
                            {this.renderNumberOfCustomPrimersInput()}
                            {this.renderHasUnpooledLibrariesCheckbox()}
                            {this.renderNumberOfUnpooledLibrariesInput()}
                            {this.renderHasPoolsCheckbox()}
                            {this.renderNumberOfPoolsInput()}
                            {this.renderNumberOfLibrariesInPoolsInputs()}
                            {this.state.numberOfPoolsAndUnpooledSamplesIsInvalid &&
                            <span style={{color: "#f83244"}} >Cannot create an SF2 with no pools and no unpooled samples.</span>
                            }
                        </FormGroup>
                    </FormGroup>
                    }
                    <FormGroup>
                        <Label for="comments">Comments</Label>
                        <Input type="textarea"
                               name="comments"
                               id="comments"
                               placeholder="Enter your comments here"
                               autoComplete="off"
                               onChange={this.handleCommentsChange}
                               onInput={this.handleCommentsChange}
                               value={this.state.comments}
                        />
                    </FormGroup>
                    <br/>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                    <span>   </span>
                    <Button disabled={!this.state.reissueIsEnabled}
                            onClick={this.handleReissue}>
                        Reissue
                    </Button>
                </Form>
            </div>
        );
    };
};
