#!/bin/bash

export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_REGION="us-east-1"

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
	--attribute-definitions "AttributeName=Id,AttributeType=S" \
	--table-name "PollDemo-Local" \
	--key-schema "AttributeName=Id,KeyType=HASH" \
	--billing-mode PAY_PER_REQUEST
