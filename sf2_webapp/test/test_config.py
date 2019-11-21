import os
import unittest

from unittest.mock import patch, mock_open

from sf2_webapp import config


class TestHelperFunctions(unittest.TestCase):


    def generic_config_loader_test(self, func_to_test, input_file_contents, expected_result):
        with patch("builtins.open", mock_open(read_data=input_file_contents)):
            result = func_to_test("fp")
            return result == expected_result


    def test_load_config_dict_from_file(self):

        input_file_contents = """
        user: onlinesf2-app
        host: 0.0.0.0
        port: 5432
        dbname: onlinesf2-dev
        """

        expected_result = {
            'host': '0.0.0.0',
            'user': 'onlinesf2-app',
            'dbname': 'onlinesf2-dev',
            'port': 5432
        }

        assert self.generic_config_loader_test(
            config.load_config_dict_from_file,
            input_file_contents,
            expected_result
        )


    def test_load_db_connection_params(self):

        input_file_contents = """
        user: onlinesf2-app
        host: 0.0.0.0
        port: 5432
        dbname: onlinesf2-dev
        """

        expected_result = config.DatabaseConnectionParams(
            user = "onlinesf2-app",
            host = "0.0.0.0",
            port = 5432,
            dbname = "onlinesf2-dev"
        )

        assert self.generic_config_loader_test(
            config.load_db_connection_params,
            input_file_contents,
            expected_result
        )


    def test_load_web_config(self):

        input_file_contents = """
        project_setup:
            address: localhost
            port: 8000

        customer_submission:
            address: localhost
            port: 8001

        review:
            address: localhost
            port: 8002
        """

        expected_result = config.WebConfig(
                project_setup = config.WebAppConfig(
                address = "localhost",
                port = 8000
            ),
            customer_submission = config.WebAppConfig(
                address = "localhost",
                port = 8001
            ),
            review = config.WebAppConfig(
                address = "localhost",
                port = 8002
            )
        )

        assert self.generic_config_loader_test(
            config.load_web_config,
            input_file_contents,
            expected_result
        )


    def test_load_email_config(self):

        input_file_contents = """
        smtp_server:
            host: localhost
            port: 1025

        dev_smtp_server:
            host: localhost
            port: 1025

        submission_email:
            subject: test_subject
            body: test_body
            sender:
                name: test_sender_name
                address: test_sender_address
            recipient:
                name: test_recipient_name
                address: test_recipient_address

        reissue_email:
            subject: test_subject
            body: test_body
            sender:
                name: test_sender_name
                address: test_sender_address
            recipient:
                name: test_recipient_name
                address: test_recipient_address

        review_email:
            subject: test_subject
            body: test_body
            sender:
                name: test_sender_name
                address: test_sender_address
            recipient:
                name: test_recipient_name
                address: test_recipient_address
        """

        test_email_details = config.EmailDetails(
            subject = "test_subject",
            body = "test_body",
            sender = config.EmailContact(
                name = "test_sender_name",
                address = "test_sender_address"
            ),
            recipient = config.EmailContact(
                name = "test_recipient_name",
                address = "test_recipient_address"
            )
        )

        expected_result = config.EmailConfig(
            smtp_server = config.SMTPServerConfig(
                host = "localhost",
                port = 1025
            ),
            submission_email = test_email_details,
            reissue_email = test_email_details,
            review_email = test_email_details
        )

        assert self.generic_config_loader_test(
            config.load_email_config,
            input_file_contents,
            expected_result
        )


    def test_load_logging_config(self):

        input_file_contents = """
        log_level: debug
        log_file:
            prefix: ~/.onlinesf2/onlinesf2_log
            max_size_in_bytes: 100000000
            number_to_keep: 1000
        """

        expected_result = config.LoggingConfig(
            log_level = "debug",
            log_file = config.LogFileConfig(
                prefix = os.path.expanduser("~/.onlinesf2/onlinesf2_log"),
                max_size_in_bytes = 100000000,
                number_to_keep = 1000
            )
        )

        assert self.generic_config_loader_test(
            config.load_logging_config,
            input_file_contents,
            expected_result
        )


    def test_load_logging_config(self):

        input_file_contents = """
        log_level: debug
        log_file:
            prefix: ~/.onlinesf2/onlinesf2_log
            max_size_in_bytes: 100000000
            number_to_keep: 1000
        """

        expected_result = config.LoggingConfig(
            log_level = "debug",
            log_file = config.LogFileConfig(
                prefix = os.path.expanduser("~/.onlinesf2/onlinesf2_log"),
                max_size_in_bytes = 100000000,
                number_to_keep = 1000
            )
        )

        assert self.generic_config_loader_test(
            config.load_logging_config,
            input_file_contents,
            expected_result
        )


    def test_load_lims_config(self):

        input_file_contents = """
        lims_url: 'lims_url'
        lims_user: 'lims_user'
        lims_password: 'lims_password'
        """

        expected_result = config.LimsConfig(
            lims_url = "lims_url",
            lims_user = "lims_user",
            lims_password = "lims_password"
        )

        assert self.generic_config_loader_test(
            config.load_lims_config,
            input_file_contents,
            expected_result
        )


class TestConfigurationManager(unittest.TestCase):


    @patch.object(config, "load_db_connection_params", return_value="db_connection_params")
    @patch.object(config, "load_web_config", return_value="web_config")
    @patch.object(config, "load_email_config", return_value="email_config")
    @patch.object(config, "load_logging_config", return_value="logging_config")
    @patch.object(config, "load_lims_config", return_value="lims_config")
    def test_configuration_manager(self, *mocks):

        config_manager = config.ConfigurationManager()

        assert config_manager.db_connection_params == "db_connection_params"
        assert config_manager.web_config == "web_config"
        assert config_manager.email_config == "email_config"
        assert config_manager.logging_config == "logging_config"
        assert config_manager.lims_config == "lims_config"


if __name__ == '__main__':
    unittest.main()
