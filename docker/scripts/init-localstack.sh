#!/bin/bash
awslocal s3 mb s3://local-bucket
awslocal s3api put-bucket-acl --bucket local-bucket --acl public-read