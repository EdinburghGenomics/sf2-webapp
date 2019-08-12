"""Model classes for sf2 web application"""

import datetime
import json
import re
import uuid

import smtplib
import email.utils
import email.mime.text

import sf2_webapp.database

# Helper functions ----

def generate_query_string():
    """Helper function to generate a unique query string"""

    return str(uuid.uuid4())


def str_to_count(num):
    """Helper function to parse a string representation of a count value, with the empty string representing zero"""

    return 0 if num == '' else int(num)


def as_ascii(input_string):
    """Helper function to parse a byte string to an ascii string if necessary"""

    try:
        return input_string.decode('ascii')
    except AttributeError:
        return input_string

def sf2metadata_record_to_dict(record):
    """Helper function to convert a record from the sf2metadata table to a dict"""

    return {
        "pid": record[5],
        "st": record[6],
        "ctp": record[7],
        "nsl": record[8],
        "di": record[9],
        "na": record[10],
        "hp": record[11],
        "np": record[12],
        "hc": record[13],
        "nc": record[14],
        "husl": record[15],
        "nusl": record[16],
        "nslp": record[17],
        "cm": record[18]
    }


def send_email(email_config, web_config, project_id, query_string, email_details, stage):
    """Send an e-mail"""

    sf2_url = 'https://{address}:{port}?{query_string}'.format(
        address=web_config._asdict()[stage].address,
        port=web_config._asdict()[stage].port,
        query_string=query_string
    )

    email_subject = email_details.subject.format(project_id=project_id)
    email_body = email_details.body.format(project_id=project_id, sf2_url=sf2_url)

    email_message = email.mime.text.MIMEText(email_body)
    email_message['From'] = email.utils.formataddr(email_details.sender)
    email_message['To'] = email.utils.formataddr(email_details.recipient)
    email_message['Subject'] = email_subject

    server = smtplib.SMTP(
        email_config.smtp_server.host,
        email_config.smtp_server.port
    )

    try:
        server.sendmail(email_details.sender.address, [email_details.recipient.address], email_message.as_string())
    finally:
        server.quit()


def datetime_to_json(dt):
    return json.dumps('{:%c}'.format(dt))


# Model classes ----

class ProjectSetup:

    def __init__(self, db_connection_params, email_config, web_config):

        self.database_connection = sf2_webapp.database.DatabaseConnection(db_connection_params)
        self.email_config = email_config
        self.web_config = web_config


    def process_submission(self, submission):
        """Process a project setup form submission"""

        submission_str = as_ascii(submission);
        submission_dict = json.loads(submission_str);
        query_string = generate_query_string()

        submission_dt = self.load_submission_into_db(submission_dict, query_string)
        self.send_notification_email(submission_dict, query_string)

        return datetime_to_json(submission_dt)


    def load_submission_into_db(self, submission_dict, query_string, reissue_of=None):
        """Load the new submission into the sf2metadata table in the database"""

        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with self.database_connection.cursor() as cur:
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
                    str_to_count(submission_dict['nsl']),
                    submission_dict['di'],
                    submission_dict['na'],
                    submission_dict['hp'],
                    str_to_count(submission_dict['np']),
                    submission_dict['hc'],
                    str_to_count(submission_dict['nc']),
                    submission_dict['husl'],
                    str_to_count(submission_dict['nusl']),
                    str(submission_dict['nslp']),
                    submission_dict['cm']
                ]
            )

        return current_dt


    def send_notification_email(self, submission_dict, query_string, reissue=False):
        """Send an e-mail specifying the url of the new Online SF2 form"""

        email_details = self.email_config.reissue_email if reissue else self.email_config.submission_email
        project_id = submission_dict['pid']

        send_email(
            email_config=self.email_config,
            web_config=self.web_config,
            project_id=project_id,
            query_string=query_string,
            email_details=email_details,
            stage='customer_submission'
        )


    def check_project_id(self, project_id):
        """Check whether the specified project id is present in the database"""

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) FROM onlinesf2.sf2metadata WHERE projectid = %s",
                [
                    as_ascii(project_id)
                ]
            )
            count_row = cur.fetchone()

        return count_row[0] > 0


    def get_latest_sf2metadata_record_with_project_id(self, project_id):
        """Get the most recent record from the sf2metadata table with a given project ID"""

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT * FROM onlinesf2.sf2metadata WHERE projectid = %s ORDER BY datecreated desc LIMIT 1",
                [
                    as_ascii(project_id)
                ]
            )
            row = cur.fetchone()

        return row


    def reissue_sf2(self, reissue_details):
        """Reissue an SF2 for an existing project"""

        reissue_str = as_ascii(reissue_details)
        reissue_dict = json.loads(reissue_str)
        project_id = reissue_dict['projectID']
        comments = reissue_dict['comments']

        assert self.check_project_id(project_id), 'Error: project ID not found in the database: ' + project_id

        # Create the new record and submit it to the database
        latest_record = self.get_latest_sf2metadata_record_with_project_id(project_id)
        new_record_dict = sf2metadata_record_to_dict(latest_record)
        new_record_dict['cm'] = comments

        new_query_string = generate_query_string()

        self.load_submission_into_db(
            submission_dict=new_record_dict,
            query_string=new_query_string,
            reissue_of=latest_record[1]
        )

        # e-mail the customer to inform them that the form has been reissued
        self.send_notification_email(
            submission_dict=new_record_json,
            query_string=new_query_string,
            reissue=True
        )

        return reissue_str;


