require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName === 'darwin') {
        console.log(`notarizing the app is skipped because the electron platform name is "${electronPlatformName}"`)
        return;
    }
    console.log('notarizing the app')

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appBundleId: 'de.codecentric.ruettenm.mergeRequestNotifier',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
    });
};
