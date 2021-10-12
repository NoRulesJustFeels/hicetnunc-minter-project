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
 * Various utility methods used throughout the app.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/constants.js

// https://github.com/pimterry/loglevel
import log from 'loglevel'
import * as constants from './constants.js'
import * as storage from './storage.js'

// https://github.com/juliangruber/stream
const stream = require('stream')
const Buffer = require('buffer').Buffer

const CID = require('cids')

let LANGUAGE = {}
export const setLanguage = (data) => (LANGUAGE = data)
export const getLanguage = () => LANGUAGE

let objktBlockList = []
export const setObjktBlockList = (data) => (objktBlockList = data)
export const getObjktBlockList = () => objktBlockList

let walletBlockList = []
export const setWalletBlockList = (data) => (walletBlockList = data)
export const getWalletBlockList = () => walletBlockList

let banBlockList = []
export const setBanBlockList = (data) => (banBlockList = data)
export const getBanBlockList = () => banBlockList

export const ALLOWED_MIMETYPES = Object.keys(constants.MIMETYPE)
    .map((k) => constants.MIMETYPE[k])
    .filter((e) => e !== constants.MIMETYPE.GLTF) // disabling GLTF from new updates

export const ALLOWED_FILETYPES_LABEL = Object.entries(constants.MIMETYPE)
    .filter((e) => ALLOWED_MIMETYPES.includes(e[1]))
    .filter((e) => !['ZIP1', 'ZIP2', 'OGA', 'OGV', 'BMP', 'TIFF', 'XWAV', 'QUICKTIME', 'WEBP'].includes(e[0]))
    .map((e) => (e[0] === 'ZIP' ? 'HTML (ZIP ARCHIVE)' : e[0]))
    .join(', ')

/**
 * Make a IPFS URI
 * @param {*} cid 
 * @returns IPFS URI
 */
export const makeIpfsUri = (cid) => {
    log.debug('makeIpfsUri:', cid)
    if (cid && !cid.startsWith(constants.IPFS_PROTOCOL))
        return constants.IPFS_PROTOCOL + cid
    return cid
}

/**
 * Convert a string to hex chars
 * @param {*} value 
 * @returns hex chars
 */
export const stringToHex = (value) => {
    log.debug('stringToHex:', value)
    return value.split('')
        .reduce(
            (hex, c) =>
            (hex += c.charCodeAt(0).toString(16).padStart(2, '0')),
            ''
        )
}

/**
 * Convert string of comma-separated tags to an array
 * @param {*} tags 
 * @returns array of tags
 */
export const tagsToArray = (tags) => {
    log.debug('tagsToArray:', tags)
    tags = tags.replace(/\s/g, '')
    if (tags.length === 0) {
        return []
    } else {
        return tags.split(',')
    }
}

/**
 * Load a file and extract its information
 * @param {*} file 
 * @param {*} fileInformation 
 */
const loadImage = async(file, fileInformation) => {
    log.debug('loadImage')
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = (e) => {
            let img = new Image()
            img.src = e.target.result

            img.onload = () => {
                log.debug('onload')
                fileInformation.width = img.width
                fileInformation.height = img.height
                resolve('resolved')
            }
        }
        reader.onerror = function() {
            log.error(reader.error)
            resolve(null)
        }
        reader.readAsDataURL(file)
    })
}

/**
 * Load a file as an arraybuffer
 * @param {*} file 
 * @returns arrayBuffer
 */
export const loadFileArrayBuffer = async(file) => {
    log.debug('loadFileArrayBuffer')
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = (e) => {
            resolve(reader.result)
        }
        reader.onerror = () => {
            log.error(reader.error)
            resolve(null)
        }
        reader.readAsArrayBuffer(file)
    })
}

/**
 * Create a file information object
 * @param {*} file 
 * @returns fileInformation object
 */
export const fileInformation = async(file) => {
    log.debug('fileInformation:', file)
    let fileInformation = {
        name: file.name,
        size: file.size,
        type: file.type,
        dateModified: file.lastModifiedDate,
        extension: file.name.replace(/^.*\./, '')
    }

    if (file.type.indexOf('image') === 0) {
        await loadImage(file, fileInformation)
    }
    return fileInformation
}

/**
 * Extract the OBJKT minting metadata from the transaction data
 * @param {*} response 
 * @param {*} address 
 * @returns {block, chain_id, op, objkt_id}
 */
