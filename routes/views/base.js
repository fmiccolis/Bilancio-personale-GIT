const {monthNames} = require('../../utils');

const baseRoutes = (app, changes) => {
    // default route
    app.get('/', (req, res) => {
        res.render("pages/index", {text: "Visione Annuale", changes: changes});
    });

    app.get('/year/:year/month/:month', (req, res) => {
        var text = monthNames[parseInt(req.params.month)] + " " + req.params.year;
        res.render("pages/month", {text: text});
    });

    app.get('/year/:year', (req, res) => {
        res.render("pages/year", {text: req.params.year});
    });

    app.get('/categories', (req, res) => {
        res.render("pages/categories", {text: "Categorie"});
    });

    app.get('/wallets', (req, res) => {
        res.render("pages/wallets", {text: "Portafogli"});
    });

    app.get('/wallets/:id', (req, res) => {
        res.render("pages/wallet");
    });

    app.get('/types', (req, res) => {
        res.render("pages/types", {text: "Tipologie"});
    });

    app.get('/recurrents', (req, res) => {
        res.render("pages/recurrents", {text: "Movimenti ricorrenti"});
    });

    app.get('/tests', (req, res) => {
        res.render("pages/tests");
    });
}

module.exports = baseRoutes;