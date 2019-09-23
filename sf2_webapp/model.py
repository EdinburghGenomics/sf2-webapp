"""Model classes for sf2 web application"""

import datetime
import functools
import itertools
import json
import re
import uuid

import smtplib
import email.utils
import email.mime.text

import sf2_webapp.database

from operator import itemgetter
from pprint import pprint
from pyclarity_lims.lims import Lims
from pyclarity_lims.entities import Container, Containertype, Sample, Project

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


# Helper classes ----

class TsvGenerator:
    """Class to convert a json dict into a tsv file"""


    sf2_frozen_rows = {
        'SampleInformation': ['EG Sample ID', 'Well ID'],
        '10XSampleInformation': ['EG 10X Sample ID', 'EG 10X Submission ID'],
        'LibraryInformation': ['EG Library ID', 'EG Submission ID', 'Well ID'],
        'PrimerInformation': ['EG Primer ID']
    }


    sf2_rows = {
        'SampleInformation': [
            'Your Sample ID',
            'Genus_Species_NCBITaxonID',
            'Reference Genome',
            'Conc (ng/\u03BCl)',
            'Volume (\u03BCl)',
            'Quantification Method',
            'Yield (ng)',
            'Image Available',
            'Storage Buffer',
            'DIN / RIN Value',
            '260 / 280nm Ratio',
            'Sample Type',
            'Tissue',
            'Extraction Method',
            'PCR Product Length (bp)',
            'Fragment Size (sheared only) (bp)',
            'Potential Biological Contaminants',
            'DNAse Treated?',
            'RNAse Treated?',
            'Type of RNAse used?',
            'Comments',
            'Library Type',
            'Sequencing Type',
            'Sequencing Chemistry',
            'Platform',
            'Number of Lanes',
            'QC Workflow'
        ],
        '10XSampleInformation': [
            'Your 10X Sample ID',
            '10X Genomics Barcode Set',
            '10X Sample Conc. (ng/\u03BCl)',
            'Pool Concentration',
            'Pool Size',
            '10X Sample Vol. (\u03BCl)',
            'Genus_Species_TaxonID',
            'Quantification Method',
            'Image Available',
            'Storage Buffer',
            'Average 10X Sample Size (bp)',
            'Estimated Molarity (nM)',
            'Potential Biological Contaminants',
            'Comments'
        ],
        'PrimerInformation': [
            'Your Primer ID',
            'Primer Conc. (\u03BCM)',
            'Primer Vol. (\u03BCl)',
            'Storage Buffer',
            'Custom Primer details',
            'Primer Sequence',
            'Comments'
        ],
        'LibraryInformation': [
            'Your Library ID',
            'Species_TaxonID',
            'Library Conc. (ng/\u03BCl)',
            'Library Vol. (\u03BCl)',
            'Quantification Method',
            'Image Available',
            'Storage Buffer',
            'Library Type',
            'Average Library Size (bp)',
            'Estimated Molarity (nM)',
            'First Index (I7) Sequence',
            'Second Index (I5) Sequence',
            'Custom Primer',
            'Potential Biological Contaminants',
            'Comments'
        ]
    }


    @staticmethod
    def row_to_tsv(row):  # List<dict> -> String
        """Function that converts a table row to a tsv string"""

        return '\t'.join(
            (cell['value'] for cell in row)
        )


    @staticmethod
    def json_to_tsv(tables, frozen_grids, sf2_rows, sf2_frozen_rows, has_plates, table_name=''):  # type: (dict, dict, dict, dict, boolean, String) -> String
        """Function that converts a json dict to a tsv string"""

        sf2_rows = TsvGenerator.sf2_rows
        sf2_frozen_rows = TsvGenerator.sf2_frozen_rows

        lines = []

        if 'name' in tables:
            lines.append(str(tables['name']))
            lines.append("")

        if 'id' in tables and has_plates:
            lines.append(str(tables['id']))
            lines.append("")

        if 'grids' in tables:
            for grid, frozen_grid in zip(tables['grids'], frozen_grids['grids']):
                lines.extend(TsvGenerator.json_to_tsv(grid, frozen_grid, sf2_rows, sf2_frozen_rows, has_plates, table_name=table_name))

        elif 'grid' in tables:
            header_written = False
            for grid_row, frozen_grid_row in zip(tables['grid'], frozen_grids['grid']):
                if not header_written:
                    frozen_header_row = sf2_frozen_rows[table_name][:len(frozen_grid_row)]
                    grid_header_row = sf2_rows[table_name][:len(grid_row)]
                    header_row = frozen_header_row + grid_header_row
                    lines.append('\t'.join(header_row))
                    header_written = True
                lines.append(TsvGenerator.row_to_tsv(frozen_grid_row + grid_row))
            lines.append('')
        else:
            for table, frozen_grid in zip(tables, frozen_grids):
                lines.extend(TsvGenerator.json_to_tsv(table, frozen_grid, sf2_rows, sf2_frozen_rows, has_plates, table_name=table['name']))

        return lines


    @staticmethod
    def generate_tsv(json_dict):

        has_plates = len(json_dict['frozenGrids'][0]['grids']) > 1
        keyfunc = lambda k: k['name']
        tables_dict = sorted(json_dict['tables'], key=keyfunc, reverse=True)
        frozen_grids_dict = sorted(json_dict['frozenGrids'], key=keyfunc, reverse=True)

        return "\n".join(
            TsvGenerator.json_to_tsv(tables_dict, frozen_grids_dict, TsvGenerator.sf2_rows, TsvGenerator.sf2_frozen_rows, has_plates)
        )


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
            submission_dict=new_record_dict,
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

        qs = json.loads(as_ascii(query_string))
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


    def process_submission(self, request_body):
        """Process a customer submission"""

        rb = json.loads(as_ascii(request_body))

        submission_dict = rb['submissionData']
        stage = rb['stage']

        query_string = submission_dict['queryString']
        sf2_contents = json.dumps(submission_dict['submissionData']['tables'])

        submission_dt = self.load_sf2_into_db(
            query_string=query_string,
            sf2_contents=sf2_contents,
            action='submit',
            stage=stage
        )

        if stage == 'customer_submission':

            project_id = self.get_project_id_for_query_string(query_string)

            self.send_notification_email(
                project_id=project_id,
                query_string=submission_dict['queryString']
            )

        elif stage == 'review':
            # load the data into the lims

            json_dict = submission_dict['submissionData']

            lims_uploader = LIMSUploader(
                json_dict = json_dict,
                project_id=None,
                container_type_is_plate=None,
                has_pools=None,
                has_custom_primers=None,
            )

            samples = lims_uploader.upload()

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


    def process_save(self, save):
        """Process a customer save SF2 action"""

        save_dict = json.loads(as_ascii(save))

        query_string = save_dict['queryString']
        sf2_contents = json.dumps(save_dict['saveData']['tables'])

        save_dt = self.load_sf2_into_db(
            query_string=query_string,
            sf2_contents=sf2_contents,
            action='save',
            stage='customer_submission'
        )

        return datetime_to_json(save_dt)


    def process_save_download(self, save_download):
        """Process a customer save download SF2 action"""

        save_dict = json.loads(as_ascii(save_download))

        query_string = save_dict['queryString']
        sf2_contents = json.dumps(save_dict['saveData']['tables'])

        save_dt = self.load_sf2_into_db(
            query_string=query_string,
            sf2_contents=sf2_contents,
            action='save_download',
            stage='customer_submission'
        )

        return datetime_to_json(save_dt)


    def process_get_download(self, query_string):
        """Process a customer save download SF2 action"""

        latest_save_download_record = self.get_latest_sf2data_record_with_details(
            query_string=as_ascii(query_string),
            action='save_download',
            stage='customer_submission'
        )

        json_dict = json.loads(latest_save_download_record[4])
        tsv = TsvGenerator.generate_tsv(json_dict)

        return tsv


    def get_latest_sf2data_record_with_details(self, query_string, action, stage):

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT * FROM onlinesf2.sf2data WHERE querystring = %s AND action = %s AND stage = %s ORDER BY datecreated desc LIMIT 1",
                [
                    as_ascii(query_string),
                    action,
                    stage
                ]
            )
            row = cur.fetchone()

            return row


    def get_query_string_of_reissued_sf2(self, query_string):

        with self.database_connection.cursor() as cur:
            cur.execute(
                "SELECT reissueof FROM onlinesf2.sf2metadata WHERE querystring = %s ORDER BY datecreated desc LIMIT 1",
                [
                    as_ascii(query_string),
                ]
            )
            row = cur.fetchone()

            return row[0]


    def get_initial_data(self, request_body):
        """Get the initial data for an SF2 form.

        This method checks for the following (in order):
        - The most recent submitted SF2 for the current stage, or if none are present
        - The most recent saved SF2 for the current stage, or if none are present
        - The most recent submitted SF2 for customer submission (if the stage is review)
        - The most recent submitted SF2 that the current SF2 is a reissue of (if the stage is customer_submission)
        """

        rb = json.loads(as_ascii(request_body))
        qs = rb['queryString']
        stage = rb['stage']

        new_record = None
        sf2_contents = {}
        submitted_at = ''

        latest_submitted_record = self.get_latest_sf2data_record_with_details(
            query_string=qs,
            action='submit',
            stage=stage
        )

        if latest_submitted_record:
            new_record = latest_submitted_record
            submitted_at = datetime_to_json(new_record[3])
        else:
            latest_saved_record = self.get_latest_sf2data_record_with_details(
                query_string=qs,
                action='save',
                stage=stage
            )

            if latest_saved_record:
                new_record = latest_saved_record
            else:
                latest_submitted_cs_record = self.get_latest_sf2data_record_with_details(
                    query_string=qs,
                    action='submit',
                    stage='customer_submission'
                )

                if stage == 'review' and latest_submitted_cs_record:
                    new_record = latest_submitted_cs_record
                else:
                    reissue_query_string = self.get_query_string_of_reissued_sf2(
                        query_string=qs
                    )

                    latest_reissue_submit_review = self.get_latest_sf2data_record_with_details(
                        query_string=reissue_query_string,
                        action='submit',
                        stage='review'
                    )

                    if latest_reissue_submit_review:
                        new_record = latest_reissue_submit_review
                    else:
                        latest_reissue_submit_cs = self.get_latest_sf2data_record_with_details(
                            query_string=reissue_query_string,
                            action='submit',
                            stage='customer_submission'
                        )

                        if latest_reissue_submit_cs:
                            new_record = latest_reissue_submit_cs

        if new_record:
            sf2_contents = json.loads(new_record[4])

        initial_data = {
           'submittedAt': submitted_at,
           'sf2': sf2_contents
        }

        return json.dumps(initial_data)



