/**
 * @author jittagornp
 */

import http from "k6/http";
// 1. init code
// Purpose: Load local files, import modules, declare lifecycle functions
// Called: Once per VU*

// Don't forget move value to ENV
const GET_ACCESS_TOKEN_URL = "https://app.dev.com/oauth/token";
const CLIENT_ID = "report.dev.adbb4c831849@app.com";
const CLIENT_SECRET = "a1a306a8-27fc-4aa6-909e-7f29f3e12112";
const TEST_URL = "https://app.dev.com/api/products?size=1";

export const options = {
  insecureSkipTLSVerify: true,
};

export function getAccessToken(url, clientId, clientSecret) {
  const requestBody = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };
  const response = http.post(url, requestBody);
  return response.json();
}

export function setup() {
  // 2. setup code
  // Purpose: Set up data for processing, share data among VUs
  // Called: Once

  const token = getAccessToken(GET_ACCESS_TOKEN_URL, CLIENT_ID, CLIENT_SECRET);
  console.log("Token: ", token);
  return token;
}

export default function (data) {
  // 3. VU code
  // Purpose: Run the test function, usually default
  // Called: Once per iteration, as many times as the test options require
  const options = {
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`,
    },
  };
  const response = http.get(TEST_URL, options);
  const products = response.json();
  console.log("Products:", products);
}

export function teardown(data) {
  // 4. teardown code
  // Purpose: Process result of setup code, stop test environment
  // Called: Once **
}

//Remarks:
// * In cloud scripts, init code might be called more often.
// ** If the Setup function ends abnormally (e.g throws an error), the teardown() function isn't called. Consider adding logic to the setup() function to handle errors and ensure proper cleanup.
