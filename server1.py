#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os.path

import tornado.auth
import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", Hello1Handler),
            (r"/blank",BlankHandler),
            (r"/target",TargetHandler),
			(r"/static/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static")})
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "template"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings) #两个星的语法？


class Hello1Handler(tornado.web.RequestHandler):
    def get(self):
        self.render("hello1.html")

class BlankHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("blank.html")

class TargetHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("target.html")


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
