// Auth Helper Content Script for Carrio Extension
// This script runs on localhost to help get authentication tokens

// Disable console logs for this script
(function () {
    const originalLog = console.log;
    console.log = function (...args) {
        // Check if this is a CARRIO AUTH log and suppress it
        if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('[CARRIO AUTH]')) {
            return;
        }
        // Allow other logs to pass through
        originalLog.apply(console, args);
    };
})();

// Function to get auth token from localStorage or cookies
function getLocalAuthToken() {
    try {
        console.log('🔐 [CARRIO AUTH] Starting token search...');
        console.log('🔐 [CARRIO AUTH] Current URL:', window.location.href);
        console.log('🔐 [CARRIO AUTH] Document cookie:', document.cookie);

        // Method 1: Check for specific Supabase auth cookie
        const targetCookieName = 'sb-icelfwwfakovrgbqfwhl-auth-token';

        // Helper function to get cookie by name
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
            return null;
        }

        const authCookieValue = getCookie(targetCookieName);
        if (authCookieValue) {
            console.log('🔐 [CARRIO AUTH] Found target auth cookie:', targetCookieName);
            console.log('🔐 [CARRIO AUTH] Cookie value length:', authCookieValue.length);
            console.log('🔐 [CARRIO AUTH] Cookie value preview:', authCookieValue.substring(0, 100) + '...');

            try {
                const decoded = decodeURIComponent(authCookieValue);
                console.log('🔐 [CARRIO AUTH] Decoded cookie preview:', decoded.substring(0, 100) + '...');

                const parsed = JSON.parse(decoded);
                console.log('🔐 [CARRIO AUTH] Parsed cookie structure:', Object.keys(parsed));

                const token = parsed.access_token || parsed.token;
                if (token) {
                    console.log('🔐 [CARRIO AUTH] Successfully extracted access token');
                    return token;
                } else {
                    console.log('🔐 [CARRIO AUTH] No access_token found in parsed data, returning full object');
                    return parsed;
                }
            } catch (parseError) {
                console.log('🔐 [CARRIO AUTH] Failed to parse cookie as JSON:', parseError);
                console.log('🔐 [CARRIO AUTH] Returning raw cookie value');
                return authCookieValue;
            }
        }

        // Method 2: Check document.cookie manually for any auth-related cookies
        console.log('🔐 [CARRIO AUTH] Target cookie not found, checking all cookies...');
        const cookies = document.cookie.split(';');
        console.log('🔐 [CARRIO AUTH] Found', cookies.length, 'total cookies');

        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            console.log('🔐 [CARRIO AUTH] Checking cookie:', name);

            if (name && (name.includes('auth') || name.includes('token') || name.includes('sb-'))) {
                console.log('🔐 [CARRIO AUTH] Found auth-related cookie:', name);

                if (value) {
                    try {
                        const decoded = decodeURIComponent(value);
                        const parsed = JSON.parse(decoded);
                        const token = parsed.access_token || parsed.token;
                        if (token) {
                            console.log('🔐 [CARRIO AUTH] Successfully extracted token from:', name);
                            return token;
                        }
                    } catch (e) {
                        console.log('🔐 [CARRIO AUTH] Could not parse cookie:', name, e.message);
                    }
                }
            }
        }

        // Method 3: Check localStorage as fallback
        console.log('🔐 [CARRIO AUTH] Checking localStorage as fallback...');
        const authKeys = Object.keys(localStorage).filter(
            (key) => key.includes('auth') || key.includes('token') || key.includes('supabase'),
        );

        console.log('🔐 [CARRIO AUTH] Found localStorage auth keys:', authKeys);

        for (const key of authKeys) {
            const value = localStorage.getItem(key);
            if (value && typeof value === 'string' && value.length > 50) {
                console.log('🔐 [CARRIO AUTH] Found potential token in localStorage key:', key);
                try {
                    const parsed = JSON.parse(value);
                    if (parsed.access_token || parsed.token) {
                        return parsed.access_token || parsed.token;
                    }
                } catch (e) {
                    // Not JSON, might be raw token
                    return value;
                }
            }
        }

        // Method 4: Try to access Supabase client directly if available
        if (window.supabase) {
            console.log('🔐 [CARRIO AUTH] Found Supabase client on window');
            return window.supabase.auth.session?.access_token;
        }

        console.log('🔐 [CARRIO AUTH] No auth token found with any method');
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error getting auth token:', error);
        return null;
    }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('🔐 [CARRIO AUTH] Received message:', message);

    if (message.type === 'GET_AUTH_TOKEN') {
        const token = getLocalAuthToken();
        console.log('🔐 [CARRIO AUTH] Sending token response:', token ? 'token found' : 'no token');
        sendResponse({
            token: token,
            url: window.location.href,
            found: !!token,
        });
    }

    if (message.type === 'CHECK_AUTH_COOKIE') {
        const targetCookieName = 'sb-icelfwwfakovrgbqfwhl-auth-token';

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
            return null;
        }

        const cookieExists = !!getCookie(targetCookieName);
        console.log('🔐 [CARRIO AUTH] Cookie exists check:', cookieExists);

        sendResponse({
            exists: cookieExists,
            url: window.location.href,
        });
    }

    return true; // Keep message channel open for async response
});

// Also try to get token immediately and store it
setTimeout(() => {
    const token = getLocalAuthToken();
    if (token) {
        console.log('🔐 [CARRIO AUTH] Token found on load, sending to background');
        chrome.runtime
            .sendMessage({
                type: 'AUTH_TOKEN_FOUND',
                token: token,
                url: window.location.href,
            })
            .catch((error) => {
                console.log('🔐 [CARRIO AUTH] Could not send to background:', error);
            });
    }
}, 1000);

// Monitor cookie changes to detect logout
let lastCookieState = document.cookie;
setInterval(() => {
    const currentCookieState = document.cookie;
    if (currentCookieState !== lastCookieState) {
        console.log('🔐 [CARRIO AUTH] Cookie state changed, checking auth status');

        const targetCookieName = 'sb-icelfwwfakovrgbqfwhl-auth-token';
        const cookieExists = currentCookieState.includes(targetCookieName);

        if (!cookieExists && lastCookieState.includes(targetCookieName)) {
            console.log('🔐 [CARRIO AUTH] Auth cookie removed - user logged out');
            chrome.runtime
                .sendMessage({
                    type: 'AUTH_TOKEN_LOST',
                    url: window.location.href,
                })
                .catch((error) => {
                    console.log('🔐 [CARRIO AUTH] Could not send logout notification:', error);
                });
        } else if (cookieExists && !lastCookieState.includes(targetCookieName)) {
            console.log('🔐 [CARRIO AUTH] Auth cookie added - user logged in');
            const token = getLocalAuthToken();
            if (token) {
                chrome.runtime
                    .sendMessage({
                        type: 'AUTH_TOKEN_FOUND',
                        token: token,
                        url: window.location.href,
                    })
                    .catch((error) => {
                        console.log('🔐 [CARRIO AUTH] Could not send login notification:', error);
                    });
            }
        }

        lastCookieState = currentCookieState;
    }
}, 2000); // Check every 2 seconds

console.log('🔐 [CARRIO AUTH] Auth helper script initialized');
