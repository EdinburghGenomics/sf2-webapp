// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';


type Props = {
    redirectUrl: string,
    active: boolean
};


const Stage1Modal = (props: Props) => {return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>SF2 Submission Completed</ModalHeader>
        <ModalBody>
            <div>
                Once the client has completed the 'SF2 Submission' form,
                the project team will be sent an e-mail containing a link to a
                webpage containing a populated online SF2 form to check:
            </div>
            <a href={props.redirectUrl}>Link to the project team review page</a>
        </ModalBody>
    </Modal>
)};


export default Stage1Modal;
