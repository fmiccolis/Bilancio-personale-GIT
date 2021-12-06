var tool2 = {
    enabled: false,
    external: function(context) {
        // Tooltip Element
        var tooltipEl = $('#chartjs-tooltip');

        // Create element on first render
        if (tooltipEl.length == 0) {
            tooltipEl = $('<div></div>');
            tooltipEl.attr('id', 'chartjs-tooltip');
            tooltipEl.append($('<div></div>'));
            tooltipEl.css({"width": '0', "height": '0'});
            $(document).find("body").append(tooltipEl);
        }

        // Hide if no tooltip
        var tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
            tooltipEl.fadeOut();
            return;
        }
        var halfSquare = ((context.chart.chartArea.height / 4) * 0.707);
        var squareSide = 2 * halfSquare;

        // Set Text
        if (tooltipModel.body) {
            let dataset = context.chart.config.data.datasets[0];
            let labels = context.chart.config.data.labels;
            let total = dataset.data.reduce((a, b) => a + b, 0);
            let indice = tooltipModel.dataPoints[0].dataIndex;
            let current = dataset.data[indice];
            let color = dataset.backgroundColor[indice];

            var money = dataset.label.split("-")[1] === "true";

            tooltipEl.empty();
            var divValore = $("<div class='valore-tooltip'>" + (money ? formatter.format(current) : current) + "</div>");
            var divNome = $("<div class='nome-tooltip' style='color: " + color + "'>" + labels[indice] + "</div>");
            var divPercentuale = $("<div class='percentuale-tooltip'>" + (current*100/total).toFixed(2) + "%</div>");

            tooltipEl.append(divValore);
            tooltipEl.append(divNome);
            tooltipEl.append(divPercentuale);
            tooltipEl.fitText(0.55);
        }

        var position = context.chart.canvas.getBoundingClientRect();

        // Display, position, and set styles for font
        tooltipEl.fadeIn();
        tooltipEl.css({
            "position": "absolute",
            "left": position.left + window.pageXOffset + (context.chart.chartArea.width / 2) - halfSquare + 'px',
            "top": position.top + window.pageYOffset + context.chart.chartArea.top + ((context.chart.chartArea.height / 4) * 1.293) + 'px',
            "width": squareSide + 'px',
            "height": squareSide+  'px',
        });
    }
};

const options = {
    aspectRatio: 0.5,
    responsive: true,
    plugins: {
        tooltip: tool2,
        legend: {
            position: "top",
            labels: {
                usePointStyle: true,
                textAlign: "left"
            }
        }
    }
}

const sidebar = $("#sidebarMenu").find("div.position-sticky");

var incomeContainer = $("#income_container");
var exitsContainer = $("#exits_container");
var categoriesContainer = $("#categories_container");
var incomeChartCanvas = $("#entrata");
var exitsChartCanvas = $('#uscita');
var categoriesChartCanvas = $('#categoryChart');
var incomeChart = incomeChartCanvas.length > 0 ? new Chart(incomeChartCanvas, {}) : "";
var exitsChart = exitsChartCanvas.length > 0 ? new Chart(exitsChartCanvas, {}) : "";
var categoriesChart = categoriesChartCanvas.length > 0 ? new Chart(categoriesChartCanvas, {}) : "";

const tipologiaSelect = $("#tipologia-select");
const categoriaSelect = $("#categoria-select");

var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

$(document).ready(function() {
	$("#dataInput").val((new Date()).toISOString().slice(0,10));
    getNavigation().then(data => {
        if(data.hasOwnProperty("empty")) {
            sidebar.prepend($("<div class='alert alert-info' role='alert'>Impossibile creare la navigazione—Il database è vuoto!</div>"));
        } else if(data.hasOwnProperty("error")) {
            sidebar.prepend($("<div class='alert alert-danger' role='alert'>Impossibile creare la navigazione—C'è un errore nel database, richiedi assistenza!</div>"));
        } else {
            sidebar.prepend(generateNavigation(data));
            updateActiveLink();
        }
    });
    
    $('.my').iconpicker();

    $('.my').on('iconpickerSelected', function(event){
        $("#visualizzazione, #FormControlVisualizza").empty();
        $("#visualizzazione, #FormControlVisualizza").append($("<i></i>").addClass(event.iconpickerValue));
    });
    
    $("#tipologiaInput").change(function () {
        var sorgenteSelect = $("#sorgenteInput");
        var destinazioneSelect = $("#destinazioneInput");
        var selected = $(this).find(":selected");
        if(selected.length == 0) return;
        var sorgente = selected.data("sorgente");
        var destinazione = selected.data("destinazione");
        var lista = selected.data("lista").toString().includes(",") ? selected.data("lista").split(",") : [selected.data("lista").toString()];
        sorgenteSelect.removeAttr("disabled");
        destinazioneSelect.removeAttr("disabled");
        if(sorgente != "any") {
            sorgenteSelect.val(sorgente);
            sorgenteSelect.attr("disabled", "true");
        }
        if(destinazione != "any") {
            destinazioneSelect.val(destinazione);
            destinazioneSelect.attr("disabled", "true");
        }
        $("#categoriaInput").find("option").show();
        $("#categoriaInput").find("option").each(function() {
            if(!lista.includes($(this).val())) $(this).hide();
        });
    });
});

