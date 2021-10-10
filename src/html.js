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
 * Utility methods for handling interactive OBJKTs zip files containing HTML files.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/utils/html.js

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as fflate from 'fflate'
import mime from 'mime-types'
import * as constants from './constants.js'

/**
 * Prepare the ZIP HTML files for IPFS uploading
 * @param {*} buffer the zip file buffer
 * @returns array of files
 */
export async function prepareFilesFromZIP(buffer) {
    log.debug('prepareFilesFromZIP')
    let files = await unzipBuffer(buffer)

    // Save raw index file
    const indexBlob = files['index.html']
    files['index_raw.html'] = new Blob([indexBlob], { type: indexBlob.type })

    // Inject CSP meta tag in all html files
    for (let k in files) {
        if (k.endsWith('.html') || k.endsWith('.htm')) {
            const pageBuffer = await files[k].arrayBuffer()
            const safePageBuffer = injectCSPMetaTagIntoBuffer(pageBuffer)
            files[k] = new Blob([safePageBuffer], {
                type: indexBlob.type,
            })
        }
    }

    // Reformat
    files = Object.entries(files).map((file) => {
        return {
            path: file[0],
            blob: file[1],
        }
    })

    // Remove top level dir
    files = files.filter((f) => f.path !== '')

    return files
}
/**
 * Unzip the files from the buffer.
 * @param {*} buffer the zip file buffer
 * @returns the list of files contained in the zip file
 */
export async function unzipBuffer(buffer) {
    log.debug('unzipBuffer')
    let entries = fflate.unzipSync(buffer)
    entries = Object.entries(entries).map((entry) => {
        return {
            path: entry[0],
            buffer: entry[1],
        }
    })

    // Find root dir
    let rootDir = null
    for (let i = 0; i < entries.length; i++) {
        const parts = entries[i].path.split('/')
        const filename = parts[parts.length - 1]
        if (filename === 'index.html') {
            const parts = entries[i].path.split('/')
            parts.pop()
            rootDir = parts.join('/')
            break
        }
    }

    if (rootDir === null) {
        const msg = 'No index.html file found!'
        log.debug(msg)
        throw new Error(msg)
    }

    // Create files map
    const files = {}
    entries.forEach((entry, index) => {
        const relPath = entry.path.replace(`${rootDir}/`, '')
        let type
        if (entry.buffer.length === 0 && entry.path.endsWith('/')) {
            type = constants.IPFS_DIRECTORY_MIMETYPE
        } else {
            type = mime.lookup(entry.path)
        }

        files[relPath] = new Blob([entry.buffer], {
            type,
        })
    })

    return files
}

/**
 * Inject CSP meta tag
 * @param {*} dataURI 
 * @returns data URI of the updated HTML file
 */
export function injectCSPMetaTagIntoDataURI(dataURI) {
    log.debug('injectCSPMetaTagIntoDataURI')

    // Data URI -> HTML
    const prefix = 'data:text/htmlbase64,'
    const base64 = dataURI.replace(prefix, '')
    const html = atob(base64)

    // Inject CSP meta tag
    const safeHTML = injectCSPMetaTagIntoHTML(html)

    // HTML -> data URI
    return `${prefix}${btoa(safeHTML)}`
}

/**
 * Inject CSP meta tag
 * @param {*} buffer of the HTML file
 * @returns buffer containing the changes
 */
export function injectCSPMetaTagIntoBuffer(buffer) {
    log.debug('injectCSPMetaTagIntoBuffer')
        // buffer -> HTML
    const html = new TextDecoder().decode(buffer)

    // inject CSP meta tag
    const safeHTML = injectCSPMetaTagIntoHTML(html)

    // HTML -> buffer
    return new TextEncoder().encode(safeHTML)
}

/**
 * Inject CSP meta tag
 * @param {*} html 
 * @returns string HTML with the CSP changes
 */
