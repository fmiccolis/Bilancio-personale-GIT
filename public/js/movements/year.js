$(document).ready(function() {
	var year_detail = $("#detail");
	var year = window.location.href.split("/").slice(-2, -1)[0];
	getElaboratedMonths(year).then(data => {
		if(data.hasOwnProperty("empty")) {
			year_detail.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova riga con l'apposito pulsante!</div>"));
		} else if(data.hasOwnProperty("error")) {
			year_detail.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
		} else {
			generateTable(year_detail, data);
			generateChart(data.categories.entrata, "total", incomeChart, "entrata", "Income dataset-true", incomeContainer);
			generateChart(data.categories.uscita, "total", exitsChart, "uscita", "Exists dataset-true", exitsContainer);
		}
	});
});

function generateTable(table, year_view) {
	var thead = $("<thead></thead>");
    var tr = $("<tr></tr>");
    year_view.headers.forEach(function (header) {
        tr.append($("<th scope='col'>" + header + "</th>"));
    });
    thead.append(tr);
	table.append(thead);
	var tbody = $("<tbody></tbody>");
	let base_link = window.location.pathname;
	year_view.list.forEach(function (yearData) {
		tr = $("<tr></tr>");
		let pos = 0;
		for(let key in yearData) {
			let td = $("<td>" + yearData[key] + "</td>");
			if(pos == 1) {
				td = $("<td><a href='month/" + yearData.month + "/'>" + yearData[key] + "</a></td>");
			}
			if(pos > 0) {
				tr.append(td);
			}
			pos++;
		}
		tbody.append(tr);
	});
	table.append(tbody);
}