$(document).ready(function() {
	var accordion = $("#accordion");
	var array_location = window.location.href.split("/");
	var year = array_location[array_location.length - 4];
	var month = array_location[array_location.length - 2];
	getElaboratedDays(year, month).then(data => {
		switch (data) {
			case data.hasOwnProperty("empty"): accordion.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova riga con l'apposito pulsante!</div>")); break;
			case data.hasOwnProperty("error"): accordion.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>")); break;
			default:
				generateCalendar(accordion, data, year, month);
				generateChart(data.categories.entrata, "total", incomeChart, "entrata", "Income dataset-true", incomeContainer);
				generateChart(data.categories.uscita, "total", exitsChart, "uscita", "Exists dataset-true", exitsContainer);
				updateCategoriaSelect(data.categories);
				break;
		}
	});

	$("#deleteLine").on('show.bs.modal', function (event) {
		var lineId = event.relatedTarget.id.slice(7);
		var tr = $("tr[data-id='" + lineId + "']");
		var table = tr.closest("table").clone();
		table.find("tbody").find("tr").not("[data-id='" + lineId + "']").remove();
		table.find("tr").find("td:last-child, th:last-child").remove();
		table.find("tr").first().prepend($("<th scope='col' style='text-align: center;'>data</th>"));
		table.find("tr").last().prepend($("<td>" + tr.closest(".accordion-item").data("day") + "</td>"));
		var dataTodelete = $("#dataTodelete");
		dataTodelete.empty();
		dataTodelete.append(table);
		dataTodelete.append($("<input type='hidden' class='hiddenId' value='" + lineId + "' />"));
		$("[data-bs-toggle='tooltip']").tooltip();
	});

	$("#deleteThisLine").click(function () {
		var lineId = $("#dataTodelete").find(".hiddenId").val();
		deleteLine(lineId).then(response => {
			window.location.reload();
		});
	});

	$("#editLine").click(function () {
		var lineId = $(this).closest(".modal-content").find(".hiddenId").val();
		var data = $("#dataInput").val();
		var importo = $("#importoInput").val();
		var tipologia = $("#tipologiaInput").val();
		var categoria = $("#categoriaInput").val();
		var sorgente = $("#sorgenteInput").val();
		var destinazione = $("#destinazioneInput").val();
		var descrizione = $("#descrizioneInput").val();
		var codice = $("#codiceInput").val();
		var newLine = {
			data: swap(data.split("-")).join("/"),
			importo: parseFloat(importo),
			tipologiaId: tipologia,
			categoriaId: categoria,
			sorgente: sorgente,
			destinazione: destinazione,
			descrizione: descrizione,
			codice: codice
		}
		editLine(newLine, lineId).then(response => {
			window.location.reload();
		});
	});

	$(this).on("click", ".day-box", function () {
		$(".day-box").removeAttr("style");

		var thisday = $(this).data("day");
		var parentweek = $(this).parent();
		var box = parentweek.next();
		var movements = box.find("[data-day='" + thisday + "']");
		if(movements.length > 0) {
			if(movements.is(":visible")) {
				box.fadeOut();
			} else {
				$(".movement-box").hide();
				box.children().hide();
				$(this).css("background-color", "#8888ff");
				movements.fadeIn();
				box.fadeIn();
			}
		} else {
			$(".movement-box").fadeOut();
		}
	});

	categoriaSelect.change(filters);
	tipologiaSelect.change(filters);
});

