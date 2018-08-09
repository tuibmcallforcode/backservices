import path from "path";
const dotenvPath = path.resolve(".env");
require("dotenv").config({ path: dotenvPath });

function importTest(name, path) {
	describe(name, function() {
		require(path);
	});
}

// var common = require("./common");

describe("top", function() {
	beforeEach(function() {
		console.log("running something before each test");
	});
	importTest("model:reliefweb_raw", "./models/reliefweb_raw");
	importTest("model:pdc", "./models/pdc");
	after(function() {
		console.log("after all tests");
	});
});
