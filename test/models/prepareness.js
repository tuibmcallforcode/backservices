import { fetchReadyGOV } from "../../src/models/prepareness";
import assert from "assert";

/**
 * 
	"flood",
	"earthquake",
	"hurricane",
	"tornado",
	"nuclear accident"
 */
describe.only("Request prepareness", function() {
	this.timeout(50000);
	it("should runs fetchReadyGOV fine", async function() {
		const data = await fetchReadyGOV({ category: "hurricane" });
		console.log(data);
		assert.equal(typeof data[0] === "string", true);
	});
});
