"""Controller module for sf2 web application"""

import functools
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

# Helper functions ----

def add_cors_if_enabled(cls, enable_cors=False):
    class WithCors(cls, CorsHandler):
        pass
    return WithCors if enable_cors else cls


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


def initialise_http_server(form, model, custom_handlers, port, enable_cors=False):

    static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client/{form}/build".format(**locals()))

    handler_params = dict(model=model)

    cors = functools.partial(add_cors_if_enabled, enable_cors=enable_cors)

    generic_handlers = [
        (r'/', MainHandler, dict(static_path=static_path)),
        (r'/(.*\.(?:css|js|ico|json))', tornado.web.StaticFileHandler, {'path': static_path})
    ]

    handlers = [(k, cors(custom_handlers[k]), handler_params) for k in custom_handlers.keys()] + generic_handlers

    application = tornado.web.Application(handlers, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)

    return http_server


# Generic request handlers ----

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


class MainHandler(tornado.web.RequestHandler):
    """Class to handle requests to the top level URL"""


    def initialize(self, static_path):
        self.static_path = static_path


    def get(self):
        self.render(os.path.join(self.static_path, "index.html"))


# Project setup request handlers -----

class ProjectSetupSubmitHandler(tornado.web.RequestHandler):
    """Class to handle Stage 1 form submissions"""


    def initialize(self, model):
        self.model = model


    def post(self):
        self.model.process_submission(self.request.body)
        self.write(self.request.body)


class ProjectSetupCheckHandler(tornado.web.RequestHandler):
    """Class to handle Project ID check requests"""


    def initialize(self, model):
        self.model = model


    def post(self):
        result = self.model.check_project_id(self.request.body)
        self.write(str(result).lower())


class ProjectSetupReissueHandler(tornado.web.RequestHandler):
    """Class to handle SF2 reissue requests"""


    def initialize(self, model):
        self.model = model


    def post(self):
        result = self.model.reissue_sf2(self.request.body)
        self.write(str(result).lower())


class CustomerSubmissionInitialStateHandler(tornado.web.RequestHandler):
    """Class to handle initial state requests"""


    def initialize(self, model):
        self.model = model


    def post(self):
        result = self.model.get_initial_state(self.request.body)
        self.write(str(result).lower())


# HTTP servers ----

def initialise_project_setup_server(config_manager, enable_cors=False):

    project_setup_model = sf2_webapp.model.ProjectSetup(
        db_connection_params = config_manager.db_connection_params,
        email_config = config_manager.email_config,
        web_config = config_manager.web_config
    )

    custom_handlers = {
        r'/submit/': ProjectSetupSubmitHandler,
        r'/check/': ProjectSetupCheckHandler,
        r'/reissue/': ProjectSetupReissueHandler
    }

    return initialise_http_server(
        form='project_setup',
        model=project_setup_model,
        custom_handlers=custom_handlers,
        port=config_manager.web_config.project_setup.port,
        enable_cors=enable_cors
    )


def initialise_customer_submission_server(config_manager, enable_cors=False):

    customer_submission_model = sf2_webapp.model.CustomerSubmission(
        db_connection_params = config_manager.db_connection_params
    )

    custom_handlers = {
        r'/initstate/': CustomerSubmissionInitialStateHandler
    }

    return initialise_http_server(
        form='customer_submission',
        model=customer_submission_model,
        custom_handlers=custom_handlers,
        port=config_manager.web_config.customer_submission.port,
        enable_cors=enable_cors
    )


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
    initialise_customer_submission_server(config_manager, enable_cors=enable_cors)

    tornado.ioloop.IOLoop.current().start()
