# How to use

## Import CSV data with specific IDs
node main.js --file ./data/customer.csv --identifiers email,customerId

## Import CSV data with specific IDs and subscriptions
node main.js --file ./data/customer.csv --identifiers email,customerId --subscriptions:EMAIL --pointOfSale:your-point-of-sales

## Convert CSV to Sitecore CDP format, not uploading data to Sitecore CDP
node main.js --file ./data/customer.csv --identifiers email,customerId --subscriptions:EMAIL --pointOfSale:your-point-of-sales --convertonly