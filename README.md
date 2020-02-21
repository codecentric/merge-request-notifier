# Merge Request Notifier

[![Build Status](https://travis-ci.org/codecentric/merge-request-notifier.svg?branch=master)](https://travis-ci.org/codecentric/merge-request-notifier) 
[![Greenkeeper](https://badges.greenkeeper.io/codecentric/merge-request-notifier.svg)](https://greenkeeper.io/)

This app shows your merge quests grouped by projects and WIP status. It is accessible from the system tray.

| Light Mode  | Dark Mode |
| ------------- | ------------- |
| <img src="./images/app.png" width=500 alt="App Screenshot (Light Mode)"> | <img src="./images/app-dark-mode.png" width=500 alt="App Screenshot (Dark Mode)"> |

## Notification
You will receive a desktop notification when a new merge request is created.

<img src="./images/notification.png" width=500 alt="Notification Screenshot">

## Settings
In the settings you have to provide one of your personal access token to get access to your merge requests. 
You are able to configure multiple groups.

<img src="./images/settings.png" width=500 alt="Settings Screenshot">

## App Updates
You will be always up to date with our integrated in app updates 🎉 Once there is a new update 
available you will be notified with a prominent alert above the merge requests. On the details page you find the release notes from github. 

| New Update Alert  | Release Notes |
| ------------- | ------------- |
| <img src="./images/new-update-alert.png" width=500 alt="New Update Alert"> | <img src="./images/update-info.png" width=500 alt="Release Notes"> |

## Installation
### From release page
The macOS and windows installer is uploaded at the [releases page](https://github.com/codecentric/merge-request-notifier/releases). Please download and double click it to install.

**Merge.Request.Notifier-x.y.z.dmg**

### With homebrew-cask
If you're using homebrew-cask, this app can be installed via it. Please tap the repository URL and install this app via brew cask as follows.

```
brew tap codecentric/merge-request-notifier https://github.com/codecentric/merge-request-notifier
brew cask install merge-request-notifier
```
It's the easiest way to install and manage this app on macOS.

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

### Logs
You will find the application logs in the following folders

| OS  | Folder |
| ------------- | ------------- |
| Linux | ~/.config/merge-request-notifier/logs/{process type}.log |
| macOS | ~/Library/Logs/merge-request-notifier/{process type}.log |
| Windows | %USERPROFILE%\AppData\Roaming\merge-request-notifier\logs\{process type}.log |

### App Settings
You will find the application settings in the following folders

| OS  | Folder |
| ------------- | ------------- |
| Linux | $XDG_CONFIG_HOME/<Your App> or ~/.config/<Your App>s |
| macOS | ~/Library/Application\ Support/<Your App> |
| Windows | %APPDATA%/<Your App> |


### New Releases
#### Create a new Release and Publish it
```bash
yarn dist
```
