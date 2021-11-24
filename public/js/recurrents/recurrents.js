$(document).ready(function() {
    var recurrents = $("#recurrents");
    var dataFromServer = null;
    getElaboratedRecurrents().then(data => {
        if(data.hasOwnProperty("empty")) {
            categories.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova categoria con l'apposito pulsante!</div>"));
        } else if(data.hasOwnProperty("error")) {
            categories.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
        } else {
            //console.log(data);
            generateRecurrentTable(recurrents, data);
            dataFromServer = data;
            populateSelects(data);
        }
	});

    $("#addNewRecurrent").click(function() {
		var newLine = {
			data: $("#dataInput").val(),
			importo: parseFloat($("#importoInput").val()),
			tipologiaId: $("#tipologiaInput").val(),
			descrizione: $("#descrizioneInput").val(),
			categoriaId: $("#categoriaInput").val(),
            sorgente: $("#sorgenteInput").val(),
            destinazione: $("#destinazioneInput").val(),
            codice: $("#codiceInput").val(),
            abilitato: "true",
		}
        addNewRecurrent(newLine).then(response => {
            window.location.reload();
        });
	});

	$("#addEditRecurrent").on('show.bs.modal', function (event) {
		var lineId = event.relatedTarget.id.slice(5);
        var recurrent = dataFromServer.list.find(ope => ope.id === lineId);
		var currentModal = $(this);
		if(recurrent) { //edit line
            console.log("sono in edit");
			currentModal.find("[name='data']").val(recurrent.data);
			currentModal.find("[name='importo']").val(recurrent.importo);
			currentModal.find("[name='tipologia']").val(recurrent.tipologiaId);
			currentModal.find("[name='categoria']").val(recurrent.categoriaId);
			currentModal.find("[name='sorgente']").val(recurrent.sorgenteId);
			currentModal.find("[name='destinazione']").val(recurrent.destinazioneId);
			currentModal.find("[name='descrizione']").val(recurrent.descrizione);
			currentModal.find("[name='codice']").val(recurrent.codice);
			currentModal.find("[name='abilitato']").val(recurrent.abilitato);
			$("#addEditRecurrentTitle").text("Modifica Movimento Ricorrente (ID="+lineId+")");
			$("#editRecurrent").show();
			$("#addNewRecurrent").hide();
			currentModal.find(".hiddenId").val(lineId);
		} else { //add line
			$("#addEditRecurrentTitle").text("Nuovo Movimento Ricorrente");
			currentModal.find(".form-control, .form-select").val("");
			$("#editRecurrent").hide();
			$("#addNewRecurrent").show();
			currentModal.find(".hiddenId").val("");
		}
        $("#tipologiaInput").trigger("change");
	});

    $("#deleteRecurrent").on('show.bs.modal', function (event) {
		var lineId = event.relatedTarget.id.slice(7);
        console.log(lineId);
		var tr = $("tr[data-r-id='" + lineId + "']");
		var table = tr.closest("table").clone();
		table.find("tbody").find("tr").not("[data-r-id='" + lineId + "']").remove();
		table.find("tr > td").slice(-3).remove();
		table.find("tr > th").slice(-3).remove();
		var dataTodelete = $("#dataTodelete");
		dataTodelete.empty();
		dataTodelete.append(table);
		dataTodelete.append($("<input type='hidden' class='hiddenId' value='" + lineId + "' />"));
		$("[data-bs-toggle='tooltip']").tooltip();
	});

	$("#deleteThisRecurrent").click(function () {
		var lineId = $("#dataTodelete").find(".hiddenId").val();
		deleteRecurrent(lineId).then(response => {
			window.location.reload();
		});
	});

	$("#editRecurrent").click(function () {
		var lineId = $(this).closest(".modal-content").find(".hiddenId").val();
		var data = $("#dataInput").val();
		var importo = $("#importoInput").val();
		var tipologia = $("#tipologiaInput").val();
		var categoria = $("#categoriaInput").val();
		var sorgente = $("#sorgenteInput").val();
		var destinazione = $("#destinazioneInput").val();
		var descrizione = $("#descrizioneInput").val();
		var codice = $("#codiceInput").val();
		var abilitato = $("#abilitatoInput").val();
		var newLine = {
			data: data,
			importo: parseFloat(importo),
			tipologiaId: tipologia,
			categoriaId: categoria,
			sorgente: sorgente,
			destinazione: destinazione,
			descrizione: descrizione,
			codice: codice,
            abilitato: abilitato
		}
		editRecurrent(newLine, lineId).then(response => {
			window.location.reload();
		});
	});

    $(this).on("change", ".toggleAbility", function () {
        var id = $(this).attr('id').replace("SwitchCheck-", "");
        toggleRecurrentAbility(id).then(response => {
            if(response.updated) {
                var recurrent = response.recurrent;
                $("tr[data-r-id='" + id + "']").find(".nextStart").text(calculateNextStart(recurrent.abilitato, recurrent.data))
            }
        });
    });
});

