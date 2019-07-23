"""Model classes for sf2 web application"""

import datetime
import uuid
import yaml

import sf2_webapp.database


class ProjectSetupHandler:

    @staticmethod
    def generate_query_string():
        """Helper function to generate a unique query string."""

        return str(uuid.uuid4())


    @staticmethod
    def str_to_count(num):
        return 0 if num == '' else int(num)


    @staticmethod
    def process_submission(submission):
        """Process a project setup form submission."""

        submission_dict = yaml.safe_load(submission)
        query_string = ProjectSetupHandler.generate_query_string()

        ProjectSetupHandler.load_submission_into_db(submission_dict, query_string)


    @staticmethod
    def load_submission_into_db(submission_dict, query_string):

        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute(
                "INSERT INTO onlinesf2.sf2metadata (querystring, appversion, datecreated, projectid, sf2type, containertypeisplate, numberofsamplesorlibraries, sf2isdualindex, barcodesetisna, sf2haspools, numberofpools, sf2hascustomprimers, numberofcustomprimers, hasunpooledsamplesorlibraries, numberofunpooledsamplesorlibraries, numberofsamplesorlibrariesinpools) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                [
                    query_string,
                    app_version,
                    current_dt,
                    submission_dict['pid'],
                    submission_dict['st'],
                    submission_dict['ctp'],
                    ProjectSetupHandler.str_to_count(submission_dict['nsl']),
                    submission_dict['di'],
                    submission_dict['na'],
                    submission_dict['hp'],
                    ProjectSetupHandler.str_to_count(submission_dict['np']),
                    submission_dict['hc'],
                    ProjectSetupHandler.str_to_count(submission_dict['nc']),
                    submission_dict['husl'],
                    ProjectSetupHandler.str_to_count(submission_dict['nusl']),
                    str(submission_dict['nslp'])
                ]
            )
