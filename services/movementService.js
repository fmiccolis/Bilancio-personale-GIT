const {writeFile, randomString, updateWallet, updateMovementWallets, getLastId} = require('./commons');
const paths = require('../filepaths');

const increase = "+";
const decrease = "-";

const createMovement = (newMovement, newCode, fs) => {
    console.log("\t", JSON.stringify(newMovement));
    try {
        var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
        var last = getLastId(movements);
        newMovement.importo = parseFloat(newMovement.importo);
        if(newCode) newMovement.codice = randomString(8);
        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        updateWallet("sorgente", decrease, wallets, newMovement);
        updateWallet("destinazione", increase, wallets, newMovement);
        writeFile(wallets, () => {console.log("Portafoglio aggiornato")}, paths.wallets, fs);
        movements[last] = newMovement;
        writeFile(movements, () => {console.log("creato")}, paths.movements, fs);

        return {movement: newMovement, added: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateMovement = (updatedData, movementId, fs) => {
    console.log("\t", JSON.stringify(updatedData));
    try {
        var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
        var oldData = movements[movementId];

        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        updateMovementWallets("sorgente", increase, decrease, wallets, oldData, updatedData);
        updateMovementWallets("destinazione", decrease, increase, wallets, oldData, updatedData);
        writeFile(wallets, () => {console.log("Portafogli aggiornati")}, paths.wallets, fs);

        updatedData.importo = parseFloat(updatedData.importo);
        movements[movementId] = updatedData;
        writeFile(movements, () => {console.log("aggiornato")}, paths.movements, fs);

        return {movement: updatedData, updated: true}
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const deleteMovement = (movementId, fs) => {
    try {
        var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
        var dataTodelete = movements[movementId];
        var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
        updateWallet("sorgente", increase, wallets, dataTodelete);
        updateWallet("destinazione", decrease, wallets, dataTodelete);
        writeFile(wallets, () => {console.log("Portafoglio aggiornato")}, paths.wallets, fs);
    
        delete movements[movementId];
        writeFile(movements, () => {console.log("cancellato")}, paths.movements, fs);
        return {deleted: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

module.exports = {
    createMovement: createMovement,
    updateMovement: updateMovement,
    deleteMovement: deleteMovement
};