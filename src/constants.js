/**
 * Copyright (c) 2021 https://github.com/hicetnunc2000/hicetnunc
 * Copyright (c) 2021 Leon Nicholls
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * List of constant values used throughout the app.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/js

// HEN NFT token symbol
export const OBJKT_SYMBOL = 'OBJKT'

// Maximum file size in MB
export const MINT_FILESIZE = 100

// List of mime-types
export const MIMETYPE = {
    BMP: 'image/bmp',
    GIF: 'image/gif',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    SVG: 'image/svg+xml',
    TIFF: 'image/tiff',
    WEBP: 'image/webp',
    MP4: 'video/mp4',
    OGV: 'video/ogg',
    QUICKTIME: 'video/quicktime',
    WEBM: 'video/webm',
    GLB: 'model/gltf-binary',
    GLTF: 'model/gltf+json',
    MP3: 'audio/mpeg',
    OGA: 'audio/ogg',
    WAV: 'audio/wav',
    XWAV: 'audio/x-wav',
    FLAC: 'audio/flac',
    PDF: 'application/pdf',
    ZIP: 'application/zip',
    ZIP1: 'application/x-zip-compressed',
    ZIP2: 'multipart/x-zip',
    MD: 'text/plain'
}

export const JSON = 'application/json'

export const JPEG_EXTENSION = '.jpg'
export const JSON_EXTENSION = '.json'

// List of music mime-types supported by HEN
export const MUSIC_MIMETYPES = [
    MIMETYPE.MP3,
    MIMETYPE.OGA,
    MIMETYPE.WAV,
    MIMETYPE.XWAV,
    MIMETYPE.FLAC,
]

// Interactive OBJKTs type; directory of HTML files
export const IPFS_DIRECTORY_MIMETYPE = 'application/x-directory'

// Cover image types supported
export const ALLOWED_COVER_MIMETYPES = [
    MIMETYPE.JPEG,
    MIMETYPE.PNG,
    MIMETYPE.GIF,
]

// Dimensions for cover image
export const COVER_OPTIONS = {
    quality: 0.85,
    maxWidth: 1024,
    maxHeight: 1024,
}

// Dimensions for thumbnail image
export const THUMBNAIL_OPTIONS = {
    quality: 0.85,
    maxWidth: 350,
    maxHeight: 350,
}

// Max chars for description
export const MAX_DESCRIPTION = 5000

// Max chars for rights
export const MAX_RIGHTS = 5000

export const ALLOWED_COVER_FILETYPES_LABEL = ['jpeg, png, gif']

export const MIN_EDITIONS = 1 // Limited by contract

export const MAX_EDITIONS = 10000 // Limited by contract

export const MIN_ROYALTIES = 10 // Limited by contract

export const MAX_ROYALTIES = 25 // Limited by contract

// Infura API time limit in mins
export const MAX_INFURA_TIMEOUT = 30

export const MIN_INFURA_TIMEOUT = 1

// https://infura.io/docs/ipfs
export const INFURA_URL = 'https://ipfs.infura.io:5001'

// https://docs.pinata.cloud/
export const PINATA_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

// https://nft.storage/
export const NFT_STORAGE_URL = 'https://api.nft.storage/upload/'

export const IPFS_DEFAULT_THUMBNAIL_URI = 'ipfs://QmNrhZHUaEqxhyLfqoq1mtHSipkWHeT31LNHb1QEbDHgnc'

// HEN smart contracts
export const SMART_CONTRACT_hDAO = 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW'
export const SMART_CONTRACT_SUBJKT = 'KT1My1wDZHDGweCrJnQJi3wcFaS67iksirvj'
export const SMART_CONTRACT_V1 = 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'
export const SMART_CONTRACT_UNREGISTRY = 'KT18xby6bb1ur1dKe7i6YVrBaksP4AgtuLES'
export const SMART_CONTRACT_V2 = 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn'
export const SMART_CONTRACT_OBJKTS = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'
export const SMART_CONTRACT_HDAO_CURATION = 'KT1TybhR7XraG75JFYKSrh7KnxukMBT5dor6'
export const SMART_CONTRACT_HDAO_MARKETPLACE = 'KT1QPvv7sWVaT9PcPiC4fN9BgfX8NB2d5WzL'

export const IPFS_PROTOCOL = 'ipfs://'

export const IPFS_INFURA = 'infura'
export const IPFS_NFT_STORAGE = 'nft.storage'
export const IPFS_PINATA = 'pinata'

export const WALLET_STORAGE_LIMIT = 310
export const WALLET_CONFIRMATIONS_TO_WAIT = 1

// https://tezostaquito.io/docs/rpc_nodes/#list-of-community-run-nodes
export const RPC_NODES = [
    "https://mainnet.api.tez.ie",
    "https://api.tez.ie/rpc/mainnet",
    "https://mainnet.smartpy.io",
    "https://mainnet.smartpy.io",
    "https://rpc.tzbeta.net",
    "https://teznode.letzbake.com",
]

// Regular expressions used for validating the metadata JSON schema
export const IPFS_REGEX = "ipfs:\/\/Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}"
export const DATE_TIME_REGEX = `^\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d(\\.\\d+)?(([+-]\\d\\d:\\d\\d)|Z)?` // "2021-09-27T14:46:19.842Z"
export const DIMENSIONS_REGEX = `^(\\d*\\.?\\d+)\\s*x\\s*(\\d*\\.?\\d+)`
export const TEZOS_ADDRESS_REGEX = `^(tz1|tz2|tz3|KT1)[0-9a-zA-Z]{33}`

let mimeTypes = []
for (let key of Object.keys(MIMETYPE)) {
    mimeTypes.push(MIMETYPE[key])
}
mimeTypes.push(IPFS_DIRECTORY_MIMETYPE)

// JSON Schema used to validate the OBJKT metadata
// https://ajv.js.org/json-schema.html
export const METADATA_JSON_SCHEMA = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        rights: { type: "string" },
        minter: { type: "string", pattern: TEZOS_ADDRESS_REGEX },
        tags: { type: "array", items: { type: "string" } },
        symbol: { type: "string" },
        artifactUri: { type: "string", pattern: IPFS_REGEX },
        displayUri: { type: "string", pattern: IPFS_REGEX },
        thumbnailUri: { type: "string", pattern: IPFS_REGEX },
        creators: { type: "array", items: { type: "string", pattern: TEZOS_ADDRESS_REGEX } },
        contributors: { type: "array", items: { type: "string", pattern: TEZOS_ADDRESS_REGEX } },
        date: { type: "string", pattern: DATE_TIME_REGEX },
        formats: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    uri: { type: "string", pattern: IPFS_REGEX },
                    mimeType: { type: "string", enum: mimeTypes },
                    fileSize: { type: "number", minimum: 0 },
                    fileName: { type: "string" },
                    dimensions: {
                        type: "object",
                        properties: {
                            value: { type: "string", pattern: DIMENSIONS_REGEX },
                            unit: { type: "string" },
                        },
                        required: ["value", "unit"],
                        additionalProperties: true
                    },
                },
                required: ["uri", "mimeType"],
                additionalProperties: true
            }
        },
        attributes: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    value: { type: "string" },
                    type: { type: "string" },
                    trait_type: { type: "string" }
                },
                required: ["value"],
                additionalProperties: true
            }
        },
        decimals: { type: "number", minimum: 0 },
        isBooleanAmount: { type: "boolean" },
        shouldPreferSymbol: { type: "boolean" },
    },
    required: ["name", "description", "tags", "symbol", "artifactUri", "displayUri", "thumbnailUri", "creators", "formats", "decimals", "isBooleanAmount", "shouldPreferSymbol"],
    additionalProperties: false
}

// User settings
export const RPC_NODE = 'RPC_NODE'
export const IPFS_API = 'IPFS_API'
export const NFT_STORAGE_KEY = 'NFT_STORAGE_KEY'
export const INFURA_PROJECT_ID = 'INFURA_PROJECT_ID'
export const INFURA_PROJECT_SECRET = 'INFURA_PROJECT_SECRET'
export const INFURA_TIMEOUT = 'INFURA_TIMEOUT'
export const PINATA_API_KEY = 'PINATA_API_KEY'
export const PINATA_API_SECRET = 'PINATA_API_SECRET'