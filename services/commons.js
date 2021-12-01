const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const externalId = "external"

const writeFile = (fileData, callback, filePath, fs, encoding = 'utf8') => {	
    filtered = JSON.stringify(fileData, null, 2)

    fs.writeFileSync(filePath, filtered, encoding, (err) => {
        if (err) {
            throw err;
        }
        callback();
    });
};

const updateWallet = (param, operator, wallets, movement) => {
    if(movement[param] != externalId) {
        var wallet = wallets[movement[param]];
        let operation = wallet.totale + " " + operator + " " + movement.importo;
        wallet.totale = eval("(" + operation + ")");
    }
}

const getLastId = (collection) => {
    var last = 0;
    var keysS = Object.keys(collection);
    if(keysS.length > 0) {
        var keysI = keysS.map(function (idx) {
            return parseInt(idx, 10);
        });
        var sorted = keysI.sort((a, b) => a-b);
        var last = sorted.pop()+1;
    }
    return last
}

const updateMovementWallets = (param, operator1, operator2, wallets, oldMovement, newMovement) => {
    updateWallet(param, operator1, wallets, oldMovement);
    updateWallet(param, operator2, wallets, newMovement);
}

const randomString = (length) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

module.exports = {
    writeFile: writeFile,
    randomString: randomString,
    updateWallet: updateWallet,
    updateMovementWallets: updateMovementWallets,
    getLastId: getLastId
};