import os
import unittest

from collections import namedtuple
from unittest.mock import patch

from sf2_webapp import config
from sf2_webapp import database


class MockCursor:

    def __str__(self):
        return "cursor"

    def close(self):
        pass



class MockConnection:

    def __init__(self, closed):
        self.closed = closed

    def close(self):
        self.closed = 1

    def cursor(self):
        return MockCursor()

    def commit(self):
        pass



class TestDatabaseConnection(unittest.TestCase):


    def setUp(self):
        self.db_connection_params = config.DatabaseConnectionParams(
            user = "onlinesf2-app",
            host = "0.0.0.0",
            port = 5432,
            dbname = "onlinesf2-dev"
        )

        self.database_connection = database.DatabaseConnection(self.db_connection_params)
        self.database_connection.connection = MockConnection(closed=0)



    def test_init(self):
        assert self.database_connection.connection_parameters == self.db_connection_params



    def test_uri(self):
        assert self.database_connection.uri == 'postgresql://onlinesf2-app@0.0.0.0:5432/onlinesf2-dev'



    def test_connection_is_open(self):

        self.database_connection.connection = None
        assert self.database_connection.connection_is_open == False

        self.database_connection.connection = MockConnection(closed=1)
        assert self.database_connection.connection_is_open == False

        self.database_connection.connection = MockConnection(closed=0)
        assert self.database_connection.connection_is_open == True



    def test_can_connect(self):

        assert self.database_connection.can_connect == True

        with patch('psycopg2.connect', return_value=MockConnection(closed=0)) as mock_connect:
            self.database_connection.connection = MockConnection(closed=1)
            assert self.database_connection.can_connect == True



    def test_open(self):

        assert self.database_connection.open().closed == 0

        with patch('psycopg2.connect', return_value=MockConnection(closed=0)) as mock_connect:
            self.database_connection.connection = MockConnection(closed=1)
            assert self.database_connection.open().closed == 0



    def test_close(self):

        assert self.database_connection.connection_is_open == True

        self.database_connection.close()

        assert self.database_connection.connection_is_open == False



    def test_cursor(self):

        with self.database_connection.cursor() as cursor:
            assert str(cursor) == "cursor"



if __name__ == '__main__':
    unittest.main()
