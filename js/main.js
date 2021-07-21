$(document).ready(function () {
    init();
});

function init () {
    getCurrencies();
    calculateexchange();
    fillHeader();
    tableAppend();
    totalAppend();
    localStorageFunction();
}

var date,apiDate,storagePrices;

var currencySymbols = {
    'try': '₺',
    'usd': '$'
}

var total = {
    'try': 0,
    'usd': 0
}

var currencies;
var table = $('#tableBody');
var calculatedCurrencies;


function getCurrencies() {
    $.ajax({
        url: "http://data.fixer.io/api/latest?access_key=48de17dda4a5151659c8e521c0492eaa&format=1",
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            currencies = data.rates;
            apiDate = data.timestamp
        },
        error: function () {
            console.log("Error in the request");
        }
    });
}

function calculateexchange() {
    calculatedCurrencies = {
        "usd": currencies.TRY / currencies.USD,
        "gau": (currencies.TRY / currencies.XAU) / 31.103,
        "xau": (currencies.TRY / currencies.XAU),
        "eur": currencies.TRY
    }
}

function fillHeader() {
    $('#dollar').html(formatNumber(calculatedCurrencies.usd, currencySymbols.try))
    $('#gau').html(formatNumber(calculatedCurrencies.gau, currencySymbols.try))
    $('#xau').html(formatNumber(calculatedCurrencies.xau, currencySymbols.try))
    $('#euro').html(formatNumber(currencies.TRY, currencySymbols.try))
}

function formatNumber(number, symbol) {
    var result = number.toFixed(4) + symbol;
    if (symbol === currencySymbols.usd) {
        result = symbol + number.toFixed(4);
    }
    return result;
}

function tableAppend() {
    var rows = '';
    var rowClass = '';
    var prices;
    for (var i = 0; i < goldList.length; i++) {
        var list = goldList[i];

        prices = {
            'totalGram': (list.gram * list.quantity),
            'tryUnit': list.gram * calculatedCurrencies.gau,
            'dollarUnit': (list.gram* calculatedCurrencies.gau) / calculatedCurrencies.usd,
            'totalTry': (list.gram * list.quantity) * calculatedCurrencies.gau,
            'totalUsd': ((list.gram * list.quantity) * calculatedCurrencies.gau) / calculatedCurrencies.usd
        }
        rowClass = localCalculate(list, prices);
        rows += '<tr>' +
            ' <th scope="row"> ' + list.name + ' </th>' +
            '<td>' + list.quantity + '</td>' +
            '<td>' + prices.totalGram + '</td>' +
            '<td><div class="' + rowClass.tryUnit + '"></div><div class="col-lg-9 previousPrice">Previous Price: '+ formatNumber(storagePrices.tryUnit,currencySymbols.try) +'</div>' + formatNumber(prices.tryUnit, currencySymbols.try) + '</td>' +
            '<td class="' + rowClass.dollarUnit + '"><div class="previousPrice">Previous Price: '+ formatNumber(storagePrices.dollarUnit,currencySymbols.usd) +'</div>' + formatNumber(prices.dollarUnit, currencySymbols.usd) + '</td>' +
            '<td class="' + rowClass.totalTry + '"><div class="previousPrice">Previous Price: '+ formatNumber(storagePrices.totalTry,currencySymbols.try) +'</div>' + formatNumber(prices.totalTry, currencySymbols.try) + '</td>' +
            '<td class="' + rowClass.totalUsd + '"><div class="previousPrice">Previous Price: '+ formatNumber(storagePrices.totalUsd,currencySymbols.usd) +'</div>' + formatNumber(prices.totalUsd, currencySymbols.usd) + '</td>' +
            '</tr>';
        total.usd = (total.usd + ((list.gram * list.quantity) * calculatedCurrencies.gau) / calculatedCurrencies.usd);
        total.try = (total.try + (list.gram * list.quantity) * calculatedCurrencies.gau);
    }
    table.append(rows);
}

function totalAppend() {
    rows = '';
    $.each(total, function (key, value) {
        rows += '<tr>' +
            ' <td scope="row"></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>Total (' + key.toUpperCase() + ')</td>' +
            '<td>' + formatNumber(value, currencySymbols[key]) + '</td>' +
            '</tr>';
    });
    table.append(rows);
}

function localStorageFunction() {
    if (checkTime()) {
        var moneyConvert = {
            'date': date,
            'currencies': [
                {
                    'name': 'dollar',
                    'price': calculatedCurrencies.usd,
                },
                {
                    'name': 'euro',
                    'price': calculatedCurrencies.eur,
                },
                {
                    'name': 'gau',
                    'price': calculatedCurrencies.gau,
                },
                {
                    'name': 'xau',
                    'price': calculatedCurrencies.xau,
                },
            ]
        }
        localStorage.setItem("prices", JSON.stringify(moneyConvert));
    }
}

function localCalculate(list, prices) {
    var localStorageCurrencies = JSON.parse(localStorage.getItem('prices'));

    storagePrices = {
        'tryUnit': localStorageCurrencies === null ? prices.tryUnit : (list.gram * localStorageCurrencies.currencies[2].price),
        'dollarUnit': localStorageCurrencies === null ? prices.dollarUnit : ((list.gram* localStorageCurrencies.currencies[2].price) / localStorageCurrencies.currencies[0].price),
        'totalTry': localStorageCurrencies === null ? prices.totalTry : (list.gram * list.quantity) * localStorageCurrencies.currencies[2].price,
        'totalUsd': localStorageCurrencies === null ? prices.totalUsd :
            ((list.gram * list.quantity) * localStorageCurrencies.currencies[2].price) / localStorageCurrencies.currencies[0].price
    }

    var result = {
        'tryUnit': '',
        'dollarUnit': '',
        'totalTry': '',
        'totalUsd': ''
    }

    var types = {
        'down': 'fa fa-long-arrow-down',
        'up': 'fa fa-long-arrow-up'
    }

    if (prices.tryUnit > storagePrices.tryUnit) {
        result.tryUnit = types.up;
    } else if (prices.tryUnit < storagePrices.tryUnit) {
        result.tryUnit = types.down;
    }


    if (prices.dollarUnit > storagePrices.dollarUnit) {
        result.dollarUnit = types.up;
    } else if (prices.dollarUnit < storagePrices.dollarUnit) {
        result.dollarUnit = types.down;
    }


    if (prices.totalTry > storagePrices.totalTry) {
        result.totalTry = types.up;
    } else if (prices.totalTry < storagePrices.totalTry) {
        result.totalTry = types.down;
    }


    if (prices.totalUsd > storagePrices.totalUsd) {
        result.totalUsd = types.up;
    } else if (prices.totalUsd < storagePrices.totalUsd) {
        result.totalUsd = types.down;
    }
    return result;
}

function checkTime() {
    date = new Date(apiDate * 1000);
    var epochYesterday = + new Date()
    var yesterday = new Date (epochYesterday - (86400*1000))

    $('#date').append(("Last Update: "+date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds()))

    var result = false
    if (date.getDate() !== yesterday.getDate() && date.getMonth() !== yesterday.getMonth() && date.getFullYear() !== yesterday.getFullYear()  ) {
        result = true
    }
    return result;
}



