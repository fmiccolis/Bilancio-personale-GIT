// import other routes
const crudMovementsRoutes = require('./api/crudMovements');
const crudCategoriesRoutes = require('./api/crudCategories');
const crudWalletsRoutes = require('./api/crudWallets');
const crudTypesRoutes = require('./api/crudTypes');
const crudRecurrentsRoutes = require('./api/crudRecurrents');
const baseRoutes = require('./views/base');

const appRouter = (app, fs, changes) => {
    //view routes
    baseRoutes(app, changes);

    //api movements routes
    crudMovementsRoutes(app, fs);
    //api categories routes
    crudCategoriesRoutes(app, fs);
    //api wallets routes
    crudWalletsRoutes(app, fs);
    //api types routes
    crudTypesRoutes(app, fs);
    //api recurrents routes
    crudRecurrentsRoutes(app, fs);


    //always the last IMPORTANT
    app.get('*', function(req, res) {
        res.status(404).render("pages/404", {text: "PAGINA NON TROVA O IN COSTRUZIONE"});
    });
};

module.exports = appRouter;