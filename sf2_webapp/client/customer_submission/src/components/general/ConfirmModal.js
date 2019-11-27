// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


type Props = {
    onConfirm: () => any,
    onCancel: () => any,
    active: boolean
};


const ConfirmModal = (props: Props) => {

    return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>Confirm Submission</ModalHeader>
        <ModalBody>
            <div>
                Are you sure you want to submit this SF2?
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={props.onConfirm}>Confirm</Button>{' '}
            <Button color="secondary" onClick={props.onCancel}>Cancel</Button>
        </ModalFooter>
    </Modal>
)};


export default ConfirmModal;