class CustomerSubmission:

    def __init__(self, db_connection_params, email_config, web_config):

        self.database_connection = sf2_webapp.database.DatabaseConnection(db_connection_params)
        self.email_config = email_config
        self.web_config = web_config


    def get_latest_sf2metadata_record_with_query_string(self, query_string):

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT * FROM onlinesf2.sf2metadata WHERE querystring = %s ORDER BY datecreated desc LIMIT 1",
                [
                    as_ascii(query_string)
                ]
            )
            row = cur.fetchone()

            return row


    def get_initial_state(self, query_string):

        qs = re.sub('^.*: ', '', as_ascii(query_string))
        qs = re.sub('}$', '', qs)

        initial_state_row = self.get_latest_sf2metadata_record_with_query_string(qs)
        initial_state_json = json.dumps(sf2metadata_record_to_dict(initial_state_row))

        return initial_state_json


    def get_latest_sf2metadata_record_with_query_string(self, query_string):

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT * FROM onlinesf2.sf2metadata WHERE querystring = %s ORDER BY datecreated desc LIMIT 1",
                [
                    as_ascii(query_string)
                ]
            )
            row = cur.fetchone()

            return row


    def get_initial_state(self, query_string):

        qs = re.sub('^.*: ', '', as_ascii(query_string))
        qs = re.sub('}$', '', qs)

        initial_state_row = self.get_latest_sf2metadata_record_with_query_string(qs)
        initial_state_json = json.dumps(sf2metadata_record_to_dict(initial_state_row))

        return initial_state_json


    def load_sf2_into_db(self, query_string, sf2_contents, action, stage):
        """Load an SF2 into the sf2data table in the database"""

        app_version = sf2_webapp.__version__
        current_dt = datetime.datetime.now()

        with self.database_connection.cursor() as cur:
            cur.execute(
                "INSERT INTO onlinesf2.sf2data (querystring, appversion, datecreated, sf2contents, action, stage) VALUES (%s, %s, %s, %s, %s, %s)",
                [
                    query_string,
                    app_version,
                    current_dt,
                    sf2_contents,
                    action,
                    stage
                ]
            )

        return current_dt


    def get_project_id_for_query_string(self, query_string):
        """Get the project ID for a given query string"""

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT projectid FROM onlinesf2.sf2metadata WHERE querystring = %s ORDER BY datecreated desc LIMIT 1",
                [
                    query_string
                ]
            )
            row = cur.fetchone()

        return row[0]


    def process_submission(self, submission):
        """Process a customer submission"""

        submission_dict = json.loads(as_ascii(submission))

        query_string = submission_dict['queryString']
        sf2_contents = json.dumps(submission_dict['submissionData']['tables'])

        submission_dt = self.load_sf2_into_db(
            query_string=query_string,
            sf2_contents=sf2_contents,
            action='submit',
            stage='customer_submission'
        )

        project_id = self.get_project_id_for_query_string(query_string)

        self.send_notification_email(
            project_id=project_id,
            query_string=submission_dict['queryString']
        )

        return datetime_to_json(submission_dt)


    def send_notification_email(self, project_id, query_string):
        """Send an e-mail specifying the url of the Online SF2 form ready for review"""

        send_email(
            email_config=self.email_config,
            web_config=self.web_config,
            project_id=project_id,
            query_string=query_string,
            email_details=self.email_config.review_email,
            stage='review'
        )
