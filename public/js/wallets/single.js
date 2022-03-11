var walletChartContainer = $("#wallets_container");
var walletChartCanvas = $("#walletChart");
var walletChart = walletChartCanvas.length > 0 ? new Chart(walletChartCanvas, {}) : "";

$(document).ready(function() {
    var walletContainer = $("#wallet");
    var walletForm = $("#editWalletForm");
	var array_location = window.location.href.split("/");
	var walletId = array_location[array_location.length - 2];
	getSingleWallet(walletId).then(data => {
        $("#section-title").text(data.name);
		generateWalletAccordions(walletContainer, data);
        var typesArray = [];
        for(let tidx in data.types) {
            if(data.types[tidx].list.length > 0) {
                typesArray.push({
                    name: data.types[tidx].name,
                    usages: data.types[tidx].list.length
                });
            }
        }
		generateChart(typesArray, "usages", walletChart, "walletChart", "Wallet dataset-false", walletChartContainer);
        populateForm(walletForm, data);
	});

    $("#editWallet").click(function() {
        var updatedWallet = {
            nome: $("[data-w-name]").val(),
            icona: $("[data-w-icon]").html(),
            totale: $("[data-w-total]").val(),
            scadenza: swap($("[data-w-valid]").val().split("-")).join("/"),
            utilizzabile: $("[data-w-utility]").is(":checked")
        }
        editWallet(updatedWallet, walletId).then(response => {
            window.location.reload();
        });
    });
});

function generateWalletAccordions(container, wallet) {
    var walletId = wallet.id;
    var nav = $("<nav></nav>");
    var tabs = $("<div class='nav nav-tabs' id='nav-tab-" + walletId + "' role='tablist'></div>");
    var contents = $("<div class='tab-content' id='nav-tabContent-" + walletId + "'><div>");
    var first = true;
    for(let tidx in wallet.types) {
        var currentType = wallet.types[tidx];
        if(currentType.list.length === 0) continue;
        var buttonClass = "nav-link";
        var contentClass = "tab-pane fade"
        if(first) {
            buttonClass = "nav-link active";
            contentClass = "tab-pane fade show active";
        }
        var tabButton = $("<button class='" + buttonClass + "' id='nav-" + tidx + "-tab-" + walletId + "' data-bs-toggle='tab' data-bs-target='#nav-" + tidx + "-" + walletId + "' type='button' role='tab' aria-controls='nav-" + tidx + "' aria-selected='" + first.toString() + "'>" + currentType.name + "</button>");
        var tabPanel = $("<div class='" + contentClass + "' id='nav-" + tidx + "-" + walletId + "' role='tabpanel' aria-labelledby='nav-" + tidx + "-tab-" + walletId + "'></div>");
        visualizeMovement(
            currentType.list, 
            tabPanel, 
            {
                showData: true, 
                showActions: true,
                readClass: true
            },
            wallet.masterCodes
        );
        contents.append(tabPanel);
        tabs.append(tabButton);
        first = false;
    }
    if(tabs.is(":empty")) {
        container.append($("<div class='alert alert-info' role='alert'>Non ci sono movimenti con questo portafogli!</div>"));
    } else {
        nav.append(tabs);
        container.append(nav);
        container.append(contents);
    }
}

function populateForm(container, wallet) {
    container.find("[data-w-name]").val(wallet.name);
    container.find("[data-w-total]").val(wallet.total);
    container.find("[data-w-icon]").html(wallet.icon);
    container.find("[data-w-valid]").val(swap(wallet.valid.split("/")).join("-"));
    container.find("[data-w-utility]").prop("checked", wallet.utility);
}