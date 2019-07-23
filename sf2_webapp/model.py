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
    def process_submission(submission):
        """Process a project setup form submission."""

        submission_dict = yaml.safe_load(submission)

        query_string = ProjectSetupHandler.generate_query_string()
        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute("INSERT INTO onlinesf2.sf2metadata (querystring, appversion, datecreated, projectid) VALUES (%s, %s, %s, %s)", [query_string, app_version, current_dt, submission_dict['pid']])
