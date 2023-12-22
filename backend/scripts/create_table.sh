#!/bin/bash

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
	--attribute-definitions "AttributeName=Id,AttributeType=S" \
	--table-name "PollDemo-Local" \
	--key-schema "AttributeName=Id,KeyType=HASH" \
	--billing-mode PAY_PER_REQUEST
