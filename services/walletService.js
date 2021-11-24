const {writeFile, getLastId} = require('./commons');
const paths = require('../filepaths');


const createWallet = (newWallet, fs) => {
    console.log("\t", JSON.stringify(newWallet));
    try {
        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        var last = getLastId(wallets);
        newWallet.totale = parseFloat(newWallet.totale);
        newWallet.utilizzabile = newWallet.utilizzabile === "true";
        wallets[last] = newWallet;
        writeFile(wallets, () => {console.log("creato")}, paths.wallets, fs);

        return {wallet: newWallet, added: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateWallet = (updatedData, walletId, fs) => {
    console.log("\t", JSON.stringify(updatedData));
    try {
        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        updatedData.totale = parseFloat(updatedData.totale);
        updatedData.utilizzabile = updatedData.utilizzabile === "true";
        wallets[walletId] = updatedData;
        writeFile(wallets, () => {console.log("aggiornato")}, paths.wallets, fs);

        return {wallet: updatedData, updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const deleteWallet = (walletId, fs) => {
    try {
        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        delete wallets[walletId];
        writeFile(wallets, () => {console.log("cancellato")}, paths.wallets, fs);

        return {deleted: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

module.exports = {
    createWallet: createWallet,
    updateWallet: updateWallet,
    deleteWallet: deleteWallet
};