// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


type Props = {
    onOK: () => any,
    active: boolean
};


const ErrorModal = (props: Props) => {

    return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>Cannot submit SF2</ModalHeader>
        <ModalBody>
            <div>
                You cannot submit an SF2 form that contains errors. Please correct the remaining errors before proceeding.
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={props.onOK}>OK</Button>{' '}
        </ModalFooter>
    </Modal>
)};


export default ErrorModal;
