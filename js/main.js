// API для получения курсов валют
const API_URL = 'https://api.exchangerate-api.com/v4/latest/RUB';

let exchangeRates = {};
let lastUpdate = '';

// Элементы DOM
const amountInput = document.getElementById('amount-input');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultOutput = document.getElementById('result-output');
const rateInfo = document.getElementById('rate-info');
const updateTime = document.getElementById('update-time');
const swapBtn = document.getElementById('swap-btn');

// Получение курсов валют
async function fetchExchangeRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        exchangeRates = data.rates;
        lastUpdate = new Date(data.date).toLocaleString();
        
        updateTime.textContent = `Курсы обновлены: ${lastUpdate}`;
        rateInfo.textContent = 'Курсы загружены';
        calculate();
    } catch (error) {
        console.error('Ошибка при получении курсов:', error);
        rateInfo.textContent = 'Ошибка загрузки курсов. Используются последние известные значения.';
        
        // Резервные курсы на случай ошибки
        exchangeRates = {
            RUB: 1,
            USD: 90.5,
            EUR: 98.3,
            CNY: 12.7,
            KZT: 0.2
        };
        calculate();
    }
}

// Расчет конвертации
function calculate() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    if (isNaN(amount) || amount < 0) {
        resultOutput.value = '';
        return;
    }
    
    if (exchangeRates[from] && exchangeRates[to]) {
        // Конвертируем через RUB как базовую валюту
        const rubAmount = amount / exchangeRates[from];
        const result = rubAmount * exchangeRates[to];
        
        resultOutput.value = result.toFixed(2);
        
        // Отображение курса
        const rate = (exchangeRates[to] / exchangeRates[from]).toFixed(4);
        rateInfo.textContent = `1 ${from} = ${rate} ${to}`;
    }
}

// Обмен валют местами
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    calculate();
}

// Слушатели событий
amountInput.addEventListener('input', calculate);
fromCurrency.addEventListener('change', calculate);
toCurrency.addEventListener('change', calculate);
swapBtn.addEventListener('click', swapCurrencies);

// Инициализация
fetchExchangeRates();
