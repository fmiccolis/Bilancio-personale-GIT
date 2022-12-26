$(document).ready(function() {
	var year_detail = $("#detail");
	getElaboratedYears().then(data => {
		if(data.hasOwnProperty("empty")) {
			year_detail.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova riga con l'apposito pulsante!</div>"));
		} else if(data.hasOwnProperty("error")) {
			year_detail.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
		} else {
			//console.log(data);

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
	year_view.list.forEach(function (yearData) {
		tr = $("<tr></tr>");
		let first = true;
		for(let key in yearData) {
			let td = $("<td>" + yearData[key] + "</td>");
			if(first) {
				td = $("<td><a href='/year/" + yearData[key] + "/'>" + yearData[key] + "</a></td>");
				first = false;
			}
			tr.append(td);
		}
		tbody.append(tr);
	});
	table.append(tbody);
	var tfoot = $("<tfoot></tfoot>");
	tr = $("<tr></tr>");
	tr.append("<td>Media " + year_view.footer.total_footer_input + " mesi</td>");
	tr.append("<td>" + formatter.format(year_view.footer.totalSpent) + "</td>");
	tr.append("<td>" + formatter.format(year_view.footer.month_avarage_spent) + "</td>");
	tr.append("<td> --- € </td>");
	tr.append("<td>" + formatter.format(year_view.footer.daily_avarage) + "</td>");
	tr.append("<td> --- € </td>");
	tr.append("<td> --- € </td>");
	tr.append("<td>" + formatter.format(year_view.footer.totalEarned) + "</td>");
	tr.append("<td>" + formatter.format(year_view.footer.month_avarage_earned) + "</td>");
	tr.append("<td> --- € </td>");
	tr.append("<td>" + formatter.format(year_view.footer.month_saving_avarage) + "</td>");
	tr.append("<td>" + formatter.format(year_view.footer.average_saving) + "</td>");
	tr.append("<td> --- € </td>");
	tr.append("<td>" + year_view.footer.average_saving_rate + "</td>");
	tr.append("<td> --- € </td>");
	tfoot.append(tr);
	table.append(tfoot);
}