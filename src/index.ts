// *** YOU ARE LIMITED TO THE FOLLOWING IMPORTS TO BUILD YOUR PHAT CONTRACT     ***
// *** ADDING ANY IMPORTS WILL RESULT IN ERRORS & UPLOADING YOUR CODE TO PHALA  ***
// *** NETWORK WILL FAIL. IF YOU WANT TO KNOW MORE, JOIN OUR DISCORD TO SPEAK   ***
// *** WITH THE PHALA TEAM AT https://discord.gg/5HfmWQNX THANK YOU             ***
import "@phala/pink-env";
import { Coders } from "@phala/ethers";

type HexString = `0x${string}`

import {
  WalkerImpl,
  createTupleEncoder,
  encodeStr,
  decodeStr,
  encodeU8,
  decodeU8,
  createVecEncoder,
  createVecDecoder,
  createTupleDecoder,
} from '@scale-codec/core';

type Tuple = [string, string, string, string, number[]]
type GetTuple = [string, string, string, string]

const encodeS3Put = createTupleEncoder<Tuple>([
  encodeStr,
  encodeStr,
  encodeStr,
  encodeStr,
  createVecEncoder(encodeU8),
])

const encodeS3Get = createTupleEncoder<GetTuple>([
  encodeStr,
  encodeStr,
  encodeStr,
  encodeStr,
])

const decodeS3Put = createTupleDecoder<Tuple>([
  decodeStr,
  decodeStr,
  decodeStr,
  decodeStr,
  createVecDecoder(decodeU8),
])

const decodeS3Get = createTupleDecoder<GetTuple>([
  decodeStr,
  decodeStr,
  decodeStr,
  decodeStr,
])


// ETH ABI Coders available
/*
// Basic Types
// Encode uint
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
// Encode Bytes
const bytesCoder = new Coders.BytesCoder("bytes");
// Encode String
const stringCoder = new Coders.StringCoder("string");
// Encode Address
const addressCoder = new Coders.AddressCoder("address");

// ARRAYS
//
// ***NOTE***
// IF YOU DEFINE AN TYPED ARRAY FOR ENCODING, YOU MUST ALSO DEFINE THE SIZE WHEN DECODING THE ACTION REPLY IN YOUR
// SOLIDITY SMART CONTRACT.
// EXAMPLE for an array of string with a length of 10
//
// index.ts
const stringCoder = new Coders.StringCoder("string");
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string[]");
function encodeReply(reply: [number, number, string[]]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringArrayCoder], reply) as HexString;
}

const stringArray = string[10];

export default function main(request: HexString, secrets: string): HexString {
  return encodeReply([0, 1, stringArray]);
}
// OracleConsumerContract.sol
function _onMessageReceived(bytes calldata action) internal override {
    (uint respType, uint id, string[10] memory data) = abi.decode(
        action,
        (uint, uint, string[10])
    );
}
// Encode Array of addresses with a length of 10
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string");
// Encode Array of addresses with a length of 10
const addressArrayCoder = new Coders.ArrayCoder(addressCoder, 10, "address");
// Encode Array of bytes with a length of 10
const bytesArrayCoder = new Coders.ArrayCoder(bytesCoder, 10, "bytes");
// Encode Array of uint with a length of 10
const uintArrayCoder = new Coders.ArrayCoder(uintCoder, 10, "uint256");
*/

const uintCoder = new Coders.NumberCoder(32, false, "uint256");
const bytesCoder = new Coders.BytesCoder("bytes");
const stringCoder = new Coders.StringCoder("string");

function encodeReply(reply: [number, number, string, string]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringCoder, stringCoder], reply) as HexString;
}

// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

enum Error {
  BadRequestString = "BadRequestString",
  FailedToFetchData = "FailedToFetchData",
  FailedToDecode = "FailedToDecode",
  MalformedRequest = "MalformedRequest",
}

function errorToCode(error: Error): number {
  switch (error) {
    case Error.BadRequestString:
      return 1;
    case Error.FailedToFetchData:
      return 2;
    case Error.FailedToDecode:
      return 3;
    case Error.MalformedRequest:
      return 4;
    default:
      return 0;
  }
}

const WEATHER_SYMBOL_PLAIN = {
  "?": "https://ipfs.apillon.io/ipfs/QmV5apTs4snioxEFj5YmhipNpLgjGNk6hcgJj5vEcK7oxv",
  "mm": "https://ipfs.apillon.io/ipfs/QmNYBmQKvfEnAnGRbhTdZ8XxAp9BDpvCnWqS1VkKTzFy1S",
  "=": "https://ipfs.apillon.io/ipfs/QmNYBmQKvfEnAnGRbhTdZ8XxAp9BDpvCnWqS1VkKTzFy1S",
  "///": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "//": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "**": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "*/*": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "/": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  ".": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "x": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "x/": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "*": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "*/": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "m": "https://ipfs.apillon.io/ipfs/QmV5apTs4snioxEFj5YmhipNpLgjGNk6hcgJj5vEcK7oxv",
  "o": "https://ipfs.apillon.io/ipfs/QmV5apTs4snioxEFj5YmhipNpLgjGNk6hcgJj5vEcK7oxv",
  "/!/": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "!/": "https://ipfs.apillon.io/ipfs/QmVUDR7JosCXj2XXBax6rTiJu42vhSv3HSMNaj458ogxxN",
  "*!*": "https://ipfs.apillon.io/ipfs/QmbofYJo4PyVfckuqQAiPnBRsZ1mL5yo7SfFH8c1TqwhGH",
  "mmm": "https://ipfs.apillon.io/ipfs/QmNYBmQKvfEnAnGRbhTdZ8XxAp9BDpvCnWqS1VkKTzFy1S",
}

