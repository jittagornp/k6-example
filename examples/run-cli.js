/**
 * Required extensions
 * - https://github.com/fcurella/xk6-exec
 *
 * @author jittagornp
 */

import exec from "k6/x/exec";
// 1. init code
// Purpose: Load local files, import modules, declare lifecycle functions
// Called: Once per VU*

export function setup() {
  // 2. setup code
  // Purpose: Set up data for processing, share data among VUs
  // Called: Once
  console.log("Home:", exec.command("sh", ["-c", "echo $HOME"]));
}

export default function (data) {
  // 3. VU code
  // Purpose: Run the test function, usually default
  // Called: Once per iteration, as many times as the test options require
}

export function teardown(data) {
  // 4. teardown code
  // Purpose: Process result of setup code, stop test environment
  // Called: Once **
}

//Remarks:
// * In cloud scripts, init code might be called more often.
// ** If the Setup function ends abnormally (e.g throws an error), the teardown() function isn't called. Consider adding logic to the setup() function to handle errors and ensure proper cleanup.
