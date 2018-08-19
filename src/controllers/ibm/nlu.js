if (
	!process.env.NLU_IAM &&
	(!process.env.NLU_USERNAME && !process.env.NLU_PASSWORD)
) {
	console.error("env for nlu not found");
	process.exit(1);
}

import NaturalLanguageUnderstandingV1 from "watson-developer-cloud/natural-language-understanding/v1";
import logger from "../../logger";
const VERSION = "2018-03-16";

const nluParams = {
	features: {
		semantic_roles: {},
		categories: {}
	}
};

const authParams = process.env.NLU_IAM
	? { iam_apikey: process.env.NLU_IAM }
	: {
			username: process.env.NLU_USERNAME,
			password: process.env.NLU_PASSWORD
	  };

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1(
	Object.assign({}, { version: VERSION }, authParams)
);

function analyzeAsync(parameters) {
	return new Promise((resolve, reject) => {
		naturalLanguageUnderstanding.analyze(parameters, (err, response) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(response);
			return;
		});
	});
}

export async function analyze(text) {
	const textDebug = text.substring(0, 20);
	logger.debug("analying %s, params %O", textDebug, nluParams);
	const parameters = Object.assign({}, { text }, nluParams);
	return await analyzeAsync(parameters);
}

/**
 * 
 * 
 * 
 * example result 
 * {
    "usage": {
        "text_units": 1,
        "text_characters": 2495,
        "features": 1
    },
    "semantic_roles": [
        {go
            "subject": {
                "text": "A team of eight European experts"
            },
            "sentence": "A team of eight European experts will fly to Guatemala on Saturday to support national authorities after the multiple eruptions of Volcan de Fuego since 3 June.",
            "action": {
                "verb": {
                    "text": "fly",
                    "tense": "future"
                },
                "text": "will fly",
                "normalized": "will fly"
            }
        },
        {
            "subject": {
                "text": "A team of eight European experts"
            },
            "sentence": "A team of eight European experts will fly to Guatemala on Saturday to support national authorities after the multiple eruptions of Volcan de Fuego since 3 June.",
            "object": {
                "text": "national authorities"
            },
            "action": {
                "verb": {
                    "text": "support",
                    "tense": "future"
                },
                "text": "to support",
                "normalized": "to support"
            }
        },
        {
            "subject": {
                "text": "by the Government of Guatemala.We"
            },
            "sentence": " The team is being deployed though the European Union Civil Protection Mechanism, following a request for assistance issued by the Government of Guatemala.We are continuing to support Guatemala following the recent volcano eruptions.",
            "object": {
                "text": "assistance"
            },
            "action": {
                "verb": {
                    "text": "issue",
                    "tense": "past"
                },
                "text": "issued",
                "normalized": "issue"
            }
        },
        {
            "subject": {
                "text": "a request for assistance issued by the Government of Guatemala.We"
            },
            "sentence": " The team is being deployed though the European Union Civil Protection Mechanism, following a request for assistance issued by the Government of Guatemala.We are continuing to support Guatemala following the recent volcano eruptions.",
            "object": {
                "text": "continuing to support Guatemala"
            },
            "action": {
                "verb": {
                    "text": "be",
                    "tense": "present"
                },
                "text": "are",
                "normalized": "be"
            }
        },
        {
            "subject": {
                "text": "a request for assistance issued by the Government of Guatemala.We"
            },
            "sentence": " The team is being deployed though the European Union Civil Protection Mechanism, following a request for assistance issued by the Government of Guatemala.We are continuing to support Guatemala following the recent volcano eruptions.",
            "object": {
                "text": "Guatemala"
            },
            "action": {
                "verb": {
                    "text": "support",
                    "tense": "future"
                },
                "text": "are continuing to support",
                "normalized": "be continue to support"
            }
        },
        {
            "subject": {
                "text": "the EU"
            },
            "sentence": " The deployment of European experts comes on top of the 400 000 in emergency assistance, which the EU has provided to Guatemala since the volcano erupted to provide displaced populations in the worst-hit departments with health, water and sanitation assistance, as well as psychosocial support.",
            "object": {
                "text": "the 400 000 in emergency assistance"
            },
            "action": {
                "verb": {
                    "text": "provide",
                    "tense": "past"
                },
                "text": "has provided",
                "normalized": "have provide"
            }
        },
        {
            "subject": {
                "text": "far.BackgroundOn 3 June 2018, Guatemala's Volcan de Fuego"
            },
            "sentence": " The EU's Copernicus satellite mapping service was also activated upon request of the Government of Guatemala and has produced 18 maps so far.BackgroundOn 3 June 2018, Guatemala's Volcan de Fuego erupted, triggering floods of lava and emission of ash and small rocks.",
            "object": {
                "text": "floods of lava and emission of ash and small rocks"
            },
            "action": {
                "verb": {
                    "text": "trigger",
                    "tense": "present"
                },
                "text": "triggering",
                "normalized": "trigger"
            }
        },
        {
            "subject": {
                "text": "The eruption"
            },
            "sentence": " The eruption affected different areas of the departments of Chimaltenango, Sacatepquez, and Escuintla.",
            "object": {
                "text": "different areas of the departments of Chimaltenango, Sacatepquez, and Escuintla"
            },
            "action": {
                "verb": {
                    "text": "affect",
                    "tense": "past"
                },
                "text": "affected",
                "normalized": "affect"
            }
        },
        {
            "subject": {
                "text": "the volcano"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "action": {
                "verb": {
                    "text": "be",
                    "tense": "past"
                },
                "text": "was still reported to be",
                "normalized": "be still report to be"
            }
        },
        {
            "subject": {
                "text": "the volcano"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "action": {
                "verb": {
                    "text": "report",
                    "tense": "past"
                },
                "text": "reported",
                "normalized": "report"
            }
        },
        {
            "subject": {
                "text": "the volcano"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "object": {
                "text": "active"
            },
            "action": {
                "verb": {
                    "text": "be",
                    "tense": "past"
                },
                "text": "was still reported to be",
                "normalized": "be still report to be"
            }
        },
        {
            "subject": {
                "text": "four to five weak explosions"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "object": {
                "text": "every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing"
            },
            "action": {
                "verb": {
                    "text": "record",
                    "tense": "past"
                },
                "text": "recorded",
                "normalized": "record"
            }
        },
        {
            "subject": {
                "text": "by the Guatemalan national authorities"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "object": {
                "text": "the latest figures"
            },
            "action": {
                "verb": {
                    "text": "publish",
                    "tense": "past"
                },
                "text": "published",
                "normalized": "publish"
            }
        },
        {
            "subject": {
                "text": "197 people"
            },
            "sentence": " On 20 June, the volcano was still reported to be active, with four to five weak explosions recorded every hour.According to the latest figures published by the Guatemalan national authorities, the eruption has left 110 dead, with 197 people still missing.",
            "action": {
                "verb": {
                    "text": "miss",
                    "tense": "present"
                },
                "text": "missing",
                "normalized": "miss"
            }
        },
        {
            "subject": {
                "text": "an estimated 3 600"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "action": {
                "verb": {
                    "text": "be",
                    "tense": "present"
                },
                "text": "are",
                "normalized": "be"
            }
        },
        {
            "subject": {
                "text": "an estimated 3 600"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "action": {
                "verb": {
                    "text": "host",
                    "tense": "past"
                },
                "text": "hosted",
                "normalized": "host"
            }
        },
        {
            "subject": {
                "text": "17 official shelters.This EU Civil Protection Mechanism"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "object": {
                "text": "managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe"
            },
            "action": {
                "verb": {
                    "text": "be",
                    "tense": "present"
                },
                "text": "is",
                "normalized": "be"
            }
        },
        {
            "subject": {
                "text": "by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "object": {
                "text": "17 official shelters.This EU Civil Protection Mechanism"
            },
            "action": {
                "verb": {
                    "text": "manage",
                    "tense": "past"
                },
                "text": "is managed",
                "normalized": "be manage"
            }
        },
        {
            "subject": {
                "text": "Approximately 12 800 people"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "object": {
                "text": "a key role"
            },
            "action": {
                "verb": {
                    "text": "play",
                    "tense": "present"
                },
                "text": "plays",
                "normalized": "play"
            }
        },
        {
            "subject": {
                "text": "Approximately 12 800 people"
            },
            "sentence": " Approximately 12 800 people have been evacuated, and an estimated 3 600 are currently hosted in 17 official shelters.This EU Civil Protection Mechanism is managed by the European Commission's Emergency Response Coordination Centre (ERCC), which operates on a 24/7 basis and plays a key role as a coordination hub to facilitate a coherent European response during emergencies inside and outside Europe.",
            "object": {
                "text": "a coherent European response during emergencies inside and outside Europe"
            },
            "action": {
                "verb": {
                    "text": "facilitate",
                    "tense": "future"
                },
                "text": "to facilitate",
                "normalized": "to facilitate"
            }
        }
    ],
    "language": "en"
}
 */
