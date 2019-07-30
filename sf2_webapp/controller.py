"""Controller module for sf2 web application"""


import os

import tornado.httpserver
import tornado.ioloop
import tornado.web

import sf2_webapp.config
import sf2_webapp.model


settings = {
    'debug': True
}


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


# Run function -----

def run(enable_cors=False, db_config_fp=None, web_config_fp=None):
    """Runs the server and listens on the specified port"""

    config_manager = sf2_webapp.config.ConfigurationManager(
        db_config_fp=db_config_fp,
        web_config_fp=web_config_fp
    )

    project_setup_model = sf2_webapp.model.ProjectSetup(
        db_connection_params = config_manager.db_connection_params
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
    tornado.ioloop.IOLoop.current().start()
