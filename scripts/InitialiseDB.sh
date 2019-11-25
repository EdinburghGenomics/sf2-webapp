#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL

    /*
    * SQL script to set up PostgreSQL database for Online SF2 app
    */

    -- Set the time zone

    SET TIMEZONE = "Europe/London";

    -- Create the dev database

    CREATE DATABASE "onlinesf2-dev";

    -- Create the user role that the Online SF2 app will use

    CREATE USER "onlinesf2-app" PASSWORD 'p';
    GRANT ALL PRIVILEGES ON DATABASE "onlinesf2-dev" TO "onlinesf2-app";

EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "onlinesf2-dev" <<-EOSQL

   /*
    * SQL script to populate PostgreSQL database for Online SF2 app
    */

    -- Create the onlinesf2 schema

    CREATE SCHEMA "onlinesf2";
    GRANT ALL ON SCHEMA "onlinesf2" TO "onlinesf2-app";

    -- Create the sf2metadata table

    CREATE TABLE onlinesf2.sf2metadata (
        id SERIAL PRIMARY KEY,
        queryString text UNIQUE,
        appVersion text,
        dateCreated timestamptz,
        reissueOf text,
        projectID text,
        sf2Type text,
        containerTypeIsPlate boolean,
        numberOfSamplesOrLibraries integer,
        sf2IsDualIndex boolean,
        barcodeSetIsNA boolean,
        sf2HasPools boolean,
        numberOfPools integer,
        sf2HasCustomPrimers boolean,
        numberOfCustomPrimers integer,
        hasUnpooledSamplesOrLibraries boolean,
        numberOfUnpooledSamplesOrLibraries integer,
        numberOfSamplesOrLibrariesInPools text,
        comments text,
        sampleOrLibraryStartIndex integer,
        unpooledSubmissionStartIndex integer,
        poolStartIndex integer,
        containerStartIndex integer
    );

    CREATE TABLE onlinesf2.sf2data (
        id SERIAL PRIMARY KEY,
        queryString text,
        appVersion text,
        dateCreated timestamptz,
        sf2contents text,
        action text,
        stage text
    );

    -- Grant permissions to onlinesf2-app

    GRANT ALL ON TABLE onlinesf2.sf2metadata TO "onlinesf2-app";
    GRANT USAGE, SELECT ON SEQUENCE onlinesf2.sf2metadata_id_seq TO "onlinesf2-app";

    GRANT ALL ON TABLE onlinesf2.sf2data TO "onlinesf2-app";
    GRANT USAGE, SELECT ON SEQUENCE onlinesf2.sf2data_id_seq TO "onlinesf2-app";

EOSQL
