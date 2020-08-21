require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        console.log(`notarizing the app is skipped because the electron platform name is "${electronPlatformName}"`)
        return;
    }
    const appName = context.packager.appInfo.productFilename;
    const appPath = `${appOutDir}/${appName}.app`

    console.log('notarizing the app', appPath)

    return await notarize({
        appBundleId: 'de.codecentric.ruettenm.mergeRequestNotifier',
        appPath,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
    });
};
