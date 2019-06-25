"""Edinburgh Genomics Online SF2 web application

examples:

To start the tornado server:

    $ start_sf2_webapp

More information is available at:

- http://gitlab.genepool.private/hdunnda/sf2-webapp

"""

__version__="0.0.1"


import argparse


def main():  # type: () -> None
    """Command line entry point for the web application"""

    # Parse the command line arguments
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    
    parser.add_argument("-v", "--version", action="version", version='%(prog)s {version}'.format(version=__version__))
    
    args = parser.parse_args()

    print('started...')


if __name__ == "__main__":
    main()

