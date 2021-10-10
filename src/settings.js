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
 * Settings UI
 */

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as constants from './constants.js'
import * as utils from './utils.js'
import * as storage from './storage.js'

// Obtain references to all the UI elements
const settingsElement = document.getElementById('settings')
const rpcNodeElement = document.getElementById('rpcNode')
const ipfsApiElement = document.getElementById('ipfsApi')
const nftStorageKeyElement = document.getElementById('nftStorageKey')
const infuraProjectIdElement = document.getElementById('infuraProjectId')
const infuraProjectSecretElement = document.getElementById('infuraProjectSecret')
const infuraTimeoutElement = document.getElementById('infuraTimeout')
const pinataApiKeyElement = document.getElementById('pinataApiKey')
const pinataSecretElement = document.getElementById('pinataSecret')
const settingsOpenElement = document.getElementById('settingsOpen')
const settingsCloseElement = document.getElementById('settingsClose')

// Initialize data associated with the UI elements
let rpcNode = utils.getSetting(constants.RPC_NODE)
let ipfsApi = utils.getSetting(constants.IPFS_API)
let nftStorageKey = utils.getSetting(constants.NFT_STORAGE_KEY)
let infuraProjectId = utils.getSetting(constants.INFURA_PROJECT_ID)
let infuraProjectSecret = utils.getSetting(constants.INFURA_PROJECT_SECRET)
let infuraTimeout = utils.getSetting(constants.INFURA_TIMEOUT)
let pinataApiKey = utils.getSetting(constants.PINATA_API_KEY)
let pinataSecret = utils.getSetting(constants.PINATA_API_SECRET)

/**
 * Initialize the settings elements
 */
export const initSettingsForm = () => {
    log.debug('initSettingsForm')

    rpcNodeElement.value = utils.getSetting(constants.RPC_NODE)
    rpcNodeElement.title = `RPC Node (used for communicating with the Tezos blockchain)`
    rpcNodeElement.labels[0].innerHTML = rpcNodeElement.title
    ipfsApiElement.value = utils.getSetting(constants.IPFS_API)
    ipfsApiElement.title = `IPFS API (used for storing and <a href="https://github.com/hicetnunc2000/hicetnunc/wiki/IPFS-pinning" target="_blank">pinning</a> the NFT files)`
    ipfsApiElement.labels[0].innerHTML = ipfsApiElement.title
    nftStorageKeyElement.value = utils.getSetting(constants.NFT_STORAGE_KEY, true)
    nftStorageKeyElement.title = `Key`
    nftStorageKeyElement.labels[0].innerHTML = nftStorageKeyElement.title
    infuraProjectIdElement.value = utils.getSetting(constants.INFURA_PROJECT_ID, true)
    infuraProjectIdElement.title = `Project ID`
    infuraProjectIdElement.labels[0].innerHTML = infuraProjectIdElement.title
    infuraProjectSecretElement.value = utils.getSetting(constants.INFURA_PROJECT_SECRET, true)
    infuraProjectSecretElement.title = `Project secret`
    infuraProjectSecretElement.labels[0].innerHTML = infuraProjectSecretElement.title
    infuraTimeoutElement.value = utils.getSetting(constants.INFURA_TIMEOUT, true)
    infuraTimeoutElement.min = constants.MIN_INFURA_TIMEOUT
    infuraTimeoutElement.max = constants.MAX_INFURA_TIMEOUT
    infuraTimeoutElement.title = `Timeout (from ${constants.MIN_INFURA_TIMEOUT} mins to ${constants.MAX_INFURA_TIMEOUT} mins)`
    infuraTimeoutElement.labels[0].innerHTML = infuraTimeoutElement.title
    pinataApiKeyElement.value = utils.getSetting(constants.PINATA_API_KEY, true)
    pinataApiKeyElement.title = `API key`
    pinataApiKeyElement.labels[0].innerHTML = pinataApiKeyElement.title
    pinataSecretElement.value = utils.getSetting(constants.PINATA_API_SECRET, true)
    pinataSecretElement.title = `API secret`
    pinataSecretElement.labels[0].innerHTML = pinataSecretElement.title
}

