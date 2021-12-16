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
 * Minting UI
 */

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as constants from './constants.js'
import * as utils from './utils.js'
import * as images from './images.js'
import * as ipfs from './ipfs.js'
import * as html from './html.js'
import * as storage from './storage.js'
import * as tezos from './tezos.js'
import * as settings from './settings.js'

// Obtain references to all the UI elements
const syncButton = document.getElementById('sync')
const mintButton = document.getElementById('mint')
const titleInput = document.getElementById('title')
const descriptionInput = document.getElementById('description')
const rightsInput = document.getElementById('rights')
const tagsInput = document.getElementById('tags')
const editionsInput = document.getElementById('editions')
const royaltiesInput = document.getElementById('royalties')
const fileInput = document.getElementById('file')
const imageElement = document.getElementById('image')
const coverInput = document.getElementById('cover')
const needCoverElement = document.getElementById('needCover')
const coverOptionsElement = document.getElementById('coverOptions')
const operationElement = document.getElementById('operation')
const makeCoverElement = document.getElementById('makeCover')
const provideCoverElement = document.getElementById('provideCover')
const interactiveObjktsGuideElement = document.getElementById('interactiveObjktsGuide')


let title = ''
let description = ''
let rights = ''
let tags = ''
let editions = constants.MIN_EDITIONS
let royalties = constants.MIN_ROYALTIES
let file
let fileBuffer
let files
let cover
let coverBuffer
let thumbnail
let height
let width
let makeCover = true

/**
 * Limit the input field value to a range
 * @param {*} target element
 * @param {*} minValue 
 * @param {*} maxValue 
 */
const limitNumericField = (target, minValue, maxValue) => {
    if (target.value === '') target.value = '' // Seems redundant but actually cleans up e.g. '234e'
    target.value = Math.round(
        Math.max(Math.min(target.value, maxValue), minValue)
    )
}

/**
 * Listen to change events from the title input field
 */
titleInput.addEventListener('change', (event) => {
    title = event.target.value
    storage.setItem('title', title)
})

/**
 * Listen to change events from the description input field
 */
descriptionInput.addEventListener('change', (event) => {
    description = event.target.value
    storage.setItem('description', description)
})

/**
 * Listen to change events from the rights input field
 */
rightsInput.addEventListener('change', (event) => {
    rights = event.target.value
    storage.setItem('rights', rights)
})

/**
 * Listen to change events from the tags input field
 */
tagsInput.addEventListener('change', (event) => {
    tags = event.target.value
    storage.setItem('tags', tags)
})

/**
 * Listen to change events from the number of editions input field
 */
editionsInput.addEventListener('change', (event) => {
    editions = parseInt(event.target.value)
    storage.setItem('editions', editions)
})
editionsInput.addEventListener('blur', (event) => {
    limitNumericField(event.target, 1, constants.MAX_EDITIONS)
    editions = parseInt(event.target.value)
})

/**
 * Listen to change events from the royalties input field
 */
royaltiesInput.addEventListener('change', (event) => {
    royalties = parseInt(event.target.value)
    storage.setItem('royalties', royalties)
})
royaltiesInput.addEventListener('blur', (event) => {
    limitNumericField(event.target, constants.MIN_ROYALTIES, constants.MAX_ROYALTIES)
    royalties = parseInt(event.target.value)
})

/**
 * Listen to change events from the make cover radio button
 */
makeCoverElement.addEventListener('change', (event) => {
    makeCover = makeCoverElement.checked
    storage.setItem('makeCover', makeCover)

    // Display the cover file input element
    if (makeCover) {
        needCoverElement.style.display = 'none'
    } else {
        needCoverElement.style.display = 'block'
    }
})

/**
 * Listen to change events from the provide cover radio button
 */
provideCoverElement.addEventListener('change', (event) => {
    makeCover = !provideCoverElement.checked
    storage.setItem('makeCover', makeCover)

    // Display the cover file input element
    if (makeCover) {
        needCoverElement.style.display = 'none'
    } else {
        needCoverElement.style.display = 'block'
    }
})

/**
 * File input handler. Generate a cover and thumbnail image.
 * @param {*} file 
 * @param {*} fileBuffer 
 * @param {*} isCover 
 */
