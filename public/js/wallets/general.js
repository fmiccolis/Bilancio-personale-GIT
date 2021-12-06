var walletContainer = $("#wallets_container");
var walletChartCanvas = $("#walletChart");
var walletChart = walletChartCanvas.length > 0 ? new Chart(walletChartCanvas, {}) : "";

$(document).ready(function() {
    let now = new Date();
    let nextMonth = (new Date(now.getFullYear(), now.getMonth() + 1, 15)).toISOString().slice(0,7);
    $("#scadenzaInput").attr("min", nextMonth);
    var wallets = $("#walletsCard");
    getWallets().then(data => {
        if(data.hasOwnProperty("empty")) {
            wallets.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi un nuovo portafoglio con l'apposito pulsante!</div>"));
        } else if(data.hasOwnProperty("error")) {
            wallets.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
        } else {
            generateWalletCards(wallets, data);
            var walletArray = [];
            for(let widx in data) {
                walletArray.push({
                    name: data[widx].nome,
                    total: data[widx].totale
                });
            }
            generateChart(walletArray, "total", walletChart, "walletChart", "Wallet dataset-true", walletContainer);
        }
	});

    $("#addNewWallet").click(function () {
        var newWallet = {
            nome: $("#nomeInput").val(),
            icona: $("#visualizzazione").html(),
            totale: $("#totaleInput").val(),
            scadenza: swap($("#scadenzaInput").val().split("-")).join("/"),
            utilizzabile: $("#utilizzabileInput").is(":checked")
        }
        addNewWallet(newWallet).then(response => {
            window.location.reload();
        });
    });

    $("#addWalletModal").on('show.bs.modal', function () {
        $("#addEditWalletTitle").text("Nuovo Portafogli");
        $("#nomeInput").val("");
        $("#nomeInput").prop('disabled', false);
        $("#iconaInput").val("");
        $("#editWallet").hide();
        $("#addNewWallet").show();  
        $(".hiddenId").val("");
    });
});

function generateWalletCards(container, walletsData) {
    var masterRow = $("<div class='row'></div>");
    for(let walletId in walletsData) {
        var wallet = walletsData[walletId];
        var validity = wallet.scadenza !== "" ? wallet.scadenza : "nessuna scadenza";
        var col = $("<div class='col-xxl-4 col-xl-6 col-12 mb-3'></div>");
        var card = $("<div class='card h-100 test-gradient'></div>");
        var body = $("<div class='card-body my-3'></div>");
        var innercontainer = $("<div class='container-fluid p-0'></div>");
        var topRow = $("<div class='row'></div>");
        var bottomRow = $("<div class='row'></div>");
        var nameCol = $("<div class='col-9 fs-2 wallet-name'>" + wallet.nome + "</div>");
        var iconCol = $("<div class='col-3 fs-2 flex-centered'>" + wallet.icona + "</div>");
        var validCol = $("<div class='col-4 flex-so'><i>" + validity + "</i></div>");
        var totalCcol = $("<div class='col-8 fs-3 flex-se'><div>" + formatter.format(wallet.totale) + "</div></div>");
        var link = $("<a href='" + walletId + "/' class='wallet-link'><i class='fas fa-arrow-right'></i></a>");
        topRow.append(nameCol);
        topRow.append(iconCol);
        bottomRow.append(validCol);
        bottomRow.append(totalCcol);
        innercontainer.append(topRow);
        innercontainer.append(bottomRow);
        body.append(innercontainer);
        card.append(body);
        card.append(link);
        col.append(card);
        masterRow.append(col);
    }
    container.append(masterRow);
    $("[data-bs-toggle='tooltip']").tooltip();
}