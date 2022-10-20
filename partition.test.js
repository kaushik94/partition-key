const deterministicPartitionKey = require("./partition")


test("deterministicPartitionKey shoul work with an initial partition key", () => {
    expect(deterministicPartitionKey({partitionKey: "0"})).toBe("0")
})

test("deterministicPartitionKey shoul work with an initial partition key", () => {
    expect(deterministicPartitionKey({partitionKey: "something"})).toBe("something")
})

test("deterministicPartitionKey shoul work without event", () => {
    expect(deterministicPartitionKey()).toBe("0")
})

test("deterministicPartitionKey shoul work without a partition key allocated", () => {
    expect(deterministicPartitionKey({}).length).toBe(128)
})