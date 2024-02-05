/**
 * Required extensions
 * - https://github.com/mostafa/xk6-kafka
 *
 * @author jittagornp
 */

import {
  Writer,
  SchemaRegistry,
  SCHEMA_TYPE_JSON,
  SCHEMA_TYPE_STRING,
} from "k6/x/kafka";

// 1. init code
// Purpose: Load local files, import modules, declare lifecycle functions
// Called: Once per VU*

const KAFKA_BROKERS = ["broker:9092"];
const KAFKA_TOPIC = "my-topic";

const writer = new Writer({
  // WriterConfig object
  brokers: KAFKA_BROKERS,
  topic: KAFKA_TOPIC,
});

const schemaRegistry = new SchemaRegistry();

function randomMessage() {
  return {
    key: schemaRegistry.serialize({
      data: "my-key",
      schemaType: SCHEMA_TYPE_STRING,
    }),
    value: schemaRegistry.serialize({
      data: {
        name: "Hello World!",
      },
      schemaType: SCHEMA_TYPE_JSON,
    }),
  };
}

export function setup() {
  // 2. setup code
  // Purpose: Set up data for processing, share data among VUs
  // Called: Once
}

export default function (data) {
  // 3. VU code
  // Purpose: Run the test function, usually default
  // Called: Once per iteration, as many times as the test options require
  writer.produce({ messages: [randomMessage()] });
}

export function teardown(data) {
  // 4. teardown code
  // Purpose: Process result of setup code, stop test environment
  // Called: Once **

  writer.close();
}

//Remarks:
// * In cloud scripts, init code might be called more often.
// ** If the Setup function ends abnormally (e.g throws an error), the teardown() function isn't called. Consider adding logic to the setup() function to handle errors and ensure proper cleanup.
