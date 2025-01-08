from django.test.testcases import LiveServerThread, QuietWSGIRequestHandler

from django.test import LiveServerTestCase

class LiveServerThreadWithReuse(LiveServerThread):
    """
    This miniclass overrides _create_server to allow port reuse. This avoids creating
    "address already in use" errors for tests that have been run subsequently.
    """

    def _create_server(self, connections_override=None):
        return self.server_class(
            (self.host, self.port),
            QuietWSGIRequestHandler,
            allow_reuse_address=True,
            connections_override=connections_override,
        )

class AppLiveServerTestCase(LiveServerTestCase):
    server_thread_class = LiveServerThreadWithReuse