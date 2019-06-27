"""Controller module for sf2 web application"""

import os

import tornado.httpserver
import tornado.ioloop
import tornado.web


settings = {
    'debug': True
}

    
# Request handlers -----
    
class MainHandler(tornado.web.RequestHandler):
    """Class to handle requests to the top level URL"""

    def get(self):
        self.render("../client/build/index.html")
        

# Run function -----

def run(port):
    """Runs the server and listens on the specified port"""

    handlers = [
        (r'/', MainHandler),
        (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': 'client/build'}),
        (r'/(.*\.(?:css|js|svg|json))', tornado.web.StaticFileHandler, {'path': 'client/build'})
    ]

    application = tornado.web.Application(handlers, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)
    tornado.ioloop.IOLoop.current().start()
