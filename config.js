// Configuration file for CryptoSwap DApp
// This file contains all the configurable settings, token data, and exchange rates

// Application Configuration
const CONFIG = {
    // App Settings
    APP_NAME: 'CryptoSwap',
    VERSION: '1.0.0',
    
    // Default Settings
    DEFAULT_SLIPPAGE: 0.5, // 0.5%
    DEFAULT_DEADLINE: 20, // 20 minutes
    MAX_SLIPPAGE: 50, // 50%
    MAX_DEADLINE: 4320, // 3 days in minutes
    
    // UI Settings
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 5000,
    PRICE_UPDATE_INTERVAL: 10000, // 10 seconds
    
    // Transaction Settings
    MIN_TRANSACTION_AMOUNT: 0.000001,
    MAX_PRICE_IMPACT_WARNING: 5, // 5%
    HIGH_PRICE_IMPACT_THRESHOLD: 10, // Amount threshold for price impact
    
    // Network Configuration
    SUPPORTED_NETWORKS: ['mainnet', 'testnet'],
    DEFAULT_NETWORK: 'mainnet'
};

// Token Configuration
const TOKENS = {
    ETH: {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: 'E',
        decimals: 18,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        coingeckoId: 'ethereum',
        address: {
            mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            testnet: '0x...'
        }
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        icon: 'U',
        decimals: 6,
        color: 'linear-gradient(135deg, #2775ca 0%, #6cb2eb 100%)',
        coingeckoId: 'usd-coin',
        address: {
            mainnet: '0xA0b86a33E6417E6e4DdC68Bc2F221Bf4AC5A68B4',
            testnet: '0x...'
        }
    },
    USDT: {
        symbol: 'USDT',
        name: 'Tether',
        icon: 'T',
        decimals: 6,
        color: 'linear-gradient(135deg, #26a17b 0%, #2dd4bf 100%)',
        coingeckoId: 'tether',
        address: {
            mainnet: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            testnet: '0x...'
        }
    },
    BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: 'B',
        decimals: 8,
        color: 'linear-gradient(135deg, #f7931a 0%, #ffb84d 100%)',
        coingeckoId: 'bitcoin',
        address: {
            mainnet: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
            testnet: '0x...'
        }
    },
    // Additional tokens can be added here
    DAI: {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        icon: 'D',
        decimals: 18,
        color: 'linear-gradient(135deg, #f5ac37 0%, #f8cc82 100%)',
        coingeckoId: 'dai',
        address: {
            mainnet: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            testnet: '0x...'
        }
    },
    LINK: {
        symbol: 'LINK',
        name: 'Chainlink',
        icon: 'L',
        decimals: 18,
        color: 'linear-gradient(135deg, #2a5ada 0%, #7c3aed 100%)',
        coingeckoId: 'chainlink',
        address: {
            mainnet: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            testnet: '0x...'
        }
    }
};

// Mock Exchange Rates (In production, these would come from an API)
const EXCHANGE_RATES = {
    // ETH pairs
    'ETH-USDC': 2100.50,
    'ETH-USDT': 2098.75,
    'ETH-BTC': 0.065432,
    'ETH-DAI': 2099.25,
    'ETH-LINK': 147.89,
    
    // USDC pairs
    'USDC-ETH': 0.00047619,
    'USDC-USDT': 0.9992,
    'USDC-BTC': 0.00003115,
    'USDC-DAI': 0.9998,
    'USDC-LINK': 0.07041,
    
    // USDT pairs
    'USDT-ETH': 0.00047658,
    'USDT-USDC': 1.0008,
    'USDT-BTC': 0.00003118,
    'USDT-DAI': 1.0006,
    'USDT-LINK': 0.07045,
    
    // BTC pairs
    'BTC-ETH': 15.284,
    'BTC-USDC': 32150.75,
    'BTC-USDT': 32175.25,
    'BTC-DAI': 32140.50,
    'BTC-LINK': 2265.33,
    
    // DAI pairs
    'DAI-ETH': 0.00047643,
    'DAI-USDC': 1.0002,
    'DAI-USDT': 0.9994,
    'DAI-BTC': 0.00003116,
    'DAI-LINK': 0.07042,
    
    // LINK pairs
    'LINK-ETH': 0.00676,
    'LINK-USDC': 14.205,
    'LINK-USDT': 14.195,
    'LINK-BTC': 0.000441,
    'LINK-DAI': 14.201
};

