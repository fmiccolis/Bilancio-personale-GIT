const paths = require('./filepaths');
const { createMovement } = require('./services/movementService');

const month_detail = ['importo', 'descrizione', 'categoria', 's/d', 'actions'];
const wallet_detail = ['data', 'importo', 'descrizione', 'categoria'];
const year_detail = ['mese', 'totale speso', 'media giornaliera', 'proiezione finale di spesa', 'guadagni', 'risparmi', 'proiezione finale risparmi', 'saving rate', 'proiezione finale saving rate', 'giorno peggiore'];
const vision_detail = ['anno', 'totale speso',	'media mensile', 'proiezione di spesa su media mensile', 'media giornaliera', 'proiezione di spesa su media giornaliera', 'proiezione di spesa media', 'entrate attuali', 'entrate medie', 'entrate finali stimate', 'risparmio medio mensile', 'risparmio attuale', 'risparmio annuale finale stimato', 'saving rate medio', 'mese peggiore'];
const recurrent_detail = ['descrizione', 'importo', 'tipologia', 'categoria', 'direzione', 'codice', 'abilitato', 'prossimo lancio', 'actions'];
const type_detail = ['nome', 'descrizione', 'analizza', 'icona', 'sorgente', 'destinazione', 'lista'];
const externalId = "external"
const externalwallet = {
    id: externalId,
    nome: "esterno",
    icona: "<i class=\"fas fa-running\"></i>",
    totale: 0,
    scadenza: ""
}

const elaborateDataSlimYear = (movements, types, categories) => {
    var elaborated = {
        list: [],
        categories: getTypeNames(types, "array", false),
        totals:  getTypeNames(types, 0, false)
    };
    for(var idx in movements) {
        // prendo il movimento corrente e gli setto il suo id
        let movement = movements[idx];
        movement.id = idx;

        // verifico che la tipologia sia una da analizzare
        let tipologia = types[movement.tipologiaId];
        if(!tipologia.analizza) {
            // se non bisogna analizzare la tipologia passo al prossimo movimento
            continue;
        }

        let categoria = categories[movement.categoriaId];

        // estraggo l'oggetto data dal campo 'data' per poter differenziare i mesi e gli anni
        let parts_of_date = movement.data.split("/");
        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
        let year = output.getFullYear();
        let month = output.getMonth();
        let exist_year = false;

        elaborated.list.forEach(function (yearData) {
            if(yearData.year === year) {
                exist_year = true;
                let exist_month = false;
                yearData.list.forEach(function (monthData) {
                    if(monthData.month === month) {
                        exist_month = true;
                        monthData.totals[tipologia.nome] += movement.importo;
                    }
                });
                if(!exist_month) {
                    var newMonthData = {
                        month: month,
                        name: capitalizeFirstLetter(output.toLocaleString('it-IT', { month: 'long' })),
                        totals: getTypeNames(types, 0, false)
                    }
                    newMonthData.totals[tipologia.nome] += movement.importo;
                    yearData.list.push(newMonthData);
                }
                yearData.totals[tipologia.nome] += movement.importo;
            }
        });
        if(!exist_year) {
            var newMonthData = {
                month: month,
                name: capitalizeFirstLetter(output.toLocaleString('it-IT', { month: 'long' })),
                totals: getTypeNames(types, 0, false)
            }
            newMonthData.totals[tipologia.nome] += movement.importo;
            var newYearData = {
                year: year,
                list: [newMonthData],
                totals: getTypeNames(types, 0, false)
            }
            newYearData.totals[tipologia.nome] += movement.importo;
            elaborated.list.push(newYearData);
        }
        let categories_exist = false;
        elaborated.categories[tipologia.nome].forEach(function (category) {
            if(category.name === categoria.nome) {
                categories_exist = true;
                category.total += movement.importo;
            }
        });
        if(!categories_exist) {
            elaborated.categories[tipologia.nome].push({
                name: categoria.nome,
                total: movement.importo
            })
        }
        elaborated.totals[tipologia.nome] += movement.importo;
    }
    return elaborated;
}