const handleFileUpload = async(file, fileBuffer, isCover) => {
    log.debug('handleFileUpload: ', file)
    if (file.type.indexOf('image') === 0) {
        imageElement.style.display = 'block'

        // Show a progress animation while cover image is being created
        imageElement.src = './assets/loading.gif'
        utils.displayMessage('Creating a cover image...', false, false, 30000)
        let result = await images.generateCoverAndThumbnail(file, fileBuffer)

        cover = result.cover
        thumbnail = result.thumbnail
        if (cover) {
            imageElement.src = cover.reader
            mintButton.disabled = false
        } else if (thumbnail) {
            imageElement.src = thumbnail.reader
            mintButton.disabled = false
        } else {
            imageElement.src = ''
            imageElement.style.display = 'none'
        }
        utils.displayMessage('')
        if (!isCover) {
            coverOptionsElement.style.display = 'block'
        }
        interactiveObjktsGuideElement.style.display = 'none'
    } else {
        log.debug('not an image file')
        needCoverElement.style.display = 'block'
        interactiveObjktsGuideElement.style.display = 'block'
        utils.displayMessage('Choose a cover image file')
    }
}

/**
 * Check if the file is small than the max size allowed
 * @param {*} file 
 * @returns true if the file size is less than the max allowed
 */
export const canUploadFile = (file) => {
    log.debug('canUploadFile')
    const filesize = (file.size / 1024 / 1024).toFixed(4)
    log.debug('filesize=', filesize)
    if (filesize > constants.MINT_FILESIZE) {
        utils.displayMessage(`File size of ${filesize}MB exceeds the max file size of ${constants.MINT_FILESIZE}MB`, false, true)
        return false
    }
    return true
}

/**
 * Verify the zip file is the correct format
 * @param {*} file 
 * @returns true if the zip file is valid
 */
export const canUploadZip = async(file) => {
    log.debug('canUploadZip')
    const buffer = await utils.loadFileArrayBuffer(file)
    files = await html.prepareFilesFromZIP(new Uint8Array(buffer))
    const fileBlobs = {}
    files.forEach((f) => {
        fileBlobs[f.path] = f.blob
    })

    const result = await html.validateFiles(fileBlobs)
    if (result.error) {
        log.error(result.error)
        utils.displayMessage(result.error, false, true)
        return false
    }
    log.debug(result.valid)

    return true
}

/**
 * Listen to change events from the file input field
 */
fileInput.addEventListener('change', async(event) => {
    log.debug('change fileInput')
    file = fileInput.files[0]
    log.debug('file:', file)
    if (canUploadFile(file)) {
        fileBuffer = await utils.loadFileArrayBuffer(file)

        // Generate a cover and thumbnail
        handleFileUpload(file, fileBuffer)
    } else {
        file = null
        fileBuffer = null
        fileInput.value = ''
        imageElement.style.display = 'none'
        imageElement.removeAttribute('src')
        mintButton.disabled = true
    }
}, false)

/**
 * Listen to change events from the cover image input field
 */
coverInput.addEventListener('change', async(event) => {
    log.debug('change coverInput')
    let coverFile = coverInput.files[0]
    log.debug('file:', coverFile)
    if (canUploadFile(coverFile)) {
        coverBuffer = await utils.loadFileArrayBuffer(coverFile)

        // Generate a cover and thumbnail
        handleFileUpload(coverFile, coverBuffer, true)
    } else {
        cover = null
        coverInput.value = ''
        imageElement.style.display = 'none'
        imageElement.removeAttribute('src')
        mintButton.disabled = true
    }
}, false)

/**
 * Sync with a Tezos wallet
 */
const sync = async() => {
    log.debug('sync')

    utils.displayMessage()
    try {
        let error = await tezos.sync(true)
        if (error === undefined) {
            syncButton.value = 'Unsync'
            utils.displayMessage('Your Tezos wallet is now synced')
        } else {
            utils.displayErrorMessage(error)
        }
    } catch (error) {
        log.error(error)
        utils.displayErrorMessage(error)
    }
}

/**
 * Unsync with a Tezos wallet
 */
const unsync = async() => {
    log.debug('unsync')

    utils.displayMessage()
    try {
        let error = await tezos.unsync()
        if (error === undefined) {
            syncButton.value = 'Sync'
            utils.displayMessage('Your Tezos wallet is no longer synced')
        } else {
            utils.displayErrorMessage(error)
        }
    } catch (error) {
        log.error(error)
        utils.displayErrorMessage(error)
    }
}

/**
 * Listen to click events from the sync button
 */
syncButton.addEventListener('click', () => {
    log.debug('click syncButton')
    if (syncButton.value.toLowerCase() === 'sync') {
        sync()
    } else {
        unsync()
    }
})

/**
 * Set the sync button initial state
 */
export const initSync = async() => {
    log.debug('initSync')

    if (tezos.getAddress() != null) {
        try {
            let error = await tezos.sync(false)
            if (error === undefined) {
                syncButton.value = 'Unsync'
            } else {
                utils.displayErrorMessage(error)
            }
        } catch (error) {
            log.error(error)
            utils.displayErrorMessage(error)
        }
    } else {
        utils.displayMessage('Your Tezos wallet is not synced')
    }
}

/**
 * Verify that the user input for minting
 * @returns true if user input valid
 */