const SUPPORTED_CITIES = {
  "Dallas": true,
  "Yakutsk": true,
  "Sidney": true,
  "Aomori": true,
  "GrandJunction": true,
  "MexicoCity": true,
}

function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-f]+$/;
  return regex.test(str.toLowerCase());
}

function stringToHex(str: string): string {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return "0x" + hex;
}

function parseReqStr(hexStr: string): string {
  var hex = hexStr.toString();
  if (!isHexString(hex)) {
    throw Error.BadRequestString;
  }
  hex = hex.slice(2);
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    str += ch;
  }
  return str;
}

function checkCityStr(city: string): any {
  console.log(city);
  // @ts-ignore
  if (SUPPORTED_CITIES[city]) {
    return city
  } else {
    console.log(`City: ${city} not supported...defaulting to Dallas`);
    return "Dallas";
  }
}


function fetchWeatherApi(apiUrl: string, city: string): any {
  const weatherFormat = '?format={"name":"%l","description":"Weather+in+%l","external_url":"https://wrlx-bucket.4everland.store/%l/weather.json","image":"%x","attributes":[{"trait_type":"timestamp","value":"%T+%Z"},{"trait_type":"city","value":"%l"},{"trait_type":"weather","value":"%C+%t"}]}';
  const httpUrl = `${apiUrl}${city}${weatherFormat}`;
  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };
  let response = pink.httpRequest({
    url: httpUrl,
    method: "GET",
    headers,
    returnTextBody: true,
  });
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  console.log(respBody);
  return JSON.parse(respBody);
}

function updateS3Storage(city: string, metadata: string) {
  console.log(metadata)
  let uint8Array = new Uint8Array(metadata.length);
  for (let i = 0; i < metadata.length; i++) {
    uint8Array[i] = metadata.charCodeAt(i);
  }
  const endpoint = 'endpoint.4everland.co'
  const region = 'us-west-1'
  const bucket = 'wrlx-bucket'
  const object_key = `${city}/weather.json`;
  const value = uint8Array;
  const bytes = WalkerImpl.encode([
    endpoint,
    region,
    bucket,
    object_key,
    Array.from(value)
  ], encodeS3Put)
  const decoded = WalkerImpl.decode(bytes, decodeS3Put)
  console.info(`input decoded: ${decoded}`)
  console.log(bytes);
  const delegateOutput = pink.invokeContract({
    callee:
        "0x6295f7139ce955037419c444341f29e5ccc7a1e2165d6ca8591a4c401fb37abe",
    selector: 0xa2cb64e1,
    input: bytes,
  });
  console.log(`output: ${delegateOutput}`);
}

//
// Here is what you need to implemented for Phat Contract, you can customize your logic with
// JavaScript here.
//
// The Phat Contract will be called with two parameters:
//
// - request: The raw payload from the contract call `request` (check the `request` function in TestLensApiConsumerConract.sol).
//            In this example, it's a tuple of two elements: [requestId, profileId]
// - secrets: The custom secrets you set with the `config_core` function of the Action Offchain Rollup Phat Contract. In
//            this example, it just a simple text of the lens api url prefix. For more information on secrets, checkout the SECRETS.md file.
//
// Your returns value MUST be a hex string, and it will send to your contract directly. Check the `_onMessageReceived` function in
// OracleConsumerContract.sol for more details. We suggest a tuple of three elements: [successOrNotFlag, requestId, data] as
// the return value.
//
export default function main(request: HexString, secrets: string): HexString {
  console.log(`handle req: ${request}`);
  // Uncomment to debug the `settings` passed in from the Phat Contract UI configuration.
  // console.log(`secrets: ${settings}`);
  let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, "malform request", error as Error]);
  }
  const cityStr = parseReqStr(encodedReqStr as string);
  checkCityStr(cityStr);
  console.log(`Request received for city ${cityStr}`);

  try {
    const resp = fetchWeatherApi("https://wttr.in/", cityStr);
    // @ts-ignore
    const imageURI = WEATHER_SYMBOL_PLAIN[resp.image];
    console.log(imageURI);
    const nftUri = resp.external_url;
    console.log(nftUri);
    resp.image = imageURI;
    console.log(resp);
    updateS3Storage(cityStr, JSON.stringify(resp));
    // const respData = fetchApiStats(secrets, cityStr);
    // let stats = respData.data.profile.stats.totalPosts;
    console.log("response:", [TYPE_RESPONSE, requestId, cityStr, nftUri]);
    return encodeReply([TYPE_RESPONSE, requestId, cityStr, nftUri]);
  } catch (error) {
    if (error === Error.FailedToFetchData) {
      throw error;
    } else {
      // otherwise tell client we cannot process it
      console.log("error:", [TYPE_ERROR, requestId, cityStr, error as Error]);
      return encodeReply([TYPE_ERROR, requestId, cityStr, error as Error]);
    }
  }
}
