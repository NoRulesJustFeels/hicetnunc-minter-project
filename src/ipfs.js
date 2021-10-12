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
 * Utility methods for uploading files to various IPFS services.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/components/media-types/index.js
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/data/ipfs.js

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as constants from './constants.js'
import * as utils from './utils.js'
import * as metadata from './metadata.js'

// https://nft.storage/
import { NFTStorage } from 'nft.storage'

// https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
import { create } from 'ipfs-http-client'

// https://github.com/PinataCloud/Pinata-SDK
const pinataSDK = require('@pinata/sdk')

const readJsonLines = require('read-json-lines-sync').default

const Buffer = require('buffer').Buffer

/**
 * Add a file to IPFS using the configured IPFS API
 * @param {*} object of params
 * @returns CID
 */
const addFileToIpfs = async({ mimeType, buffer, reader, size, fileName }) => {
    log.debug('addFileToIpfs')
    const ipfsApi = utils.getSetting('IPFS_API')
    if (ipfsApi === constants.IPFS_INFURA) {
        try {
            // https://infura.io/docs/ipfs
            let infuraConfig = { url: constants.INFURA_URL }
            let timeout = utils.getSetting(constants.INFURA_TIMEOUT)
            infuraConfig.timeout = `${timeout ? parseInt(timeout) : constants.MIN_INFURA_TIMEOUT}m`
            infuraConfig.headers = {
                authorization: 'Basic ' + Buffer.from(utils.getSetting(constants.INFURA_PROJECT_ID) + ':' + utils.getSetting(constants.INFURA_PROJECT_SECRET)).toString('base64')
            }
            log.debug(infuraConfig)
            const IPFS = create(infuraConfig)

            let result = await IPFS.add(new Blob([buffer], { type: mimeType }))
            log.debug(result)
            log.debug('Infura pinning')
            let pinResult = await IPFS.pin.add(result.path)
            log.debug(pinResult)
            return result.path
        } catch (error) {
            log.error(error)
            return null
        }
    } else if (ipfsApi === constants.IPFS_NFT_STORAGE) {
        try {
            // https://nft.storage/
            const nftStorage = new NFTStorage({ token: utils.getSetting(constants.NFT_STORAGE_KEY) })

            let cid = await nftStorage.storeBlob(new Blob([buffer], { type: mimeType }))
            log.debug('cid=', cid)
            const status = await nftStorage.status(cid)
            log.debug('status=', status)

            // NFT.Storage only returns CIDv1, so convert to CIDv0 to be compatible with the HEN smart contract which only accepts CIDv0 for metadata URIs
            return utils.convertToCidV0(cid)
        } catch (error) {
            log.error(error)
            return null
        }
    } else if (ipfsApi === constants.IPFS_PINATA) {
        try {
            // https://github.com/PinataCloud/Pinata-SDK
            const formData = new FormData()
            formData.append('file', new Blob([buffer], { type: mimeType }), fileName)

            const options = {
                method: 'POST',
                body: formData,
                headers: {
                    pinata_api_key: utils.getSetting(constants.PINATA_API_KEY),
                    pinata_secret_api_key: utils.getSetting(constants.PINATA_API_SECRET),
                }
            }

            let result = await fetch(constants.PINATA_URL, options)
            let json = await result.json()
            log.debug(json)
            return json.IpfsHash

        } catch (error) {
            log.error(error)
            return null
        }
    } else {
        log.error('Invalid IPFS gateway:', ipfsApi)
        return null
    }
}

/**
 * Prepare a file to be uploaded to IPFS
 * @param {*} object of params
 * @returns CID of metadata
 */
