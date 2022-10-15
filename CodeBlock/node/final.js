var request = require('request');
const path = require("path");
const checksum = require('checksum')
const { execSync } = require("child_process");
const { writeFileSync, unlinkSync } = require("fs");
const {
	getFideliusVersion,
	generateRandomUUID,
	ensureDirExists,
} = require("./utils.js");


const fideliusVersion = getFideliusVersion();
const binPath = path.join(
	__dirname,
	`../fidelius-cli-${fideliusVersion}/bin/fidelius-cli`
);

const execFideliusCli = (args) => {
	const execOptions = { encoding: "utf-8" };
	const fideliusCommand = `${binPath} ${args.join(" ")}`;

	const result = execSync(fideliusCommand, execOptions);
	try {
		return JSON.parse(result.replace(/(\r\n|\n|\r)/gm, ""));
	} catch (error) {
		console.error(
			`ERROR · execFideliusCli · Command: ${args.join(" ")}\n${result}`
		);
	}
};

const getEcdhKeyMaterial = () => {
	const result = execFideliusCli(["gkm"]);
	return result;
};

const writeParamsToFile = (...params) => {
	const fileContents = params.join("\n");
	const filePath = path.join(
		__dirname,
		"temp",
		`${generateRandomUUID()}.txt`
	);
	ensureDirExists(filePath);
	writeFileSync(filePath, fileContents);
	return filePath;
};

const removeFileAtPath = (filePath) => unlinkSync(filePath);

const encryptData = ({
	stringToEncrypt,
	senderNonce,
	requesterNonce,
	senderPrivateKey,
	requesterPublicKey,
}) => {
	const paramsFilePath = writeParamsToFile(
		"e",
		stringToEncrypt,
		senderNonce,
		requesterNonce,
		senderPrivateKey,
		requesterPublicKey
	);
	const result = execFideliusCli(["-f", paramsFilePath]);
	removeFileAtPath(paramsFilePath);
	return result;
};

const runExample = ({ stringToEncrypt,requesterData }) => {
	const senderKeyMaterial = getEcdhKeyMaterial();
	const requesterKeyMaterial = JSON.parse(requesterData);

	
	const encryptionResult = encryptData({
		stringToEncrypt,
		senderNonce: senderKeyMaterial.nonce,
		requesterNonce: requesterKeyMaterial.nonce,
		senderPrivateKey: senderKeyMaterial.privateKey,
		requesterPublicKey: requesterKeyMaterial.publicKey,
	});
	
	console.log({ senderKeyMaterial});
	console.log( {encryptionResult});
	const checkval  = checksum(encryptionResult.encryptedData)
	const checkvalbase64 = Buffer.from(checkval).toString('base64')

	console.log('checksum details' + checkvalbase64);
	request.post(
		'https://ndhm.herokuapp.com/',
		{ json: { encryptData :  encryptionResult.encryptedData,senderKeyMaterial: senderKeyMaterial,chekcsumvalue: checkvalbase64, inboundUrl : "encryptdata"} },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			}
		}
	);
};

module.exports = {
	encryptDataFunc : function encryptDataFunc ( stringToEncrypt,requesterData ) {
		const senderKeyMaterial = getEcdhKeyMaterial();
		const requesterKeyMaterial = requesterData;
	
		
		const encryptionResult = encryptData({
			stringToEncrypt,
			senderNonce: senderKeyMaterial.nonce,
			requesterNonce: requesterKeyMaterial.nonce,
			senderPrivateKey: senderKeyMaterial.privateKey,
			requesterPublicKey: requesterKeyMaterial.publicKey,
		});
		
		console.log({ senderKeyMaterial});
		console.log( {encryptionResult});
		const checkval  = checksum(encryptionResult.encryptedData)
		const checkvalbase64 = Buffer.from(checkval).toString('base64')
	
		console.log('checksum details' + checkvalbase64);
		request.post(
			'https://ndhm.herokuapp.com/',
			{ json: { encryptData :  encryptionResult.encryptedData,senderKeyMaterial: senderKeyMaterial,chekcsumvalue: checkvalbase64, inboundUrl : "encryptdata"} },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
				}
			}
		);
	},
}


//runExample( {stringToEncrypt: '{"data": "There is no war in Ba Sing Se!"}', requesterData: '{"nonce" : "mRTKi3jFnS7/HET9iKnrn0PkKf677ka16nyX+/5l8sc=","publicKey" : "BDb0S6+PsekYnhXars8ZlOpdHePGpPOBWkCqIBSws0I7d4OVNQpogxJN1p57sXWcYAv+m9zxkAdGttMP8geaIjA=" }' });




