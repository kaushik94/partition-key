const crypto = require("crypto");

const deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  // Check that we have an event
  if (event) {
    // Check that event has a Partition Key
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      // Else we genetate a partition key
      // and assign to the candidate
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  // We have succesfully created our candidate
  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    // In case we did not receive an event
    // or partition key is missing
    // assign a trivial partition key
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};

console.log(deterministicPartitionKey({}).length)

module.exports = deterministicPartitionKey;