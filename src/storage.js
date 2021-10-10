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
 * Utility methods for using local storage. Used for storing user settings.
 */

// Code originally derived from:
// https://github.com/hicetnunc2000/hicetnunc/blob/main/src/utils/storage.js

// Prefix each setting
const HEN_PREFIX = 'hen:'

/**
 * Get a value from local storage
 * @param {*} key 
 * @returns value
 */
export const getItem = (key) => {
    let storageValue = localStorage.getItem(`${HEN_PREFIX}${key}`)
    try {
        return JSON.parse(storageValue)
    } catch (error) {
        return storageValue
    }
}

/**
 * Set a key/value pair in local storage
 * @param {*} key 
 * @param {*} value 
 * @returns value stored
 */
export const setItem = (key, value) => {
    // Check if the value is an object
    if (value !== undefined && value !== null && value.constructor == Object) {
        value = JSON.stringify(value)
    }
    localStorage.setItem(`${HEN_PREFIX}${key}`, value)

    return getItem(key)
}

/**
 * Remove a value from local storage
 * @param {*} key 
 */
export const removeItem = (key) => {
    localStorage.removeItem(`${HEN_PREFIX}${key}`)
}