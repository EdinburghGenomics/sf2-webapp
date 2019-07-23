"""Model classes for sf2 web application"""

import yaml

import sf2_webapp.database


class ProjectSetupHandler:

    @staticmethod
    def process_submission(submission):
        """Process a project setup form submission."""

        submission_dict = yaml.safe_load(submission)

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute("INSERT INTO onlinesf2.sf2metadata (projectid) VALUES (%s)", [submission_dict['pid']])
