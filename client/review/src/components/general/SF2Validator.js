// @flow
import React from 'react';
import * as R from 'ramda';

import { Button } from 'reactstrap';

import SF2DataSheetWrapper from './SF2DataSheetWrapper';

import type { GridWithID, Warnings, Stage1FormState } from '../../types/flowTypes';
import type { Columns, Grid, StringMap } from '../../sf2datasheet/types/flowTypes';

import { getDuplicateMessage, getDuplicateWarnings, getRepeatedKeys, getRowID } from "../../functions/lib";


type SF2ValidatorProps = {
    id: string,
    columns: Columns,
    data?: StringMap,
    frozenColumns: Columns,
    frozenGrid?: ?Grid,
    initialGrid?: Grid,
    initialState: Object,
    handleSubmission: () => void,
    handleSave: () => void,
    handleDownload: () => void,
    showDocumentation: () => {},
    updateHasErrors: (string, boolean) => void,
    updateGrids: GridWithID => void,
    updateWarningList?: Warnings => void,
    showHiddenColumns: boolean,
    topRowNumber: number,
    submitDisabled: boolean,
    saveDisabled: boolean,
    tableType: string,
    validator?: (Array<string>, Grid) => Array<string>,
    disallowDuplicateIDs?: ?boolean,
    warnings?: Warnings
};


export default class SF2Validator extends React.Component<SF2ValidatorProps, Stage1FormState> {
    grid = [];


    constructor (props : Object) {
        super(props);

        this.state = this.props.initialState;
        Object.assign(this.state, {
            errors: [],
            warnings: [],
            submitDisabled: true
        });

        if(R.isNil(this.props.initialGrid)) {
            this.grid = R.repeat([], this.state.numberOfSamplesOrLibraries);
        } else {
            this.grid = this.props.initialGrid
        }

    };


    componentDidMount() {
        this.checkGridForErrors();
    }


    updateParentErrors = () => {
        // tell the parent component when the error status changes
        if(this.state.errors.length === 0) {
            this.props.updateHasErrors(this.props.id, false);
        } else if(this.state.errors.length > 0) {
            this.props.updateHasErrors(this.props.id, true);
        }
    };


    checkGridForErrors = () : void => {

        // check the grid for errors
        const validationResults = this.getValidationResults();

        const errors = validationResults.errors;
        const warnings = validationResults.warnings;

        if (!R.equals(errors, this.state.errors)) {
            this.setState({errors: errors}, this.updateParentErrors);
        } else {
            this.updateParentErrors();
        }

        if (!R.equals(warnings, this.state.warnings)) {
            this.setState({warnings: warnings}, () => {
                if(!R.isNil(this.props.updateWarningList)) {
                    this.props.updateWarningList(warnings);
                }
            })
        }

    };


    updateParentGrids = () : void => {

        const gridWithID = {
            id: this.props.id,
            grid: this.grid
        };

        this.props.updateGrids(gridWithID);

    };


    onUpdateGrid = (newGrid : Grid) : void => {

        this.grid = newGrid;
        this.updateParentGrids();
        this.checkGridForErrors();

    };


