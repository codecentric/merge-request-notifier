# Merge Request Notifier

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

#### Create a new Release
```bash
yarn dist
```

#### Publish it to GitHub
```bash
electron-builder --publish always
```