export const prepareFile = async({
    title,
    description,
    rights,
    tags,
    address,
    file,
    fileName,
    fileBuffer,
    cover,
    thumbnail
}) => {
    log.debug('prepareFile')

    // Upload OBJKT file 
    utils.updateStatus('Adding OBJKT file to IPFS...')
    const hash = await addFileToIpfs({ mimeType: file.type, buffer: fileBuffer, fileName })
    if (!hash) {
        throw new Error('OBJKT file could not be added to IPFS')
    }
    log.debug('hash=', hash)
    const cid = utils.makeIpfsUri(hash)

    // Upload cover image
    utils.updateStatus('Adding cover image to IPFS...')
    let displayUri = ''
    cover.fileName = utils.createCoverFileName(fileName)
    const coverHash = await addFileToIpfs(cover)
    if (!coverHash) {
        throw new Error('Cover file could not be added to IPFS')
    }
    log.debug('coverHash=', coverHash)
    displayUri = utils.makeIpfsUri(coverHash)

    // Upload thumbnail image
    utils.updateStatus('Adding thumbnail image to IPFS...')
    let thumbnailUri = ''
    thumbnail.fileName = utils.createThumbnailFileName(fileName)
    const thumbnailHash = await addFileToIpfs(thumbnail)
    if (!thumbnailHash) {
        throw new Error('Thumbnail file could not be added to IPFS')
    }
    log.debug('thumbnailHash=', thumbnailHash)
    thumbnailUri = utils.makeIpfsUri(thumbnailHash)

    return await uploadMetadataFile({
        title,
        description,
        rights,
        tags,
        cid,
        address,
        file,
        fileName,
        fileBuffer,
        mimeType: file.type,
        displayUri,
        thumbnailUri,
        cover,
        thumbnail
    })
}

/**
 * Prepare a directory (zip file for HTML) to be uploaded to IPFS
 * @param {*} object of params 
 * @returns CID of metadata
 */
export const prepareDirectory = async({
    title,
    description,
    rights,
    tags,
    address,
    files,
    cover,
    thumbnail,
    file,
}) => {
    log.debug('prepareDirectory: files=', files.length)

    utils.updateStatus('Adding OBJKT file to IPFS...')
    const result = await addDirectoryToIpfs(file, files)
    if (!result) {
        throw new Error('File could not be added to IPFS')
    }
    const cid = utils.makeIpfsUri(result)

    let displayUri = ''
    let thumbnailUri = ''

    // Upload cover image
    utils.updateStatus('Adding cover image to IPFS...')
    cover.fileName = utils.createCoverFileName(file.name)
    const coverHash = await addFileToIpfs(cover)
    if (!coverHash) {
        throw new Error('Cover file could not be added to IPFS')
    }
    log.debug('coverHash=', coverHash)
    displayUri = utils.makeIpfsUri(coverHash)

    // Upload thumbnail image
    utils.updateStatus('Adding thumbnail image to IPFS...')
    thumbnail.fileName = utils.createThumbnailFileName(file.name)
    const thumbnailHash = await addFileToIpfs(thumbnail)
    if (!thumbnailHash) {
        throw new Error('Thumbnail file could not be added to IPFS')
    }
    log.debug('thumbnailHash=', thumbnailHash)
    thumbnailUri = utils.makeIpfsUri(thumbnailHash)

    return await uploadMetadataFile({
        title,
        description,
        rights,
        tags,
        cid,
        address,
        file,
        fileName: file.name,
        fileBuffer: null,
        mimeType: constants.IPFS_DIRECTORY_MIMETYPE,
        displayUri,
        thumbnailUri,
        cover,
        thumbnail
    })
}

/**
 * Check that the file type isn't a directory
 * @param {*} file 
 * @returns true if not a directory
 */
const not_directory = (file) => {
    return file.blob.type !== constants.IPFS_DIRECTORY_MIMETYPE
}

/**
 * Add the directory of files using the configured IPFS API
 * @param {*} file the zip file
 * @param {*} files the files contained in the zip file
 * @returns CID of the directory
 */
