"""Edinburgh Genomics Online SF2 web application.

examples:

To start the tornado server:

    $ start_sf2_webapp

More information is available at:

- http://gitlab.genepool.private/hdunnda/sf2-webapp
"""

__version__="0.0.1"


import os

import tornado.options

from tornado.options import define, options

import sf2_webapp.controller
import sf2_webapp.config
import sf2_webapp.database


define("dbconfig", default=None, help="Path to the database configuration file", type=str)
define("webconfig", default=None, help="Path to the web configuration file", type=str)
define("emailconfig", default=None, help="Path to the email configuration file", type=str)
define("loggingconfig", default=None, help="Path to the logging configuration file", type=str)
define("enable_cors", default=False, help="Flag to indicate that CORS should be enabled", type=bool)


def main():  # type: () -> None
    """Command line entry point for the web application"""

    tornado.options.parse_command_line()

    assert (options.dbconfig is None or os.path.exists(options.dbconfig)), 'Error: database configuration file ' + str(options.dbconfig) + ' not found.'
    assert (options.webconfig is None or os.path.exists(options.webconfig)), 'Error: web configuration file ' + str(options.webconfig) + ' not found.'
    assert (options.emailconfig is None or os.path.exists(options.emailconfig)), 'Error: email configuration file ' + str(options.emailconfig) + ' not found.'
    assert (options.loggingconfig is None or os.path.exists(options.loggingconfig)), 'Error: logging configuration file ' + str(options.loggingconfig) + ' not found.'

    sf2_webapp.controller.run(
        enable_cors=options.enable_cors,
        db_config_fp=options.dbconfig,
        web_config_fp=options.webconfig,
        email_config_fp=options.emailconfig,
        logging_config_fp=options.loggingconfig
    )


if __name__ == "__main__":
    main()
