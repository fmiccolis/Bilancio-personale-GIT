const {writeFile, getLastId} = require('./commons');
const paths = require('../filepaths');


const createRecurrent = (newRecurrent, fs) => {
    console.log("\t", JSON.stringify(newRecurrent));
    try {
        var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
        var last = getLastId(recurrents);
        newRecurrent.importo = parseFloat(newRecurrent.importo);
        newRecurrent.abilitato = newRecurrent.abilitato === "true";
        recurrents[last] = newRecurrent;
        writeFile(recurrents, () => {console.log("creato")}, paths.recurrents, fs);

        return {recurrent: newRecurrent, added: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateRecurrent = (updatedData, recurrentId, fs) => {
    console.log("\t", JSON.stringify(updatedData));
    try {
        var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
        updatedData.importo = parseFloat(updatedData.importo);
        updatedData.abilitato = updatedData.abilitato === "true";
        recurrents[recurrentId] = updatedData;
        writeFile(recurrents, () => {console.log("aggiornato")}, paths.recurrents, fs);

        return {recurrent: updatedData, updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateRecurrentAbility = (recurrentId, fs) => {
    console.log("\t", JSON.stringify(recurrentId));
    try {
        var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
        recurrents[recurrentId].abilitato = !recurrents[recurrentId].abilitato;
        writeFile(recurrents, () => {console.log("aggiornato")}, paths.recurrents, fs);

        return {recurrent: recurrents[recurrentId], updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const deleteRecurrent = (recurrentId, fs) => {
    try {
        var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
        delete recurrents[recurrentId];
        writeFile(recurrents, () => {console.log("cancellato")}, paths.recurrents, fs);

        return {deleted: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

module.exports = {
    createRecurrent: createRecurrent,
    updateRecurrent: updateRecurrent,
    updateRecurrentAbility: updateRecurrentAbility,
    deleteRecurrent: deleteRecurrent
};