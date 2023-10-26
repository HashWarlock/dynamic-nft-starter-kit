// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITokenERC721.sol";
import "./PhatRollupAnchor.sol";

contract OracleConsumerContract is PhatRollupAnchor, Ownable {
    event MintSucceeded(uint256 nftId);
    event ErrorMintFail(string err);
    event ResponseReceived(uint reqId, string reqData, string city);
    event ErrorReceived(uint reqId, string reqData, string errno);
    event ErrorWeatherMojoCityAlreadyMinted(string city);
    event WeatherMojoCityNftUpdated(uint reqId, string city, string nftUri);
    event ErrorSenderNotOwnerOfCityNft(uint256 nftId, string err);

    uint constant TYPE_RESPONSE = 0;
    uint constant TYPE_ERROR = 2;

    mapping(uint => address) public requestsByUsers;
    mapping(string => uint) mintedWeatherMojoCities;
    ITokenERC721 WeatherMojoNfts = ITokenERC721(0x494b46B3527C376d6A0A36d193ebD05dd9Ed7965);
    mapping(uint => string) requests;
    uint nextRequest = 1;

    constructor(address phatAttestor) {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function setAttestor(address phatAttestor) public {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function request(string memory city) public {
        if (mintedWeatherMojoCities[city] >= 0) {
            emit ErrorWeatherMojoCityAlreadyMinted(city);
        } else {
            address sender = msg.sender;
            // assemble the request
            uint id = nextRequest;
            requests[id] = city;
            requestsByUsers[id] = sender;
            _pushMessage(abi.encode(id, city));
            nextRequest += 1;
        }
    }

    function updateWeather(string memory city) public {
        address sender = msg.sender;
        uint nftId = mintedWeatherMojoCities[city];
        if (sender != WeatherMojoNfts.ownerOf(nftId)) {
            emit ErrorSenderNotOwnerOfCityNft(nftId, "sender is not owner of NFT");
        } else {
            // assemble the request
            uint id = nextRequest;
            requests[id] = city;
            requestsByUsers[id] = sender;
            _pushMessage(abi.encode(id, city));
            nextRequest += 1;
        }
    }

    // For test
    function malformedRequest(bytes calldata malformedData) public {
        uint id = nextRequest;
        requests[id] = "malformed_req";
        _pushMessage(malformedData);
        nextRequest += 1;
    }

    function _onMessageReceived(bytes calldata action) internal override {
        // Optional to check length of action
        // require(action.length == 32 * 3, "cannot parse action");
        (uint respType, uint id, string memory city, string memory nftUri) = abi.decode(
            action,
            (uint, uint, string, string)
        );
        if (respType == TYPE_RESPONSE) {
            emit ResponseReceived(id, requests[id], city);
            address requester = requestsByUsers[id];
            if (mintedWeatherMojoCities[city] >= 0) {
                emit ResponseReceived(id, requests[id], nftUri);
                emit WeatherMojoCityNftUpdated(id, city, nftUri);
                delete requests[id];
                delete requestsByUsers[id];
            } else {
                try WeatherMojoNfts.mintTo(requester, nftUri) returns (uint256 nftId) {
                    emit ResponseReceived(id, requests[id], nftUri);
                    emit MintSucceeded(nftId);
                    mintedWeatherMojoCities[city] = nftId;
                    delete requests[id];
                    delete requestsByUsers[id];
                } catch Error(string memory error) {
                    emit ErrorMintFail(error);
                    delete requests[id];
                    delete requestsByUsers[id];
                }
            }
        } else if (respType == TYPE_ERROR) {
            emit ErrorReceived(id, requests[id], nftUri);
            delete requests[id];
            delete requestsByUsers[id];
        }
    }
}