export function injectCSPMetaTagIntoHTML(html) {
    log.debug('injectCSPMetaTagIntoHTML')
        // HTML -> doc
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Remove any existing CSP meta tags
    const existing = doc.head.querySelectorAll(
        'meta[http-equiv="Content-Security-Policy"]'
    )
    if (existing.length) {
        for (let i = 0; i < existing.length; i++) {
            existing[i].remove()
        }
    }

    if (!doc.head) {
        const msg = 'index.html is missing <head> tag!'
        log.debug(msg)
        throw new Error(msg)
    }

    // Inject CSP meta tag
    // TODO externalize
    doc.head.insertAdjacentHTML(
        'afterbegin',
        `
        <meta http-equiv="Content-Security-Policy" content="
        upgrade-insecure-requests;
        default-src
          'none';
        frame-src
          'self';
        child-src
          'self';
        script-src
          'self'
          'unsafe-inline'
          'unsafe-eval'
          blob:;
        style-src
          'self'
          'unsafe-inline';
        img-src
          'self'
          'unsafe-inline'
          data:
          blob:
          https://services.tzkt.io
          https://ipfs.infura.io
          https://*.infura-ipfs.io
          https://cloudflare-ipfs.com/
          https://ipfs.io/
          https://templewallet.com/logo.png
          https://gateway.pinata.cloud/;
        font-src
          'self'
          data:
          https://ipfs.infura.io
          https://*.infura-ipfs.io
          https://cloudflare-ipfs.com/
          https://fonts.googleapis.com/
          https://ipfs.io/
          https://gateway.pinata.cloud/;
        connect-src
          'self'
          https://better-call.dev
          https://*.better-call.dev
          https://*.cryptonomic-infra.tech
          https://cryptonomic-infra.tech
          https://*.infura.io
          https://*.infura-ipfs.io
          https://infura.io
          blob:
          data:
          ws:
          wss:
          bootstrap.libp2p.io
          preload.ipfs.io
          https://mainnet.smartpy.io
          https://mainnet-tezos.giganode.io
          https://api.etherscan.io
          https://api.thegraph.com
          https://*.tzkt.io
          https://api.hicdex.com
          https://hdapi.teztools.io
          https://api.tzstats.com
          https://*.wikidata.org
          https://*.coinmarketcap.com
          https://api.openweathermap.org
          https://hicetnunc.xyz
          https://*.hicetnunc.xyz;
        manifest-src
          'self';
        base-uri
          'self';
        form-action
          'none';
        media-src
          'self'
          'unsafe-inline'
          data:
          blob:
          https://ipfs.infura.io
          https://*.infura-ipfs.io
          https://cloudflare-ipfs.com/
          https://ipfs.io/
          https://gateway.pinata.cloud/;
        prefetch-src
          'self'
          https://ipfs.infura.io
          https://*.infura-ipfs.io
          https://cloudflare-ipfs.com/
          https://fonts.googleapis.com/
          https://ipfs.io/
          https://gateway.pinata.cloud/;
        worker-src
          'self'
          'unsafe-inline'
          blob:;">
      `
    )

    // Doc -> HTML
    return `<!DOCTYPE html><html>${doc.documentElement.innerHTML}</html>`
}

/**
 * Get HTML cover image
 * @param {*} buffer of the HTML file
 * @returns string path of the meta image
 */
export function getCoverImagePathFromBuffer(buffer) {
    log.debug('getCoverImagePathFromBuffer')
        // buffer -> html
    const html = new TextDecoder().decode(buffer)

    // html -> doc
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    return getCoverImagePathFromDoc(doc)
}

/**
 * Get cover image from HTML document
 * @param {*} doc of the HTML file
 * @returns string meta tag for the image
 */
function getCoverImagePathFromDoc(doc) {
    log.debug('getCoverImagePathFromDoc')
    let meta = doc.head.querySelector('meta[property="cover-image"]')
    if (!meta) {
        meta = doc.head.querySelector('meta[property="og:image"]')
    }

    if (!meta) return null

    return meta.getAttribute('content')
}

/**
 * Validate the files in the ZIP
 * @param {*} files of the zip file
 * @returns {valid, error}
 */
export async function validateFiles(files) {
    log.debug('getCoverImagePathFromDoc')

    // check for index.html file
    if (!files['index.html']) {
        return {
            valid: false,
            error: 'Missing index.html file',
        }
    }

    const pageBlob = files['index.html']
    let htmlString = await pageBlob.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    // check for <head> tag
    if (!doc.head) {
        return {
            valid: false,
            error: 'Missing <head> tag in index.html. Please refer to the Interactive OBJKTs Guide..',
        }
    }

    return {
        valid: true,
    }
}

/**
 * Convert data URI to buffer
 * @param {*} dataURI 
 * @returns uint8array
 */
export function dataRUIToBuffer(dataURI) {
    log.debug('dataRUIToBuffer:', dataURI)
    const parts = dataURI.split(',')
    const base64 = parts[1]
    const binaryStr = Buffer.from(base64, 'base64') //atob(base64)
    const len = binaryStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
    }
    return bytes
}