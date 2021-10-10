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
 * Utilities for working with images.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/pages/mint/index.js

// https://github.com/pimterry/loglevel
import log from 'loglevel'

import * as constants from './constants.js'

// https://github.com/KnicKnic/WASM-ImageMagick
import { call } from 'wasm-imagemagick'

const OUTPUT_IMAGE_DIMENSIONS_REGEX = /(\d*\.?\d+)\s*x\s*(\d*\.?\d+)/g

/**
 * Convert blob to a URL
 * @param {*} blob 
 * @returns data URL
 */
export const blobToDataURL = async(blob) => {
    log.debug('blobToDataURL')
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onerror = reject
        reader.onload = (e) => resolve(reader.result)
        reader.readAsDataURL(blob)
    })
}

/**
 * Scale the image
 * @param {*} file file object
 * @param {*} fileBuffer buffer for the file
 * @param {*} options for the image dimensions
 * @returns object { mimeType, buffer, reader, size }
 */
export const generateCompressedImage = async(file, fileBuffer, options) => {
    log.debug('generateCompressedImage')

    const content = new Uint8Array(fileBuffer);
    const image = { name: file.name, content }

    let command = []

    // Check for animated gifs
    if (file.type === constants.MIMETYPE.GIF) {
        // Use imagemagick to convert an animated gif to smaller dimensions
        // convert in.gif -coalesce -resize 256x256> -deconstruct out-deconstruct.gif
        command = ["convert", file.name, '-verbose', '-coalesce', '-resize', `${options.maxWidth}x${options.maxHeight}>`, '-deconstruct', 'out.gif']
    } else {
        command = ["convert", file.name, '-verbose', '-resize', `${options.maxWidth}x${options.maxHeight}>`, 'out.jpg']
    }
    const result = await call([image], command)
    log.debug(result)

    if (result.exitCode !== 0) {
        log.error(result.stderr.join('\n'))
        return null
    }

    if (result.outputFiles.length > 0) {
        const outputImage = result.outputFiles[0]

        let blob = outputImage.blob
        const mimeType = constants.MIMETYPE.JPEG
        const buffer = await blob.arrayBuffer()
        const reader = await blobToDataURL(blob)

        // Extract the new image width and height from the command stdout:
        // burn5.jpg=>out.jpg JPEG 1080x731=>1024x693 1024x693+0+0 8-bit Grayscale Gray 251460B 0.000u 0:00.000
        let width = 0
        let height = 0
        if (result.stdout && result.stdout.length > 0) {
            let outputArray
            let counter = 0
            while ((outputArray = OUTPUT_IMAGE_DIMENSIONS_REGEX.exec(result.stdout[0])) !== null) {
                if (counter === 1) {
                    width = outputArray[1]
                    height = outputArray[2]
                }
                counter++
            }
        }
        return { mimeType, buffer, reader, size: buffer.byteLength, width, height }
    } else {
        log.debug('outputFiles.length == 0')
        return null
    }
}

/**
 * Generate a cover image and a thumbnail image
 * @param {*} file file object
 * @param {*} fileBuffer buffer for the file
 * @returns object { cover, thumbnail }
 */
export const generateCoverAndThumbnail = async(file, fileBuffer) => {
    log.debug('generateCoverAndThumbnail')
    let cover
    let thumbnail

    // Use ImageMagick to scale images
    cover = await generateCompressedImage(file, fileBuffer, constants.COVER_OPTIONS)
    if (cover) {
        thumbnail = await generateCompressedImage(file, fileBuffer, constants.THUMBNAIL_OPTIONS)
    }

    return { cover, thumbnail }
}