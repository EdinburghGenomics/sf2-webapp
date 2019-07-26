"""Model classes for sf2 web application"""

import datetime
import uuid
import yaml

import smtplib
import email.utils
import email.mime.text

import sf2_webapp.database


class ProjectSetupHandler:

    @staticmethod
    def generate_query_string():
        """Helper function to generate a unique query string."""

        return str(uuid.uuid4())


    @staticmethod
    def str_to_count(num):
        """Helper function to parse a string representation of a count value, with the empty string representing zero."""

        return 0 if num == '' else int(num)


    @staticmethod
    def process_submission(submission):
        """Process a project setup form submission."""

        submission_dict = yaml.safe_load(submission)

        assert isinstance(submission_dict, dict), "Error: yaml parsing failed"

        query_string = ProjectSetupHandler.generate_query_string()

        ProjectSetupHandler.load_submission_into_db(submission_dict, query_string)

        ProjectSetupHandler.send_email(submission_dict, query_string)


    @staticmethod
    def load_submission_into_db(submission_dict, query_string):
        """Load the new submission into the sf2metadata table in the database."""

        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute(
                "INSERT INTO onlinesf2.sf2metadata (querystring, appversion, datecreated, projectid, sf2type, containertypeisplate, numberofsamplesorlibraries, sf2isdualindex, barcodesetisna, sf2haspools, numberofpools, sf2hascustomprimers, numberofcustomprimers, hasunpooledsamplesorlibraries, numberofunpooledsamplesorlibraries, numberofsamplesorlibrariesinpools, comments) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
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
                    str(submission_dict['nslp']),
                    submission_dict['cm']
                ]
            )


    @staticmethod
    def send_email(submission_dict, query_string, host='127.0.0.1', port=1025):
        """Send an e-mail specifying the url of the new Online SF2 form."""

        project_id = submission_dict['pid']
        sf2_url = 'https://localhost:3001?{query_string}'.format(**locals())
        email_subject = """New Online SF2 created for project '{project_id}'""".format(**locals())
        email_body = """
        Dear Customer,

        A new Online SF2 form has been created for project '{project_id}'.  You can find the form at the following url:

        {sf2_url}

        Please do not hesitate to contact us if you need any assistance completing the form.

        Best wishes,

        Edinburgh Genomics
        """.format(**locals())
        email_sender = 'Online SF2 Project Setup', 'online-sf2-project-setup@edinburgh-genomics.ed.ac.uk'
        email_recipient = 'Edinburgh Genomics Admin', 'genepool-admin@ed.ac.uk'

        email_message = email.mime.text.MIMEText(email_body)
        email_message['From'] = email.utils.formataddr(email_sender)
        email_message['To'] = email.utils.formataddr(email_recipient)
        email_message['Subject'] = email_subject

        server = smtplib.SMTP(host, port)

        try:
            server.sendmail(email_sender[1], [email_recipient[1]], email_message.as_string())
        finally:
            server.quit()


    @staticmethod
    def check_project_id(project_id):
        """Check whether the specified project id is present in the database"""

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) FROM onlinesf2.sf2metadata WHERE projectid = %s",
                [
                    project_id.decode('ascii')
                ]
            )
            count_row = cur.fetchone()

        return count_row[0] > 0
