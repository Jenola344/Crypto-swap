// Global Variables and Configuration
const exchangeRates = {
    'ETH-USDC': 2100,
    'ETH-USDT': 2098,
    'ETH-BTC': 0.065,
    'USDC-ETH': 0.000476,
    'USDC-USDT': 0.999,
    'USDC-BTC': 0.000031,
    'USDT-ETH': 0.000477,
    'USDT-USDC': 1.001,
    'USDT-BTC': 0.000031,
    'BTC-ETH': 15.38,
    'BTC-USDC': 32258,
    'BTC-USDT': 32290
};

let currentPayToken = 'ETH';
let currentReceiveToken = 'USDC';
let isConnected = false;
let transactions = [];

// Token Configuration
const tokenConfig = {
    'ETH': {
        name: 'Ethereum',
        icon: 'E',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    'USDC': {
        name: 'USD Coin',
        icon: 'U',
        color: 'linear-gradient(135deg, #2775ca 0%, #6cb2eb 100%)'
    },
    'USDT': {
        name: 'Tether',
        icon: 'T',
        color: 'linear-gradient(135deg, #26a17b 0%, #2dd4bf 100%)'
    },
    'BTC': {
        name: 'Bitcoin',
        icon: 'B',
        color: 'linear-gradient(135deg, #f7931a 0%, #ffb84d 100%)'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Setup network selector
    setupNetworkSelector();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.token-selector')) {
            closeAllDropdowns();
        }
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeSettings();
        }
    });
    
    // Initial calculation
    calculateSwap();
}

function setupEventListeners() {
    // Amount input validation
    const payAmountInput = document.getElementById('payAmount');
    payAmountInput.addEventListener('input', function(e) {
        // Prevent negative numbers
        if (e.target.value < 0) {
            e.target.value = 0;
        }
        calculateSwap();
    });
    
    //
