import http.server
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
if __name__ == '__main__':
    http.server.test(HandlerClass=Handler, port=8123)