const elaborateDataSlimMonth = (movements, types, categories, year) => {
    var yearData = {
        list: [],
        categories: getTypeNames(types, "array", false),
        totals: getTypeNames(types, 0, false)
    };
    for(var idx in movements) {
        // prendo il movimento corrente e gli setto il suo id
        let movement = movements[idx];
        movement.id = idx;

        // verifico che la tipologia sia una da analizzare
        let tipologia = types[movement.tipologiaId];
        if(!tipologia.analizza) {
            // se non bisogna analizzare la tipologia passo al prossimo movimento
            continue;
        }

        let categoria = categories[movement.categoriaId];

        // estraggo l'oggetto data dal campo 'data' per poter differenziare i mesi e gli anni
        let parts_of_date = movement.data.split("/");
        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
        let movementYear = output.getFullYear();
        let month = output.getMonth();

        if(movementYear == year) {
            var exist_month = false;
            yearData.list.forEach(function (monthData) {
                if(monthData.month === month) {
                    exist_month = true;
                    if(monthData.dates.hasOwnProperty(movement.data)) {
                        monthData.dates[movement.data][tipologia.nome] += movement.importo;
                    } else {
                        monthData.dates[movement.data] = getTypeNames(types, 0, false);
                        monthData.dates[movement.data][tipologia.nome] = movement.importo;
                        monthData.dates[movement.data].list = [];
                    }
                    monthData.totals[tipologia.nome] += movement.importo;
                    return;
                }
            });
            if(!exist_month) {
                var newData = getTypeNames(types, 0, false);
                newData[tipologia.nome] = movement.importo;
                newData["list"] = [];
                var newMonthData = {
                    month: month,
                    name: capitalizeFirstLetter(output.toLocaleString('it-IT', { month: 'long' })),
                    dates: {[movement.data]: newData},
                    totals: getTypeNames(types, 0, false)
                }
                newMonthData.totals[tipologia.nome] += movement.importo;
                yearData.list.push(newMonthData);
            }
            let categories_exist = false;
            yearData.categories[tipologia.nome].forEach(function (category) {
                if(category.name === categoria.nome) {
                    categories_exist = true;
                    category.total = category.total + movement.importo;
                }
            });
            if(!categories_exist) {
                yearData.categories[tipologia.nome].push({
                    name: categoria.nome,
                    total: movement.importo
                })
            }
            yearData.totals[tipologia.nome] += movement.importo;
        }
    }
    return yearData;
}

