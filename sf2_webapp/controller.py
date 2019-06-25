"""Controller module for sf2 web application"""

import tornado.httpserver
import tornado.ioloop
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    """Class to handle requests to the top level URL"""

    def get(self):
        self.write("Online SF2")


def run(port):
    """Run the server and listen on the specified port"""

    application = tornado.web.Application([(r"/", MainHandler)])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port)
    tornado.ioloop.IOLoop.current().start()



