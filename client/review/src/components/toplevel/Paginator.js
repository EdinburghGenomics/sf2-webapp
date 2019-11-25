// @flow
import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


type PaginatorProps = {
    stage?: number
};


const Paginator = (props: PaginatorProps) => {

    // Set the active stage in the paginator based on the args
    let stageStatus = new Map([[1, "disabled"],[2, "disabled"],[3, "disabled"]]);
    stageStatus.set(props.stage, "active");

    // Function to disable navigation by clicking on pagination elements
    const disableNavigation = (e) => {e.preventDefault()};

    return (
        <Pagination style={{display: "table", width: "100%"}} aria-label="Page navigation">
            <PaginationItem className={stageStatus.get(1)} style={{display: "table-cell"}}>
                <PaginationLink href="#" onClick={disableNavigation}>
                    Stage 1: Project setup (project team)
                </PaginationLink>
            </PaginationItem>
            <PaginationItem className={stageStatus.get(2)} style={{display: "table-cell"}}>
                <PaginationLink href="#" onClick={disableNavigation}>
                    Stage 2: SF2 submission form (client)
                </PaginationLink>
            </PaginationItem>
            <PaginationItem className={stageStatus.get(3)} style={{display: "table-cell"}}>
                <PaginationLink href="#" onClick={disableNavigation}>
                    Stage 3: SF2 submission review (project team)
                </PaginationLink>
            </PaginationItem>
        </Pagination>
    );
};


export default Paginator;