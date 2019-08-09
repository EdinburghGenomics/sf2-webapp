"""Controller module for sf2 web application"""

import logging
import os

import tornado.httpserver
import tornado.ioloop
import tornado.web

import sf2_webapp.config
import sf2_webapp.model


settings = {
    'debug': True
}


# Logging setup -----

def set_up_logging(config_manager):

    logging_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    logging_handler = logging.handlers.RotatingFileHandler(
        config_manager.logging_config.log_file.prefix,
        maxBytes=config_manager.logging_config.log_file.max_size_in_bytes,
        backupCount=config_manager.logging_config.log_file.number_to_keep
    )
    logging_handler.setFormatter(logging_formatter)

    access_log = logging.getLogger("tornado.access")
    app_log = logging.getLogger("tornado.application")
    gen_log = logging.getLogger("tornado.general")

    tornado.log.enable_pretty_logging()

    access_log.addHandler(logging_handler)
    app_log.addHandler(logging_handler)
    gen_log.addHandler(logging_handler)

    logging.getLogger("tornado.access").propagate = False
    logging.getLogger("tornado.application").propagate = False
    logging.getLogger("tornado.general").propagate = False

    log_levels = dict(
        zip(
            ['debug', 'info', 'warning', 'error'],
            [logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR]
        )
    )

    log_level = log_levels[config_manager.logging_config.log_level]

    logging.getLogger("tornado.access").setLevel(log_level)
    logging.getLogger("tornado.application").setLevel(log_level)
    logging.getLogger("tornado.general").setLevel(log_level)


# Request handlers -----

class MainHandler(tornado.web.RequestHandler):
    """Class to handle requests to the top level URL"""


    def initialize(self, project_setup_model):
        self.project_setup_model = project_setup_model


    def get(self):
        self.render("../client/build/index.html")


class CorsHandler(tornado.web.RequestHandler):
    """Class to handle CORS requests from localhost. To be used in development only.
    Adapted from https://stackoverflow.com/questions/30610934/content-type-header-not-getting-set-in-tornado
    """

    def set_default_headers(self):
        super(CorsHandler, self).set_default_headers()

        self.set_header('Access-Control-Allow-Origin', self.request.headers.get('Origin', 'http://localhost'))
        self.set_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.set_header('Access-Control-Allow-Headers', ','.join(
            self.request.headers.get('Access-Control-Request-Headers', '').split(',') +
            ['Content-Type']
        ))

        self.set_header('Content-Type', 'application/json')


    def options(self, *args, **kwargs):
        pass


class SubmitHandler(tornado.web.RequestHandler):
    """Class to handle Stage 1 form submissions"""


    def initialize(self, project_setup_model):
        self.project_setup_model = project_setup_model


    def post(self):
        self.project_setup_model.process_submission(self.request.body)
        self.write(self.request.body)


class CheckHandler(tornado.web.RequestHandler):
    """Class to handle Project ID check requests"""


    def initialize(self, project_setup_model):
        self.project_setup_model = project_setup_model


    def post(self):
        result = self.project_setup_model.check_project_id(self.request.body)
        self.write(str(result).lower())


class ReissueHandler(tornado.web.RequestHandler):
    """Class to handle SF2 reissue requests"""


    def initialize(self, project_setup_model):
        self.project_setup_model = project_setup_model


    def post(self):
        result = self.project_setup_model.reissue_sf2(self.request.body)
        self.write(str(result).lower())


class CorsSubmitHandler(CorsHandler, SubmitHandler):
    """Class to handle Stage 1 form submissions, which allows CORS requests"""
    pass


class CorsCheckHandler(CorsHandler, CheckHandler):
    """Class to handle Project ID check requests, which allows CORS requests"""
    pass


class CorsReissueHandler(CorsHandler, ReissueHandler):
    """Class to handle SF2 reissue requests, which allows CORS requests"""
    pass


# HTTP servers ----

def initialise_project_setup_server(config_manager, enable_cors=False):

    project_setup_model = sf2_webapp.model.ProjectSetup(
        db_connection_params = config_manager.db_connection_params,
        email_config = config_manager.email_config,
        web_config = config_manager.web_config
    )

    handler_params = dict(project_setup_model=project_setup_model)

    submit_handler = CorsSubmitHandler if enable_cors else SubmitHandler
    check_handler = CorsCheckHandler if enable_cors else CheckHandler
    reissue_handler = CorsReissueHandler if enable_cors else ReissueHandler

    static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client/build")

    handlers = [
        (r'/', MainHandler, handler_params),
        (r'/submit/', submit_handler, handler_params),
        (r'/check/', check_handler, handler_params),
        (r'/reissue/', reissue_handler, handler_params),
        (r'/(.*\.(?:css|js|ico|json))', tornado.web.StaticFileHandler, {'path': static_path})
    ]

    application = tornado.web.Application(handlers, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(config_manager.web_config.project_setup.port)

    return http_server


# Run function -----

def run(enable_cors=False, db_config_fp=None, web_config_fp=None, email_config_fp=None, logging_config_fp=None):
    """Runs the server and listens on the specified port"""

    config_manager = sf2_webapp.config.ConfigurationManager(
        db_config_fp=db_config_fp,
        web_config_fp=web_config_fp,
        email_config_fp=email_config_fp,
        logging_config_fp=logging_config_fp
    )

    set_up_logging(config_manager)

    initialise_project_setup_server(config_manager, enable_cors=enable_cors)

    tornado.ioloop.IOLoop.current().start()