const readyToMint = async() => {
    log.debug('readyToMint')
    log.debug('title=', title, 'description=', description, 'editions=', editions, 'royalties=', royalties, 'file=', file)

    if (description.length > constants.MAX_DESCRIPTION) {
        utils.displayMessage('Description is too long', false, true)
        return false
    }
    if (editions < constants.MIN_EDITIONS) {
        utils.displayMessage('Number of editions is too small', false, true)
        return false
    }
    if (editions > constants.MAX_EDITIONS) {
        utils.displayMessage('Number of editions is too large', false, true)
        return false
    }
    if (royalties < constants.MIN_ROYALTIES) {
        utils.displayMessage('Royalties is too low', false, true)
        return false
    }
    if (royalties > constants.MAX_ROYALTIES) {
        utils.displayMessage('Royalties is too high', false, true)
        return false
    }
    if (!file) {
        utils.displayMessage('OBJKT file is missing', false, true)
        return false
    }
    if (utils.ALLOWED_MIMETYPES.indexOf(file.type) === -1) {
        utils.displayMessage(`OBJKT file format invalid. Supported types include: ${utils.ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}`, false, true)
        return false
    }
    if (!canUploadFile(file)) return false
    if (!cover || !thumbnail) {
        utils.displayMessage('Thumbnails not ready. Try again in a minute.', false, true)
        return false
    }
    // TODO Display warning until Nft.Storage bug is fixed: https://github.com/ipfs-shipyard/nft.storage/issues/523
    /*
    if (storage.getItem(constants.IPFS_API) === constants.IPFS_NFT_STORAGE && [constants.MIMETYPE.ZIP, constants.MIMETYPE.ZIP1, constants.MIMETYPE.ZIP2].includes(file.type)) {
        utils.displayMessage('NFT.Storage does not support interactive OBJKTs', false, true)
        return false
    }
    */
    return await settings.verify()
}

/**
 * Mint the OBJKT
 */
const mint = async() => {
    log.debug('mint')
    mintButton.disabled = true
    operationElement.innerHTML = ''
    utils.displayMessage('Getting files ready to mint...', true, false, 60000)
    if (await readyToMint()) {
        log.debug('Ready to mint')
        let address = tezos.getAddress()
        let metadataHash
        if (
            [constants.MIMETYPE.ZIP, constants.MIMETYPE.ZIP1, constants.MIMETYPE.ZIP2].includes(file.type)
        ) {
            log.debug('Uploading zip')
            if (await canUploadZip(file)) {
                try {
                    log.debug(file)
                    log.debug(files)
                    metadataHash = await ipfs.prepareDirectory({
                        title: storage.getItem('title'),
                        description: storage.getItem('description'),
                        rights: storage.getItem('rights'),
                        tags: storage.getItem('tags'),
                        address,
                        files,
                        fileName: file.name,
                        cover,
                        thumbnail,
                        file
                    })
                    log.debug('metadataHash=', metadataHash)
                } catch (error) {
                    log.error(error)
                    utils.displayErrorMessage(error)
                    mintButton.disabled = false
                    return
                }
            }
        } else {
            log.debug('Uploading file')
            log.debug(file)
            log.debug(fileBuffer.byteLength)
            try {
                metadataHash = await ipfs.prepareFile({
                    title: storage.getItem('title'),
                    description: storage.getItem('description'),
                    rights: storage.getItem('rights'),
                    tags: storage.getItem('tags'),
                    address,
                    file,
                    fileName: file.name,
                    fileBuffer,
                    cover,
                    thumbnail
                })
                log.debug('metadataHash=', metadataHash)
            } catch (error) {
                log.error(error)
                utils.displayErrorMessage(error)
                mintButton.disabled = false
                return
            }
        }

        utils.displayMessage('Minting OBJKT...', true)
        try {
            log.debug('address=', address)
            log.debug('editions=', storage.getItem('editions'))
            log.debug('royalties=', storage.getItem('royalties'))
            log.debug('metadataHash=', metadataHash)
            let op = await tezos.mint(address, storage.getItem('editions'), metadataHash, storage.getItem('royalties'))
            log.debug('op:', op)
            utils.displayMessage('Waiting for the minting transaction to be confirmed (can take a few mins)...', true, false, 120000)
            op.confirmation(constants.WALLET_CONFIRMATIONS_TO_WAIT).then((result) => {
                    log.debug('transaction result:', result)

                    if (result && result.completed) {
                        let data = utils.parseTransaction(result, address)
                        log.debug('data=', data)
                        if (data) {
                            operationElement.innerHTML = `OBJKT ID = <a href="https://www.hicetnunc.xyz/objkt/${data.objkt_id}" target="_blank">${data.objkt_id}</a> (<a href="https://tzkt.io/${data.op}" target="_blank">transaction</a>, <a href="https://ipfs.io/ipfs/${metadataHash}" target="_blank">metadata</a>, <a href="https://ipfs.io/ipfs/${metadataHash}" target="_blank">view on IPFS</a>)`
                            utils.displayMessage('OBJKT minted successfully')
                        } else {
                            utils.displayMessage('An error has occurred confirming the transaction.', false, true) // TODO better message
                        }
                    } else {
                        utils.displayMessage('An error has occurred confirming the transaction.', false, true) // TODO better message
                    }
                    mintButton.disabled = false
                })
                .catch((error) => {
                    log.error(error)
                    utils.displayMessage('An error has occurred confirming the transaction.', false, true) // TODO better message
                    mintButton.disabled = false
                })

        } catch (error) {
            log.error(error)
            utils.displayMessage('An error has occurred during minting.', false, true) // TODO better message
            mintButton.disabled = false
        }
    } else {
        log.debug('Not ready to mint')
        mintButton.disabled = false
    }
}

