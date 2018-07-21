var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var analyzedSchema = new Schema({
    "usage": { "text_units": 1, "text_characters": 890, "features": 1 },
    "semantic_roles": [
        {
            "subject": {
                "text": "The Government of the Hong Kong Special Administrative Region"
            },
            "sentence":
                "The Government of the Hong Kong Special Administrative Region has accepted the advice of the Disaster Relief Fund Advisory Committee and approved from the Disaster Relief Fund a grant of $3.207 million to the Adventist Development and Relief Agency, China (ADRA China) for providing relief to earthquake victims in Papua New Guinea.",
            "object": { "text": "a grant of $3.207 million" },
            "action": {
                "verb": { "text": "approve", "tense": "past" },
                "text": "approved",
                "normalized": "approve"
            }
        }
    ],
    "language": "en"
});



const Analyzed = mongoose.model("analyzed", analyzedSchema);
module.exports = Analyzed;
