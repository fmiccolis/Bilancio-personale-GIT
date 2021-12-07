const {writeFile, getLastId} = require('./commons');
const paths = require('../filepaths');


const createType = (newType, fs) => {
    console.log("\t", JSON.stringify(newType));
    try {
        var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
        newType.analizza = newType.analizza === "true";
        var last = getLastId(types);
        types[last] = newType;
        writeFile(types, () => {console.log("creato")}, paths.types, fs);

        return {type: newType, added: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateType = (updatedData, typeId, fs) => {
    console.log("\t", JSON.stringify(updatedData));
    try {
        var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
        updatedData.analizza = updatedData.analizza === "true";
        types[typeId] = updatedData;
        writeFile(types, () => {console.log("aggiornato")}, paths.types, fs);

        return {type: updatedData, updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateTypeAnalitics = (typeId, fs) => {
    console.log("\t", JSON.stringify(typeId));
    try {
        var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
        types[typeId].analizza = !types[typeId].analizza;
        writeFile(types, () => {console.log("aggiornato")}, paths.types, fs);

        return {type: types[typeId], updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const deleteType = (typeId, fs) => {
    try {
        var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
        delete types[typeId];
        writeFile(types, () => {console.log("cancellato")}, paths.types, fs);

        return {deleted: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

module.exports = {
    createType: createType,
    updateType: updateType,
    updateTypeAnalitics: updateTypeAnalitics,
    deleteType: deleteType
};