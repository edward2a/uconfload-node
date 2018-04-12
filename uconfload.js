/*
 * Copyright 2018 Eduardo A. Paris Penas <edward2a@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const yaml = require('js-yaml');
const fs = require('fs');
const argparse = require('argparse');

exports.loadArgs = loadArgs;
exports.loadConfig = loadConfig;
exports.loadEnv = loadEnv;

function loadArgs(){

	var parser = new argparse.ArgumentParser({addHelp: true});

	parser.addArgument(['-c', '--config'], {help: 'Config file path',
		defaultValue: '../config/config.yml'});

	var args = parser.parseArgs();

	return args
}


function loadConfig(cfg_file){
	return yaml.safeLoad(fs.readFileSync(cfg_file, 'utf8'));
}


function loadEnv(cfg_obj, inner=false){

	let e = 0;

	// Regex matchers
	var envVarId = new RegExp('env:[a-z]+?:')
	var boolFalse = new RegExp('^([Nn0]o?|[Ff]alse)$');
	var boolTrue = new RegExp('^([yY1](es)?|[Tt]rue)$');
	var numberRegex = new RegExp('env:(int|float):')

	for (const [key, value] of Object.entries(cfg_obj)) {

		// Nested dict (object) iterator
		if (typeof(value) === 'object' && value !== null) { e + loadEnv(value, true); }

		else if (typeof(value) === 'string' && value.startsWith('env')) {

			try {

				// Handle undefined variables
				if (! process.env[value.replace(envVarId, '')]) {
					e++
					throw `Configuration missing in process environment: ${value}`
				}

				// String handler
				if (value.startsWith('env:str:')) {
					cfg_obj[key] = process.env[value.replace('env:str:', '')]; }

				// List (array) handler
				else if (value.startsWith('env:list:')) {
					cfg_obj[key] = process.env[value.replace('env:list:', '')].split(','); }

				// Boolean handler
				else if (value.startsWith('env:bool:')) {
					var boolEnv = process.env[value.replace('env:bool:', '')]

					if (boolFalse.test(boolEnv)) {
						cfg_obj[key] = false; }

					else if (boolTrue.test(boolEnv)) {
						cfg_obj[key] = true; }

					else { console.error(`Value of environment variable ${value.replace('env:bool:', '')} is not supported as boolean`) }
				}

				// Number (int/float) handler
				else if (value.startsWith('env:int:') || value.startsWith('env:float:')) {
					cfg_obj[key] = Number(process.env[value.replace(numberRegex, '')]); }

			} // end try

			catch(error) {
				console.error(error);
			}

		} // end else if
	} // end for

	if (inner == true) { return e; }
	if (e > 0) { process.exit(1) }
}
