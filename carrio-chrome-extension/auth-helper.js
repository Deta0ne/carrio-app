/**
 * Auth Helper Content Script for Carrio Extension
 * Runs on localhost to help get authentication tokens from Supabase
 * Provides secure token extraction and monitoring capabilities
 */

// ===== CONSOLE LOG SUPPRESSION =====
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

// ===== CONFIGURATION =====
const AUTH_CONFIG = {
    TARGET_COOKIE_NAME: 'sb-icelfwwfakovrgbqfwhl-auth-token',
    COOKIE_CHECK_INTERVAL: 2000,
    TOKEN_EXTRACTION_DELAY: 1000,
    SUPPORTED_AUTH_PATTERNS: ['auth', 'token', 'sb-', 'supabase'],
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error getting cookie:', error);
        return null;
    }
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @returns {object|null} Parsed object or null if invalid
 */
function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
}

/**
 * Extract access token from parsed auth data
 * @param {object} authData - Parsed authentication data
 * @returns {string|null} Access token or null
 */
function extractAccessToken(authData) {
    if (!authData || typeof authData !== 'object') {
        return null;
    }
    return authData.access_token || authData.token || null;
}

// ===== MAIN TOKEN EXTRACTION =====

/**
 * Get authentication token from localStorage or cookies
 * @returns {string|null} Authentication token or null if not found
 */
function getLocalAuthToken() {
    try {
        console.log('🔐 [CARRIO AUTH] Starting token search...');
        console.log('🔐 [CARRIO AUTH] Current URL:', window.location.href);

        // Method 1: Check for specific Supabase auth cookie
        const authCookieValue = getCookie(AUTH_CONFIG.TARGET_COOKIE_NAME);
        if (authCookieValue) {
            console.log('🔐 [CARRIO AUTH] Found target auth cookie:', AUTH_CONFIG.TARGET_COOKIE_NAME);
            console.log('🔐 [CARRIO AUTH] Cookie value length:', authCookieValue.length);

            try {
                const decoded = decodeURIComponent(authCookieValue);
                const parsed = safeJsonParse(decoded);

                if (parsed) {
                    console.log('🔐 [CARRIO AUTH] Parsed cookie structure:', Object.keys(parsed));
                    const token = extractAccessToken(parsed);

                    if (token) {
                        console.log('🔐 [CARRIO AUTH] Successfully extracted access token');
                        return token;
                    } else {
                        console.log('🔐 [CARRIO AUTH] No access_token found in parsed data, returning full object');
                        return parsed;
                    }
                } else {
                    console.log('🔐 [CARRIO AUTH] Failed to parse cookie as JSON, returning raw value');
                    return authCookieValue;
                }
            } catch (decodeError) {
                console.log('🔐 [CARRIO AUTH] Failed to decode cookie:', decodeError);
                return authCookieValue;
            }
        }

        // Method 2: Check all cookies for auth-related patterns
        console.log('🔐 [CARRIO AUTH] Target cookie not found, checking all cookies...');
        const authToken = findAuthTokenInCookies();
        if (authToken) {
            return authToken;
        }

        // Method 3: Check localStorage as fallback
        console.log('🔐 [CARRIO AUTH] Checking localStorage as fallback...');
        const localStorageToken = findAuthTokenInLocalStorage();
        if (localStorageToken) {
            return localStorageToken;
        }

        // Method 4: Try to access Supabase client directly if available
        const supabaseToken = getSupabaseDirectToken();
        if (supabaseToken) {
            return supabaseToken;
        }

        console.log('🔐 [CARRIO AUTH] No auth token found with any method');
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error getting auth token:', error);
        return null;
    }
}

/**
 * Find auth token in cookies by checking various patterns
 * @returns {string|null} Found auth token or null
 */
