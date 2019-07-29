"""Model classes for sf2 web application"""

import datetime
import json
import uuid

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
    def as_ascii(input_string):
        """Helper function to parse a byte string to an ascii string if necessary"""

        try:
            return input_string.decode('ascii')
        except AttributeError:
            return input_string


    @staticmethod
    def process_submission(submission):
        """Process a project setup form submission."""

        submission_str = ProjectSetupHandler.as_ascii(submission);
        submission_dict = json.loads(submission_str);
        query_string = ProjectSetupHandler.generate_query_string()

        ProjectSetupHandler.load_submission_into_db(submission_dict, query_string)
        ProjectSetupHandler.send_email(submission_dict, query_string)


    @staticmethod
    def load_submission_into_db(submission_dict, query_string, reissue_of=None):
        """Load the new submission into the sf2metadata table in the database."""

        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute(
                "INSERT INTO onlinesf2.sf2metadata (querystring, appversion, datecreated, reissueof, projectid, sf2type, containertypeisplate, numberofsamplesorlibraries, sf2isdualindex, barcodesetisna, sf2haspools, numberofpools, sf2hascustomprimers, numberofcustomprimers, hasunpooledsamplesorlibraries, numberofunpooledsamplesorlibraries, numberofsamplesorlibrariesinpools, comments) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                [
                    query_string,
                    app_version,
                    current_dt,
                    reissue_of,
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
    def send_email(submission_dict, query_string, host='127.0.0.1', port=1025, reissue=False):
        """Send an e-mail specifying the url of the new Online SF2 form."""

        project_id = submission_dict['pid']
        sf2_url = 'https://localhost:3001?{query_string}'.format(**locals())
        email_subject = """New Online SF2 created for project '{project_id}'""".format(**locals())
        action = 'reissued' if reissue else 'created'
        email_body = """
        Dear Customer,

        An Online SF2 form has been {action} for project '{project_id}'.  You can find the form at the following url:

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
                    ProjectSetupHandler.as_ascii(project_id)
                ]
            )
            count_row = cur.fetchone()

        return count_row[0] > 0


    @staticmethod
    def get_most_recent_sf2metadata_record(project_id):
        """Get the most recent record from the sf2metadata table with a given project ID"""

        with sf2_webapp.database.db_cursor() as cur:
            cur.execute(
                "SELECT * FROM onlinesf2.sf2metadata WHERE projectid = %s ORDER BY datecreated desc LIMIT 1",
                [
                    ProjectSetupHandler.as_ascii(project_id)
                ]
            )
            row = cur.fetchone()

        return row


    @staticmethod
    def reissue_sf2(reissue_details):
        """Reissue an SF2 for an existing project"""

        reissue_str = ProjectSetupHandler.as_ascii(reissue_details)
        reissue_dict = json.loads(reissue_str)
        project_id = reissue_dict['projectID']
        comments = reissue_dict['comments']

        assert ProjectSetupHandler.check_project_id(project_id), 'Error: project ID not found in the database: ' + project_id

        # Create the new record and submit it to the database
        latest_record = ProjectSetupHandler.get_most_recent_sf2metadata_record(project_id)

        new_record = {
            'pid': project_id,
            'st': latest_record[6],
            'ctp': latest_record[7],
            'nsl': latest_record[8],
            'di': latest_record[9],
            'na': latest_record[10],
            'hp': latest_record[11],
            'np': latest_record[12],
            'hc': latest_record[13],
            'nc': latest_record[14],
            'husl': latest_record[15],
            'nusl': latest_record[16],
            'nslp': latest_record[17],
            'cm': comments
        }

        new_query_string = ProjectSetupHandler.generate_query_string()

        ProjectSetupHandler.load_submission_into_db(
            submission_dict=new_record,
            query_string=new_query_string,
            reissue_of=latest_record[1]
        )

        # e-mail the customer to inform them that the form has been reissued
        ProjectSetupHandler.send_email(
            submission_dict=new_record,
            query_string=new_query_string,
            reissue=True
        )

        return reissue_str;
