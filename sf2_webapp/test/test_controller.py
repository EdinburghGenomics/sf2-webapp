import logging
import os
import unittest
import tornado

from tornado.testing import AsyncHTTPTestCase
from collections import namedtuple
from unittest.mock import patch

from sf2_webapp import config
from sf2_webapp import controller
from sf2_webapp import model


mock_lims_config = config.LimsConfig(
    lims_url = "lims_url",
    lims_user = "lims_user",
    lims_password = "lims_password"
)


def check_response(obj, url_suffix, method='POST', body='test', response_body='success'):
    response = obj.fetch(url_suffix, method=method, body=body)
    obj.assertEqual(response.code, 200)
    obj.assertEqual(response.body, bytes(response_body, "utf-8"))



def get_sf2_app(form, has_extra_cols, enable_cors):

    with patch.object(config, "load_lims_config", return_value=mock_lims_config) as mock_lims:
        mock_model = model.SF2(
            db_connection_params = "config_manager.db_connection_params",
            email_config = "config_manager.email_config",
            web_config = "config_manager.web_config",
            lims_config = mock_lims,
            has_extra_cols = has_extra_cols
        )

    custom_handlers = {
        r'/initstate/': controller.CustomerSubmissionInitialStateHandler,
        r'/initdata/': controller.CustomerSubmissionInitialDataHandler,
        r'/savedownload/': controller.SaveDownloadHandler,
        r'/getdownload/': controller.GetDownloadHandler,
        r'/save/': controller.SaveHandler
    }

    application =  controller.initialise_tornado_app(
        form=form,
        model=mock_model,
        custom_handlers=custom_handlers,
        enable_cors=enable_cors
    )

    return application



class TestHelperFunctions(unittest.TestCase):


    def test_add_cors_if_enabled(self):

        class WithoutCors():
            pass

        new_cls = controller.add_cors_if_enabled(WithoutCors, enable_cors=False)

        assert not issubclass(new_cls, controller.CorsHandler)

        new_cls = controller.add_cors_if_enabled(WithoutCors, enable_cors=True)

        assert issubclass(new_cls, controller.CorsHandler)


    @patch.object(config, "load_db_connection_params", return_value="db_connection_params")
    @patch.object(config, "load_web_config", return_value="web_config")
    @patch.object(config, "load_email_config", return_value="email_config")
    @patch.object(config, "load_lims_config", return_value="lims_config")
    def test_set_up_logging(self, *mocks):

        mock_logging_config = config.LoggingConfig(
            log_level = "debug",
            log_file = config.LogFileConfig(
                prefix = os.path.expanduser("~/.onlinesf2/onlinesf2_log"),
                max_size_in_bytes = 100000000,
                number_to_keep = 1000
            )
        )

        with patch.object(config, "load_logging_config", return_value=mock_logging_config) as mock_config:
            config_manager = config.ConfigurationManager()
            controller.set_up_logging(config_manager)

            access = logging.getLogger("tornado.access").getEffectiveLevel()
            application = logging.getLogger("tornado.application").getEffectiveLevel()
            general = logging.getLogger("tornado.general").getEffectiveLevel()

            assert access == 10
            assert application == 10
            assert general == 10


    def test_initialise_http_server(self):

        mock_lims_config = config.LimsConfig(
            lims_url = "lims_url",
            lims_user = "lims_user",
            lims_password = "lims_password"
        )

        with patch.object(config, "load_lims_config", return_value=mock_lims_config) as mock_lims:
            project_setup_model = model.ProjectSetup(
                db_connection_params = "config_manager.db_connection_params",
                email_config = "config_manager.email_config",
                web_config = "config_manager.web_config",
                lims_config = mock_lims
            )

        custom_handlers = {
            r'/check/': controller.ProjectSetupCheckHandler,
            r'/reissue/': controller.ProjectSetupReissueHandler
        }

        server =  controller.initialise_http_server(
            form='project_setup',
            model=project_setup_model,
            custom_handlers=custom_handlers,
            port=3000,
            enable_cors=False
        )

        assert isinstance(server, tornado.httpserver.HTTPServer)



class TestProjectSetupController(AsyncHTTPTestCase):

    def get_app(self):

        with patch.object(config, "load_lims_config", return_value=mock_lims_config) as mock_lims:
            mock_model = model.ProjectSetup(
                db_connection_params = "config_manager.db_connection_params",
                email_config = "config_manager.email_config",
                web_config = "config_manager.web_config",
                lims_config = mock_lims
            )

        custom_handlers = {
            r'/check/': controller.ProjectSetupCheckHandler,
            r'/reissue/': controller.ProjectSetupReissueHandler
        }

        application =  controller.initialise_tornado_app(
            form='project_setup',
            model=mock_model,
            custom_handlers=custom_handlers,
            enable_cors=False
        )

        return application


    def test_mainhandler(self):
        response = self.fetch('/')
        self.assertEqual(response.code, 200)


    @patch.object(model.ProjectSetup, "check_project_id", return_value="success")
    def test_check(self, mock):
        check_response(self, '/check/')


    @patch.object(model.ProjectSetup, "reissue_sf2", return_value="success")
    def test_reissue(self, mock):
        check_response(self, '/reissue/')


    @patch.object(model.ProjectSetup, "process_submission", return_value="success")
    def test_submit(self, mock):
        check_response(self, '/submit/')


class TestSF2Controller(AsyncHTTPTestCase):

    def get_app(self):

        return get_sf2_app(
            form='customer_submission',
            has_extra_cols=False,
            enable_cors=False
        )


    def test_customer_submission_mainhandler(self):
        response = self.fetch('/')
        self.assertEqual(response.code, 200)


    @patch.object(model.SF2, "process_save", return_value="success")
    def test_save(self, mock):
        check_response(self, '/save/')


    @patch.object(model.SF2, "get_initial_state", return_value="success")
    def test_initstate(self, mock):
        check_response(self, '/initstate/')


    @patch.object(model.SF2, "get_initial_data", return_value="success")
    def test_initdata(self, mock):
        check_response(self, '/initdata/')


    @patch.object(model.SF2, "process_save_download", return_value="success")
    def test_savedownload(self, mock):
        check_response(self, '/savedownload/')


    @patch.object(model.SF2, "process_get_download", return_value="success")
    @patch.object(model.SF2, "get_filename_for_download", return_value="mock_filename")
    def test_getdownload(self, *mocks):
        response = self.fetch('/getdownload/?querystring', method='GET')
        self.assertEqual(response.code, 200)
        self.assertEqual(response.body, bytes("success", "utf-8"))
        content_type = response.headers['Content-Type']
        content_disposition = response.headers['Content-Disposition']
        self.assertEqual(content_type, "application/octet-stream")
        self.assertEqual(content_disposition, "attachment; filename=mock_filename")


if __name__ == '__main__':
    unittest.main()
