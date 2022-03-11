const {writeFile, getLastId} = require('./commons');
const paths = require('../filepaths');


const createCategory = (newCategory, fs) => {
    console.log("\t", JSON.stringify(newCategory));
    try {
        var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
        var last = getLastId(categories);
        categories[last] = newCategory;
        writeFile(categories, () => {console.log("creato")}, paths.categories, fs);

        return {category: newCategory, added: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const updateCategory = (updatedData, categoryId, fs) => {
    console.log("\t", JSON.stringify(updatedData));
    try {
        var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
        categories[categoryId] = updatedData;
        writeFile(categories, () => {console.log("aggiornato")}, paths.categories, fs);

        return {category: updatedData, updated: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

const deleteCategory = (categoryId, fs) => {
    try {
        var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
        var types = JSON.parse(fs.readFileSync(paths.types, 'uft-8'));
        for(let tidx in types) {
            var type = types[tidx];
            var lista = type.lista;
            var indice = lista.indexOf(categoryId)
            if(indice > -1) {
                lista.splice(indice, 1);
            }
        }
        delete categories[categoryId];
        writeFile(categories, () => {console.log("cancellato")}, paths.categories, fs);
        writeFile(types, () => {console.log("aggiornato")}, paths.types, fs);

        return {deleted: true};
    } catch(e) {
        console.log(e);
        return {error: true, message: e};
    }
}

module.exports = {
    createCategory: createCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
};