function generateNavigation(elaborated) {
    var ul = $("<ul class='nav flex-column'></ul>");
    elaborated.list.forEach(function(yearData, idx, array) {
        var li= $("<li class='nav-item nav-link yearData'></li>");
        var year = $("<button class='year btn btn-toggle align-items-center rounded collapsed' data-bs-toggle='collapse' data-bs-target='#collapse-" + yearData.year + "' aria-expanded='false' data-year='" + yearData.year + "'>" + yearData.year + "</button>");
		var link = $("<a href='/year/" + yearData.year + "/' class='link-dark rounded'><i class='fas fa-external-link-alt fa-xs'></i></a>");
        var list = $("<div class='collapse' id='collapse-" + yearData.year + "'></div>");
        var innerUl = $("<ul class='btn-toggle-nav list-unstyled fw-normal pb-1 small'></ul>");
        var months = yearData.list.length;
        var quotient = Math.floor(months/2);
        var remainder = months % 2;
        var numberOfRows = quotient + remainder;
        for(let r = 0; r < numberOfRows; r++) {
            var innerLi = $("<li></li>");
            var row = $("<div class='row'></div>");
            var col = $("<div class='col-6'></div>");
			var innerLink = "/year/" + yearData.year + "/month/" + yearData.list[r].month + "/";
            col.append($("<a href='" + innerLink + "' class='link-dark rounded month' data-parent-link='" + link.attr('href') + "' data-month='" + yearData.list[r].month + "' data-year='" + yearData.year + "'>" + yearData.list[r].name + "</a>"));
            row.append(col);
            if (quotient > 0 && typeof yearData.list[r+numberOfRows] !== 'undefined') {
				innerLink = "/year/" + yearData.year + "/month/" + yearData.list[r+numberOfRows].month + "/";
                col = $("<div class='col-6'></div>");
                col.append($("<a href='" + innerLink + "' class='link-dark rounded month' data-parent-link='" + link.attr('href') + "' data-month='" + yearData.list[r+numberOfRows].month + "' data-year='" + yearData.year + "'>" + yearData.list[r+numberOfRows].name + "</a>"));
                row.append(col);
            }
            innerLi.append(row);
            innerUl.append(innerLi);
        }
        var this_page = innerUl.find("a[href$='" + window.location.pathname + "']");
        if(this_page.length > 0 && window.location.pathname !== "/") {
            year.attr("aria-expanded", "true");
            year.removeClass("collapsed");
            list.addClass("show");
        }
        list.append(innerUl);
        li.append(year);
		li.append(link);
        li.append(list);
        ul.append(li);
    });
    return ul;
}

function updateActiveLink() {
    sidebar.find(".active-custom").removeClass("active-custom");
    var link = sidebar.find("a[href='" + window.location.pathname + "']");
    var parentlink = link.data("parent-link");
    link.siblings("button").addClass("active-custom");
    if(sidebar.find("a[href$='" + parentlink + "']").length > 0) {
        sidebar.find("a[href$='" + parentlink + "']").siblings("button").addClass("active-custom");
    }
    link.addClass("active-custom");
}

