import {
	_fetchRawReports,
	_fetchReportsContentFromReportURLList,
	fetchRawReliefWeb,
	_mapContentToMongooseModel,
	QUERY_EARTHQUAKE
} from "../../src/models/reliefweb_raw";
import assert from "assert";

describe("Request reliefweb", function() {
	this.timeout(50000);
	it("should runs _fetchRawReports fine", async function() {
		const data = await _fetchRawReports({
			offset: 0
		});
		assert.equal(data.length, process.env.RELIEF_REQ_LIM || 100);
	});

	it("should runs _fetchReportsContent fine", async function() {
		const results = await _fetchReportsContentFromReportURLList([
			"https://api.reliefweb.int/v1/reports/2662779",
			"https://api.reliefweb.int/v1/reports/2685334"
		]);
		assert.equal(results.length, 2);
	});
	it("should runs fetchRawReliefWeb fine", async function() {
		const results = await fetchRawReliefWeb({
			offset: 0
		});
		assert.equal(results.length, process.env.RELIEF_REQ_LIM || 100);
	});
});
