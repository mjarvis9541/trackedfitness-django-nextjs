import logging
import warnings

from django.test.runner import DiscoverRunner


class NoLoggingTestRunner(DiscoverRunner):
    def run_tests(self, test_labels, extra_tests=None, **kwargs):

        # disable logging below CRITICAL while testing
        logging.disable(logging.CRITICAL)

        return super().run_tests(test_labels, extra_tests, **kwargs)


class DeprecationWarningTestRunner(DiscoverRunner):
    def run_tests(self, *args, **kwargs):
        # Show all warnings once, especially to show DeprecationWarning
        # messages which Python ignores by default
        warnings.simplefilter("default")
        return super().run_tests(*args, **kwargs)
