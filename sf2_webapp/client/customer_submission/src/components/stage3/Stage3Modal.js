// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';


type Props = {
    redirectUrl: string,
    active: boolean
};


const Stage3Modal = (props: Props) => {return (
    <Modal isOpen={props.active} style={{minWidth: "75%"}} >
        <ModalHeader>SF2 Review Completed</ModalHeader>
        <ModalBody>
            <div>
                Once the project team member has completed the review,
                the information in the SF2 is automatically sent to the LIMS.
            </div>
            <br/>
            <a href={props.redirectUrl}>Restart Demo</a>
        </ModalBody>
    </Modal>
)};


export default Stage3Modal;
