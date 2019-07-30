"""Class to handle the database connection"""

import os
import psycopg2

from contextlib import contextmanager


class DatabaseConnection:
    """Class to manage and track database connection parameters"""


    def __init__(self, connection_parameters):
        """Initialise the class with explicit parameters, if provided, otherwise get them from the configuration file"""

        self.connection_parameters = connection_parameters


    @property
    def uri(self):
        """The database URI"""

        return 'postgresql://{user}@{host}:{port}/{dbname}'.format(**self.__dict__['connection_parameters']._asdict())


    @property
    def connection_is_open(self):
        """Property to indicate whether the connection is open"""

        try:
            return self.connection and self.connection.closed == 0
        except AttributeError:  # The connection hasn't been initialised
            return False


    @property
    def can_connect(self):
        """Property indicating whether it's possible to connect to the database"""

        if self.connection_is_open:
            can_connect = True
        else:
            # Try to open the connection
            self.open()
            can_connect = self.connection_is_open
            self.connection.close()

        return can_connect


    def open(self):
        """Open and return the database connection"""

        if self.connection_is_open:
            return self.connection
        else:
            self.connection = psycopg2.connect(
                user=self.connection_parameters.user,
                host=self.connection_parameters.host,
                port=self.connection_parameters.port,
                dbname=self.connection_parameters.dbname
            )
            return self.connection


    def close(self):
        """Close the current connection, return True if the connection is closed successfully, False otherwise"""

        if self.connection_is_open:
            self.connection.close()
        return not self.connection_is_open


    @contextmanager
    def cursor(self):
        """Provide a database cursor"""

        conn = self.open()
        cursor = conn.cursor()

        yield cursor

        conn.commit()
        cursor.close()
        self.close()
