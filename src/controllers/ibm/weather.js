import { get } from "axios";

const ROOT_URL = "https://twcservice.mybluemix.net:443";

export const forecastHourlyWeather48hours = ({ latitude, longitude }) => {
	return new Promise((resolve, reject) => {
		get(
			`${ROOT_URL}/api/weather/v1/geocode/${latitude}/${longitude}/forecast/hourly/48hour.json`,
			{
				auth: {
					username: process.env.WEATHER_USERNAME,
					password: process.env.WEATHER_PASSWORD
				}
			}
		)
			.then(({ data: { forecasts } }) => {
				const payload = forecasts.map(({ fcst_valid, temp, phrase_32char }) => {
					return { fcst_valid, temp, phrase_32char };
				});
				resolve(payload);
			})
			.catch(({ response: { statusText } }) => {
				reject(`forecastHourlyWeather48hours err: ${statusText}`);
			});
	});
};