// Fee Configuration
const FEES = {
    TRADING_FEE: 0.003, // 0.3%
    GAS_ESTIMATES: {
        SWAP: 180000,
        APPROVE: 46000,
        TRANSFER: 21000
    },
    MINIMUM_FEES: {
        ETH: 0.001,
        USDC: 1,
        USDT: 1,
        BTC: 0.00005,
        DAI: 1,
        LINK: 0.1
    }
};

// API Endpoints (for production use)
const API_CONFIG = {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    PRICE_ENDPOINT: '/simple/price',
    UPDATE_INTERVAL: 30000, // 30 seconds
    
    // Backup APIs
    BACKUP_APIS: [
        'https://api.coinbase.com/v2/prices',
        'https://api.binance.com/api/v3/ticker/price'
    ]
};

// Supported Wallets Configuration
const WALLET_CONFIG = {
    METAMASK: {
        name: 'MetaMask',
        icon: '🦊',
        connector: 'injected'
    },
    WALLET_CONNECT: {
        name: 'WalletConnect',
        icon: '🔗',
        connector: 'walletconnect'
    },
    COINBASE_WALLET: {
        name: 'Coinbase Wallet',
        icon: '🔵',
        connector: 'coinbaseWallet'
    }
};

// Price Impact Levels
const PRICE_IMPACT_LEVELS = {
    LOW: 1,      // < 1%
    MEDIUM: 3,   // 1-3%
    HIGH: 5,     // 3-5%
    VERY_HIGH: 5 // > 5%
};

// Transaction Status Types
const TRANSACTION_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

// Theme Configuration
const THEME_CONFIG = {
    PRIMARY_COLOR: '#4A90E2',
    SECONDARY_COLOR: '#357ABD',
    SUCCESS_COLOR: '#28a745',
    ERROR_COLOR: '#dc3545',
    WARNING_COLOR: '#ffc107',
    INFO_COLOR: '#17a2b8',
    
    GRADIENTS: {
        PRIMARY: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        CARD: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        BUTTON: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
    }
};

// Error Messages
const ERROR_MESSAGES = {
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_AMOUNT: 'Please enter a valid amount',
    SAME_TOKEN: 'Cannot swap same token',
    WALLET_NOT_CONNECTED: 'Please connect your wallet',
    NETWORK_ERROR: 'Network error occurred',
    TRANSACTION_FAILED: 'Transaction failed',
    HIGH_SLIPPAGE: 'High slippage detected',
    EXPIRED_TRANSACTION: 'Transaction expired'
};

// Success Messages
const SUCCESS_MESSAGES = {
    SWAP_SUCCESS: 'Swap completed successfully!',
    WALLET_CONNECTED: 'Wallet connected successfully!',
    SETTINGS_SAVED: 'Settings saved successfully!',
    TOKEN_APPROVED: 'Token approved successfully!'
};

// Utility functions for configuration
const ConfigUtils = {
    // Get token by symbol
    getToken: (symbol) => TOKENS[symbol.toUpperCase()],
    
    // Get exchange rate
    getExchangeRate: (from, to) => EXCHANGE_RATES[`${from.toUpperCase()}-${to.toUpperCase()}`] || 0,
    
    // Get all available tokens
    getAllTokens: () => Object.values(TOKENS),
    
    // Get trading pairs
    getTradingPairs: () => Object.keys(EXCHANGE_RATES),
    
    // Format number with token decimals
    formatTokenAmount: (amount, tokenSymbol) => {
        const token = ConfigUtils.getToken(tokenSymbol);
        if (!token) return amount.toString();
        
        return Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: Math.min(token.decimals, 8)
        });
    },
    
    // Get price impact level
    getPriceImpactLevel: (impact) => {
        if (impact < PRICE_IMPACT_LEVELS.LOW) return 'low';
        if (impact < PRICE_IMPACT_LEVELS.MEDIUM) return 'medium';
        if (impact < PRICE_IMPACT_LEVELS.HIGH) return 'high';
        return 'very-high';
    },
    
    // Validate transaction amount
    isValidAmount: (amount, tokenSymbol) => {
        const numAmount = parseFloat(amount);
        return numAmount > 0 && numAmount >= CONFIG.MIN_TRANSACTION_AMOUNT;
    }
};

// Export configuration (for module systems)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        TOKENS,
        EXCHANGE_RATES,
        FEES,
        API_CONFIG,
        WALLET_CONFIG,
        PRICE_IMPACT_LEVELS,
        TRANSACTION_STATUS,
        THEME_CONFIG,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        ConfigUtils
    };
}