const elaborateDataSlimDay = (movements, types, categories, wallets, year, month, all = false) => {
    var monthData = {
        dates: {},
        categories: getTypeNames(types, "array", all),
        totals: getTypeNames(types, 0, all)
    };
    for(var idx in movements) {
        // prendo il movimento corrente e gli setto il suo id
        let movement = movements[idx];
        movement.id = idx;

        // verifico che la tipologia sia una da analizzare
        let tipologia = types[movement.tipologiaId];
        if(!tipologia.analizza && !all) {
            // se non bisogna analizzare la tipologia passo al prossimo movimento
            continue;
        }
        tipologia.id = movement.tipologiaId;

        // estraggo l'oggetto data dal campo 'data' per poter differenziare i mesi e gli anni
        let parts_of_date = movement.data.split("/");
        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
        let movementYear = output.getFullYear();
        let movementMonth = output.getMonth();

        // dal movimento estraggo la categoria, la tipologia e i portafogli interessati
        let categoria = categories[movement.categoriaId];
        categoria.id = movement.categoriaId;
        let sorgente = externalwallet;
        let destinazione = externalwallet;
        if(movement.sorgente !== externalId) {
            sorgente = wallets[movement.sorgente];
            sorgente.id = movement.sorgente;
        }
        if(movement.destinazione !== externalId) {
            destinazione = wallets[movement.destinazione];
            destinazione.id = movement.destinazione;
        }

        // reimposto al movimento gli oggetti complessi ottenuti tramite gli id
        movement.categoria = categoria;
        movement.tipologia = tipologia;
        movement.sorgente = sorgente;
        movement.destinazione = destinazione;

        if(movementYear == year && movementMonth == month) {
            if(monthData.dates.hasOwnProperty(movement.data)) {
                if(monthData.dates[movement.data].hasOwnProperty(tipologia.nome)) {
                    monthData.dates[movement.data][tipologia.nome] += movement.importo;
                    var index = monthData.dates[movement.data].categories.findIndex(x => x.id == movement.categoriaId)
                    index === -1 ? monthData.dates[movement.data].categories.push(movement.categoria) : "";
                }
            } else {
                monthData.dates[movement.data] = getTypeNames(types, 0, all);
                monthData.dates[movement.data][tipologia.nome] = movement.importo;
                monthData.dates[movement.data].list = [];
                monthData.dates[movement.data].categories = [movement.categoria];
            }
            monthData.dates[movement.data].list.push(movement);
            let categories_exist = false;
            monthData.categories[tipologia.nome].forEach(function (category) {
                if(category.name === categoria.nome) {
                    categories_exist = true;
                    category.total = category.total + movement.importo;
                }
            });
            if(!categories_exist) {
                monthData.categories[tipologia.nome].push({
                    name: categoria.nome,
                    total: movement.importo
                })
            }
            monthData.totals[tipologia.nome] += movement.importo;
        }
    }
    return monthData;
}

const generateNavigation = (movements, types) => {
    var elaborated = {
        list: []
    };

    for(let idx in movements) {
        // prendo il movimento corrente e gli setto il suo id
        let movement = movements[idx];
        movement.id = idx;

        // verifico che la tipologia sia una da analizzare
        let tipologia = types[movement.tipologiaId];
        if(!tipologia.analizza) {
            // se non bisogna analizzare la tipologia passo al prossimo movimento
            continue;
        }

        let parts_of_date = movement.data.split("/");
        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
        let year = output.getFullYear();
        let month = output.getMonth();
        let exist_year = false;

        elaborated.list.forEach(function (yearData) {
            if(yearData.year === year) {
                exist_year = true;
                let exist_month = false;
                yearData.list.forEach(function (monthData) {
                    if(monthData.month === month) {
                        exist_month = true;
                        return;
                    }
                });
                if(!exist_month) {
                    yearData.list.push({
                        month: month,
                        name: capitalizeFirstLetter(output.toLocaleString('it-IT', { month: 'long' })),
                    });
                }
                return;
            }
        });
        if(!exist_year) {
            elaborated.list.push({
                year: year,
                list: [{
                    month: month,
                    name: capitalizeFirstLetter(output.toLocaleString('it-IT', { month: 'long' })),
                }],
            });
        }
    }

    return elaborated;
}

