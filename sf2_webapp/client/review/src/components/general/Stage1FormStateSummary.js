// @flow
import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import { Stage1FormState } from '../../types/flowTypes';
import { getNumSamplesOrLibrariesLabel } from "../../functions/lib";


const Stage1FormStateSummary = (props: Stage1FormState) => {


    const numberOfSamplesOrLibrariesLabel = getNumSamplesOrLibrariesLabel(props.sf2type);


    const colStyle = {padding: ".75rem", backgroundColor: "#E5EDF5", border: "1px solid #C9C1D5", color: "#5F5F5F"};


    return (
        <div>
            <Container style={{maxWidth: "100%"}}>
                <Row>
                    <Col style={colStyle}>Project ID: {props.projectID}</Col>
                    <Col style={colStyle}>SF2 type: {props.sf2type}</Col>
                    <Col style={colStyle}>Container type is plate: {props.containerTypeIsPlate ? "yes" : "no"}</Col>
                </Row>
                {props.sf2type === "Sample" &&
                <Row>
                    <Col style={colStyle}>{numberOfSamplesOrLibrariesLabel}: {props.numberOfSamplesOrLibraries}</Col>
                </Row>}
                {props.sf2type === "Library_old" &&
                <Row>
                    <Col style={colStyle}>{numberOfSamplesOrLibrariesLabel}: {props.numberOfSamplesOrLibraries}</Col>
                    <Col style={colStyle}>SF2 is Dual Index: {props.sf2IsDualIndex ? "yes" : "no"}</Col>
                    <Col style={colStyle}>SF2 has Pools: {props.sf2HasPools ? "yes" : "no"}</Col>
                    {props.sf2HasPools && <Col style={colStyle}>Number of Pools: {props.numberOfPools}</Col>}
                    <Col style={colStyle}>SF2 has Custom Primers: {props.sf2HasCustomPrimers ? "yes" : "no"}</Col>
                    {props.sf2HasCustomPrimers && <Col style={colStyle}>Number of Custom Primers: {props.numberOfCustomPrimers}</Col>}
                </Row>}
                {props.sf2type === "10X_old" &&
                <Row>
                    <Col style={colStyle}>{numberOfSamplesOrLibrariesLabel}: {props.numberOfSamplesOrLibraries}</Col>
                    <Col style={colStyle}>Library has NA Barcode Set: {props.barcodeSetIsNA ? "yes" : "no"}</Col>
                    <Col style={colStyle}>SF2 has Pools: {props.sf2HasPools ? "yes" : "no"}</Col>
                    {props.sf2HasPools && <Col style={colStyle}>Number of Pools: {props.numberOfPools}</Col>}
                </Row>}
                {props.sf2type === "10X" &&
                <Row>
                    <Col style={colStyle}>Library has NA Barcode Set: {props.barcodeSetIsNA ? "yes" : "no"}</Col>
                    <Col style={colStyle}>SF2 has Pools: {props.sf2HasPools ? "yes" : "no"}</Col>
                    {props.sf2HasPools && <Col style={colStyle}>Number of Pools: {props.numberOfPools}</Col>}
                    <Col style={colStyle}>SF2 has Unpooled Samples: {props.sf2HasUnpooledSamplesOrLibraries ? "yes" : "no"}</Col>
                    {props.sf2HasUnpooledSamples && <Col style={colStyle}>Number of Unpooled Samples: {props.numberOfUnpooledSamplesOrLibraries}</Col>}
                    {props.sf2HasPools && <Col style={colStyle}>Number of 10X Samples in Pools: {props.numberOfSamplesOrLibrariesInPools}</Col>}
                </Row>}
                {props.sf2type === "Library" &&
                <div>
                    <Row>
                        <Col style={colStyle}>SF2 is Dual Index: {props.sf2IsDualIndex ? "yes" : "no"}</Col>
                        <Col style={colStyle}>SF2 has Pools: {props.sf2HasPools ? "yes" : "no"}</Col>
                        {props.sf2HasPools && <Col style={colStyle}>Number of Pools: {props.numberOfPools}</Col>}
                        {props.sf2HasPools && <Col style={colStyle}>Number of Libraries in Pools: {props.numberOfSamplesOrLibrariesInPools}</Col>}
                    </Row>
                    <Row>
                        <Col style={colStyle}>SF2 has Unpooled Libraries: {props.sf2HasUnpooledSamplesOrLibraries ? "yes" : "no"}</Col>
                        {props.sf2HasUnpooledSamplesOrLibraries && <Col style={colStyle}>Number of Unpooled Libraries: {props.numberOfUnpooledSamplesOrLibraries}</Col>}
                        <Col style={colStyle}>SF2 has Custom Primers: {props.sf2HasCustomPrimers ? "yes" : "no"}</Col>
                        {props.sf2HasCustomPrimers && <Col style={colStyle}>Number of Custom Primers: {props.numberOfCustomPrimers}</Col>}
                    </Row>
                </div>}
            </Container>
        </div>
    )};


export default Stage1FormStateSummary;