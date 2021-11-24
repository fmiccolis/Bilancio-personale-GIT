const {elaborateSingleWallet, elaborateUsableWallets} = require('../../utils');
const paths = require('../../filepaths');
const {createWallet, updateWallet, deleteWallet} = require("../../services/walletService");

const crudWalletsRoutes = (app, fs) => {
    const apiTitle = "wallets";

    // READ ALL
    app.get(`/api/${apiTitle}/all`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        fs.readFile(paths.wallets, 'utf8', (err, data) => {
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
        console.log(`chiamato ${req.originalUrl}/${req.params["id"]}`);
        fs.readFile(paths.wallets, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            let walletId = req.params["id"]
            try {
			    var parsed = JSON.parse(data);
                if(Object.keys(parsed).length == 0) {
                    parsed = {empty: true};
                } else if(parsed.hasOwnProperty(walletId)) {
                    parsed = parsed[walletId];
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

    // READ ELABORATED SINGLE
    app.get(`/api/${apiTitle}/getElaborated/:id`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        try {
            var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
            var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
            var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
            var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
            res.send(elaborateSingleWallet(req.params["id"], wallets, types, movements, categories));
        } catch(e) {
            console.log(e);
            if(data.length === 0) {
                res.send({empty: true});
            } else {
                res.send({error: true})
            }
        }
    });

    // READ USABLE
    app.get(`/api/${apiTitle}/getUsable`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        try {
            var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
            res.send(elaborateUsableWallets(wallets));
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
        var result = createWallet(req.body, fs);
        res.status(200).send(result);
    });

    // UPDATE
    app.put(`/api/${apiTitle}/update/:id`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        var result = updateWallet(req.body, req.params["id"], fs);
        res.status(200).send(result);
    });

    // DELETE
    app.delete(`/api/${apiTitle}/delete/:id`, (req, res) => {
        console.log(`chiamato ${req.originalUrl}`);
        var result = deleteWallet(req.params["id"], fs);
        res.status(200).send(result);
    });
};

module.exports = crudWalletsRoutes;