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
 * Utility methods for creating and verifying the OBJKT metadata JSON. Based on TZIP-21 spec:
 * https://tzip.tezosagora.org/proposal/tzip-21/
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/components/media-types/index.js
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/data/ipfs.js

// https://github.com/pimterry/loglevel
import log, { debug } from 'loglevel'

import * as constants from './constants.js'
import * as utils from './utils.js'

// https://github.com/ajv-validator/ajv
import Ajv from "ajv"

// https://github.com/buzz/mediainfo.js
import MediaInfo from 'mediainfo.js'

// https://github.com/axelpale/genversion
import * as version from './version.js'
log.info('version=', version)

/**
 * Read a chunk of data from a file
 * @param {*} file 
 * @returns uint8array
 */
const readChunk = (file) => (chunkSize, offset) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            if (event.target.error) {
                reject(event.target.error)
            }
            resolve(new Uint8Array(event.target.result))
        }
        reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
    })

/**
 * Parse the metadata from a file using mediainfo.js
 * @param {*} file 
 * @returns metadata info
 */
export const parseMediaMetadata = async(file) => {
    return await MediaInfo().then((mediainfo) =>
        mediainfo.analyzeData(() => file.size, readChunk(file))
    )
}

/**
 * Verify that the JSON metadata complies with the TZIP-21 spec.
 * @param {*} metadata 
 * @returns validation info
 */
export const verifyMetadata = (metadata) => {
    log.debug('verifyMetadata:', metadata)
    const ajv = new Ajv()
    const validate = ajv.compile(constants.METADATA_JSON_SCHEMA)
    const valid = validate(metadata)
    return { valid, validate }
}

/**
 * Generate the JSON metadata for the OBJKT
 * @param {*} object of params 
 * @returns JSON metadata
 */
export const generateMetadata = async({
    title,
    description,
    rights,
    tags,
    cid,
    address,
    file,
    fileBuffer,
    mimeType,
    displayUri = '',
    thumbnailUri = constants.IPFS_DEFAULT_THUMBNAIL_URI,
    cover,
    thumbnail
}) => {
    log.debug('generateMetadata')

    let fileInformation = await utils.fileInformation(file)
    log.debug('file information=', fileInformation)

    let mediaMetadata = await parseMediaMetadata(file)
    log.debug(mediaMetadata)

    // Initialize the JSON metadata
    let metadata = {
        name: title,
        description,
        rights,
        minter: constants.SMART_CONTRACT_V1,
        date: new Date().toISOString(),
        tags: utils.tagsToArray(tags),
        symbol: constants.OBJKT_SYMBOL,
        artifactUri: cid,
        displayUri,
        thumbnailUri,
        creators: [address],
        formats: [],
        attributes: [],
        decimals: 0,
        isBooleanAmount: false,
        shouldPreferSymbol: false,
    }

    // Add the main file to the list of formats
    if (fileInformation.width && fileInformation.height) {
        metadata.formats.push({ uri: cid, mimeType, fileSize: fileInformation.size, fileName: fileInformation.name, dimensions: { value: `${fileInformation.width}x${fileInformation.height}`, unit: 'px' } })
    } else {
        // Directory
        metadata.formats.push({ uri: cid, mimeType, fileSize: fileInformation.size, fileName: fileInformation.name, })
    }
    // Add cover image and thumbnail image to the list of formats
    if (thumbnailUri !== constants.IPFS_DEFAULT_THUMBNAIL_URI) {
        let coverdata = { uri: displayUri, mimeType: constants.MIMETYPE.JPEG, fileName: utils.createCoverFileName(fileInformation.name) }
        let thumbnailData = { uri: thumbnailUri, mimeType: constants.MIMETYPE.JPEG, fileName: utils.createThumbnailFileName(fileInformation.name) }
        if (cover.size) {
            coverdata.fileSize = cover.size
        }
        if (thumbnail.size) {
            thumbnailData.fileSize = thumbnail.size
        }
        if (cover.width && cover.height) {
            coverdata.dimensions = { value: `${cover.width}x${cover.height}`, unit: 'px' }
        }
        if (thumbnail.width && thumbnail.height) {
            thumbnailData.dimensions = { value: `${thumbnail.width}x${thumbnail.height}`, unit: 'px' }
        }
        metadata.formats.push(coverdata)
        metadata.formats.push(thumbnailData)
    }

    // Add the media metadata info as attributes
    for (let track of mediaMetadata.media.track) {
        for (let [key, value] of Object.entries(track)) {
            if (key === '@type')
                continue
            if (value.constructor == Object) {
                metadata.attributes.push({ key, value: JSON.stringify(value) })
            } else {
                metadata.attributes.push({ key, value })

                if (constants.MUSIC_MIMETYPES.includes(fileInformation.type)) {
                    if (key === 'OverallBitRate') {
                        metadata.formats[0].dataRate = {
                            value: parseInt(value) / 1000,
                            unit: 'kbps'
                        }
                    } else if (key === 'Duration') {
                        const date = new Date(0)
                        date.setSeconds(parseFloat(value))
                        metadata.formats[0].duration = date.toISOString().substr(11, 8)
                    }
                }
            }
        }
    }

    // Add custom metadata about this minter
    metadata.attributes.push({ key: '@minter', value: `hen-minter v${version}` })
    metadata.attributes.push({ key: '@mediaParser', value: `mediainfo.js` })

    let { valid, validate } = verifyMetadata(metadata)
    if (!valid) {
        log.debug(validate.errors)
        throw new Error('Metadata format invalid')
    }
    return metadata
}