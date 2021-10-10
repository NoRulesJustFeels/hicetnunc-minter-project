# The Hic Et Nunc Minter Project

This project is an experimental NFT minter based on the [Hic Et Nunc](https://www.hicetnunc.xyz/) (HEN) minter. The code for this project was originally derived from the HEN [source code](https://github.com/hicetnunc2000/hicetnunc), but has been reworked to include various improvements. The existing HEN smart contracts are reused to keep it compatible with the HEN marketplace and various Tezos indexers and wallets.

## Strategic goals
* Give artists more control over their NFTs.
* Experiment with new features for a minter without impacting the production minter on HEN.
* Make it possible to have many decentralized minters, each potentially customized to the requirements of different kinds of media, the needs of different artists and the capabilities of different client devices.
* Build new kinds of collector experiences and NFTs on top of the minter.
* Contribute any successful features back to the HEN project.

## Tactical goals
* Convert the HEN code to pure JavaScript to make it independent of any web framework and more reusable.
* Follow best practices such as copyright notices, comments, error handling and logging.
* Externalize any configurable settings to allow for user preferences and allow artist to pin all the files associated with their NFTs
* Improve user feedback and error messages.
* Support more media formats.
* Expand the media metadata to support more of the [TZIP-21](https://tzip.tezosagora.org/proposal/tzip-21/) proposed spec.

## Future goals
* HTML preview for interactive OBJKTs.
* Improved web GUI.
* Automated testing.
* Optimize for different client device capabilities.


> **_NOTE:_**  NFT.Storage is currently not supported for storing files on IPFS due to two issues ([1](https://github.com/ipfs-shipyard/nft.storage/issues/523), [2](https://github.com/ipfs-shipyard/nft.storage/issues/571))


## Setup Instructions
This project uses the node package manager ([npm](https://www.npmjs.com/)) to install various packages. Make sure to install npm, which typically comes with Node.js.

If you haven't installed Node yet, [download](https://nodejs.org/) the latest stable release of Node.js and install it using all the default options.

## Clone the repository
If you have `git` installed, you can use the `git clone` command to clone the repository.

Otherwise you can [download](https://github.com/NoRulesJustFeels/hicetnunc-minter-project/archive/refs/heads/main.zip) and unzip the downloaded zip file into your coding folder.

Let `npm` download any dependencies for the project by running this command:
```
npm install
```

## Development server
You can start a local web server for development testing using [webpack](https://webpack.js.org/):
```
npm run serve
```
The web GUI will automatically load in a browser. While the server is running, any changes to the code is hot loaded into the web browser.

## Production build
Build the code using `npm`:
```
npm run build
```
The web site files are now available in the `dist` folder and can be deployed on a web server.

## Configuration
This project uses [dotenv](https://github.com/motdotla/dotenv) to allow developers to load environment variables from a `.env` file into `process.env`.

The web GUI also provides a settings page to allow the user to configure the following:
* Tezos RPC node.
* IPFS API ([NFT.Storage](https://nft.storage/), [Infura](https://infura.io/docs/ipfs) and [Pinata](https://www.pinata.cloud/) supported).
* Account information for each of the IPFS services used for storage and [pinning](https://github.com/hicetnunc2000/hicetnunc/wiki/IPFS-pinning).

## Differences with current HEN minter
* Images are created for both the cover and the thumbnail for image OBJKTs (HEN uses a static image for the thumbnail).
* The cover and thumbnail for animated GIFs are created (HEN skips these files).
* The uploaded cover image for [interactive OBJKTs](*https://github.com/hicetnunc2000/hicetnunc/wiki/Interactive-OBJKT) is used instead of the HTML meta image.
* The user can select to have a cover image automatically generated from the OBJKT file or for a cover image to be provided.
* The metadata uses more of the TZIP-21 spec (see [METADATA](METADATA.md)).
* Any data entered previously for the title, description, rights, tags, editions and royalties are defaulted for the next mint.
* The user can configure the Tezos RPC node and IPFS API (HEN hardcodes these in the GUI).
* The user can configure their own accounts for the IPFS pinning services (HEN uses its accounts to store and pin OBJKT files).
* [wasm-imagemagick](https://github.com/KnicKnic/WASM-ImageMagick) is used to scale more image formats (HEN uses [compressor.js](https://github.com/fengyuanchen/compressorjs)).
* [mediainfo.js](https://github.com/buzz/mediainfo.js) is used to parse the media file metadata.
* The OBJKT metadata JSON is validated against a [JSON schema](https://ajv.js.org/json-schema.html).

## Bugs
+ For bugs, please report an issue on Github. 
 
## License
See [LICENSE](LICENSE).