const elaborateYears = (movements, types, categories) => {
    var elaborated = elaborateDataSlimYear(movements, types, categories);
    var year_view = {
        headers: vision_detail,
        list: [],
        categories: {}
    }
    elaborated.list.forEach(function(yearData) {
        let month_avarage_spent = yearData.totals["uscita"]/yearData.list.length;
        let total_spent_projection_month = month_avarage_spent*12;
        let sum_avarage_daily = 0;
        let sum_avarage_saving = 0;
        let sum_avarage_saving_rate = 0;
        yearData.list.forEach(function(monthData) {
            let current_saving = monthData.totals["entrata"]-monthData.totals["uscita"];
            sum_avarage_daily += getDailyAverage(monthData.month, yearData.year, monthData.totals["uscita"]);
            sum_avarage_saving += current_saving;
            sum_avarage_saving_rate += current_saving/monthData.totals["entrata"];
        });
        let daily_avarage = sum_avarage_daily/yearData.list.length;
        let total_spent_projection_daily = daily_avarage*getDaysInYear(yearData.year);
        let total_spent_projection_avarage = (total_spent_projection_daily+total_spent_projection_month)/2;
        let month_avarage_earned = yearData.totals["entrata"]/yearData.list.length;
        let total_earned_projection_month = month_avarage_earned*12;
        let month_saving_avarage = sum_avarage_saving/yearData.list.length;
        let total_saving_projection_month = month_saving_avarage*12;
        let avarage_saving_rate = sum_avarage_saving_rate/yearData.list.length;
        let worst_month = getWorstMonth(yearData);
        let year_elaboration = {
            year: yearData.year,
            totalSpent: formatter.format(yearData.totals["uscita"]),
            month_avarage_spent: formatter.format(month_avarage_spent),
            total_spent_projection_month: formatter.format(total_spent_projection_month),
            daily_avarage: formatter.format(daily_avarage),
            total_spent_projection_daily: formatter.format(total_spent_projection_daily),
            total_spent_projection_avarage: formatter.format(total_spent_projection_avarage),
            totalEarned: formatter.format(yearData.totals["entrata"]),
            month_avarage_earned: formatter.format(month_avarage_earned),
            total_earned_projection_month: formatter.format(total_earned_projection_month),
            month_saving_avarage: formatter.format(month_saving_avarage),
            sum_avarage_saving: formatter.format(sum_avarage_saving),
            total_saving_projection_month: formatter.format(total_saving_projection_month),
            saving_rate_projection: (avarage_saving_rate*100).toFixed(2) + " %",
            worst_month: worst_month
        }
        year_view.list.push(year_elaboration);
    });
    year_view.categories = elaborated.categories;
    return year_view;
}

const elaborateMonths = (movements, types, categories, year) => {
    var thisYearData = elaborateDataSlimMonth(movements, types, categories, year);
    var month_view = {
        headers: year_detail,
        list: [],
        categories: {}
    }
    if(thisYearData) {
        thisYearData.list.forEach(function(monthData) {
            let saving = monthData.totals["entrata"]-monthData.totals["uscita"];
            let daily_avarage = getDailyAverage(monthData.month, parseInt(year, 10), monthData.totals["uscita"]);
            let days = getDaysInMonth(monthData.month, year);
            let saving_projection = monthData.totals["entrata"]-(days*daily_avarage);
            let worst_day = getWorstDay(monthData);
            var month_elaboration = {
                month: monthData.month,
                name: monthData.name,
                totalSpent: formatter.format(monthData.totals["uscita"]),
                dailyAvarage: formatter.format(daily_avarage),
                spentProjection: formatter.format(days*daily_avarage),
                totalEarned: formatter.format(monthData.totals["entrata"]),
                saving: formatter.format(saving),
                savingProjection: formatter.format(saving_projection),
                savingRate: (saving/monthData.totals["entrata"]*100).toFixed(2)+' %',
                savingRateProjection: (saving_projection/monthData.totals["entrata"]*100).toFixed(2)+' %',
                worst_day: worst_day
            }
            month_view.list.push(month_elaboration);
        });
        month_view.categories = thisYearData.categories;
    }
    return month_view;
}

const elaborateDays = (movements, types, categories, wallets, year, month) => {
    var thisMonthData = elaborateDataSlimDay(movements, types, categories, wallets, year, month);
    var day_view = {
        headers: month_detail,
        dates: thisMonthData.dates,
        categories: thisMonthData.categories
    }
    return day_view;
}

