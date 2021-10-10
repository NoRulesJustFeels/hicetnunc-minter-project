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
 * Main entry point for the app. Loads the main UI with index.html
 */

// https://github.com/motdotla/dotenv
// Load environment variables from a .env file into process.env
const dotenv = require('dotenv')
dotenv.config()

// https://github.com/pimterry/loglevel
import log from 'loglevel'
log.setLevel(process.env.LOG_LEVEL)

// TODO use HEN styles
//import styles from './styles/index.scss'

import * as minting from './minting.js'
import * as settings from './settings.js'
import * as constants from './constants.js'

const messageElement = document.getElementById('message')
const progressElement = document.getElementById('progress')
const progressContentElement = document.getElementById('progressContent')

// Track the display message timeout
let timeoutID

let currentProgress
let currentConfirmation
let currentDuration

/**
 * Display a message to the user
 * @param {*} message string message
 * @param {*} progress show a progress indicator
 * @param {*} duration how long in milliseconds to display the message
 */
const displayMessage = (message, progress, confirmation, duration) => {
    log.debug('displayMessage: message=', message)
    currentProgress = progress
    currentConfirmation = confirmation
    currentDuration = duration
    if (message) {
        if (confirmation) {
            progressElement.style.display = "none";
            alert(message)
        } else if (progress) {
            progressElement.style.display = "block";
            progressContentElement.innerHTML = message
        } else {
            progressElement.style.display = "none";
            messageElement.innerHTML = message
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => {
                messageElement.innerHTML = ''
            }, duration ? duration : 5000)
        }
    } else {
        progressElement.style.display = "none";
        messageElement.innerHTML = ''
    }
}

/**
 * Display an error message to the user
 * @param {*} error string message
 */
const displayErrorMessage = (error) => {
    log.debug('displayErrorMessage: error=', error)
    if (error) {
        if (error.description) {
            displayMessage(error.description, false, true)
            return
        } else if (error.message) {
            displayMessage(error.message, false, true)
            return
        } else if (error.name) {
            displayMessage(error.name, false, true)
            return
        }
    }
    displayMessage('An error occurred.', false, true) // TODO better message
}

/**
 * Listen to custom events to update the UI messages
 */
window.addEventListener('displayMessage', (event) => {
    log.debug('displayMessage: ', event)
    if (event.detail.error) {
        displayErrorMessage(event.detail.error)
    } else if (event.detail.message) {
        displayMessage(event.detail.message, event.detail.progress, event.detail.confirmation, event.detail.duration)
    } else {
        displayMessage()
    }
});

/**
 * Listen to custom status events to update the progress indicator
 */
window.addEventListener('displayStatus', (event) => {
    log.debug('displayStatus: ', event)
    if (event.detail.message) {
        displayMessage(event.detail.message, currentProgress, false)
    } else {
        displayMessage()
    }
});

// Initialize the UI and input fields
minting.initSync()
minting.initMintForm()
settings.initSettingsForm()