function generateRecurrentTable(table, recurrentInfo) {
    var thead = $("<thead></thead>");
    var tr = $("<tr></tr>");
    recurrentInfo.headers.forEach(function (header) {
        tr.append($("<th scope='col'>" + header + "</th>"));
    });
    thead.append(tr);
	table.append(thead);

    var arrowRight = $("<i class='fas fa-long-arrow-alt-right'></i>");
	var tbody = $("<tbody></tbody>");
    recurrentInfo.list.forEach(function (recurrent) {
        //console.log(recurrent);
		tr = $("<tr data-r-id='" + recurrent.id + "'></tr>");
        var direction = $("<div class='flex-evenly'></div>");
        var sourceIcon = $(recurrent.sorgente.icona).attr('title', recurrent.sorgente.nome);
        var destIcon = $(recurrent.destinazione.icona).attr('title', recurrent.destinazione.nome);
        sourceIcon.attr('data-bs-toggle', 'tooltip');
        sourceIcon.attr('data-bs-placement', 'top');
        destIcon.attr('data-bs-toggle', 'tooltip');
        destIcon.attr('data-bs-placement', 'top');
        direction.append(sourceIcon);
        direction.append(arrowRight.clone());
        direction.append(destIcon);
        let editB = $("<span class='action px-1' id='edit-" + recurrent.id + "' data-bs-toggle='modal' data-bs-target='#addEditRecurrent' style='color: gold'><i class='fas fa-edit fa-fw'></i></span>");
        let deleteB = $("<span class='action px-1' id='delete-" + recurrent.id + "' data-bs-toggle='modal' data-bs-target='#deleteRecurrent' style='color: tomato'><i class='fas fa-trash-alt fa-fw'></i></span>");

        tr.append($("<td>" + recurrent.descrizione + "</td>"));
        tr.append($("<td>" + formatter.format(recurrent.importo) + "</td>"));
        tr.append($("<td></td>").append(recurrent.tipologia.nome));
        tr.append($("<td></td>").append(recurrent.categoria.nome));
        tr.append($("<td></td>").append(direction));
        tr.append($("<td style='font-family: monospace'>" + recurrent.codice + "</td>"));
        tr.append($("<td><div class='form-check form-switch'><input class='form-check-input toggleAbility' type='checkbox' id='SwitchCheck-" + recurrent.id + "' " + (recurrent.abilitato ? 'checked' : '') + "></div></td>"));
        tr.append($("<td class='nextStart'>" + calculateNextStart(recurrent.abilitato, recurrent.data) + "</td>"));
        tr.append($("<td></td>").append(editB, deleteB));
		tbody.append(tr);
	});
	table.append(tbody);
    $("[data-bs-toggle='tooltip']").tooltip();
}

function populateSelects(data) {
    for(let idx in data.types) {
        var currentType = data.types[idx];
        $("#tipologiaInput").append($("<option value='" + idx + "' data-sorgente='" + currentType.sorgente + "' data-destinazione='" + currentType.destinazione + "' data-lista='" + currentType.lista + "'>" + currentType.nome + "</option>"));
    }
    for(let idx in data.wallets) {
        var walletDOM = $("<option value='" + idx + "'>" + data.wallets[idx].nome + "</option>");
        if(data.wallets[idx].utilizzabile) $("#sorgenteInput").append(walletDOM);
        $("#destinazioneInput").append(walletDOM.clone());
    }
    for(let idx in data.categories) {
        var cate = data.categories[idx];
        $("#categoriaInput").append($("<option value='" + idx + "'>" + cate.nome + "</option>"));
    }
}

function calculateNextStart(abilitato, data) {
    if(!abilitato) return "indefinito";

    let today = new Date();
    let day = today.getDate();
    let intData = parseInt(data, 10);

    let month = today.getMonth();
    let year = today.getFullYear();
    if(day > intData) {
        if(month === 11) {
            month = 0
            year += 1
        } else {
            month += 1;
        }
    }
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(year, month, intData).toLocaleDateString('it-IT', options).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });;
}