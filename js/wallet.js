// Wallet state
let walletAddress = null;

// Check if wallet is connected
window.isWalletConnected = () => {
    return walletAddress !== null;
};

// Connect wallet function
window.connectWallet = async () => {
    try {
        const provider = window?.phantom?.solana;
        
        if (!provider?.isPhantom) {
            window.open('https://phantom.app/', '_blank');
            return;
        }

        const { publicKey } = await provider.connect();
        walletAddress = publicKey.toString();
        
        // Update UI for all wallet-related elements
        updateUI(true);

        // Add disconnect handler
        const connectBtn = document.getElementById('connect-wallet');
        if (connectBtn) {
            connectBtn.addEventListener('contextmenu', async (e) => {
                e.preventDefault();
                await provider.disconnect();
                disconnectWallet();
            });
        }

        return walletAddress;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        return null;
    }
};

// Disconnect wallet function
const disconnectWallet = () => {
    walletAddress = null;
    updateUI(false);
};

// Handle wallet button click to toggle connect/disconnect
window.handleWalletClick = async () => {
    if (walletAddress) {
        if (confirm('Do you want to disconnect your wallet?')) {
            await disconnectWallet();
        }
    } else {
        await connectWallet();
    }
};

// Handle main play button click
window.handleMainPlayClick = async () => {
    if (!walletAddress) {
        await connectWallet();
    }
};

// Update all UI elements
function updateUI(isConnected) {
    // Header buttons
    const connectButton = document.getElementById('connect-wallet');
    const playBtn = document.getElementById('play-btn');
    
    // Content container buttons
    const mainPlayBtn = document.querySelector('.button-container .play-game');
    const mainBuyBtn = document.querySelector('.button-container .buy-tromp');
    
    if (isConnected) {
        // Update header connect button
        if (connectButton) {
            connectButton.textContent = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
            connectButton.classList.add('connected');
        }
        
        // Update header play button
        if (playBtn) {
            playBtn.style.display = 'block';
            playBtn.href = `https://taymcquaya.github.io/GameTest/?wallet=${encodeURIComponent(walletAddress)}`;
        }
        
        // Update main connect/play button
        if (mainPlayBtn) {
            mainPlayBtn.textContent = 'PLAY GAME';
            mainPlayBtn.onclick = () => {
                window.location.href = `https://taymcquaya.github.io/GameTest/?wallet=${encodeURIComponent(walletAddress)}`;
            };
        }
    } else {
        // Reset header connect button
        if (connectButton) {
            connectButton.textContent = 'Connect Wallet';
            connectButton.classList.remove('connected');
        }
        
        // Reset header play button
        if (playBtn) {
            playBtn.style.display = 'none';
        }
        
        // Reset main connect/play button
        if (mainPlayBtn) {
            mainPlayBtn.textContent = 'CONNECT WALLET';
            mainPlayBtn.onclick = handleMainPlayClick;
        }
    }
} 