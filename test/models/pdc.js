import { fetchPDC, _mapPDCToMongooseModel } from "../../src/models/pdc";
import assert from "assert";

describe.only("Request PDC", function() {
	this.timeout(50000);
	it("should runs fetchPDC fine", async function() {
		const data = await fetchPDC();
		assert.equal(typeof data[0].pdc_id === "string", true);
	});
});
