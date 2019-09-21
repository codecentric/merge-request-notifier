# Merge Request Notifier

[![Build Status](https://travis-ci.org/codecentric/merge-request-notifier.svg?branch=master)](https://travis-ci.org/codecentric/merge-request-notifier) 
[![Greenkeeper](https://badges.greenkeeper.io/codecentric/merge-request-notifier.svg)](https://greenkeeper.io/)

## Installation
### From release page
Installers for each platforms are ready at [releases page](https://github.com/codecentric/merge-request-notifier/releases).
Please download it for your platform and double click it to install.

macOS: Merge.Request.Notifier-x.y.z.dmg or Merge.Request.Notifier-x.y.z-mac.zip
Linux: [...]

Note: On macOS, trying to install app may be rejected by OS at first time since this app is not signed with code signing. 
In the case, please install from it 'Preferences -> Security'.

### With homebrew-cask
If you're macOS user and using homebrew-cask, this app can be installed via it. Please tap the repository URL and install this app via brew cask as follows.

```
brew tap codecentric/merge-request-notifier https://github.com/codecentric/merge-request-notifier
brew cask install merge-request-notifier
```
It's easiest way to install and manage this app on macOS.

## Development

### Install all dependencies 

```bash
yarn install
```

### Usage

This will start the application with hot-reload so you can instantly start developing your application.

```bash
yarn start
```

### New Releases

#### Create a new Release and Publish it
```bash
yarn dist
```