const elaborateCategories = (categories, pureLines) => {
    var elaborated = {};
    for(let cidx in categories) {
        var currentC = categories[cidx];
        elaborated[currentC.nome] = {
            id: cidx,
            usages: 0,
            icon: currentC.icona,
            total: 0,
            color: currentC.colore
        }
    }
    for(let idx in pureLines) {
        var currentLine = pureLines[idx];
        var category = categories[currentLine.categoriaId];
        elaborated[category.nome].usages += 1;
        elaborated[category.nome].total += currentLine.importo;
    }
    var elaboratedArray = [];
    for(let key in elaborated) {
        elaboratedArray.push({
            id: elaborated[key].id,
            name: key,
            icon: elaborated[key].icon,
            usages: elaborated[key].usages,
            avarage: elaborated[key].total/elaborated[key].usages,
            color: elaborated[key].color
        });
    }
    elaboratedArray.sort((a, b) => (a.usages < b.usages) ? 1 : ((b.usages < a.usages) ? -1 : 0));
    return elaboratedArray;
}

const elaborateSingleWallet = (walletId, wallets, types, movements, categories) => {
    let currentW = wallets[walletId];
    var common_types = {};
    for(let tidx in types) {
        common_types[tidx] = {
            name: types[tidx].nome,
            list: []
        }
    }
    var elaborated = {
        id: walletId,
        name: currentW.nome,
        total: currentW.totale,
        icon: currentW.icona,
        types: JSON.parse(JSON.stringify(common_types)),
        valid: currentW.scadenza !== "" ? currentW.scadenza : "nessuna scadenza",
        utility: currentW.utilizzabile
    };
    for(let idx in movements) {
        var currentLine = movements[idx];
        let categoria = categories[currentLine.categoriaId];
        categoria.id = currentLine.categoriaId;
        currentLine.categoria = categoria;
        
        var sorgente = currentLine.sorgente;
        var destinazione = currentLine.destinazione;
        var tipologia = currentLine.tipologiaId;
        currentLine.tipologia = tipologia;

        if(sorgente !== externalId && sorgente === walletId) {
            currentLine.cssClass = "";
            currentLine.portafoglio = typeof wallets[destinazione] !== "undefined" ? wallets[destinazione].nome : externalId;
            elaborated.types[tipologia].list.push(JSON.parse(JSON.stringify(currentLine)));
        }

        if(destinazione !== externalId && destinazione === walletId) {
            currentLine.cssClass = "plus";
            currentLine.portafoglio = typeof wallets[sorgente] !== "undefined" ? wallets[sorgente].nome : externalId;
            elaborated.types[tipologia].list.push(JSON.parse(JSON.stringify(currentLine)));
        }
    }
    return elaborated
}

const elaborateUsableWallets = (wallets) => {
    var usable = {}
    for(let widx in wallets) {
        var current = wallets[widx];
        if(current.utilizzabile) usable[widx] = current;
    }
    return usable;
}

const elaborateRecurrents = (recurrents, wallets, types, categories) => {
    wallets[externalId] = externalwallet;
    var elaborated = {
        headers: recurrent_detail,
        list: [],
        wallets: wallets,
        types: types,
        categories: categories
    };
    for(let ridx in recurrents) {
        var recurrent = recurrents[ridx];
        var currentCategory = categories[recurrent.categoriaId];
        var currentType = types[recurrent.tipologiaId];
        var source = wallets[recurrent.sorgente];
        var dest = wallets[recurrent.destinazione];

        recurrent.id = ridx;
        recurrent.categoria = currentCategory;
        recurrent.tipologia = currentType;
        recurrent.sorgenteId = recurrent.sorgente; 
        recurrent.sorgente = source;
        recurrent.destinazioneId = recurrent.destinazione; 
        recurrent.destinazione = dest;

        elaborated.list.push(recurrent);
    }

    return elaborated;
}

function elaborateTypes(types, categories) {
    var elaborated = {
        headers: type_detail,
        list: [],
    };
    for(let tidx in types) {
        var type = types[tidx];
        var category_list = []
        type.lista.forEach(function(cidx) {
            category_list.push(categories[cidx]);
        });
        type.lista = category_list
        elaborated.list.push(type);
    }

    return elaborated;
}

