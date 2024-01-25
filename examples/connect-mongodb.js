import xk6Mongo from "k6/x/mongo";

const client = xk6Mongo.newClient("mongodb://root:password@host.docker.internal:27017");

export default function () {
  const results = client.findAll("admin", "users");
  console.log("results size:", results.length);
}
