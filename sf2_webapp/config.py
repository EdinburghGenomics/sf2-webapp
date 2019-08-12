"""Class to handle configuration files"""

import os
import yaml

from collections import namedtuple


DatabaseConnectionParams = namedtuple('DatabaseConnectionParams', 'user host port dbname')

WebAppConfig =  namedtuple('WebAppConfig', 'address port')
WebConfig =  namedtuple('WebConfig', 'project_setup customer_submission review')

EmailConfig = namedtuple('EmailConfig', 'smtp_server submission_email reissue_email review_email')
SMTPServerConfig = namedtuple('SMTPServerConfig', 'host port')
EmailDetails = namedtuple('EmailDetails', 'subject body sender recipient')
EmailContact = namedtuple('EmailContact', 'name address')

LoggingConfig = namedtuple('LoggingConfig', 'log_level log_file')
LogFileConfig = namedtuple('LogFileConfig', 'prefix max_size_in_bytes number_to_keep')


def load_config_dict_from_file(fp):
    """Function to load a dict of configuration settings from a yaml file"""

    with open(fp, 'r') as config_file:
        config_dict = yaml.safe_load(config_file.read())

    return config_dict


def load_db_connection_params(fp):
    """Function to create a DatabaseConnectionParams instance from a db config yaml file"""

    db_config_dict = load_config_dict_from_file(fp)

    db_connection_params = DatabaseConnectionParams(
        user = db_config_dict['user'],
        host = db_config_dict['host'],
        port = db_config_dict['port'],
        dbname = db_config_dict['dbname']
    )

    return db_connection_params


def load_web_config(fp):
    """Function to create a WebConfig instance from a web config yaml file"""

    web_config_dict = load_config_dict_from_file(fp)

    web_config = WebConfig(
        project_setup = WebAppConfig(
            address = web_config_dict['project_setup']['address'],
            port = web_config_dict['project_setup']['port']
        ),
        customer_submission = WebAppConfig(
            address = web_config_dict['customer_submission']['address'],
            port = web_config_dict['customer_submission']['port']
        ),
        review = WebAppConfig(
            address = web_config_dict['review']['address'],
            port = web_config_dict['review']['port']
        )
    )

    return web_config


def load_email_config(fp):
    """Function to create a EmailConfig instance from a email config yaml file"""

    email_config_dict = load_config_dict_from_file(fp)

    email_config = EmailConfig(
        smtp_server = SMTPServerConfig(
            host = email_config_dict['smtp_server']['host'],
            port = email_config_dict['smtp_server']['port']
        ),
        submission_email = EmailDetails(
            subject = email_config_dict['submission_email']['subject'],
            body = email_config_dict['submission_email']['body'],
            sender = EmailContact(
                name = email_config_dict['submission_email']['sender']['name'],
                address = email_config_dict['submission_email']['sender']['address']
            ),
            recipient = EmailContact(
                name = email_config_dict['submission_email']['recipient']['name'],
                address = email_config_dict['submission_email']['recipient']['address']
            )
        ),
        reissue_email = EmailDetails(
            subject = email_config_dict['reissue_email']['subject'],
            body = email_config_dict['reissue_email']['body'],
            sender = EmailContact(
                name = email_config_dict['reissue_email']['sender']['name'],
                address = email_config_dict['reissue_email']['sender']['address']
            ),
            recipient = EmailContact(
                name = email_config_dict['reissue_email']['recipient']['name'],
                address = email_config_dict['reissue_email']['recipient']['address']
            )
        ),
        review_email = EmailDetails(
            subject = email_config_dict['review_email']['subject'],
            body = email_config_dict['review_email']['body'],
            sender = EmailContact(
                name = email_config_dict['review_email']['sender']['name'],
                address = email_config_dict['review_email']['sender']['address']
            ),
            recipient = EmailContact(
                name = email_config_dict['review_email']['recipient']['name'],
                address = email_config_dict['review_email']['recipient']['address']
            )
        )
    )

    return email_config


def load_logging_config(fp):
    """Function to create a LoggingConfig instance from a logging config yaml file"""

    logging_config_dict = load_config_dict_from_file(fp)

    logging_config = LoggingConfig(
        log_level = logging_config_dict['log_level'],
        log_file = LogFileConfig(
            prefix = os.path.abspath(os.path.expanduser(logging_config_dict['log_file']['prefix'])),
            max_size_in_bytes = logging_config_dict['log_file']['max_size_in_bytes'],
            number_to_keep = logging_config_dict['log_file']['number_to_keep']
        )
    )

    return logging_config


class ConfigurationManager:
    """Class to manage configuration settings for the SF2 web application"""


    _default_config_dirname = 'config'
    _default_config_filenames = {
        'db': 'db_config.yaml',
        'web': 'web_config.yaml',
        'email': 'email_config.yaml',
        'logging': 'logging_config.yaml'
    }


    def __init__(self, db_config_fp=None, web_config_fp=None, email_config_fp=None, logging_config_fp=None):
        """Initialise a ConfigurationManager object with either values from the provided config files, or default config files"""

        default_config_filepaths = self._get_default_config_filepaths()

        if db_config_fp is None:
            db_config_fp = default_config_filepaths['db']

        if web_config_fp is None:
            web_config_fp = default_config_filepaths['web']

        if email_config_fp is None:
            email_config_fp = default_config_filepaths['email']

        if logging_config_fp is None:
            logging_config_fp = default_config_filepaths['logging']

        self.db_connection_params = load_db_connection_params(db_config_fp)
        self.web_config = load_web_config(web_config_fp)
        self.email_config = load_email_config(email_config_fp)
        self.logging_config = load_logging_config(logging_config_fp)


    def _get_default_config_filepaths(self):
        """Return a dict of default config file paths"""

        default_config_dirpath = os.path.join(os.path.dirname(os.path.dirname(__file__)), self._default_config_dirname)

        default_config_filepaths = {k: os.path.join(default_config_dirpath, self._default_config_filenames[k]) for k, v in self._default_config_filenames.items()}

        return default_config_filepaths

