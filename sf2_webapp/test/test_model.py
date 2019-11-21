import datetime
import json
import logging
import os
import smtplib
import unittest
import tornado

from tornado.testing import AsyncHTTPTestCase
from collections import namedtuple
from unittest.mock import Mock, patch

from sf2_webapp import config
from sf2_webapp import model


class TestHelperFunctions(unittest.TestCase):


    def test_generate_query_string(self):
        query_string = model.generate_query_string()
        assert isinstance(query_string, str)



    def test_str_to_count(self):
        self.assertEqual(model.str_to_count("5"), 5)
        self.assertEqual(model.str_to_count("-5"), -5)
        self.assertEqual(model.str_to_count(""), 0)



    def test_as_ascii(self):
        self.assertEqual(model.as_ascii(bytes("test", "ascii")), "test")
        self.assertEqual(model.as_ascii("test"), "test")



    def test_sf2metadata_record_to_dict(self):

        record = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            19,
            20,
            21,
            22
        ]

        expected_result = {
            "pid": "5",
            "st": "6",
            "ctp": "7",
            "nsl": "8",
            "di": "9",
            "na": "10",
            "hp": "11",
            "np": "12",
            "hc": "13",
            "nc": "14",
            "husl": "15",
            "nusl": "16",
            "nslp": "17",
            "cm": "18",
            "sampleOrLibraryStartIndex": "19",
            "unpooledSubmissionStartIndex": "20",
            "poolStartIndex": "21",
            "containerStartIndex": "22"
        }

        self.assertEqual(
            model.sf2metadata_record_to_dict(record),
            expected_result
        )



    @patch("smtplib.SMTP")
    def test_send_email(self, mock_smtp):

        stage = 'customer_submission'

        mock_stage_config = Mock()
        mock_stage_config.address = "address"
        mock_stage_config.port = "port"

        mock_stage_config_dict = dict()
        mock_stage_config_dict[stage] = mock_stage_config

        mock_web_config = Mock()
        mock_web_config._asdict = Mock(return_value=mock_stage_config_dict)

        mock_email_config = Mock()
        mock_email_config.smtp_server.host = "host"
        mock_email_config.smtp_server.port = "port"

        mock_email_details = config.EmailDetails(
            sender = config.EmailContact(
                name = "sender_name",
                address = "sender_address"
            ),
            recipient = config.EmailContact(
                name = "recipient_name",
                address = "recipient_address"
            ),
            subject = "subject",
            body = "body"
        )

        model.send_email(
            email_config=mock_email_config,
            web_config=mock_web_config,
            project_id="12345_test_project",
            query_string="test_query_string",
            email_details=mock_email_details,
            stage=stage
        )

        mock_smtp.sendmail.assert_called_once()



    def test_datetime_to_json(self):
        dt = datetime.datetime(2000, 1, 1)
        dt_json = '"Sat Jan  1 00:00:00 2000"'
        self.assertEqual(model.datetime_to_json(dt), dt_json)



