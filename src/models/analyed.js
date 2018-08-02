var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var analyzedSchema = new Schema({
	usage: { text_units: Number, text_characters: Number, features: Number },
	semantic_roles: [
		{
			subject: {
				text: String
			},
			sentence: String,
			object: String,
			action: {
				verb: { text: String, tense: String },
				text: String,
				normalized: String
			}
		}
	],
	relations: [
		{
			type: String,
			sentence: String,
			score: 0.889063,
			arguments: [
				{
					text: String,
					location: [209, 248],
					entities: [
						{
							type: String,
							text: String
						}
					]
				},
				{
					text: String,
					location: [187, 201],
					entities: [
						{
							type: String,
							text: String,
							disambiguation: { subtype: [String] }
						}
					]
				}
			]
		}
	],
	language: String,
	keywords: [
		{
			text: String,
			sentiment: { score: Number, label: String },
			relevance: Number,
			emotion: {
				sadness: Number,
				joy: Number,
				fear: Number,
				disgust: Number,
				anger: Number
			}
		}
	],
	entities: [
		{
			type: String,
			text: String,
			sentiment: { score: Number, label: String },
			relevance: Number,
			emotion: {
				sadness: Number,
				joy: Number,
				fear: Number,
				disgust: Number,
				anger: Number
			},
			count: Number
		}
	],
	categories: [{ score: Number, label: String }]
});

const Analyzed = mongoose.model("analyzed", analyzedSchema);
module.exports = Analyzed;