function getWorstDay(monthData) {
    let worst = "";
    let max = 0;
    for(let date in monthData.dates) {
        let current_spent = monthData.dates[date].uscita;
        if(current_spent > max) {
            max = current_spent;
            worst = date;
        }
    }
    return worst.split("/")[0] + " " + monthData.name + " " + formatter.format(max);
}

function getWorstMonth(yearData) {
    let worst = "";
    let max = 0;
    yearData.list.forEach(function (monthData) {
        let current_spent = monthData.totals["uscita"];
        if(current_spent > max) {
            max = current_spent;
            worst = monthData.name;
        }
    });
    return worst + " " + yearData.year + " " + formatter.format(max);
}

const checkRecurrentMovements = (fs) => {
    console.log("chiamato checkrecurrent");
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    var recurrents = JSON.parse(fs.readFileSync(paths.recurrents, 'utf8'));
    var movements = JSON.parse(fs.readFileSync(paths.movements, 'utf8'));
    var categories = JSON.parse(fs.readFileSync(paths.categories, 'utf8'));
    var types = JSON.parse(fs.readFileSync(paths.types, 'utf8'));
    var wallets = JSON.parse(fs.readFileSync(paths.wallets, 'utf8'));
    var thisMonthMovements = elaborateDataSlimDay(movements, types, categories, wallets, year, month, true);
    for(let idx in recurrents) {
        var operation = recurrents[idx];

        if(!operation.abilitato) continue;

        var intDate = parseInt(operation.data, 10);
        if(today.getDate() >= intDate) {
            var composed = operation.data + "/" + today.toLocaleString('it-IT', { month: '2-digit' }) + "/" + year;
            var executed = false;
            if(Object.keys(thisMonthMovements.dates).length > 0) {
                for(let date in thisMonthMovements.dates) {
                    var thisList = thisMonthMovements.dates[date].list;
                    thisList.some(function (movement) {
                        if(movement.codice === operation.codice) {
                            executed = true;
                            console.log("per questo mese è già stata eseguita l'operazione con codice " + operation.codice);
                            return executed;
                        }
                    });
                    if(executed) break;      
                }
            }
            if(!executed) {
                console.log("eseguo l'operazione con codice " + operation.codice);
                operation.data = composed
                var result = createMovement(operation, false, fs);
                console.log(result);
            }
        } else {
            console.log("non eseguo l'operazione perchè non è ancora arrivato il giorno. codice " + operation.codice);
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDaysInYear(year) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
}

function getDaysInMonth(month, year) {
    return new Date(year, month+1, 0).getDate();
}

function getDailyAverage(month, year, totalSpent) {
    let today = new Date();
    let days = getDaysInMonth(month, year);
    if(month === today.getMonth() && year === today.getFullYear()) {
        days = today.getDate();
    }
    return totalSpent/days;
}

function getTypeNames(types, value, all) {
    var names = {};
    for(let tidx in types) {
        var currentType = types[tidx];
        if(currentType.analizza || all) names[currentType.nome] = value === "array" ? [] : value
    }
    return names;
}

const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", 
    "Maggio", "Giugno", "Luglio", "Agosto", 
    "Settembre", "Ottobre", "Novembre", "Dicembre"
];

module.exports = {
    generateNavigation: generateNavigation,
    elaborateYears: elaborateYears,
    elaborateMonths: elaborateMonths,
    elaborateDays: elaborateDays,
    elaborateCategories: elaborateCategories,
    elaborateSingleWallet: elaborateSingleWallet,
    elaborateUsableWallets: elaborateUsableWallets,
    checkRecurrentMovements: checkRecurrentMovements,
    elaborateRecurrents: elaborateRecurrents,
    elaborateTypes: elaborateTypes,
    monthNames: monthNames
};