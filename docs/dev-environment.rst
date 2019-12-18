Setting up a development environment
====================================

These steps describe how to set up a development environment on your local machine using Docker.

.. role:: bash(code)
   :language: bash

Setting up an environment for python server side development
------------------------------------------------------------

* Clone the github repository, using the command :bash:`git clone git@github.com:EdinburghGenomics/sf2-webapp.git`.  The project follows the `git flow` branching model, so the latest development code can be obtained by checking out the `develop` branch
* Create a new python 3.4 virtual environment
* Activate the virtual environment and install the app using pip in the venv, making it editable for hot reloading of modified python by navigating to the project folder and running :bash:`pip install –editable .`
* Run the python unit tests by running :bash:`python setup.py test` in the project folder
* Copy the example configuration files in the config folder from the sf2-webapp project folder to `.sf2webapp/config` in your home directory, and create a `.sf2webapp/logs` folder, in which the tornado log file is written by the app  
* Update the config files as required, and add a file called `lims_config.yaml` to the config directory containing the login details of your instance of Clarity LIMS, using the following template:

  .. code-block:: yaml
                  
     lims_url: [your lims url]
     lims_user: [your lims username]
     lims_password: [your lims password]
  
* Install `docker`_ (if it’s not already present) and stop the existing `PostgreSQL`_ server on your computer (if you have one)
* Run the following command in the project folder to create a new docker container with the `PostgreSQL`_ 9.4 database initialised correctly:

  .. code-block:: bash
  
     docker run --name db2 -e POSTGRES_PASSWORD=pw \
       -v scripts/InitialiseDB.sh:/docker-entrypoint-initdb.d/ \
       -d -p 5432:5432 postgres:9.4.22-alpine

* Test the database by running the following commands:

  .. code-block:: bash
                  
     psql –h 0.0.0.0 -p 5432 --username onlinesf2-app \
       --dbname onlinesf2-dev -c 'SELECT * FROM onlinesf2.sf2metadata'

     psql –h 0.0.0.0 -p 5432 --username onlinesf2-app \
       --dbname onlinesf2-dev -c 'SELECT * FROM onlinesf2.sf2data'

* Run :bash:`scripts/dev_smtp_server.py` in the project folder (with your virtual environment active) to start a new test smtp server
* Run :bash:`start_sf2_webapp` to start the application, and navigate to `localhost:8000` to see the Project Setup page
     
Extending the environment to allow front end JavaScript development
-------------------------------------------------------------------

The steps detailed in the previous section should be sufficient for you to work on the server side python code.  If you also need to make changes to the front end JavaScript code, you need to perform the following additional actions:

* Stop the `start_sf2_webapp` process
* Install `create-react-app`_
* Run :bash:`start_sf2_webapp –enable-cors`, to start the server with CORS enabled.  This makes it possible to call the back end web services from pages served on different ports (i.e. by the react development servers)
* Navigate to the client app directories in the client folder.  In each of these directories run :bash:`yarn test` to run the unit tests, then :bash:`yarn start` to run the application itself.  In each case the port on which the relevant page is deployed is hardcoded in the package.json file.  The ports are:
    * 3000 for the Project Setup form
    * 3001 for the Customer Submission form
    * 3002 for the Review form
* Open a browser and navigate to `localhost:[port]` to run the development version of each web page.  Changes to the underlying JavaScript code will be reflected in these pages
* When the code has been updated, run :bash:`yarn build` to build the production JavaScript to be served by the tornado server

.. _docker: https://www.docker.com/
.. _PostgreSQL: https://www.postgresql.org/
.. _create-react-app: https://github.com/facebook/create-react-app
.. _git flow: https://nvie.com/posts/a-successful-git-branching-model/
