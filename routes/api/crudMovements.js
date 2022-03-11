const {generateNavigation, elaborateYears, elaborateMonths, elaborateDays, detailMovement} = require('../../utils');
const paths = require('../../filepaths');
const {createMovement, updateMovement, deleteMovement} = require("../../services/movementService");

const crudMovementsRoutes = (app, fs) => {
    const apiTitle = "movements";

    // READ ALL
    app.get(`/api/${apiTitle}/all`, (req, res) => {
        fs.readFile(paths.movements, 'utf8', (err, data) => {
            if (err) throw err;
            
            try {
			    var parsed = JSON.parse(data);
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

    // GET NAVIGATION
    app.get(`/api/${apiTitle}/getNavigation`, (req, res) => {
        try {
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            res.send(generateNavigation(movements, types));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });

    // READ ELABORATED YEARS
    app.get(`/api/${apiTitle}/getElaboratedYears`, (req, res) => {
        try {
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            res.send(elaborateYears(movements, types, categories));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });

    // READ ELABORATED MONTHS
    app.get(`/api/${apiTitle}/getElaboratedMonths/:year`, (req, res) => {
        try {
            var year = req.params.year;
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            res.send(elaborateMonths(movements, types, categories, year));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });

    // READ ELABORATED DAYS
    app.get(`/api/${apiTitle}/getElaboratedDays/:year/:month`, (req, res) => {
        var year = req.params.year;
        var month = req.params.month;
        try {
            var year = req.params.year;
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
            res.send(elaborateDays(movements, types, categories, wallets, year, month));
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
        var newMovement = req.body;
        var result = createMovement(newMovement, true, fs);
        res.status(200).send(result);
    });

    // UPDATE
    app.put(`/api/${apiTitle}/update/:id`, (req, res) => {
        var result = updateMovement(req.body, req.params["id"], fs);
        res.status(200).send(result);
    });

    // DELETE
    app.delete(`/api/${apiTitle}/delete/:id`, (req, res) => {
        var result = deleteMovement(req.params["id"], fs);
        res.status(200).send(result);
    });

    // DETAIL
    app.get(`/api/${apiTitle}/detail/:id`, (req, res) => {
        try {
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
            res.send(detailMovement(movements, types, categories, wallets, req.params["id"]));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });
};

module.exports = crudMovementsRoutes;