import {
	_fetchRawReports,
	_fetchReportsContent,
	fetchRawReliefWeb,
	QUERY_EARTHQUAKE
} from "../../src/models/reliefweb_raw";
import assert from "assert";

describe("Request reliefweb", () => {
	it("should runs _fetchRawReports fine", async function() {
		this.timeout(50000);
		const data = await _fetchRawReports({
			offset: 0,
			query: "earthquake"
		});
		assert.equal(data.length, process.env.RELIEF_REQ_LIM || 100);
	});

	it("should runs _fetchReportsContent fine", async function() {
		this.timeout(50000);
		const result = await _fetchReportsContent({
			reportURLList: [
				"https://api.reliefweb.int/v1/reports/2662779",
				"https://api.reliefweb.int/v1/reports/2685334"
			]
		});
		assert.equal(result.length, 2);
	});
	it("should runs fetchRawReliefWeb fine", async function() {
		this.timeout(50000);
		const result = await fetchRawReliefWeb({
			offset: 0,
			query: QUERY_EARTHQUAKE
		});
		assert.equal(result.length, process.env.RELIEF_REQ_LIM || 100);
	});
});
