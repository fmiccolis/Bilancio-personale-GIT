$(document).ready(function() {
	$("#dataInput").val((new Date()).toISOString().slice(0,10));
    fillCategories();
    fillTypes();
    fillWallets();

    $("#addNewLine").click(function() {
		var newLine = {
			data: swap($("#dataInput").val().split("-")).join("/"),
			importo: parseFloat($("#importoInput").val()),
			tipologiaId: $("#tipologiaInput").val(),
			descrizione: $("#descrizioneInput").val(),
			categoriaId: $("#categoriaInput").val(),
            sorgente: $("#sorgenteInput").val(),
            destinazione: $("#destinazioneInput").val()
		}
        addNewLine(newLine).then(response => {
            window.location.reload();
        });
	});

	$("#addEditMovement").on('show.bs.modal', function (event) {
		var lineId = event.relatedTarget.id.slice(5);
		var details = $("details[data-id='" + lineId + "']");
		var currentModal = $(this);
		if(details.length > 0) { //edit line
			currentModal.find("[name='data']").val(swap(details.closest("[data-day]").data("day").split("/")).join("-"));
			currentModal.find("[name='importo']").val(details.find(".importo").data("importo"));
			currentModal.find("[name='tipologia']").val(details.data("tipologiaid"));
			currentModal.find("[name='categoria']").val(details.find(".categoria").data("categoria"));
			currentModal.find("[name='sorgente']").val(details.find(".sd").data("sorgente"));
			currentModal.find("[name='destinazione']").val(details.find(".sd").data("destinazione"));
			currentModal.find("[name='descrizione']").val(details.find(".descrizione").text());
			currentModal.find("[name='codice']").val(details.find(".codice").text());
			$("#addEditMovementTitle").text("Modifica Movimento (ID="+lineId+")");
			$("#editLine").show();
			$("#addNewLine").hide();
			currentModal.find(".hiddenId").val(lineId);
		} else { //add line
			$("#addEditMovementTitle").text("Nuovo Movimento");
			currentModal.find(".form-control, .form-select").val("");
			currentModal.find("#dataInput").val((new Date()).toISOString().slice(0,10));
			$("#editLine").hide();
			$("#addNewLine").show();
			currentModal.find(".hiddenId").val("");
		}
        $("#tipologiaInput").trigger("change");
	});
});

function fillCategories() {
    getElaboratedCategories().then(data => {
        if(data.hasOwnProperty("empty")) {
            console.log("vuoto");
        } else if(data.hasOwnProperty("error")) {
            console.log("errore");
        } else {
            data.forEach(function(cate) {
                $("#categoriaInput").append($("<option value='" + cate.id + "'>" + cate.name + "</option>"));
            });
        }
    });
}

function fillTypes() {
    getTypes().then(data => {
        if(data.hasOwnProperty("empty")) {
            console.log("vuoto");
        } else if(data.hasOwnProperty("error")) {
            console.log("errore");
        } else {
            for(let idx in data) {
                var currentType = data[idx];
                $("#tipologiaInput").append($("<option value='" + idx + "' data-sorgente='" + currentType.sorgente + "' data-destinazione='" + currentType.destinazione + "' data-lista='" + currentType.lista + "'>" + currentType.nome + "</option>"));
            }
        }
    });
}

function fillWallets() {
    getWallets().then(data => {
        if(data.hasOwnProperty("empty")) {
            console.log("vuoto");
        } else if(data.hasOwnProperty("error")) {
            console.log("errore");
        } else {
            for(let idx in data) {
                var walletDOM = $("<option value='" + idx + "'>" + data[idx].nome + "</option>");
                if(data[idx].utilizzabile) $("#sorgenteInput").append(walletDOM);
                $("#destinazioneInput").append(walletDOM.clone());
            }
        }
    });
}

function updateCategoriaSelect(categories) {
    //console.log(categories);
    categoriaSelect.empty();
    categoriaSelect.append($("<option selected value='base'>Seleziona la categoria</option>"));
    for(var type in categories) {
        var group = $("<optgroup label='" + type + "'></optgroup>");
        categories[type].forEach(function (category) {
            group.append($("<option value='" + category.name + "'>" + category.name + "</option>"));
        });
        categoriaSelect.append(group);
    }
}