/**
 * Listen to change events from the RPC node dropdown
 */
rpcNodeElement.addEventListener('change', (event) => {
    rpcNode = event.target.value
    storage.setItem(constants.RPC_NODE, rpcNode)
})

/**
 * Listen to change events from the IPFS API dropdown
 */
ipfsApiElement.addEventListener('change', (event) => {
    ipfsApi = event.target.value
    storage.setItem(constants.IPFS_API, ipfsApi)
})

/**
 * Listen to change events from the NFT.Storage input field
 */
nftStorageKeyElement.addEventListener('change', (event) => {
    nftStorageKey = event.target.value
    storage.setItem(constants.NFT_STORAGE_KEY, nftStorageKey)
})

/**
 * Listen to change events from the Infura prject ID input field
 */
infuraProjectIdElement.addEventListener('change', (event) => {
    infuraProjectId = event.target.value
    storage.setItem(constants.INFURA_PROJECT_ID, infuraProjectId)
})

/**
 * Listen to change events from the Infura project secret input field
 */
infuraProjectSecretElement.addEventListener('change', (event) => {
    infuraProjectSecret = event.target.value
    storage.setItem(constants.INFURA_PROJECT_SECRET, infuraProjectSecret)
})

/**
 * Listen to change events from the Infura timeout input field
 */
infuraTimeoutElement.addEventListener('change', (event) => {
    infuraTimeout = parseInt(event.target.value)
    storage.setItem(constants.INFURA_TIMEOUT, infuraTimeout)
})
infuraTimeoutElement.addEventListener('blur', (event) => {
    limitNumericField(event.target, constants.MIN_INFURA_TIMEOUT, constants.MAX_INFURA_TIMEOUT)
    infuraTimeout = parseInt(event.target.value)
})

/**
 * Listen to change events from the Pinata API key input field
 */
pinataApiKeyElement.addEventListener('change', (event) => {
    pinataApiKey = event.target.value
    storage.setItem(constants.PINATA_API_KEY, pinataApiKey)
})

/**
 * Listen to change events from the Pinata secrete input field
 */
pinataSecretElement.addEventListener('change', (event) => {
    pinataSecret = event.target.value
    storage.setItem(constants.PINATA_API_SECRET, pinataSecret)
})

/**
 * Listen to click events from the setting open button
 */
settingsOpenElement.addEventListener('click', () => {
    settingsElement.style.display = "block";
})

/**
 * Listen to click events from the setting close button
 */
settingsCloseElement.addEventListener('click', () => {
    settingsElement.style.display = "none";
})

/**
 * Verify that the user settings values are valid
 * @returns true if all settings are valid
 */
export const verify = async() => {
    if (ipfsApi === constants.IPFS_INFURA) {
        if (!utils.getSetting(constants.INFURA_PROJECT_ID) || !utils.getSetting(constants.INFURA_PROJECT_SECRET)) {
            utils.displayMessage('Missing Infura settings', false, true)
            return false
        }
    } else if (ipfsApi === constants.IPFS_NFT_STORAGE) {
        if (!utils.getSetting(constants.NFT_STORAGE_KEY)) {
            utils.displayMessage('Missing Nft.Storage settings', false, true)
            return false
        }
    } else if (ipfsApi === constants.IPFS_PINATA) {
        if (!utils.getSetting(constants.PINATA_API_KEY) || !utils.getSetting(constants.PINATA_API_SECRET)) {
            utils.displayMessage('Missing Pinata settings', false, true)
            return false
        }
        // https://github.com/PinataCloud/Pinata-SDK
        const pinataSDK = require('@pinata/sdk')
        const pinata = pinataSDK(utils.getSetting(constants.PINATA_API_KEY), utils.getSetting(constants.PINATA_API_SECRET))

        // Verify that the Pinata settings can be authenticated
        try {
            let result = await pinata.testAuthentication()
            log.debug(result)
        } catch (error) {
            log.error(error)
            utils.displayMessage('Invalid Pinata API key or secret', false, true)
            return false
        }
    } else {
        utils.displayMessage(`Invalid IPFS gateway: ${ipfsApi}`, false, true)
        return false
    }
    return true
}