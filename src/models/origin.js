var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var originSchema = new Schema({
	fields: {
		date: {
			original: Date,
			changed: Date,
			created: Date
		},
		country: [
			{
				name: String,
				shortname: String,
				iso3: String,
				location: { lat: Number, lon: Number },
				primary: Boolean
			}
		],
		primary_country: {
			name: String,
			shortname: String,
			iso3: String,
			location: { lat: Number, lon: Number }
		},
        title: String,
        body: String,
        url: String,
        id: {
            type: String,
            unique: true
        },
		origin: String,
		language: [{ id: Number, name: String, code: String }],
		disaster_type: [{ id: Number, name: String, code: String }]
	}
});



const Origin = mongoose.model("origin", originSchema);
module.exports = Origin;
