$(document).ready(function() {
    var recurrents = $("#types");
    getElaboratedTypes().then(data => {
        if(data.hasOwnProperty("empty")) {
            categories.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova categoria con l'apposito pulsante!</div>"));
        } else if(data.hasOwnProperty("error")) {
            categories.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
        } else {
            console.log(data);
            generateTypesTable(recurrents, data)
        }
	});
});

function generateTypesTable(container, data) {
    var thead = $("<thead></thead>");
    var tr = $("<tr></tr>");
    data.headers.forEach(function(header) {
        tr.append("<th>" + header + "</th>");
    });
    thead.append(tr);
    tr = $("<tr></tr>");
    var tbody = $("<tbody></tbody>");
    data.list.forEach(function(type) {
        tr.append("<td>" + type.nome + "</td>");
        tr.append("<td>" + type.descrizione + "</td>");
        tr.append("<td>" + type.analizza + "</td>");
        tr.append("<td>" + type.icona + "</td>");
        tr.append("<td>" + type.sorgente + "</td>");
        tr.append("<td>" + type.destinazione + "</td>");
        var td = $("<td></td>");
        type.lista.forEach(function(category) {
            td.append("<span class='badge rounded-pill bg-secondary cate-badge'>" + category.icona + " " + category.nome + "</span>");
        })
        tr.append(td);
        tbody.append(tr);
        tr = $("<tr></tr>");
    });
    container.append(thead);
    container.append(tbody);
}