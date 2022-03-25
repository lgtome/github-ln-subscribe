# Gitlab and LN subscribe

## Usage

Load Github or LN page where you can find users, then click subscribe.

## How to install

First, clone this repo `git clone https://github.com/NaaYaa-oops/github-ln-subscribe` and then see below for browser specific instructions.

### Chrome

Recently chrome disallowed to install packed `crx` extension that are not listed on the Chrome Store, so to install this

-   On Chrome: Menu
    -   More Tools
        -   Extensions (be sure to have _Developer Mode_ enabled there)
-   In the Extension page: `Load unpacked` and select the cloned repository

### Firefox

-   On Firefox: enter `about:debugging#/runtime/this-firefox` into the address bar
-   In the Extension page: `Load Temporary Add-on...` and select any file within the cloned repository

## How to update

-   `git pull`

### Chrome

-   On Chrome: Menu
    -   More Tools
        -   Extensions
-   In the Extension page find `Gitlab | LN subscribe` and hit the refresh button

### Firefox

-   On Firefox: enter `about:debugging#/runtime/this-firefox` into the address bar
-   In the Extension page find `Gitlab | LN subscribe` and hit the reload button

## How to run it on a self-hosted instance

-   Open manifest.json
-   Add your domain to `permissions` and `content_scripts -> matches`
-   Open the browser and install or update the extension

## Future

-   use active buttons in the merge request panel instead of the extension chrome icon
