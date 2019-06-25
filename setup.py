"""Setup script for Online SF2 webapp"""

import os.path
from setuptools import setup


current_dir = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(current_dir, "README.md"), 'r') as readme:
    README = readme.read()


setup(
    name="sf2_webapp",
    version="0.0.1",
    description="Edinburgh Genomics Online SF2 web application",
    long_description=README,
    long_description_content_type="text/markdown",
    url="http://gitlab.genepool.private/hdunnda/sf2-webapp",
    author="Hywel Dunn-Davies",
    author_email="Hywel.Dunn-Davies@ed.ac.uk",
    license="Copyright 2019 Edinburgh Genomics",
    classifiers=[
        "Programming Language :: Python :: 3.4.5"
    ],
    packages=["sf2_webapp"],
    include_package_data=True,
    install_requires=[
        "tornado"
    ],
    entry_points={"console_scripts": ["start_sf2_webapp=sf2_webapp.__main__:main"]},
)
