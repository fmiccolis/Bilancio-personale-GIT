const {elaborateCategories} = require('../../utils');
const paths = require('../../filepaths');
const {createCategory, updateCategory, deleteCategory} = require("../../services/categoryService");

const crudCategoriesRoutes = (app, fs) => {
    const apiTitle = "categories";

    // READ ALL
    app.get(`/api/${apiTitle}/all`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        fs.readFile(paths.categories, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            try {
			    var parsed = JSON.parse(data);
                if(Object.keys(parsed).length == 0) {
                    parsed = {empty: true};
                }
                res.send(parsed);
            } catch(e) {
                console.log(e);
                if(data.length === 0) {
                    res.send({empty: true});
                } else {
                    res.send({error: true})
                }
            }
        });
    });

    // READ ONE
    app.get(`/api/${apiTitle}/getOne/:name`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}/${req.params["name"]}`);
        fs.readFile(paths.categories, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let categoryName = req.params["name"]
            try {
			    var parsed = JSON.parse(data);
                if(Object.keys(parsed).length == 0) {
                    parsed = {empty: true};
                } else if(parsed.hasOwnProperty(categoryName)) {
                    parsed = parsed[categoryName];
                }
                res.status(200).send(parsed);
            } catch(e) {
                console.log(e);
                if(data.length === 0) {
                    res.send({empty: true});
                } else {
                    res.send({error: true})
                }
            }
        });
    });

    // READ ELABORATED
    app.get(`/api/${apiTitle}/getElaborated`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        try {
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            res.send(elaborateCategories(categories, movements));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });

    // CREATE
    app.post(`/api/${apiTitle}/add`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        var result = createCategory(req.body, fs);
        res.status(200).send(result);
    });

    // UPDATE
    app.put(`/api/${apiTitle}/update/:id`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        var result = updateCategory(req.body, req.params["id"], fs);
        res.status(200).send(result);
    });

    // DELETE
    app.delete(`/api/${apiTitle}/delete/:id`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        var result = deleteCategory(req.params["id"], fs);
        res.status(200).send(result);
    });
};

module.exports = crudCategoriesRoutes;