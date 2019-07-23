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


class SubmitHandler(CorsHandler):
    """Class to handle Stage 1 form submissions"""


    def post(self):
        sf2_webapp.model.ProjectSetupHandler.process_submission(self.request.body)
        self.write(self.request.body)


# Run function -----

def run(port):
    """Runs the server and listens on the specified port"""

    handlers = [
        (r'/', MainHandler),
        (r'/submit/', SubmitHandler),
        (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': 'client/build'}),
        (r'/(.*\.(?:css|js|svg|json))', tornado.web.StaticFileHandler, {'path': 'client/build'})
    ]

    application = tornado.web.Application(handlers, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)
    tornado.ioloop.IOLoop.current().start()
