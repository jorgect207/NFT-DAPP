// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Iwhitelisted.sol";

contract NftMint is ERC721Enumerable, ERC721URIStorage, Ownable {
    //ERROS
    error NOT_WHILISTED_STATED();
    error NOT_ENOUGHT_MONEY();
    error NOT_WHITELISTED();
    error NO_MORE_NFT();
    error TIME_DONE();
    error ITS_SO_EARLY();
    error NOT_PUBLIC_STATED();
    error TRANSACTION_FAILDE();
    error ONE_NFT_FOR_PERSON();

    //events
    event mint(uint256 tokenId, address addressMinted);

    //ENUMS
    enum state {
        STOP,
        WHITELIST,
        PUBLIC
    }
    state public stateMint;

    //CONTRACT VARIABLES
    uint256 public constant mintWhilistedPrice = 0.1 ether;
    uint256 public constant minPublicPrice = 0.2 ether;
    uint256 public constant maxTokenIds = 1000;

    mapping(address => bool) public addressWithNft;
    uint256 public immutable whitelistedTime;

    uint256 public tokenId = 0;
    Iwhitelisted public immutable whitelistedPeople;

    //ARRAY WIHT THE TOKENSURI
    string[] public tokensUrl;

    constructor(
        address _addressWhilistContract,
        string[] memory _tokensUrl
    ) ERC721("Basils", "Bs") {
        whitelistedPeople = Iwhitelisted(_addressWhilistContract);
        whitelistedTime = block.timestamp + 5 minutes;
        stateMint = state.WHITELIST;
        tokensUrl = _tokensUrl;
    }

    //OVERRIDINF FUNCTION IN ERC721Enumerable, ERC721URIStorage
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //NFT FUNCTIONS

    // STATES
    // 0 = STOP
    // 1 = WHITELIST
    // 2 = PUBLIC
    function changeState(state _state) public onlyOwner {
        stateMint = _state;
    }

    function mintWhilisted() external payable {
        if (block.timestamp > whitelistedTime) {
            revert TIME_DONE();
        }
        if (stateMint != state.WHITELIST) {
            revert NOT_WHILISTED_STATED();
        }
        require(msg.value >= mintWhilistedPrice, "no enouht money");
        // if (msg.value >= mintWhilistedPrice) {
        //     revert NOT_ENOUGHT_MONEY();
        // }
        if (!whitelistedPeople.whitelistedAddresses(msg.sender)) {
            revert NOT_WHITELISTED();
        }
        if (tokenId > maxTokenIds) {
            revert NO_MORE_NFT();
        }
        if (addressWithNft[msg.sender]) {
            revert ONE_NFT_FOR_PERSON();
        }

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokensUrl[tokenId]);
        emit mint(tokenId, msg.sender);
        tokenId += 1;
        addressWithNft[msg.sender] = true;
    }

    function mintPublic() external payable {
        if (block.timestamp < whitelistedTime) {
            revert ITS_SO_EARLY();
        }
        if (stateMint != state.PUBLIC) {
            revert NOT_PUBLIC_STATED();
        }
        require(msg.value >= minPublicPrice, "no enouht money");
        // if (msg.value > minPublicPrice) {
        //     revert NOT_ENOUGHT_MONEY();
        // }

        if (tokenId > maxTokenIds) {
            revert NO_MORE_NFT();
        }
        if (addressWithNft[msg.sender]) {
            revert ONE_NFT_FOR_PERSON();
        }

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokensUrl[tokenId]);
        emit mint(tokenId, msg.sender);
        tokenId++;
        addressWithNft[msg.sender] = true;
    }

    function stop() public onlyOwner {
        stateMint = state.STOP;
    }

    function withdraw(address payable _address) public onlyOwner {
        (bool success, ) = _address.call{value: address(this).balance}("");
        if (!success) {
            revert TRANSACTION_FAILDE();
        }
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