class TestTsvGenerator(unittest.TestCase):


    def test_row_to_tsv(self):

        row = [
            {'value': "1"},
            {'value': "2"}
        ]

        self.assertEqual(model.TsvGenerator.row_to_tsv(row), "1\t2")



    def test_json_to_tsv(self):

        test_tables = [{'grids': [{'grid': [[{'readonly': False, 'value': 's1'},
                       {'readonly': False, 'value': 'SI-GA-A1'},
                       {'readonly': False, 'value': '1'},
                       {'readonly': False, 'value': '2'},
                       {'readonly': False, 'value': 'Homo_sapiens_9606'},
                       {'readonly': False, 'value': 'Fluorometric'},
                       {'readonly': False, 'value': 'Yes'},
                       {'readonly': False, 'value': 'TE'},
                       {'readonly': False, 'value': '3'},
                       {'readonly': False, 'value': '512.8'},
                       {'readonly': False, 'value': ''},
                       {'readonly': False, 'value': ''}]],
             'id': '0'}],
  'name': '10XSampleInformation'}]

        test_frozen_grids = [{'grids': [{'grid': [[{'value': '00050ST0001'}, {'value': '00050ST0001'}]],
             'id': '0'}],
  'name': '10XSampleInformation'}]

        expected_result = ['10XSampleInformation', '', 'EG 10X Sample ID\tEG 10X Submission ID\tYour 10X Sample ID\t10X Genomics Barcode Set\t10X Sample Conc. (ng/ul)\tPool Concentration\tPool Size\t10X Sample Vol. (ul)\tGenus_Species_TaxonID\tQuantification Method\tImage Available\tStorage Buffer\tAverage 10X Sample Size (bp)\tEstimated Molarity (nM)', '00050ST0001\t00050ST0001\ts1\tSI-GA-A1\t1\t2\tHomo_sapiens_9606\tFluorometric\tYes\tTE\t3\t512.8\t\t', '']

        tsv = model.TsvGenerator.json_to_tsv(
            tables = test_tables,
            frozen_grids = test_frozen_grids,
            sf2_rows = model.TsvGenerator.sf2_rows,
            sf2_frozen_rows = model.TsvGenerator.sf2_frozen_rows,
            has_plates = False,
            table_name = ''
        )

        self.assertEqual(tsv, expected_result)



    def test_generate_tsv(self):

        test_json_dict = {'name': '10XSF2', 'frozenGrids': [{'name': '10XSampleInformation', 'grids': [{'grid': [[{'value': '00050ST0001'}, {'value': '00050ST0001'}]], 'id': '0'}]}], 'tables': [{'name': '10XSampleInformation', 'grids': [{'grid': [[{'value': 's1', 'readonly': False}, {'value': 'SI-GA-A1', 'readonly': False}, {'value': '1', 'readonly': False}, {'value': '2', 'readonly': False}, {'value': 'Homo_sapiens_9606', 'readonly': False}, {'value': 'Fluorometric', 'readonly': False}, {'value': 'Yes', 'readonly': False}, {'value': 'TE', 'readonly': False}, {'value': '4', 'readonly': False}, {'value': '384.6', 'readonly': False}, {'value': '', 'readonly': False}, {'value': '', 'readonly': False}]], 'id': '0'}]}]}

        tsv = model.TsvGenerator.generate_tsv(test_json_dict)

        expected_result = """10XSampleInformation

EG 10X Sample ID	EG 10X Submission ID	Your 10X Sample ID	10X Genomics Barcode Set	10X Sample Conc. (ng/ul)	Pool Concentration	Pool Size	10X Sample Vol. (ul)	Genus_Species_TaxonID	Quantification Method	Image Available	Storage Buffer	Average 10X Sample Size (bp)	Estimated Molarity (nM)
00050ST0001	00050ST0001	s1	SI-GA-A1	1	2	Homo_sapiens_9606	Fluorometric	Yes	TE	4	384.6"""

        self.assertEqual(tsv.strip(), expected_result)



class TestProjectSetup(unittest.TestCase):


    def setUp(self):

        mock_db_connection_params = None
        mock_email_config = config.EmailConfig(
            smtp_server = None,
            submission_email = None,
            reissue_email = None,
            review_email = None
        )
        mock_web_config = None
        mock_lims_config = config.LimsConfig(
            lims_url = "lims_url",
            lims_user = "lims_user",
            lims_password = "lims_password"
        )

        with patch('sf2_webapp.database.DatabaseConnection'):
                self.project_setup = model.ProjectSetup(
                    db_connection_params = mock_db_connection_params,
                    email_config = mock_email_config,
                    web_config = mock_web_config,
                    lims_config = mock_lims_config
                )


    def test_get_index_dict(self):

        with patch.object(self.project_setup.lims, "get_samples", return_value=[]):
            test_index_dict = self.project_setup.get_index_dict(
                project_id="12345_test_project",
                container_type_is_plate=False
            )

        expected_result = {
            'sampleOrLibraryStartIndex': 1,
            'poolStartIndex': 1,
            'containerStartIndex': 1,
            'unpooledSubmissionStartIndex': 1
        }

        self.assertEqual(test_index_dict, expected_result)



    def test_process_submission(self):

        test_submission = '{"pid": "12345_test_project", "ctp": false}'
        expected_result = '"Sat Jan  1 00:00:00 2000"'

        with patch.object(self.project_setup, "load_submission_into_db", return_value=datetime.datetime(2000,1,1)) as mock_load:
            with patch.object(self.project_setup, "send_notification_email") as mock_send:
                with patch.object(self.project_setup, "get_index_dict") as mock_get_index_dict:
                    submission_dt = self.project_setup.process_submission(test_submission)

        self.assertEqual(submission_dt, expected_result)



    def test_load_submission_into_db(self):

        record = range(0,23)

        test_submission_dict = {
            "pid": record[5],
            "st": record[6],
            "ctp": record[7],
            "nsl": record[8],
            "di": record[9],
            "na": record[10],
            "hp": record[11],
            "np": record[12],
            "hc": record[13],
            "nc": record[14],
            "husl": record[15],
            "nusl": record[16],
            "nslp": record[17],
            "cm": record[18],
            "sampleOrLibraryStartIndex": str(record[19]),
            "unpooledSubmissionStartIndex": str(record[20]),
            "poolStartIndex": str(record[21]),
            "containerStartIndex": str(record[22])
        }

        test_query_string = "test_query_string"

        with patch.object(self.project_setup.database_connection.cursor, "execute") as mock_execute:
            dt = self.project_setup.load_submission_into_db(
                submission_dict=test_submission_dict,
                query_string=test_query_string
            )

        self.assertIsInstance(dt, datetime.datetime)


    def test_send_notification_email(self):

        test_submission_dict = {"pid": "12345_Test_Project"}
        test_query_string = "test_query_string"

        with patch.object(model, "send_email") as mock_send_email:

            self.project_setup.send_notification_email(
                submission_dict=test_submission_dict,
                query_string=test_query_string
            )

            mock_send_email.assert_called_once()


    def test_check_project_id(self):

        with patch.object(self.project_setup.database_connection, "cursor") as mock_cursor:
                mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [1]
                self.assertTrue(self.project_setup.check_project_id("12345_Test_Project"))


    def test_get_latest_sf2metadata_record_with_project_id(self):
        with patch.object(self.project_setup.database_connection, "cursor") as mock_cursor:
                mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [1]
                self.assertTrue(self.project_setup.get_latest_sf2metadata_record_with_project_id("12345_Test_Project"))


    def test_reissue_sf2(self):
        with patch.object(self.project_setup, "load_submission_into_db", return_value=datetime.datetime(2000,1,1)) as mock_load:
            with patch.object(self.project_setup, "send_notification_email") as mock_send:
                with patch.object(self.project_setup, "check_project_id") as mock_check_project_id:
                    with patch.object(self.project_setup, "get_index_dict") as mock_get_index_dict:
                        reissue_params = '{"projectID": "12345_Test_Project", "comments": "comments"}'
                        reissue_str = self.project_setup.reissue_sf2(reissue_params)
                    self.assertEqual(reissue_params, reissue_str)


