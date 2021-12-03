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

    $(this).on("click", ".cate-badge", function() {
        var text = $(this).text().trim();
        var page = $(this).data("page");
        window.location.href = `/${page}/#:~:text=${text}`;
    });

    $(this).on("swiped-left", "[data-swipe-threshold]", function(e) {
        var detail = e.detail;
        var tr = $(e.target).closest("tr");
        tr.removeClass("tobeswiped");
        tr.addClass("swiping");
        tr.find(".action-buttons").fadeIn();
    });

    $(this).on("swiped-right", "[data-swipe-threshold]", function(e) {
        var detail = e.detail;
        var tr = $(e.target).closest("tr");
        tr.addClass("tobeswiped");
        tr.removeClass("swiping");
        tr.find(".action-buttons").fadeOut();
    });
});

function generateTypesTable(container, data) {
    var thead = $("<thead></thead>");
    var tr = $("<tr></tr>");
    data.headers.forEach(function(header) {
        tr.append("<th>" + header + "</th>");
    });
    thead.append(tr);
    tr = $("<tr data-swipe-threshold='50' data-swipe-timeout='500' data-swipe-ignore='false'></tr>");
    var tbody = $("<tbody></tbody>");
    var any_pill = "<span class='badge rounded-pill bg-info cate-badge'>any</span>";
    data.list.forEach(function(type) {
        tr.append("<td>" + type.nome + "</td>");
        tr.append("<td><i>" + type.descrizione + "</i></td>");
        tr.append($("<td><div class='form-check form-switch'><input class='form-check-input toggleAbility' type='checkbox' id='SwitchCheck-" + type.id + "' " + (type.analizza ? 'checked' : '') + "></div></td>"));
        tr.append("<td>" + type.icona + "</td>");
        var td = $("<td>" + any_pill + "</td>");
        if(type.sorgente !== "any") {
            td = $("<td><span class='badge rounded-pill bg-warning cate-badge' data-page='wallets'>" + type.sorgente.icona + " " + type.sorgente.nome + "</span></td>")
        }
        tr.append(td);
        td = $("<td>" + any_pill + "</td>");
        if(type.destinazione !== "any") {
            td = $("<td><span class='badge rounded-pill bg-warning cate-badge' data-page='wallets'>" + type.destinazione.icona + " " + type.destinazione.nome + "</span></td>")
        }
        tr.append(td);
        td = $("<td></td>");
        var pills_container = $("<div class='pills-container'></div>")
        type.lista.forEach(function(category) {
            pills_container.append("<span class='badge rounded-pill cate-badge' data-page='categories' style='background-color: " + category.colore + "; color: " + invertColor(category.colore, true) + "'>" + category.icona + " " + category.nome + "</span>");
        })
        td.append(pills_container);
        tr.append(td);
        let editB = $("<span class='action px-1' id='edit-" + type.id + "' data-bs-toggle='modal' data-bs-target='#addEditRecurrent' style='color: gold'><i class='fas fa-edit fa-fw'></i></span>");
        let deleteB = $("<span class='action px-1' id='delete-" + type.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecurrent' style='color: tomato'><i class='fas fa-trash-alt fa-fw'></i></span>");
        tr.append($("<td></td>").append(editB, deleteB));
        tr.append($("<td class='action-buttons'></td>").append("<div>ehi ciao</div>"));
        tbody.append(tr);
        tr = $("<tr data-swipe-threshold='50' data-swipe-timeout='500' data-swipe-ignore='false'></tr>");
    });
    container.append(thead);
    container.append(tbody);
}