// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


type Props = {
    onConfirm: () => any,
    onCancel: () => any,
    active: boolean,
    warnings: ?Array<any>
};


const WarningModal = (props: Props) => {

    return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>SF2 contains warnings</ModalHeader>
        <ModalBody>
            <div>This SF2 contains the following warnings:</div>
            <br/>
            <div style={{height: "150px", overflowY: "auto", border: "1px solid grey", padding: "10px"}}>
                {props.warnings && props.warnings.map(x=><div>{x.message}</div>)}
            </div>
            <br/>
            <div>Do you want to submit the SF2 anyway?</div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={props.onCancel}>No</Button>{' '}
            <Button color="secondary" onClick={props.onConfirm}>Yes</Button>
        </ModalFooter>
    </Modal>
)};


export default WarningModal;