class TestSF2(unittest.TestCase):


    def setUp(self):

        mock_db_connection_params = None
        mock_email_config = config.EmailConfig(
            smtp_server = None,
            submission_email = None,
            reissue_email = None,
            review_email = None
        )
        mock_web_config = None
        mock_lims_config = config.LimsConfig(
            lims_url = "lims_url",
            lims_user = "lims_user",
            lims_password = "lims_password"
        )

        with patch('sf2_webapp.database.DatabaseConnection'):
            with patch('sf2_webapp.model.LIMSUploader'):
                self.sf2 = model.SF2(
                    db_connection_params = mock_db_connection_params,
                    email_config = mock_email_config,
                    web_config = mock_web_config,
                    lims_config = mock_lims_config
                )


    def test_get_latest_sf2metadata_record_with_query_string(self):
        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:
                mock_cursor.return_value.__enter__.return_value.fetchone.return_value = "test"
                self.assertEqual(self.sf2.get_latest_sf2metadata_record_with_query_string("test"), "test")


    def test_get_initial_state(self):
        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:
                mock_cursor.return_value.__enter__.return_value.fetchone.return_value = "test"

                mock_initial_state = '{"pid": "12345_Test_Project"}'

                mock_initial_state_dict = {
                    "pid": "12345_Test_Project"
                }

                with patch.object(model, "sf2metadata_record_to_dict", return_value=mock_initial_state_dict) as mock_sf2_metdata_dict:
                    return_value = self.sf2.get_initial_state(mock_initial_state)
                    return_dict = json.loads(return_value)
                    self.assertDictEqual(return_dict, mock_initial_state_dict)


    def test_load_sf2_into_db(self):

        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:

            return_value = self.sf2.load_sf2_into_db(
                query_string="test",
                sf2_contents="test",
                action="test",
                stage="test"
            )

            self.assertEqual(type(return_value), datetime.datetime)


    def test_get_project_id_for_query_string(self):

        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.fetchone.return_value = ["test"]

            return_value = self.sf2.get_project_id_for_query_string(
                query_string="test"
            )

            self.assertEqual(return_value, "test")


    @patch.object(model.LIMSUploader, "__init__", return_value=None)
    @patch.object(model.LIMSUploader, "upload", return_value=None)
    def test_process_submission(self, *mocks):

        test_dt = datetime.datetime(2000,1,1)
        test_dt_json = '"Sat Jan  1 00:00:00 2000"'

        with patch.object(self.sf2, "load_sf2_into_db", return_value=test_dt) as mock_load:
            with patch.object(self.sf2, "send_notification_email") as mock_email:

                request_dict = {
                    "submissionData": { "submissionData": {
                                "tables": "{}",
                            },
                                "queryString": "test"
                        }
                    }

                for stage in ['customer submission', 'review']:

                    request_dict['stage'] = stage

                    request_str = json.dumps(request_dict)

                    return_value = self.sf2.process_submission(request_str)

                    self.assertEqual(return_value, test_dt_json)


    @patch.object(model, "send_email")
    def test_send_notification_email(self, mock):

        self.sf2.send_notification_email(
            project_id="12345_Test_Project",
            query_string="test"
        )


    def test_process_save(self):

        test_dt = datetime.datetime(2000,1,1)
        test_dt_json = '"Sat Jan  1 00:00:00 2000"'

        with patch.object(self.sf2, "load_sf2_into_db", return_value=test_dt) as mock_load:
            with patch.object(self.sf2, "send_notification_email") as mock_email:

                save_dict = {
                    "queryString": "test",

                    "saveData": {
                                "tables": "{}",
                        }
                    }

                request_str = json.dumps(save_dict)

                return_value = self.sf2.process_save(request_str)

                self.assertEqual(return_value, test_dt_json)


    def test_process_save_download(self):

        test_dt = datetime.datetime(2000,1,1)
        test_dt_json = '"Sat Jan  1 00:00:00 2000"'

        with patch.object(self.sf2, "load_sf2_into_db", return_value=test_dt) as mock_load:
            with patch.object(self.sf2, "send_notification_email") as mock_email:

                save_dict = {
                    "queryString": "test",

                    "saveData": {
                                "tables": "{}",
                        }
                    }

                request_str = json.dumps(save_dict)

                return_value = self.sf2.process_save_download(request_str)

                self.assertEqual(return_value, test_dt_json)


    def test_get_filename_for_download(self):

        test_metadata_record = list(range(10))
        test_metadata_record[5] = "projectid"
        test_metadata_record[6] = "type"

        with patch.object(self.sf2, "get_latest_sf2metadata_record_with_query_string", return_value=test_metadata_record) as mock_get_latest:

            return_value = self.sf2.get_filename_for_download("test")

            self.assertTrue(return_value.startswith("projectid-typeSF2-"))
            self.assertTrue(return_value.endswith("_gmt.tsv"))

    @patch.object(model.TsvGenerator, "generate_tsv", return_value="test")
    def test_process_get_download(self, mock):

        test_save_download_record = [str(i) for i in range(5)]

        with patch.object(self.sf2, "get_latest_sf2data_record_with_details", return_value=test_save_download_record):

            return_value = self.sf2.process_get_download(
                query_string="test"
            )

            self.assertEqual(return_value, "test")


    def test_get_latest_sf2data_record_with_details(self):

        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.fetchone.return_value = "test"

            return_value = self.sf2.get_latest_sf2data_record_with_details(
                query_string="test",
                action="test",
                stage="test"
            )

            self.assertEqual(return_value, "test")


    def test_get_query_string_of_reissued_sf2(self):

        with patch.object(self.sf2.database_connection, "cursor") as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.fetchone.return_value = ["test"]

            return_value = self.sf2.get_query_string_of_reissued_sf2(
                query_string="test"
            )

            self.assertEqual(return_value, "test")


    def test_remove_extra_cols(self):

        test_sf2_contents = {
            "tables": [
                {
                    "name": "SampleInformation",
                    "grids": [
                        {"grid": [[str(i) for i in range(10)] for j in range(2)]}
                    ]
                }
            ]
        }

        return_value = self.sf2.remove_extra_cols(test_sf2_contents)

        return_grid = return_value['tables'][0]['grids'][0]['grid']

        for row in return_grid:
            self.assertEqual(len(row), 4)


    @patch.object(model, "datetime_to_json", return_value="test")
    def test_get_initial_data(self, mock):

        test_request_body_dict = {
            "queryString": "test",
            "stage": "test"
        }

        test_request_body_json = json.dumps(test_request_body_dict)

        test_return_dict = {
            "submittedAt": "test",
            "sf2": "test"
        }

        with patch.object(self.sf2, "remove_extra_cols", return_value="test"):
            with patch.object(self.sf2, "get_latest_sf2data_record_with_details", return_value=[str(i) for i in range(5)]):

                return_value = self.sf2.get_initial_data(
                    request_body=test_request_body_json
                )
                self.assertDictEqual(json.loads(return_value), test_return_dict)


if __name__ == '__main__':
    unittest.main()
