import chalk from "chalk";
import crypto from "crypto";
import * as uuid from "uuid";

/* 
firstSeen: null, // string | ISO 8601 Date/Time
lastSeen: null, // string | ISO 8601 Date/Time
guestType: null, // string | ex. guest
title: null, // string | ex. "Br", "Brigadier", "Capt", "Colonel", "Dame", "Dr", "Elder", "Fr", "General", "Hon", "Judge", "Lord", "Master", "Miss", "Mr", "Mrs", "Ms", "Mstr", "Prof", "Rabbi", "Rev", "Shaikha", "Sheikh", "Sir", "Sister", "Sr"
firstName: null, // string
lastName: null, // string
gender: null, // string | male/female/unknown
dateOfBirth: null, // string | ISO 8601 Date/Time UTC Validation: Date must be in the past.
email: null, // string
phoneNumbers: null, // array | ex. [ "+353161123345", "+353861123311" ] => input data is comma splitted
language: null, // string | ex. "EN", "FR", "DE"
nationality: null, // string | ex. "Irish", "British", "Spanish", "French""Irish", "British", "Spanish", "French"
passportNumber: null, // string
passportExpiry: null, // string | ISO 8601 Date/Time
street: null, // array | ex. ["Ashford House", "Tara Street", "Dublin 2"] => input data is comma splitted
city: null, // string | ex. "Dublin", "London", "Madrid", "Paris"
country: null, // string | ex. "IE", "GB", "ES", "FR"
postcode: null, // string
state: null, // string 
*/
const standardAttributes = ["firstSeen", "lastSeen", "guestType", "title", "firstName", "lastName", "gender", "dateOfBirth", "email", "phoneNumbers", "language", "nationality", "passportNumber", "passportExpiry", "street", "city", "country", "country", "postcode", "state"];
const subscriptionAttributes = ["EMAIL", "MOBILE_APP", "MOBILE_WEB"];

function buildExtensionData(attributes) {
    let ext = {
        name: "ext",
        key: "default",
        ...attributes
    };
    // delete standard attributes
    standardAttributes.forEach(item => {
        delete ext[item];
    });
    // delete subscription attributes
    subscriptionAttributes.forEach(item => {
        delete ext[item];
    })
    return ext;
}

function buildIdentifiers(attributes, identifiers) {
    let attributeKeys = Object.keys(attributes);
    let idKeys = attributeKeys.filter(key => {
        let compareResult = false;
        for (let ii = 0; ii < identifiers.length; ii++) {
            if (identifiers[ii].localeCompare(key) === 0) {
                compareResult = true;
                break;
            }
        }
        return compareResult;
    });
    
    if (idKeys.length > 0) {
        let ids = [];
        idKeys.forEach(key => {
            let idObj = {
                provider: key,
                id: attributes[key]
            }
            ids.push(idObj);
        });
        return {
            identifiers: ids
        };
    } else {
        return {};
    }
}

function buildRecordTemplate() {
    return {
        ref: createUUID(),
        schema: "",
        mode: "",
        value: {
            /*
            subscriptions: [
                {
                    "name":"default",
                    "channel":"EMAIL",
                    "pointOfSale":"default",
                    "status":"SUBSCRIBED",
                    "effectiveDate":"2012-08-23T16:17:16.000Z"
                }
            ] 
             */
            // subscriptions: [],
            /*
            identifiers: [
                {
                    "provider":"BOXEVER_IDENTITY_SYSTEM",
                    "id":"B7524AE6-CF1C-440F-B1A2-0C9D42F5CB41",
                    "expiryDate":"2016-08-23T16:17:16.000Z"
                }
            ] 
             */
            // identifiers: [],
            /*
            extensions: [
                {
                    "name":"ext",  // name must be ext
                    "key":"default", // key must be default
                    "loyaltytier":"level2", // attribute key value pair
                    "rewardBalance":"50125", // attribute key value pair
                    "memberSince":"2020-10-08T00:00", // attribute key value pair
                    "loyaltyNumber":"123456789" // attribute key value pair
                }
            ] 
             */
            // extensions: []
        }
    };
}

function buildStatndardCustomerAttributes(attributes) {
    let keys = Object.keys(attributes);
    let standardKeys = keys.filter(key => {
            return standardAttributes.includes(key);
    });
    if (standardKeys.length > 0) {
        let standardField = {};
        standardKeys.forEach(key => {
            if (attributes[key]) {
                if (key.localeCompare("street") === 0) {
                    standardField[key] = attributes[key].split(" ");
                } else if (key.localeCompare("phoneNumbers") === 0) {
                    standardField[key] = attributes[key].split(",");
                } else {
                    standardField[key] = attributes[key];
                }
            }
        });
        return standardField
    } else {
        return {};
    }
}

function buildSubscriptions(attributes, subscriptions, pointOfSale) {
    if (subscriptions.length === 0 || !pointOfSale) return {};

    let keys = Object.keys(attributes);
    let subscriptionKeys = keys.filter( key => {
        let compareResult = false;
        for(let ii = 0; ii < subscriptions.length; ii++) {
            if (subscriptions[ii].localeCompare(key) === 0) {
                compareResult = true;
                break;
            }
        }
        return compareResult;
    });

    if (subscriptionKeys.length > 0) {
        let subs = [];
        subscriptionKeys.forEach( key => {
            let subObj = {
                name: key,
                pointOfSale: pointOfSale,
                channel: key,
                status: attributes[key]
            }
            subs.push(subObj);
        });
        return {
            subscriptions: subs
        };
    } else {
        return {};
    }

}

/*
    Exported functions 
 */
// create a guest record using key value pair attributes which is read by csv.
export function createGuestRecord(attributes, { mode = "upsert", identifiers = ["email"], subscriptions = [], pointOfSale }) {
    // console.log(chalk.green("=== createGuestRecord ==="));
    // console.log(chalk.green(`mode = ${mode}`));
    // console.log(chalk.green(`identifiers = ${identifiers}`));
    // console.log(chalk.green(`subscriptions = ${subscriptions}`));
    // console.log(chalk.green(`pointOfSale = ${pointOfSale}`));

    let record = buildRecordTemplate();
    record.schema = "guest";
    record.mode = mode;
    let standardCustomerAttributes = buildStatndardCustomerAttributes(attributes);
    let identifiersObj = buildIdentifiers(attributes, identifiers);
    let subscriptionsObj = buildSubscriptions(attributes, subscriptions, pointOfSale);
    let extension = buildExtensionData(attributes);
    record.value = {
        ...standardCustomerAttributes,
        ...identifiersObj,
        ...subscriptionsObj,
        extensions: [
            {
                ...extension
            }
        ]
    };
    return record;
}

// create multiple guest records using key value pair attributes which is read by csv.
export function createGuestRecords(records = [], { mode = "upsert", identifiers = ["email"], subscriptions = [], pointOfSale }) {
    let guestRecords = records.map( record => {
        let guestRecord = createGuestRecord(record, { mode, identifiers, subscriptions, pointOfSale })
        return guestRecord;
    });
    return guestRecords;
}

// generate v5 uuid
export function createUUID() {
    let namespace = crypto.randomUUID();
    let name = (new Date).toISOString();
    return uuid.v5(name, namespace);
}

// get gzip information to send a request of Batch API
export function getGzipInfo(buffer) {
    let hash = crypto.createHash('md5');
    let digest = hash.update(buffer).digest("hex");
    return {
        checksum: digest,
        size: buffer.length
    };
}