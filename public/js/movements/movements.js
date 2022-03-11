$(document).ready(function() {
	$("#dataInput").val((new Date()).toISOString().slice(0,10));

    $("#addNewLine").click(function() {
		var newLine = {
			data: swap($("#dataInput").val().split("-")).join("/"),
			importo: parseFloat($("#importoInput").val()),
			tipologiaId: $("#tipologiaInput").val(),
			descrizione: $("#descrizioneInput").val(),
			categoriaId: $("#categoriaInput").val(),
            sorgente: $("#sorgenteInput").val(),
            destinazione: $("#destinazioneInput").val(),
            collegato: $("#collegatoInput").val()
		}
        addNewLine(newLine).then(response => {
            window.location.reload();
        });
	});
});