/**
 * Initialize the minting input elements
 */
export const initMintForm = () => {
    log.debug('initMintForm')

    const storageTitle = storage.getItem('title')
    titleInput.value = storageTitle ? storageTitle : title
    titleInput.title = `Title of the OBJKT`
    titleInput.labels[0].innerHTML = titleInput.title
    const storageDescription = storage.getItem('description')
    descriptionInput.value = storageDescription ? storageDescription : description
    descriptionInput.title = `Description of the OBJKT (max ${constants.MAX_DESCRIPTION} characters)`
    descriptionInput.labels[0].innerHTML = descriptionInput.title
    descriptionInput.maxlength = constants.MAX_DESCRIPTION
    const storageRights = storage.getItem('rights')
    rightsInput.value = storageRights ? storageRights : rights
    rightsInput.title = `Rights of the OBJKT (max ${constants.MAX_DESCRIPTION} characters)`
    rightsInput.labels[0].innerHTML = rightsInput.title
    rightsInput.maxlength = constants.MAX_RIGHTS
    const storageTags = storage.getItem('tags')
    tagsInput.value = storageTags ? storageTags : tags
    tagsInput.title = 'Comma separated list of tags (for example: illustration, digital, 3D)'
    tagsInput.labels[0].innerHTML = tagsInput.title
    const storageEditions = storage.getItem('editions')
    if (storageEditions) {
        editionsInput.value = storageEditions
    } else {
        editionsInput.value = editions
        storage.setItem('editions', editions)
    }
    editionsInput.min = constants.MIN_EDITIONS
    editionsInput.max = constants.MAX_EDITIONS
    editionsInput.title = `Number of editions (from ${constants.MIN_EDITIONS} to ${constants.MAX_EDITIONS})`
    editionsInput.labels[0].innerHTML = editionsInput.title
    const storageRoyalties = storage.getItem('royalties')
    if (storageRoyalties) {
        royaltiesInput.value = storageRoyalties
    } else {
        royaltiesInput.value = royalties
        storage.setItem('royalties', royalties)
    }
    royaltiesInput.min = constants.MIN_ROYALTIES
    royaltiesInput.max = constants.MAX_ROYALTIES
    royaltiesInput.title = `Royalties after each sale (from ${constants.MIN_ROYALTIES}% to ${constants.MAX_ROYALTIES}%)`
    royaltiesInput.labels[0].innerHTML = royaltiesInput.title
    fileInput.title = `OBJKT file (Types supported: ${utils.ALLOWED_FILETYPES_LABEL.toLocaleLowerCase()}. Max file size is ${constants.MINT_FILESIZE}MB)`
    fileInput.labels[0].innerHTML = fileInput.title
    let mimeTypes = []
    for (let key of Object.keys(constants.MIMETYPE)) {
        mimeTypes.push(constants.MIMETYPE[key])
    }
    fileInput.accept = mimeTypes.join()
    coverInput.title = `Cover file (Types supported: ${constants.ALLOWED_COVER_FILETYPES_LABEL.join()}. Max file size is ${constants.MINT_FILESIZE}MB. Max width is ${constants.COVER_OPTIONS.maxWidth} and max height is ${constants.COVER_OPTIONS.maxHeight})`
    coverInput.labels[0].innerHTML = coverInput.title
    mimeTypes = []
    for (let key of Object.keys(constants.ALLOWED_COVER_MIMETYPES)) {
        mimeTypes.push(constants.ALLOWED_COVER_MIMETYPES[key])
    }
    coverInput.accept = mimeTypes.join()
    needCoverElement.style.display = 'none'
    coverOptionsElement.style.display = 'none'
    interactiveObjktsGuideElement.style.display = 'none'
    makeCoverElement.checked = true
}

/**
 * Listen to click events from the mint button
 */
mintButton.addEventListener('click', () => {
    mint()
})