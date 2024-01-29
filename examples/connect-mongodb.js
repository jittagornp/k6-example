/**
 * Required extensions
 * - https://github.com/GhMartingit/xk6-mongo
 *
 * @author jittagornp
 */

import xk6Mongo from "k6/x/mongo";

const databaseUsername = "root";
const databasePassword = "password";
const databaseHost = "host.docker.internal";
const databasePort = "27017";
const databaseName = "admin";
const client = xk6Mongo.newClient(
  `mongodb://${databaseUsername}:${databasePassword}@${databaseHost}:${databasePort}`
);

export default function () {
  const collection = "users";
  const results = client.findAll(databaseName, collection);
  console.log("results size:", results.length);
}
