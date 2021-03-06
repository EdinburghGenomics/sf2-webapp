// @flow
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


type Props = {
    onCancel: () => any,
    active: boolean
};


const DocumentationModal = (props: Props) => {

    return (
    <Modal isOpen={props.active} style={{minWidth: "95%"}} >
        <ModalHeader>Online SF2 Documentation</ModalHeader>
        <ModalBody>
            <div style={{maxHeight: 600, overflow: "scroll"}}>
            <a name="Top"/> 
            <h5>Contents</h5>
            <a href="#Introduction">Introduction</a>
            <br/>
            <a href="#Navigation">Navigation</a>
            <br/>
            <a href="#Entering">Entering text</a>
            <br/>
            <a href="#Saving">Saving your work</a>
            <br/>
            <a href="#Submitting">Submitting the SF2</a>
            <br/>
            <a href="#Help">Getting help</a>
            <br/>
            <br/>
            <h5>Introduction</h5>
            <a name="Introduction"/> 
            <p>The online SF2 form provides a convenient method of submitting the details of your samples or libraries to Edinburgh Genomics</p>
            <a href="#Top">Back to top</a>
            <br/>
            <h5>Navigation</h5>
            <a name="Navigation"/> 
            <p>The submission form consists of four main regions. These are (going from top to bottom):</p>
            <ul>
            <li>The SF2 table control panel</li>
            <li>The SF2 table</li>
            <li>The submission control panel</li>
            <li>The validation messages</li>
            </ul>
            <p>The SF2 table allows you to enter and view data associated with your samples or libraries, using a similar interface to spreadsheet applications such as Google Sheets or Microsoft Excel.</p>
            <p>The table itself is situated within a black box that can be resized using the handle at the bottom of the box.</p>
            <p>Due to the amount of information required, not all of the cells fit on the screen at once. When there are cells that are not visible, scrollbars appear inside the box. These can be used to scroll to the hidden cells. If a cell in the table is selected, you can also navigate using the arrow keys on the keyboard, as in a traditional spreadsheet application.</p>
            <a href="#Top">Back to top</a>
            <br/>
            <h5>Entering text</h5>
            <a name="Entering"/> 
            <p>Text can be entered into the SF2 table as in a traditional spreadsheet, and can be copied and pasted from other applications. However, there are a number of notable differences to traditional spreadsheets:</p>
            <ul>
            <li>User supplied spreadsheet formulas are not supported, and will be interpreted as text</li>
            <li>Corner dragging of cells to fill adjacent cells is not supported</li>
            </ul>
            <p>Four different types of cell can exist in an SF2 table. These are:</p>
            <ul>
            <li>Free text cells</li>
            <li>Autocomplete cells</li>
            <li>Select cells</li>
            <li>Calculated cells</li>
            </ul>
            <a href="#Top">Back to top</a>
            <br/>
            <h5>Saving your work</h5>
            <a name="Saving"/> 
            <p>There are three ways in which you can save your progress on an SF2 without submitting it:</p>
            <ul>
            <li>Using the 'Save' button in the submission panel. Clicking this button will save the current state of your form to the database without submitting it. When you reload the page it will appear in the state it was in when it was last saved</li>
            <li>Using the 'Download' button in the submission panel. By clicking this button, you can download the current version of your form in csv format</li>
            <li>Using the standard copy / paste functionality. This allows you to copy the contents of cells in the SF2 table so that you can paste them to an external document. This can be cumbersome for large amounts of data and is therefore not the recommended way of exporting entire tables</li>
            </ul>
            <a href="#Top">Back to top</a>
            <br/>
            <h5>Submitting the completed SF2</h5>
            <a name="Submitting"/> 
            <p>Once the SF2 form is complete, and there are no more outstanding actions listed, you can submit the form by clicking 'Submit'. Once you have confirmed your intention to submit, the form will automatically be submitted to Edinburgh Genomics for review.</p>
            <a href="#Top">Back to top</a>
            <br/>
            <h5>Getting help</h5>
            <a name="Help"/> 
            <p>Tips for completing specific columns are shown in tooltips associated with column headers. If you have any further questions, please e-mail Edinburgh Genomics.</p>
            <a href="#Top">Back to top</a>
            <br/>
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={props.onCancel}>Return to SF2 Submission Form</Button>
        </ModalFooter>
    </Modal>
)};


export default DocumentationModal;