function findAuthTokenInCookies() {
    try {
        const cookies = document.cookie.split(';');
        console.log('🔐 [CARRIO AUTH] Found', cookies.length, 'total cookies');

        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');

            if (name && AUTH_CONFIG.SUPPORTED_AUTH_PATTERNS.some((pattern) => name.includes(pattern))) {
                console.log('🔐 [CARRIO AUTH] Found auth-related cookie:', name);

                if (value) {
                    try {
                        const decoded = decodeURIComponent(value);
                        const parsed = safeJsonParse(decoded);

                        if (parsed) {
                            const token = extractAccessToken(parsed);
                            if (token) {
                                console.log('🔐 [CARRIO AUTH] Successfully extracted token from:', name);
                                return token;
                            }
                        }
                    } catch (e) {
                        console.log('🔐 [CARRIO AUTH] Could not parse cookie:', name, e.message);
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error finding auth token in cookies:', error);
        return null;
    }
}

/**
 * Find auth token in localStorage
 * @returns {string|null} Found auth token or null
 */
function findAuthTokenInLocalStorage() {
    try {
        const authKeys = Object.keys(localStorage).filter((key) =>
            AUTH_CONFIG.SUPPORTED_AUTH_PATTERNS.some((pattern) => key.includes(pattern)),
        );

        console.log('🔐 [CARRIO AUTH] Found localStorage auth keys:', authKeys);

        for (const key of authKeys) {
            const value = localStorage.getItem(key);
            if (value && typeof value === 'string' && value.length > 50) {
                console.log('🔐 [CARRIO AUTH] Found potential token in localStorage key:', key);

                const parsed = safeJsonParse(value);
                if (parsed) {
                    const token = extractAccessToken(parsed);
                    if (token) {
                        return token;
                    }
                } else {
                    // Not JSON, might be raw token
                    return value;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error finding auth token in localStorage:', error);
        return null;
    }
}

/**
 * Get auth token directly from Supabase client if available
 * @returns {string|null} Supabase auth token or null
 */
function getSupabaseDirectToken() {
    try {
        if (window.supabase) {
            console.log('🔐 [CARRIO AUTH] Found Supabase client on window');
            return window.supabase.auth.session?.access_token || null;
        }
        return null;
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error getting Supabase direct token:', error);
        return null;
    }
}

// ===== MESSAGE HANDLERS =====

/**
 * Listen for messages from background script and handle auth requests
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('🔐 [CARRIO AUTH] Received message:', message);

    try {
        switch (message.type) {
            case 'GET_AUTH_TOKEN':
                handleGetAuthToken(sendResponse);
                break;

            case 'CHECK_AUTH_COOKIE':
                handleCheckAuthCookie(sendResponse);
                break;

            default:
                console.log('🔐 [CARRIO AUTH] Unknown message type:', message.type);
                sendResponse({ error: 'Unknown message type' });
        }
    } catch (error) {
        console.error('🔐 [CARRIO AUTH] Error handling message:', error);
        sendResponse({ error: error.message });
    }

    return true; // Keep message channel open for async response
});

/**
 * Handle GET_AUTH_TOKEN message
 * @param {function} sendResponse - Response callback
 */
function handleGetAuthToken(sendResponse) {
    const token = getLocalAuthToken();
    console.log('🔐 [CARRIO AUTH] Sending token response:', token ? 'token found' : 'no token');

    sendResponse({
        token: token,
        url: window.location.href,
        found: Boolean(token),
        timestamp: Date.now(),
    });
}

/**
 * Handle CHECK_AUTH_COOKIE message
 * @param {function} sendResponse - Response callback
 */
function handleCheckAuthCookie(sendResponse) {
    const cookieExists = Boolean(getCookie(AUTH_CONFIG.TARGET_COOKIE_NAME));
    console.log('🔐 [CARRIO AUTH] Cookie exists check:', cookieExists);

    sendResponse({
        exists: cookieExists,
        url: window.location.href,
        timestamp: Date.now(),
    });
}

// ===== INITIALIZATION AND MONITORING =====

/**
 * Initialize auth helper and check for existing tokens
 */
function initializeAuthHelper() {
    setTimeout(() => {
        const token = getLocalAuthToken();
        if (token) {
            console.log('🔐 [CARRIO AUTH] Token found on load, sending to background');
            chrome.runtime
                .sendMessage({
                    type: 'AUTH_TOKEN_FOUND',
                    token: token,
                    url: window.location.href,
                    timestamp: Date.now(),
                })
                .catch((error) => {
                    console.log('🔐 [CARRIO AUTH] Could not send to background:', error);
                });
        }
    }, AUTH_CONFIG.TOKEN_EXTRACTION_DELAY);
}

/**
 * Monitor cookie changes to detect authentication state changes
 */
function setupCookieMonitoring() {
    let lastCookieState = document.cookie;

    setInterval(() => {
        const currentCookieState = document.cookie;
        if (currentCookieState !== lastCookieState) {
            console.log('🔐 [CARRIO AUTH] Cookie state changed, checking auth status');

            const cookieExists = currentCookieState.includes(AUTH_CONFIG.TARGET_COOKIE_NAME);
            const wasAuthenticated = lastCookieState.includes(AUTH_CONFIG.TARGET_COOKIE_NAME);

            if (!cookieExists && wasAuthenticated) {
                console.log('🔐 [CARRIO AUTH] Auth cookie removed - user logged out');
                chrome.runtime
                    .sendMessage({
                        type: 'AUTH_TOKEN_LOST',
                        url: window.location.href,
                        timestamp: Date.now(),
                    })
                    .catch((error) => {
                        console.log('🔐 [CARRIO AUTH] Could not send logout notification:', error);
                    });
            } else if (cookieExists && !wasAuthenticated) {
                console.log('🔐 [CARRIO AUTH] Auth cookie added - user logged in');
                const token = getLocalAuthToken();
                if (token) {
                    chrome.runtime
                        .sendMessage({
                            type: 'AUTH_TOKEN_FOUND',
                            token: token,
                            url: window.location.href,
                            timestamp: Date.now(),
                        })
                        .catch((error) => {
                            console.log('🔐 [CARRIO AUTH] Could not send login notification:', error);
                        });
                }
            }

            lastCookieState = currentCookieState;
        }
    }, AUTH_CONFIG.COOKIE_CHECK_INTERVAL);
}

// ===== STARTUP =====

// Initialize the auth helper
initializeAuthHelper();
setupCookieMonitoring();

console.log('🔐 [CARRIO AUTH] Auth helper script initialized successfully');
