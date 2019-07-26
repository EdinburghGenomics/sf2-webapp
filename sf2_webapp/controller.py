"""Controller module for sf2 web application"""


import os

import tornado.httpserver
import tornado.ioloop
import tornado.web

import sf2_webapp.model

settings = {
    'debug': True
}


# Request handlers -----

class MainHandler(tornado.web.RequestHandler):
    """Class to handle requests to the top level URL"""


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


    def post(self):
        sf2_webapp.model.ProjectSetupHandler.process_submission(self.request.body)
        self.write(self.request.body)


class CorsSubmitHandler(CorsHandler, SubmitHandler):
    """Class to handle Stage 1 form submissions, which allows CORS requests""" 
    pass


class CheckHandler(tornado.web.RequestHandler):
    """Class to handle Project ID check requests"""


    def post(self):
        result = sf2_webapp.model.ProjectSetupHandler.check_project_id(self.request.body)
        self.write(str(result).lower())


# Run function -----

def run(port, enable_cors=False):
    """Runs the server and listens on the specified port"""

    submit_handler = CorsSubmitHandler if enable_cors else SubmitHandler

    static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client/build")

    handlers = [
        (r'/', MainHandler),
        (r'/submit/', submit_handler),
        (r'/check/', CheckHandler),
        (r'/(.*\.(?:css|js|ico|json))', tornado.web.StaticFileHandler, {'path': static_path})
    ]

    application = tornado.web.Application(handlers, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)
    tornado.ioloop.IOLoop.current().start()
