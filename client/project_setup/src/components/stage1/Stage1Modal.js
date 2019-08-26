// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';


type Props = {
    active: boolean,
    formUrl: string
};


const Stage1Modal = (props: Props) => {return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>Project Setup Completed</ModalHeader>
        <ModalBody>
            <div>
            The contents of the Project Setup form have been saved to the database.
            </div>
            <br/>
            <a href={props.formUrl}>Return to Project Setup form</a>
        </ModalBody>
    </Modal>
)};


export default Stage1Modal;