const addDirectoryToIpfs = async(file, files) => {
    log.debug('addDirectoryToIpfs')
    files = files.filter(not_directory)
    const ipfsApi = utils.getSetting('IPFS_API')
    if (ipfsApi === constants.IPFS_INFURA) {
        try {
            // https://infura.io/docs/ipfs
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('file', file.blob, encodeURIComponent(file.path))
            })

            const options = {
                method: 'POST',
                body: formData,
                headers: {
                    authorization: 'Basic ' + Buffer.from(utils.getSetting('INFURA_PROJECT_ID') + ':' + utils.getSetting('INFURA_PROJECT_SECRET')).toString('base64')
                }
            }

            let result = await fetch(`${constants.INFURA_URL}/api/v0/add?pin=true&wrap-with-directory=true`, options)
            const data = readJsonLines(await result.text())
            log.debug(data)

            const rootDir = data.find((e) => e.Name === '')
            if (rootDir) {
                return rootDir.Hash
            } else {
                return null
            }
        } catch (error) {
            log.error(error)
            return null
        }
    } else if (ipfsApi === constants.IPFS_NFT_STORAGE) {
        try {
            // https://ipfs-shipyard.github.io/nft.storage/client/
            const formData = new FormData()
            for (const file of files) {
                formData.append('file', file.blob, encodeURIComponent(file.path))
            }

            const response = await fetch(constants.NFT_STORAGE_URL, {
                method: 'POST',
                headers: NFTStorage.auth(utils.getSetting(constants.NFT_STORAGE_KEY)),
                body: formData,
            })
            const result = await response.json()

            if (result.ok) {
                return result.value.cid
            } else {
                log.error(result.error.message)
                return null
            }
        } catch (error) {
            log.error(error)
            return null
        }
    } else if (ipfsApi === constants.IPFS_PINATA) {
        try {
            // https://docs.pinata.cloud/api-pinning/pin-file#pinning-a-directory-example
            const formData = new FormData()
            const fileName = file.name
            files.forEach((file) => {
                formData.append('file', file.blob, `${utils.changeFileExtension(fileName, '')}/${encodeURIComponent(file.path)}`)
            })

            const pinataMetadata = JSON.stringify({
                name: fileName
            });
            formData.append('pinataMetadata', pinataMetadata);

            const options = {
                method: 'POST',
                body: formData,
                headers: {
                    pinata_api_key: utils.getSetting(constants.PINATA_API_KEY),
                    pinata_secret_api_key: utils.getSetting(constants.PINATA_API_SECRET),
                }
            }

            let result = await fetch(constants.PINATA_URL, options)
            let json = await result.json()
            log.debug(json)
            return json.IpfsHash
        } catch (error) {
            log.error(error)
            return null
        }
    } else {
        log.error('Invalid IPFS gateway:', ipfsApi)
        return null
    }
}

/**
 * Upload the metadata file for the OBJKT. Based on TZIP-21 spec.
 * @param {*} object of params 
 * @returns CID of the metadata
 */
const uploadMetadataFile = async({
    title,
    description,
    rights,
    tags,
    cid,
    address,
    file,
    fileName,
    fileBuffer,
    mimeType,
    displayUri = '',
    thumbnailUri = constants.IPFS_DEFAULT_THUMBNAIL_URI,
    cover,
    thumbnail
}) => {
    log.debug('uploadMetadataFile')

    let fileMetadata = await metadata.generateMetadata({
        title,
        description,
        rights,
        tags,
        cid,
        address,
        file,
        fileBuffer,
        mimeType,
        displayUri,
        thumbnailUri,
        cover,
        thumbnail
    });

    log.debug('fileMetadata=', fileMetadata)
    utils.updateStatus('Adding metadata file to IPFS...')
    let metadataHash = await addFileToIpfs({
        fileName: `metadata-${utils.changeFileExtension(fileName, constants.JSON_EXTENSION)}`,
        mimeType: constants.JSON,
        buffer: Buffer.from(
            JSON.stringify(fileMetadata)
        )
    })
    if (!metadataHash) {
        throw new Error('Metadata file could not be added to IPFS')
    }

    return metadataHash
}