export const parseTransaction = (result, address) => {
    log.debug('parseTransaction')
    let data = {}
    try {
        data.block = result.block.header.level
        data.chain_id = result.block.chain_id
        for (let operations of result.block.operations) {
            for (let op of operations) {
                for (let content of op.contents) {
                    if (content.kind === 'transaction' &&
                        content.source === address &&
                        content.destination === constants.SMART_CONTRACT_V1 &&
                        content.parameters.entrypoint === 'mint_OBJKT') {
                        data.op = op.hash
                        for (let diff of content.metadata.operation_result.big_map_diff) {
                            if (diff.key.int) {
                                data.objkt_id = diff.key.int
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        log.error(error)
        return null
    }
    return data
}

/**
 * Get a user setting value
 * @param {*} key 
 * @param {*} userOnly 
 * @returns value
 */
export const getSetting = (key, userOnly) => {
    // Determine if the user configured a value
    log.debug('getSetting: key=', key)
    let storageValue = storage.getItem(key)
    if (storageValue) {
        return storageValue
    }

    if (userOnly) {
        log.debug('no setting')
        return null
    }

    // Webpack is doing something weird with process.env
    // Have to look up the variables explicitly instead of parameterized
    let envValue
    switch (key) {
        case constants.RPC_NODE:
            envValue = process.env.RPC_NODE
            break;
        case constants.IPFS_API:
            envValue = process.env.IPFS_API
            break;
        case constants.NFT_STORAGE_KEY:
            envValue = process.env.NFT_STORAGE_KEY
            break;
        case constants.INFURA_PROJECT_ID:
            envValue = process.env.INFURA_PROJECT_ID
            break;
        case constants.INFURA_PROJECT_SECRET:
            envValue = process.env.INFURA_PROJECT_SECRET
            break;
        case constants.INFURA_TIMEOUT:
            envValue = process.env.INFURA_TIMEOUT
            break;
        case constants.PINATA_API_KEY:
            envValue = process.env.PINATA_API_KEY
            break;
        case constants.PINATA_API_SECRET:
            envValue = process.env.PINATA_API_SECRET
            break;

        default:
            break;
    }
    if (envValue) {
        return envValue
    }
    log.debug('no setting')
    return null
}

/**
 * Convert a buffer to a stream
 * @param {*} buffer 
 * @returns 
 */
export const bufferToStream = (buffer) => {
    log.debug('bufferToStream')
    let tmp = new stream.Duplex()
    tmp.push(Buffer.from(buffer))
    tmp.push(null)
    return tmp
}

/**
 * Display a message to the user
 * @param {*} message string message to display
 * @param {*} progress boolean to show progress indicator
 * @param {*} confirmation boolean to get confirmation from the user
 * @param {*} duration duration in ms for message to be visible
 */
export const displayMessage = (message, progress, confirmation, duration) => {
    log.debug('displayMessage')
        // create and dispatch the event
    let detail = {}
    if (message) {
        detail.message = message
    }
    if (progress) {
        detail.progress = progress
    }
    if (confirmation) {
        detail.confirmation = confirmation
    }
    if (duration) {
        detail.duration = duration
    }
    const event = new CustomEvent('displayMessage', {
        detail
    })
    log.debug(detail)
    window.dispatchEvent(event);
}

/**
 * Display an error message to the user
 * @param {*} error 
 */
export const displayErrorMessage = (error) => {
    log.debug('displayErrorMessage')
    if (error) {
        const event = new CustomEvent('displayMessage', {
            detail: {
                error
            }
        })
        window.dispatchEvent(event)
    }
}

/**
 * Update the status of the currently progressing operation
 * @param {*} message 
 */
export const updateStatus = (message) => {
    log.debug('updateStatus')
    if (message) {
        const event = new CustomEvent('displayStatus', {
            detail: {
                message
            }
        })
        window.dispatchEvent(event)
    }
}

/**
 * Change the file extension to another
 * @param {*} file 
 * @param {*} extension 
 * @returns file name with new extension
 */
export const changeFileExtension = (file, extension) => {
    log.debug('changeFileExtension')
    const pos = file.lastIndexOf('.')
    file = file.substr(0, pos < 0 ? file.length : pos) + extension
    return file
}

/**
 * Create a name for the cover image
 * @param {*} fileName 
 * @returns cover image file name
 */
export const createCoverFileName = (fileName) => {
    log.debug('createCoverFileName')
    return `cover-${changeFileExtension(fileName, constants.JPEG_EXTENSION)}`
}

/**
 * Create a name for the thumbnail image
 * @param {*} fileName 
 * @returns thumbnail image file name
 */
export const createThumbnailFileName = (fileName) => {
    log.debug('createThumbnailFileName')
    return `thumbnail-${changeFileExtension(fileName, constants.JPEG_EXTENSION)}`
}

/**
 * Convert a CIDv1 to CIDv0
 * @param {*} cid1 
 * @returns 
 */
export const convertToCidV0 = (cid1) => {
    log.debug('convertToCidV0')
    try {
        let cid = new CID(cid1)
        cid = cid.toV0()
        log.debug(cid.toString())
        return cid.toString()
    } catch (error) {
        log.error(error)
        return null
    }
}