class LIMSUploader:
    """Class to upload a json dict to the LIMS"""


    def __init__(self, json_dict, config_manager, project_id=None, container_type_is_plate=None, has_pools=None, has_custom_primers=None, create_project=False, batch_mode=True):

        self.lims = Lims(
            config_manager.lims_url,
            config_manager.lims_user,
            config_manager.lims_password
        )

        self.batch_mode = batch_mode

        # Get project data from the json dict if possible
        tables, _project_id, _container_type_is_plate, _has_pools, _has_custom_primers = LIMSUploader.get_project_data_from_json(json_dict)

        self.project_id = project_id if project_id is not None else _project_id
        self.container_type_is_plate = container_type_is_plate if container_type_is_plate is True else _container_type_is_plate
        self.has_pools = has_pools if has_pools is True else _has_pools
        self.has_custom_primers = has_custom_primers if has_custom_primers is True else _has_custom_primers

        assert self.project_id is not None, 'Project ID cannot be None'
        assert self.container_type_is_plate is not None, 'containerTypeIsPlate cannot be None'
        assert self.has_pools is not None, 'has_pools cannot be None'
        assert self.has_custom_primers is not None, 'has_custom_primers cannot be None'

        if not create_project:
            assert self.project_exists, "Project {self.project_id} does not exist in the LIMS".format(**locals())
        elif not self.project_exists:
            pass
            #TODO - create the project

        self.json_dict = tables


    @staticmethod
    def get_project_data_from_json(json_dict):

        #Usage: project_id, container_type_is_plate, has_pools, has_custom_primers = LIMSUploader.get_project_data_from_json(json_dict)

        if 'initialState' in json_dict.keys():
            #pprint(json_dict['initialState'].keys())
            project_id, container_type_is_plate, has_pools, has_custom_primers = itemgetter('projectID', 'containerTypeIsPlate', 'sf2HasPools', 'sf2HasCustomPrimers')(json_dict['initialState'])
            #print(project_id, container_type_is_plate, has_pools, has_custom_primers)

        if 'tables' in json_dict.keys():
            tables = json_dict['tables']
        else:
            tables = json_dict

        return tables, project_id, container_type_is_plate, has_pools, has_custom_primers


    @property
    def project_exists(self):
        return self.project is not None


    @property
    def project_has_samples(self):
        samples = self.lims.get_samples(projectname=self.project_id)
        return len(samples) > 0


    @property
    def project(self):
        projects = self.lims.get_projects(name=self.project_id)
        assert len(list(projects)) > 0, "No projects found for ID: " + self.project_id
        return projects[0]


    @property
    def samples(self):
        return self.lims.get_samples(projectname=self.project_id)


    @staticmethod
    def get_rows_from_tables(tables_dict, table_name, container_type):

        add_container_id = (container_type == '96 well plate')

        grids_with_ids = [x['grids'] for x in tables_dict if x['name'] == table_name][0]

        grids = []
        for grid_with_id in grids_with_ids:
            id = grid_with_id['id']
            new_grid = [x + [{'value': id}] for x in grid_with_id['grid']] if add_container_id else grid_with_id['grid']
            grids.append(new_grid)


        rows = list(itertools.chain.from_iterable(grids))

        for row in rows:
            for cell in row:
                try:
                    del cell['readonly']
                    cell['value'] = cell['value'].strip()
                except KeyError:
                    pass

        return rows


    @staticmethod
    def get_samples_dict(json_dict, table_name, container_type):

        get_rows_from_tables = functools.partial(
            LIMSUploader.get_rows_from_tables,
            table_name = table_name,
            container_type = container_type
        )

        frozen_rows = get_rows_from_tables(json_dict['frozenGrids'])
        table_rows = get_rows_from_tables(json_dict['tables'])

        return {'frozen_rows': frozen_rows, 'table_rows': table_rows}


    @staticmethod
    def process_json_dict(json_dict):

        information_tables = {
            'SampleSF2': 'SampleInformation',
            '10XSF2': '10XSampleInformation',
            'LibrarySF2': 'LibraryInformation'
        }

        frozen_row_lengths_for_plates = {
            'SampleSF2': 2,
            '10XSF2': -1,  # You never have plates for 10X submissions
            'LibrarySF2': 3
        }

        new_dict = {}
        new_dict['sf2_type'] = json_dict['name']
        new_dict['table_name'] = information_tables[json_dict['name']]

        frozen_grid = [x for x in json_dict['frozenGrids'] if x['name'] == new_dict['table_name']][0]

        frozen_row_length = len(frozen_grid['grids'][0]['grid'][0])

        return(new_dict)


    samplesf2_udf_names = [
        'User Sample ID',
        'Species',
        'NCBI ID',
        'User Sample Concentration (ng/ul)',
        'User_Volume (uL)',
        'User_Quantification Method',
        'User_Yield (ng)',
        'Gel image or bioanalyser trace attached',
        'Buffer',
        'User quality value',
        '260_280nm',
        'Sample Type',
        'Tissue',
        'Extraction method',
        'PCR product length',
        'Fragment size (only for sheared samples)',
        'Potential Biological Contaminants',
        'DNase treated',
        'RNase treated',
        'Type of RNase used',
        'Comment'
    ]


    tenxsf2_udf_names = [
        'User Sample ID',
        '10X Genomics Index Set',
        'User Sample Concentration (ng/ul)',
        'Pool concentration',
        'Pool size',
        'User_Volume (uL)',
        'Species',
        'User_Quantification Method',
        'Gel image or bioanalyser trace attached',
        'Buffer',
        'User Average Library Size (bp)',
        'User Estimated Molarity (nM)',
        'Potential Biological Contaminants',
        'Comment'
    ]


    librarysf2_udf_names = [
        'User Sample ID',
        'Species',
        'User Sample Concentration (ng/ul)',
        'Pool concentration',
        'Pool size',
        'User_Volume (uL)',
        'User_Quantification Method',
        'Gel image or bioanalyser trace attached',
        'Buffer',
        'Library Type',
        'User Average Library Size (bp)',
        'User Estimated Molarity (nM)',
        'First Index (I7)',
        'Second Index (I5)',
        'Custom primer',
        'Potential Biological Contaminants',
        'Comment'
    ]


    def create_container(self, type_name, container_id):
        container_type = self.lims.get_container_types(name=type_name)[0]
        container = Container.create(self.lims, type=container_type, name=container_id)
        return container


    def create_sample_udfs_for_upload(self, table_row, sf2_type, eg_submission_id=None):

        table_row_values = [x['value'] for x in table_row]

        udf_names = []
        if sf2_type == 'SampleSF2':
            udf_names = LIMSUploader.samplesf2_udf_names
        elif sf2_type == '10XSF2':
            udf_names = LIMSUploader.tenxsf2_udf_names
        elif sf2_type == 'LibrarySF2':
            udf_names = LIMSUploader.librarysf2_udf_names

        if not self.has_pools:
            udf_names = [x for x in udf_names if x not in ['Pool concentration', 'Pool size']]

        if not self.has_custom_primers:
            udf_names = [x for x in udf_names if x != 'Custom primer']

        if self.container_type_is_plate:
            del table_row_values[-1]

        assert len(udf_names) == len(table_row_values), "Number of udf names {udfnum} does not match number of columns {colnum}".format(udfnum=len(udf_names),colnum=len(table_row_values))

        sample_udfs_for_upload = dict(zip(udf_names, table_row_values))

        if eg_submission_id is not None and sf2_type in ['10XSF2', 'LibrarySF2']:
            sample_udfs_for_upload['SLX Identifier'] = eg_submission_id

        if self.has_pools:
            del sample_udfs_for_upload['Pool concentration']  # This udf is currently missing from the LIMS
            try:
                sample_udfs_for_upload['Pool size'] = int(sample_udfs_for_upload['Pool size'])
            except ValueError:
                sample_udfs_for_upload['Pool size'] = 0

        if sf2_type == 'LibrarySF2':

            sample_udfs_for_upload['Index sequence'] = '-'.join([
                sample_udfs_for_upload['First Index (I7)'],
                sample_udfs_for_upload['Second Index (I5)']
            ])

            project_number = re.findall('\d+', eg_submission_id)[0]
            sample_udfs_for_upload['Custom Index Name (I7)'] = project_number
            sample_udfs_for_upload['Custom Index Name (I5)'] = project_number

        return sample_udfs_for_upload


    def expand_plate_id(self, plate_id):

        pid_regex = re.compile('(\d+)_(\w)\w+_(\w)\w+')
        pid_match = pid_regex.match(self.project.name)
        pid_prefix = ''.join(pid_match.groups())
        pid_index = str(int(plate_id)+1).zfill(2)

        expanded_plate_id = pid_prefix + 'PLATE' + pid_index

        return expanded_plate_id


    def upload(self):
        processed_json_dict = LIMSUploader.process_json_dict(self.json_dict)

        container_type = '96 well plate' if self.container_type_is_plate else 'Tube'

        get_samples_dict_func = functools.partial(
            LIMSUploader.get_samples_dict,
            table_name = processed_json_dict['table_name'],
            container_type = container_type
        )

        samples_dict = get_samples_dict_func(self.json_dict)


        frozen_rows = samples_dict['frozen_rows']
        table_rows = samples_dict['table_rows']
        sf2_type = processed_json_dict['sf2_type']

        sf2_can_have_pools = sf2_type in ['10XSF2', 'LibrarySF2']
        sf2_can_have_plates = sf2_type in ['SampleSF2', 'LibrarySF2']

        sample_names_for_upload = [x[0]['value'] for x in frozen_rows]
        zipped_sample_rows = list(zip(frozen_rows, table_rows))
        existing_sample_names = [x.name for x in self.samples]

        sample_udfs_for_upload = [
            self.create_sample_udfs_for_upload(
                x[1],
                sf2_type=sf2_type,
                eg_submission_id=(x[0][1]['value'] if self.has_pools else None)
            ) for x in zipped_sample_rows
        ]

        positions = itertools.repeat("1:1")
        if container_type == '96 well plate':
            well_ids = [x[-2]['value'] for x in frozen_rows]
            positions = well_ids

        container_ids = [x[-1]['value'] for x in frozen_rows]

        sample_upload_tuples = tuple(zip(sample_names_for_upload, sample_udfs_for_upload, positions, container_ids))

        p = self.project

        for sample_name_for_upload in sample_names_for_upload:
            assert sample_name_for_upload not in existing_sample_names, 'Sample name {} already exists in the LIMS'.format(sample_name_for_upload)

        sample_upload_dicts = []
        if container_type == 'Tube':

            sample_upload_dicts = [
                {'container': self.create_container(container_type, container_id=x[0]), 'project': p, 'name': x[0], 'position': '1:1', 'udf': x[1]}
                for x in sample_upload_tuples
            ]

        elif container_type == '96 well plate':
            assert sf2_can_have_plates, 'The SF2 type specified is incompatible with a container type of ' + container_type

            plate_ids = set([x[-1]['value'] for x in frozen_rows])
            plates = {}
            sample_upload_dicts = [
                {'container': self.create_container(container_type, container_id=x[0]), 'project': p, 'name': x[0], 'position': x[2], 'udf': x[1]}
                for x in sample_upload_tuples
            ]

        samples = []
        if self.batch_mode:
            samples = self.lims.create_batch(Sample, sample_upload_dicts)
        else:
            for sample_upload_dict in sample_upload_dicts:
                samples.append(
                    Sample.create(
                    self.lims,
                    container=sample_upload_dict['container'],
                    position=sample_upload_dict['position'],
                    project=sample_upload_dict['project'],
                    name=sample_upload_dict['name'],
                    udf=sample_upload_dict['udf'])
                )

        return(samples)
