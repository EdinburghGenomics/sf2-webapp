"""Edinburgh Genomics Online SF2 web application.

examples:

To start the tornado server:

    $ start_sf2_webapp

More information is available at:

- http://gitlab.genepool.private/hdunnda/sf2-webapp
"""

__version__="0.0.1"


import tornado.options

from tornado.options import define, options

import sf2_webapp.controller


define("port", default=8888, help="run on the given port", type=int)
define("enable_cors", default=False, help="Flag to indicate that CORS should be enabled", type=bool)


def main():  # type: () -> None
    """Command line entry point for the web application"""

    tornado.options.parse_command_line()

    sf2_webapp.controller.run(options.port, options.enable_cors)


if __name__ == "__main__":
    main()
