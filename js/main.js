document.addEventListener("DOMContentLoaded", function() {
    init();
});
function init() {
    getCurrencies();
    calculateExchange();
    fillHeader();
    tableAppend();
    totalAppend();
    localStorageFunction();
}
let date, apiDate, storagePrices;
let currencySymbols = {
    'try': '₺',
    'usd': '$'
};
let total = {
    'try': 0,
    'usd': 0
};

let currencies;
let table = document.getElementById('tableBody');
let calculatedCurrencies;
function getCurrencies() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://data.fixer.io/api/latest?access_key=YOUR_API_KEY", false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            currencies = data.rates;
            apiDate = data.timestamp;
        } else {
            console.log("Error in the request");
        }
    };
    xhr.send();
}
function calculateExchange() {
    calculatedCurrencies = {
        "usd": currencies.TRY / currencies.USD,
        "gau": (currencies.TRY / currencies.XAU) / 31.103,
        "xau": (currencies.TRY / currencies.XAU),
        "eur": currencies.TRY
    };
}
function fillHeader() {
    document.getElementById('dollar').innerHTML = formatNumber(calculatedCurrencies.usd, currencySymbols.try);
    document.getElementById('gau').innerHTML = formatNumber(calculatedCurrencies.gau, currencySymbols.try);
    document.getElementById('xau').innerHTML = formatNumber(calculatedCurrencies.xau, currencySymbols.try);
    document.getElementById('euro').innerHTML = formatNumber(currencies.TRY, currencySymbols.try);
}
function formatNumber(number, symbol) {
    let result = number.toFixed(4) + symbol;
    if (symbol === currencySymbols.usd) {
        result = symbol + number.toFixed(4);
    }
    return result;
}

function tableAppend() {
    let rows = '';
    let rowClass = '';
    let prices;
    for (let i = 0; i < goldList.length; i++) {
        let list = goldList[i];

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
    document.getElementById('tableBody').innerHTML = rows;
}

function totalAppend() {
    rows = '';
    Object.keys(total).forEach(function(key) {
        rows += '<tr>' +
            ' <td scope="row"></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>Total (' + key.toUpperCase() + ')</td>' +
            '<td>' + formatNumber(total[key], currencySymbols[key]) + '</td>' +
            '</tr>';
    });
    document.getElementById('tableBody').innerHTML += rows;
}

function localStorageFunction() {
    if (checkTime()) {
        let moneyConvert = {
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
    let localStorageCurrencies = JSON.parse(localStorage.getItem('prices'));

    storagePrices = {
        'tryUnit': localStorageCurrencies === null ? prices.tryUnit : (list.gram * localStorageCurrencies.currencies[2].price),
        'dollarUnit': localStorageCurrencies === null ? prices.dollarUnit : ((list.gram* localStorageCurrencies.currencies[2].price) / localStorageCurrencies.currencies[0].price),
        'totalTry': localStorageCurrencies === null ? prices.totalTry : (list.gram * list.quantity) * localStorageCurrencies.currencies[2].price,
        'totalUsd': localStorageCurrencies === null ? prices.totalUsd :
            ((list.gram * list.quantity) * localStorageCurrencies.currencies[2].price) / localStorageCurrencies.currencies[0].price
    }

    let result = {
        'tryUnit': '',
        'dollarUnit': '',
        'totalTry': '',
        'totalUsd': ''
    }

    let types = {
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
    let epochYesterday = + new Date()
    let yesterday = new Date (epochYesterday - (86400*1000))

    document.getElementById('date').innerHTML = ("Last Update: "+date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds());

    let result = false
    if (date.getDate() !== yesterday.getDate() && date.getMonth() !== yesterday.getMonth() && date.getFullYear() !== yesterday.getFullYear()  ) {
        result = true
    }
    return result;
}
