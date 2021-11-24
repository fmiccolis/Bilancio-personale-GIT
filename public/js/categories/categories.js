$(document).ready(function() {
    var categories = $("#categories");
    getElaboratedCategories().then(data => {
        if(data.hasOwnProperty("empty")) {
            categories.append($("<div class='alert alert-info' role='alert'>Il database è vuoto—Aggiungi una nuova categoria con l'apposito pulsante!</div>"));
        } else if(data.hasOwnProperty("error")) {
            categories.append($("<div class='alert alert-danger' role='alert'>C'è un errore nel database—Richiedi assistenza!</div>"));
        } else {
            generateCategoryBoxes(categories, data);
            generateChart(data, "usages", categoriesChart, "categoryChart", "Category dataset-false", categoriesContainer);
        }
	});

    $("#addNewCate").click(function () {
        var newCate = {
            nome: $("#nomeInput").val(),
            icona: $("#visualizzazione").html(),
            colore: $("#coloreInput").val()
        }
        addNewCategory(newCate).then(response => {
            window.location.reload();
        });
    });

    $("#addCateModal").on('show.bs.modal', function (event) {
        var isEdit = event.relatedTarget.classList.contains("category-card");
        $("#visualizzazione").empty();
        $("#deleteCate").hide();
        if(isEdit) { //edit category
            var card = $(event.relatedTarget);
            var categoryName = card.find(".card-header").text().toLowerCase();
            var categoryId = card.data("category-id");
            var usages = card.data("usages");
            $("#nomeInput").val(categoryName);
            $("#nomeInput").prop('disabled', true);
            $("#iconaInput").val(card.find(".cat-icon").html());
            $("#coloreInput").val(rgb2hex(card.find(".color-box").css("background-color")));
            $("#visualizzazione").append(card.find(".cat-icon").html());
            $("#addEditCategoryTitle").text(`Modifica Categoria - ${categoryName}`);
            if(usages == 0) $("#deleteCate").show();
            $("#editCate").show();
			$("#addNewCate").hide();
            $(".hiddenId").val(categoryId);
        } else { //new category
            $("#addEditCategoryTitle").text("Nuova Categoria");
            $("#nomeInput").val("");
            $("#nomeInput").prop('disabled', false);
            $("#iconaInput").val("");
            $("#coloreInput").val("");
            $("#editCate").hide();
			$("#addNewCate").show();  
            $(".hiddenId").val("");
        }
    });

    $("#editCate").click(function() {
        var cateId = $(this).closest(".modal-content").find(".hiddenId").val();
        var updatedData = {
            nome: $("#nomeInput").val(),
            icona: $("#visualizzazione").html(),
            colore: $("#coloreInput").val()
        }
        //console.log(updatedData);
        editCategory(updatedData, cateId).then(response => {
            window.location.reload();
        });
    });

    $("#deleteCate").click(function() {
        var cateId = $(this).closest(".modal-content").find(".hiddenId").val();
        deleteCategory(cateId).then(response => {
            window.location.reload();
        });
    });
});

function generateCategoryBoxes(container, categoriesData) {
    categoriesData.forEach(function(category) {
        let col3 = $("<div class='col-xxl-2 col-xl-4 col-6 mb-3'></div>");
        let card = $("<div class='card text-center category-card' data-bs-toggle='modal' data-bs-target='#addCateModal' data-category-id='" + category.id + "' data-usages='" + category.usages + "'></div>");
        let header = $("<div class='card-header text-truncate'>" + category.name.toUpperCase() + "</div>");
        let body = $("<div class='card-body fs-1'><div class='cat-icon'>" + category.icon + "</div></div>");
        let colorBox = $("<div class='color-box' style='background-color: " + category.color + "'></div>");
        body.append(colorBox);
        let footer = $("<div class='card-footer text-muted'>utilizzato " + category.usages + " volt" + (category.usages == 1 ? "a" : "e") + "<br>in media " + formatter.format(category.avarage) + "<br>per volta</div>");
        card.append(header);
        card.append(body);
        card.append(footer);
        col3.append(card);
        container.append(col3);
    });
}