const paths = require('../../filepaths');
const {createRecurrent, updateRecurrent, updateRecurrentAbility, deleteRecurrent} = require("../../services/recurrentService");
const {elaborateRecurrents} = require('../../utils');

const crudTypesRoutes = (app, fs) => {
    const apiTitle = "recurrents";

    // READ ALL
    app.get(`/api/${apiTitle}/all`, (req, res) => {
        fs.readFile(paths.recurrents, 'utf8', (err, data) => {
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
    app.get(`/api/${apiTitle}/getOne/:id`, (req, res) => {
        fs.readFile(paths.recurrents, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let recurrentId = req.params["id"]
            try {
			    var parsed = JSON.parse(data);
                if(Object.keys(parsed).length == 0) {
                    parsed = {empty: true};
                } else if(parsed.hasOwnProperty(recurrentId)) {
                    parsed = parsed[recurrentId];
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
        try {
            var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
            res.send(elaborateRecurrents(recurrents, wallets, types, categories));
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
        var result = createRecurrent(req.body, fs);
        res.status(200).send(result);
    });

    // UPDATE
    app.put(`/api/${apiTitle}/update/:id`, (req, res) => {
        var result = updateRecurrent(req.body, req.params["id"], fs);
        res.status(200).send(result);
    });

    // UPDATE ABILITY
    app.put(`/api/${apiTitle}/ability/:id`, (req, res) => {
        var result = updateRecurrentAbility(req.params["id"], fs);
        res.status(200).send(result);
    });

    // DELETE
    app.delete(`/api/${apiTitle}/delete/:id`, (req, res) => {
        var result = deleteRecurrent(req.params["id"], fs);
        res.status(200).send(result);
    });
};

module.exports = crudTypesRoutes;