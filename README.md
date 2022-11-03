## env

Fill in the Client key and API Token and Endpoints.

## If you are planning to only create a cdp formatted file - use this command. --identifiers are matched against the column names

node main.js --file ./data/customer.csv --identifiers email,customerId

## If you have subscription lists - use this command. the point of sale for the lists needs to be specified. --convertonly will just create the file and won't upload to CDP.

node main.js --file ./data/customer.csv --identifiers email,customerId --subscriptions:EMAIL --pointOfSale:your-point-of-sales --convertonly