function generateCalendar(accordion, day_view, year, month) {
	let output = new Date(year, month, 1);
	let monthName = output.toLocaleString('it-IT', { month: 'long' }).toUpperCase();
	var days = getDaysInMonth(month, year);
	var calendar = $("<div class='calendar'></div>");
	var calendar_header = $("<div class='calendar-header'><div class='month-name'>" + monthName + "</div><div class='week-days'></div></div>");
	calendar_header.find(".week-days").append("<div>LUN</div>");
	calendar_header.find(".week-days").append("<div>MAR</div>");
	calendar_header.find(".week-days").append("<div>MER</div>");
	calendar_header.find(".week-days").append("<div>GIO</div>");
	calendar_header.find(".week-days").append("<div>VEN</div>");
	calendar_header.find(".week-days").append("<div>SAB</div>");
	calendar_header.find(".week-days").append("<div>DOM</div>");
	var calendar_body = $("<div class='calendar-body'></div>");
	var added = 0;
	var week = $("<div class='week'></div>");
	var week_movements = [];
	let how_many_fake_boxes = days[0].getDay() === 0 ? 6 : days[0].getDay() - 1;
	for(let j = 0; j < how_many_fake_boxes; j++) {
		week.append("<div class='fake-box'></div>");
	}
	var added = how_many_fake_boxes;
	var today = new Date().toLocaleString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' });
	for(let i = 0; i < days.length; i++) {
		var trimmed_date = days[i].toLocaleString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' });
		var movements = day_view.dates[trimmed_date];
		var day_box = $("<div class='day-box' data-day='" + trimmed_date + "'></div>");
		var day_num = $("<div class='day-num " + (trimmed_date === today ? "today" : "") + "'>" + days[i].getDate() + "</div>");
		day_box.append(day_num);
		if(movements) {
			week_movements.push(movements);
			var box_infos = $("<div class='infos'><div class='income'>" + (movements.entrata === 0 ? "" : formatter.format(movements.entrata)) + "</div><div class='outcome'>" + (movements.uscita === 0 ? "" : formatter.format(movements.uscita)) + "</div></div>");
			day_box.append(box_infos);
			var categories_box = $("<div class='categories-box'></div>");
			movements.categories.forEach(function (category) {
				var icona = $(category.icona);
				icona.attr('title', category.nome);
				icona.attr('data-bs-toggle', 'tooltip');
				icona.attr('data-bs-placement', 'top');
				categories_box.append(icona);
			});
			day_box.append(categories_box);
		}
		added++;
		week.append(day_box);
		if(added === 7) {
			added = 0;
			generateMovementsBox(calendar_body, week, week_movements);
			week_movements = [];
			week = $("<div class='week'></div>");
		}
	}
	how_many_fake_boxes = days[days.length-1].getDay() === 0 ? 0 : 7 - days[days.length-1].getDay();
	for(let j = 0; j < how_many_fake_boxes; j++) {
		week.append("<div class='fake-box'></div>");
	}
	generateMovementsBox(calendar_body, week, week_movements)
	week_movements = [];
	calendar.append(calendar_header);
	calendar.append(calendar_body);
	accordion.append(calendar);
	$("[data-bs-toggle='tooltip']").tooltip();
}

function generateMovementsBox(calendar_body, week, week_movements) {
	calendar_body.append(week);
	var movement_box = $("<div class='movement-box'></div>");
	week_movements.forEach(function (movements) {
		var dayname = $("<div data-day='" + movements.list[0].data + "'></div>");
		visualizeMovement(
			movements.list, 
			dayname, 
			{
				showData: false, 
				showActions: true,
				readClass: false
			}
		);
		movement_box.append(dayname);
	});
	calendar_body.append(movement_box);
}

function extractKeys(day_view) {
	var keys = Object.keys(day_view.dates);
	keys.sort(function (a, b) {
		var a_num = parseInt(a.split("/")[0], 10);
		var b_num = parseInt(b.split("/")[0], 10);
		return a_num < b_num ? -1 : b_num < a_num ? 1 : 0;
	});
	return keys;
}

function filters() {
	var selected = $(this).find("option:selected").val();
	var filter = $(this).data("filter");
	$("#accordion").find(".accordion-item").show();
	$("#accordion").find("details").show();
	if(selected !== 'base') {
		console.log($("#accordion").find("details[data-" + filter + "!='" + selected + "']"));
		$("#accordion").find("details[data-" + filter + "!='" + selected + "']").hide();
		$("#accordion").find(".accordion-item").each(function () {
			var onevisible = false;
			$(this).find("details").each(function () {
				if($(this).css("display") !== 'none') {
					console.log($(this));
					onevisible = true;
				}
			});
			if(!onevisible) $(this).hide();
		});
	}
}