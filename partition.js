const crypto = require("crypto");


const getPartitionKeyFromEvent = (event) => {
    if (event && event.partitionKey) {
        return event.partitionKey
    }
    return false;
}

const generatePartitionKey = (event, options={}) => {
    // in case we don't get an event
    // we push it to the first partition
    const TRIVIAL_PARTITION_KEY = "0";
    // default algorithms and hex values
    let algorithm = "sha3-512";
    let hex = "hex"
    if (options) {
        if (options.algorithm) {
            // use this algorithm if provided
            algorithm = options.algorithm
        }
        if (options.hex) {
            // use this hex if provided
            hex = options.hex
        }
    }

    if (!event) {
        console.log("No event found, couldnt generate a partition key");
        return TRIVIAL_PARTITION_KEY;
    }

    const data = JSON.stringify(event);
    candidate = crypto.createHash(algorithm).update(data).digest(hex);
    // ensure candidate is a string before returning
    if (typeof candidate !== "string") {
        candidate = JSON.stringify(candidate);
    }
    return candidate;
}

const ensureValidPartitionKey = (candidate, options={}) => {
    // This is the max partition key length
    const MAX_PARTITION_KEY_LENGTH = 256;
    // default algorithms and hex values
    let algorithm = "sha3-512";
    let hex = "hex"
    if (options) {
        if (options.algorithm) {
            // use this algorithm if provided
            algorithm = options.algorithm
        }
        if (options.hex) {
            // use this hex if provided
            hex = options.hex
        }
    }

    // This should not happen
    if(!candidate) {
        console.log("Error no candidate found");
        return false;
    }
    // if the key length exceeds
    // create a hash again
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = crypto.createHash(algorithm).update(candidate).digest(hex);
    }
    return candidate;
}

const deterministicPartitionKey = (event) => {
  let candidate;

  // Check if the event has a partition key
  // if so use it
  candidate = getPartitionKeyFromEvent(event);

  // If the event doesn't have a default partition key
  // we generate one
  if (!candidate) {
    candidate = generatePartitionKey(event);
  }

  // Ensure that the final partition key is valid
  candidate = ensureValidPartitionKey(candidate);
  return candidate;
};

module.exports = deterministicPartitionKey;