"""Class to handle configuration files"""

import os
import yaml

from collections import namedtuple


DatabaseConnectionParams = namedtuple('DatabaseConnectionParams', 'user host port dbname')


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


class ConfigurationManager:
    """Class to manage configuration settings for the SF2 web application"""


    _default_config_dirname = 'config'
    _default_config_filenames = {
        'db': 'db_config.yaml'
    }


    def __init__(self, db_config_fp=None):
        """Initialise a ConfigurationManager object with either values from the provided config files, or default config files"""

        default_config_filepaths = self._get_default_config_filepaths()

        if db_config_fp is None:
            db_config_fp = default_config_filepaths['db']

        self.db_connection_params = load_db_connection_params(db_config_fp)


    def _get_default_config_filepaths(self):
        """Return a dict of default config file paths"""

        default_config_dirpath = os.path.join(os.path.dirname(os.path.dirname(__file__)), self._default_config_dirname)

        default_config_filepaths = {k: os.path.join(default_config_dirpath, self._default_config_filenames[k]) for k, v in self._default_config_filenames.items()}

        return default_config_filepaths

