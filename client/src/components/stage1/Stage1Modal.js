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
                Once the Edinburgh Genomics staff member has completed the 'Project Setup' form,
                the project team will be sent an e-mail containing a link to a
                webpage containing online SF2 forms set up as specified in the project setup form:
            </div>
            <a href={props.formUrl}>Link to the online SF2 forms</a>
        </ModalBody>
    </Modal>
)};


export default Stage1Modal;
