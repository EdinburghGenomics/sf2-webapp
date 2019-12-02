.. SF2 Webapp documentation master file, created by
   sphinx-quickstart on Thu Nov 28 11:55:40 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to SF2 Webapp's documentation!
======================================

The SF2 Web Application provides a user friendly web based interface through which information about samples and libraries to be processed can be submitted to Edinburgh Genomics by customers. It also provides Edinburgh Genomics staff with web based interfaces for setting up projects, and for reviewing submissions, along with the ability to automatically upload the reviewed projects to a Clarity LIMS.

The application consists of three distinct React Single Page Applications running in the user's browser, each of which communicates with its own Tornado web service running on the server.  These are:

* The `Project Setup` page, which is used by Edinburgh Genomics staff to set up projects and initialise SF2 forms
* The `Customer Submission` page, which displays an SF2 form to the customer, which the customer can fill in and submit for review
* The `Review` page, which displays the completed SF2 form to Edinburgh Genomics staff.  Submitting this form results in the contents of the SF2 being uploaded to the LIMS

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   dev-environment
   