    getValidationResults = () => {

        let errors = [];
        let warnings = [];

        if(this.grid !== undefined && this.grid !== null) {

            const repeatedKeys = getRepeatedKeys(0, this.grid);

            // per cell validation rules
            this.grid.forEach((row, rowIndex) => {

                const rowErrors = [];

                const rowID = getRowID(rowIndex, 0, this.props.frozenGrid);

                // add errors for repeated keys if appropriate
                if(this.props.disallowDuplicateIDs === true && R.contains(row[0].value, repeatedKeys)) {
                    const duplicateMessage = getDuplicateMessage(
                        row[0].value,
                        rowID,
                        this.props.columns[0].value
                    );
                    rowErrors.push(duplicateMessage);
                }

                row.forEach((cell, colIndex) => {

                    const thisColumn = this.props.columns[colIndex];
                    const colName = thisColumn.value;
                    const colValidation = R.isNil(thisColumn.validation) ? '' : thisColumn.validation;
                    const validationRules = (R.split(',', colValidation));
                    const ruleExists = rule => R.contains(rule, validationRules);

                    if (
                        (ruleExists('required')) &&
                        cell.value === ""
                    ) {
                        rowErrors.push("Missing value for required field, row '" + rowID + "', column '" + colName + "'");
                    }

                    if (
                        (ruleExists('number')) &&
                        cell.value !== "" &&
                        !(new RegExp(/^\d+(\.\d+)?$/).test(cell.value))
                    ) {
                        rowErrors.push("Value must be a number, row '" + rowID + "', column '" + colName + "'");
                    }

                    if (
                        (ruleExists('yesOrNo')) &&
                        cell.value !== "" &&
                        !(new RegExp(/^(y|n|yes|no)$/i).test(cell.value))
                    ) {
                        rowErrors.push("Value must be Yes or No, row '" + rowID + "', column '" + colName + "'");
                    }

                    if (
                        (ruleExists('nucleotideSequence')) &&
                        cell.value !== "" &&
                        !(new RegExp(/^[NACTG]*$/).test(cell.value))
                    ) {
                        rowErrors.push("Value must be a valid nucleotide sequence, row '" + rowID + "', column '" + colName + "'");
                    }


                });

                errors = errors.concat(rowErrors);

            });

            // add warnings for duplicate IDs if necessary
            if(this.props.disallowDuplicateIDs !== true) {
                warnings = getDuplicateWarnings(
                    0,
                    this.props.columns,
                    this.grid,
                    this.props.frozenGrid,
                    repeatedKeys
                );
            }

        }

        // add SF2 specific errors if they exist
        if(!R.isNil(this.props.validator)) {
            errors = this.props.validator(errors, this.grid, this.props.frozenGrid);
        }

        return {errors: errors, warnings: warnings};

    };


    getPluralTableType = () => {

        if (this.state.sf2type === 'Library') {
            return 'libraries'
        } else {
            return 'samples'
        }

    };


    showDocumentation = () => {
        this.props.showDocumentation();
    };


    getButtonDisabled = (disabledProp : Boolean) : Boolean => {

        const submittedAtElement = document.getElementById("submittedAt");
        const submittedAt = R.propOr('', 'textContent')(submittedAtElement);
        return submittedAt.length > 0 || disabledProp;

    };


    render() {

        return (
            <div>{/*style={{border: "1px solid green"}}>}*/}
                <span>Please enter the details of your {this.getPluralTableType()} in the grid below. Fields marked with * are required. Please click <a href={"#"} onClick={this.showDocumentation}>here</a> for more information on how to use this form.</span>
                <SF2DataSheetWrapper
                    id={this.props.id}
                    columns={this.props.columns}
                    data={this.props.data}
                    initialGrid={this.grid}
                    onUpdateGrid={this.onUpdateGrid}
                    showHiddenColumns={this.props.showHiddenColumns}
                    frozenColumns={this.props.frozenColumns}
                    frozenGrid={this.props.frozenGrid}
                    projectID={this.state.projectID}
                    topRowNumber={this.props.topRowNumber}
                    sf2type={this.state.sf2type}
                    tableType={this.props.tableType}
                    containerTypeIsPlate={this.state.containerTypeIsPlate}
                />
                <p><em>1. If the source of your samples is human or other organism covered by regulatory controls such as the Human Tissue regulations or CITES regulations we require you to affirm to us that all samples are covered by relevant licences and ethical permissions. You should note that we are not a clinical diagnostic service, and you should not use us as such.</em></p>
                <Button onClick={this.props.handleSave} disabled={this.getButtonDisabled(this.props.saveDisabled)}>Save</Button>
                <span>    </span>
                <Button onClick={this.props.handleDownload} disabled={this.getButtonDisabled(false)}>Download</Button>
                <span>    </span>
                <Button onClick={this.props.handleSubmission} disabled={this.getButtonDisabled(this.props.submitDisabled)}>Submit</Button>
                <br/>
                <br/>
                <div style={{width: "1000px", wordBreak: "break-word"}}>
                    {this.state.errors.length > 0 && <h5 style={{color: "red"}}>Outstanding actions for SF2 table:</h5>}
                    {this.state.errors.length > 0 && <ul style={{color: "red"}}>
                        {
                            this.state.errors.map(error => <li key={error}>{error}</li>)
                        }
                    </ul>}
                    {this.state.warnings.length > 0 && <ul style={{color: "#FF9F00"}}>
                        {
                            this.state.warnings.map(warning => <li key={warning.message}>Warning: {warning.message}</li>)
                        }
                    </ul>}
                </div>
            </div>
    )};
};
