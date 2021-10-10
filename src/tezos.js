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
 * Utility methods for working with Tezos wallets and smart contracts.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/context/HicetnuncContext.js

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as constants from './constants.js'
import * as utils from './utils.js'
import * as storage from './storage.js'

// https://tezostaquito.io/docs/wallet_API
// https://typedocs.walletbeacon.io/
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'

// https://tezostaquito.io/typedoc/classes/_taquito_beacon_wallet.beaconwallet.html
const WALLET = new BeaconWallet({
    name: process.env.WALLET_NAME,
    preferredNetwork: process.env.TEZOS_NETWORK,
})

// https://tezostaquito.io/docs/quick_start/
const TEZOS = new TezosToolkit(utils.getSetting('RPC_NODE'))
TEZOS.setWalletProvider(WALLET)

const NETWORK = {
    type: process.env.TEZOS_NETWORK,
    rpcUrl: utils.getSetting('RPC_NODE'),
}

const ADDRESS = 'address'

/**
 * Get the user's Tezos address from local storage
 * @returns 
 */
export const getAddress = () => {
    return storage.getItem(ADDRESS)
}

/**
 * Sync with the users wallet app
 * @param {boolean} requestPermission true if permission should be requested from the wallet app
 * @returns {Error} or void if no error
 */
export const sync = async(requestPermission = false) => {
    log.debug('sync: requestPermission =', requestPermission)

    let activeAccount
    try {
        activeAccount = await WALLET.client.getActiveAccount()
        log.debug('activeAccount:', activeAccount)
    } catch (error) {
        log.error(error)
        return error
    }

    if (requestPermission && activeAccount === undefined) {
        log.info('no active account')
        try {
            await WALLET.requestPermissions({ network: NETWORK })
        } catch (error) {
            log.error(error)
            return error
        }
    }

    let address = undefined

    // Get the user's address
    try {
        address = await WALLET.getPKH()
        log.debug('address:', address)
    } catch (error) {
        log.error(error)
        return error
    }

    // Persist the user's Tezos address in local storage
    storage.setItem(ADDRESS, address)
}

/**
 * Clear the active wallet account
 * @returns {Error} or void if no error
 */
export const unsync = async() => {
    log.debug('unsync')
    try {
        await WALLET.client.clearActiveAccount()
    } catch (error) {
        log.error(error)
        return error
    }
    storage.setItem('address', null)
}

/**
 * Mint a new OBJKT using the HEN v1 smart contrat
 * @param {string} tz
 * @param {number} amount 
 * @param {string} cid 
 * @param {number} royalties 
 */
export const mint = async(tz, amount, cid, royalties) => {
    log.debug('mint:', 'tz=', tz, 'amount=', amount, 'cid=', cid, 'royalties=', royalties)

    // Call the mint endpoint of the HEN smart contract
    return await TEZOS.wallet
        .at(constants.SMART_CONTRACT_V1)
        .then((contract) =>
            contract.methods.mint_OBJKT(
                tz,
                parseFloat(amount),
                utils.stringToHex(utils.makeIpfsUri(cid)),
                parseFloat(royalties) * 10
            )
            .send({ amount: 0, storageLimit: constants.WALLET_STORAGE_LIMIT })
        )
}