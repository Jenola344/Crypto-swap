// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * CryptoSwap - Minimal AMM for a DEX UI MVP
 * ---------------------------------------------------------
 * Core:
 *  - Constant product pools (x * y = k) with 0.30% fee
 *  - Create pool, add/remove liquidity (owner-seeded for demo)
 *  - Swap with slippage + deadline protection
 *  - Quote helpers + price impact estimation (bps)
 *  - Events for transaction history (front-end indexing)
 *
 * ⚠️ Educational reference, not audited. Use at your own risk.
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address a) external view returns (uint256);
    function allowance(address o, address s) external view returns (uint256);
    function approve(address s, uint256 a) external returns (bool);
    function transfer(address to, uint256 a) external returns (bool);
    function transferFrom(address f, address t, uint256 a) external returns (bool);
    function decimals() external view returns (uint8);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library TransferHelper {
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        bool ok = token.transferFrom(from, to, value);
        require(ok, "TRANSFER_FROM_FAILED");
    }
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        bool ok = token.transfer(to, value);
        require(ok, "TRANSFER_FAILED");
    }
}

contract CryptoSwap {
    using TransferHelper for IERC20;

    // --- Admin ---
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    // --- Fees / Constants ---
    // Fee = 0.30% => fee factor 997 / 1000 (Uniswap-v2 style math)
    uint256 private constant FEE_NUM = 997;
    uint256 private constant FEE_DEN = 1000;
    uint256 private constant BPS_DEN = 10_000;

    // --- Pool Storage ---
    struct Pool {
        address token0;
        address token1;
        uint112 reserve0; // fits up to ~5e33 with 18 decimals as uint112
        uint112 reserve1;
        bool exists;
    }

    // pairKey => Pool
    mapping(bytes32 => Pool) public pools;

    // --- Events (for history/analytics) ---
    event PoolCreated(address indexed token0, address indexed token1);
    event LiquidityAdded(address indexed provider, address indexed token0, address indexed token1, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(address indexed provider, address indexed token0, address indexed token1, uint256 amount0, uint256 amount1);
    event SwapExecuted(
        address indexed trader,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 priceImpactBps
    );

    constructor() {
        owner = msg.sender;
    }

    // --- Utils ---
    function _sort(address a, address b) internal pure returns (address token0, address token1) {
        require(a != b, "IDENTICAL");
        (token0, token1) = a < b ? (a, b) : (b, a);
        require(token0 != address(0), "ZERO_ADDR");
    }

    function _pairKey(address a, address b) internal pure returns (bytes32) {
        (address t0, address t1) = _sort(a, b);
        return keccak256(abi.encodePacked(t0, t1));
    }

    function _getPool(address tokenA, address tokenB) internal view returns (Pool storage p, bool reversed) {
        (address t0, address t1) = _sort(tokenA, tokenB);
        bytes32 key = keccak256(abi.encodePacked(t0, t1));
        p = pools[key];
        require(p.exists, "POOL_NOT_FOUND");
        // reversed == true means user order is token1->token0
        reversed = (tokenA != p.token0);
    }

    function getPool(address tokenA, address tokenB) external view returns (
        address token0, address token1, uint112 reserve0, uint112 reserve1, bool exists
    ) {
        (address t0, address t1) = _sort(tokenA, tokenB);
        bytes32 key = keccak256(abi.encodePacked(t0, t1));
        Pool storage p = pools[key];
        return (p.token0, p.token1, p.reserve0, p.reserve1, p.exists);
    }

    // --- Admin: Create/Seed Pools (for demo/testing) ---
    function createPool(address tokenA, address tokenB) external onlyOwner {
        (address t0, address t1) = _sort(tokenA, tokenB);
        bytes32 key = keccak256(abi.encodePacked(t0, t1));
        require(!pools[key].exists, "POOL_EXISTS");
        pools[key] = Pool({ token0: t0, token1: t1, reserve0: 0, reserve1: 0, exists: true });
        emit PoolCreated(t0, t1);
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external onlyOwner {
        (Pool storage p, bool rev) = _getPool(tokenA, tokenB);
        (uint256 a0, uint256 a1) = rev ? (amountB, amountA) : (amountA, amountB);
        // Pull tokens from owner
        IERC20(p.token0).safeTransferFrom(msg.sender, address(this), a0);
        IERC20(p.token1).safeTransferFrom(msg.sender, address(this), a1);
        // Update reserves
        p.reserve0 = uint112(uint256(p.reserve0) + a0);
        p.reserve1 = uint112(uint256(p.reserve1) + a1);
        emit LiquidityAdded(msg.sender, p.token0, p.token1, a0, a1);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 amount0, uint256 amount1, address to) external onlyOwner {
        (Pool storage p, ) = _getPool(tokenA, tokenB);
        require(amount0 <= p.reserve0 && amount1 <= p.reserve1, "INSUFFICIENT_LIQ");
        p.reserve0 = uint112(uint256(p.reserve0) - amount0);
        p.reserve1 = uint112(uint256(p.reserve1) - amount1);
        IERC20(p.token0).safeTransfer(to, amount0);
        IERC20(p.token1).safeTransfer(to, amount1);
        emit LiquidityRemoved(msg.sender, p.token0, p.token1, amount0, amount1);
    }

    // --- Pricing Math (Uniswap v2 style) ---
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut) {
        require(amountIn > 0 && reserveIn > 0 && reserveOut > 0, "BAD_AMOUNTS");
        uint256 amountInWithFee = amountIn * FEE_NUM;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * FEE_DEN + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function quote(uint256 amountIn, address tokenIn, address tokenOut) external view returns (uint256 amountOut) {
        (Pool storage p, bool rev) = _getPool(tokenIn, tokenOut);
        (uint256 rIn, uint256 rOut) = rev ? (p.reserve1, p.reserve0) : (p.reserve0, p.reserve1);
        return getAmountOut(amountIn, rIn, rOut);
    }

    /// @notice Rough price impact in basis points (bps). For UI warnings.
    function priceImpactBps(uint256 amountIn, address tokenIn, address tokenOut) public view returns (uint256) {
        (Pool storage p, bool rev) = _getPool(tokenIn, tokenOut);
        (uint256 rIn, uint256 rOut) = rev ? (p.reserve1, p.reserve0) : (p.reserve0, p.reserve1);
        require(rIn > 0 && rOut > 0, "NO_LIQ");
        // Mid-price = rOut / rIn, execution price = amountOut / amountIn
        uint256 amountOut = getAmountOut(amountIn, rIn, rOut);
        // impact = 1 - execPrice / midPrice = 1 - ((amountOut/amountIn)/(rOut/rIn)) = 1 - (amountOut * rIn) / (amountIn * rOut)
        uint256 num = amountOut * rIn * BPS_DEN;
        uint256 den = amountIn * rOut;
        if (den == 0) return 0;
        if (num >= den) return 0; // no negative impact
        return (BPS_DEN - (num / den));
    }

    // --- Swaps ---
    /**
     * @param amountIn   Exact input amount
     * @param minOut     Slippage protection (respect UI "slippage tolerance")
     * @param to         Recipient
     * @param deadline   Unix timestamp after which the tx reverts (UI setting)
     */
    function swapExactTokensForTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minOut,
        address to,
        uint256 deadline
    ) external returns (uint256 amountOut, uint256 impactBps) {
        require(block.timestamp <= deadline, "DEADLINE_EXPIRED");
        require(amountIn > 0, "AMOUNT_ZERO");

        (Pool storage p, bool rev) = _getPool(tokenIn, tokenOut);

        // Figure reserves in the direction of tokenIn -> tokenOut
        (uint256 rIn, uint256 rOut) = rev ? (p.reserve1, p.reserve0) : (p.reserve0, p.reserve1);

        // Pull input tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Compute output
        amountOut = getAmountOut(amountIn, rIn, rOut);
        require(amountOut >= minOut, "SLIPPAGE");

        // Update reserves
        rIn += amountIn;
        rOut -= amountOut;

        if (rev) {
            p.reserve1 = uint112(rIn);
            p.reserve0 = uint112(rOut);
        } else {
            p.reserve0 = uint112(rIn);
            p.reserve1 = uint112(rOut);
        }

        // Send output tokens
        IERC20(tokenOut).safeTransfer(to, amountOut);

        // Compute price impact for UI
        impactBps = priceImpactBps(amountIn, tokenIn, tokenOut);

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut, impactBps);
    }

    // --- Front-end Helpers ---
    function poolExists(address tokenA, address tokenB) external view returns (bool) {
        (address t0, address t1) = _sort(tokenA, tokenB);
        return pools[keccak256(abi.encodePacked(t0, t1))].exists;
    }

    function reserves(address tokenA, address tokenB) external view returns (uint256 r0, uint256 r1) {
        (address t0, address t1) = _sort(tokenA, tokenB);
        Pool storage p = pools[keccak256(abi.encodePacked(t0, t1))];
        require(p.exists, "POOL_NOT_FOUND");
        return (p.reserve0, p.reserve1);
    }

    // --- Ownership ---
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDR");
        owner = newOwner;
    }
}