function generateChart(categories, param, chart, type, datasetName, container) {
    chart.destroy();
    container.find("canvas").remove();
    extracted = [];
    let sum_of_totals = 0;
    categories.forEach(function(category) {
        extracted.push({
            label: category.name,
            data: category[param],
            color: randomColor()
        });
        sum_of_totals += category[param];
    });
    extracted.sort((a, b) => (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0));
    var chartData = {
        labels: extracted.map(({label}) => label),
        datasets: [{
          label: datasetName,
          data: extracted.map(({data}) => data),
          backgroundColor: extracted.map(({color}) => color),
          hoverOffset: 4
        }]
    };
    var chartConfig = {
        type: 'doughnut',
        data: chartData,
        options: options
    };
    container.find(".total").text("(" + (param === "total" ? formatter.format(sum_of_totals) : sum_of_totals) + ")");
    let element = $("<canvas id='" + type + "' class='my-4 w-100'></canvas>");
    container.append(element);
    chart = new Chart(element, chartConfig);
}

function visualizeMovement(list, container, options) {
    list.forEach(function (rowData) {
        var details = $("<details data-id='" + rowData.id + "' data-tipologia='" + rowData.tipologia.nome + "' data-tipologiaid='" + rowData.tipologiaId + "' data-categoria='" + rowData.categoria.nome + "'></details>");
        var summary = $("<summary></summary>");
        var otherInfo = $("<div></div>");
        var masterInfo = $("<div></div>");
        var icon = $("<span style='background-color: " + rowData.categoria.colore + "'>" + rowData.categoria.icona + "</span>");
        var h4 = $("<h4></h4>");
        var descrizione = $("<strong class='descrizione'>" + rowData.descrizione + "</strong>");
        var categoria = $("<small class='categoria' data-categoria='" + rowData.categoriaId + "'>" + rowData.categoria.nome + "</small>");
        var cssClass = '';
        var symbol = '-';
        var nomePortafoglio = rowData.sorgente.nome;
        if(rowData.tipologia.nome === "entrata") {
            cssClass = 'plus';
            symbol = '+';
            nomePortafoglio = rowData.destinazione.nome;
        } else if(options.readClass) {
            cssClass = rowData.cssClass;
            symbol = rowData.cssClass === "plus" ? "+" : "-";
            nomePortafoglio = rowData.portafoglio;
        }
        var importo = $("<span class='importo " + cssClass + "' data-importo='" + rowData.importo + "'>" + symbol + formatter.format(rowData.importo) + "</span>");
        h4.append(descrizione);
        h4.append(categoria);
        masterInfo.append(icon);
        masterInfo.append(h4);
        masterInfo.append(importo);
        summary.append(masterInfo);
        var dl = $("<dl></dl>");
        var dataMovement = $("<div><dt>Data</dt><dd>" + rowData.data + "</dd></div>");
        var portafoglio = $("<div><dt class='sd' data-sorgente='" + rowData.sorgente.id + "' data-destinazione='" + rowData.destinazione.id + "'>Portafoglio</dt><dd>" + nomePortafoglio + "</dd></div>");
        var codice = $("<div><dt>Codice</dt><dd class='codice'>" + rowData.codice + "</dd></div>");
        
        let editB = $("<span class='action px-1' id='edit-" + rowData.id + "' data-bs-toggle='modal' data-bs-target='#addEditMovement' style='color: gold'><i class='fas fa-edit fa-fw'></i></span>");
        let deleteB = $("<span class='action px-1' id='delete-" + rowData.id + "' data-bs-toggle='modal' data-bs-target='#deleteLine' style='color: tomato'><i class='fas fa-trash-alt fa-fw'></i></span>");
        var actions = $("<div><dt>Azioni</dt><dd></dd></div>");
        actions.find("dd").append(editB, deleteB);
        if(options.showData) dl.append(dataMovement);
        dl.append(portafoglio);
        dl.append(codice);
        if(options.showActions) dl.append(actions);
        otherInfo.append(dl);
        details.append(summary);
        details.append(otherInfo);
        container.append(details);
    });
}

function getDaysInMonth(month, year) {
    let size = new Date(parseInt(year, 10), parseInt(month, 10)+1, 0).getDate();
    let daylist = [];
    for(i=1; i<=size; i++) {
        daylist.push(new Date(year, month, i))
    }
    return daylist;
}

function getWeekOfMonth(date) {
    var firstDay = new Date(date.setDate(1)).getDay();
    var totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Math.ceil((firstDay + totalDays) / 7);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function swap(arra) {
    [arra[0], arra[arra.length - 1]] = [arra[arra.length - 1], arra[0]];
    return arra;
}

const randomColor = () => {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
   
function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});