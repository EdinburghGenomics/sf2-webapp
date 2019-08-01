#!/usr/bin/env python
"""Helper script to run a dummy smtp server that receives and prints e-mail messages sent by the SF2 web application"""


import asyncore
import os
import smtpd
import yaml


config_fp = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'config', 
    'email_config.yaml'
)

with open(config_fp, 'r') as config_file:
    smtp_config = yaml.safe_load(config_file.read())

smtp_server_details = smtp_config['dev_smtp_server']['host'], smtp_config['dev_smtp_server']['port']
    
server = smtpd.DebuggingServer(smtp_server_details, None)

asyncore.loop()
