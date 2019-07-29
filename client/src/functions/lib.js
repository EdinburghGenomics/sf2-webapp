// @flow
// Helper functions for the SF2 webapp demo

import * as R from 'ramda';


export const eventTargetIsValid = (event : Object) => {
    return R.isNil(event.target.validity) ? false : (event.target.validity.valid === true);
};


export const getNumSamplesOrLibrariesLabel = (sf2type : string) : string => {

    switch(sf2type) {
        case 'Sample':
            return 'Number of samples';
        case 'Library_old':
            return 'Number of libraries';
        case '10X_old':
            return 'Number of 10X samples';
        default:
            return 'Error: SF2 type not recognised';
    }

};


export const getNumSamplesOrLibrariesPlaceholder = (sf2type : string) : string => {

    switch(sf2type) {
        case 'Sample':
            return 'Enter the number of samples here';
        case 'Library_old':
            return 'Enter the number of libraries here';
        case '10X_old':
            return 'Enter the number of 10X samples here';
        default:
            return 'Error: SF2 type not recognised';
    }

};


export const getCallbackHref = (location : Object) : string => {

    // work out web service url
    let href = '';
    if(location.port === "3000") {
        // running in dev environment, just use hardcoded url
        href = 'http://localhost:8888/';
    } else {
        // running in test / production, infer url from window.location
        href = location.href;
    }

    return href;

};
