function getNavigation() {
    return $.ajax({
        url: "/api/movements/getNavigation",
        type: "get",
        dataType: "json"
    });
}

function getElaboratedYears() {
    return $.ajax({
        url: "/api/movements/getElaboratedYears",
        type: "get",
        dataType: "json"
    });
}

function getElaboratedMonths(year) {
    return $.ajax({
        url: `/api/movements/getElaboratedMonths/${year}`,
        type: "get",
        dataType: "json"
    });
}

function getElaboratedDays(year, month) {
    return $.ajax({
        url: `/api/movements/getElaboratedDays/${year}/${month}`,
        type: "get",
        dataType: "json"
    });
}

function addNewLine(newLine) {
    return $.ajax({
        url: "/api/movements/add/",
        type: "post",
        dataType: "json",
        data: newLine
    });
}

function editLine(newLine, lineId) {
    return $.ajax({
        url: `/api/movements/update/${lineId}`,
        type: "put",
        dataType: "json",
        data: newLine,
    });
}

function deleteLine(lineId) {
    return $.ajax({
        url: `/api/movements/delete/${lineId}`,
        type: "delete",
        dataType: "text",
    });
}

function getCategories() {
	return $.ajax({
		url: "/api/categories/all",
		type: "get",
		dataType: "json"
	});
}

function getElaboratedCategories() {
	return $.ajax({
		url: "/api/categories/getElaborated",
		type: "get",
		dataType: "json"
	});
}

function getFrequentDescription(categoryId, date) {
    return $.ajax({
        url: `/api/categories/getDescriptions/${categoryId}/${date}`,
        type: "get",
        dataType: "json"
    });
}

function addNewCategory(newCategory) {
    return $.ajax({
        url: "/api/categories/add/",
        type: "post",
        dataType: "json",
        data: newCategory
    });
}

function editCategory(newCategory, categoryId) {
    return $.ajax({
        url: `/api/categories/update/${categoryId}`,
        type: "put",
        dataType: "json",
        data: newCategory
    });
}

function deleteCategory(categoryId) {
    return $.ajax({
        url: `/api/categories/delete/${categoryId}`,
        type: "delete",
        dataType: "text"
    });
}

// WALLET
function getWallets() {
	return $.ajax({
		url: "/api/wallets/all",
		type: "get",
		dataType: "json"
	});
}

function getSingleWallet(walletId) {
	return $.ajax({
		url: `/api/wallets/getElaborated/${walletId}`,
		type: "get",
		dataType: "json"
	});
}

function getUsableWallets() {
	return $.ajax({
		url: "/api/wallets/getUsable",
		type: "get",
		dataType: "json"
	});
}

function addNewWallet(newWallet) {
    return $.ajax({
        url: "/api/wallets/add/",
        type: "post",
        dataType: "json",
        data: newWallet
    });
}

function editWallet(newWallet, id) {
    return $.ajax({
        url: `/api/wallets/update/${id}`,
        type: "put",
        dataType: "json",
        data: newWallet
    });
}

// TYPES
function getTypes() {
	return $.ajax({
		url: "/api/types/all",
		type: "get",
		dataType: "json"
	});
}

function getElaboratedTypes() {
	return $.ajax({
		url: "/api/types/getElaborated",
		type: "get",
		dataType: "json"
	});
}

function addNewType(newWallet) {
    return $.ajax({
        url: "/api/types/add/",
        type: "post",
        dataType: "json",
        data: newWallet
    });
}

function editType(newType, id) {
    return $.ajax({
        url: `/api/types/update/${id}`,
        type: "put",
        dataType: "json",
        data: newType
    });
}

function toggleTypeAnalitics(id) {
    return $.ajax({
        url: `/api/types/analitics/${id}`,
        type: "put",
        dataType: "json"
    });
}

function deleteType(typeId) {
    return $.ajax({
        url: `/api/types/delete/${typeId}`,
        type: "delete",
        dataType: "text"
    });
}

// RECURRENTS
function getRecurrents() {
	return $.ajax({
		url: "/api/recurrents/all",
		type: "get",
		dataType: "json"
	});
}

function getElaboratedRecurrents() {
	return $.ajax({
		url: "/api/recurrents/getElaborated",
		type: "get",
		dataType: "json"
	});
}

function addNewRecurrent(newRecurrent) {
    return $.ajax({
        url: "/api/recurrents/add/",
        type: "post",
        dataType: "json",
        data: newRecurrent
    });
}

function editRecurrent(recurrent, id) {
    return $.ajax({
        url: `/api/recurrents/update/${id}`,
        type: "put",
        dataType: "json",
        data: recurrent
    });
}

function toggleRecurrentAbility(id) {
    return $.ajax({
        url: `/api/recurrents/ability/${id}`,
        type: "put",
        dataType: "json"
    });
}

function deleteRecurrent(recurrentId) {
    return $.ajax({
        url: `/api/recurrents/delete/${recurrentId}`,
        type: "delete",
        dataType: "text"
    });
}