// Carrio Chrome Extension Background Script

// ===== CONSTANTS =====
const CONFIG = {
    // Production URL - Vercel deployment takes priority
    API_BASE_URL: 'https://carrio-app.vercel.app',
    TIMEOUT: 10000, // 10 seconds timeout
    DEBUG: false,
    MAX_RETRY_ATTEMPTS: 3,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

const API_ENDPOINTS = {
    CHECK_APPLICATION: '/api/applications/check',
    CREATE_APPLICATION: '/api/applications/create',
    GET_APPLICATIONS: '/api/applications',
    VALIDATE_TOKEN: '/api/auth/validate',
};

const AUTH_COOKIE_PATTERNS = [
    'sb-icelfwwfakovrgbqfwhl-auth-token',
    'sb-localhost-auth-token',
    'supabase-auth-token',
    'supabase.auth.token',
];

const SUPPORTED_DOMAINS = [
    'https://carrio-app.vercel.app',
    'https://carrio.netlify.app',
    'http://localhost:3000',
    'https://localhost:3000',
    'https://carrio.app',
];

// ===== GLOBAL STATE =====
let cachedAuthToken = null;
let extensionSettings = {
    autoTracking: true,
    notifications: true,
};

// ===== UTILITY FUNCTIONS =====
function debugLog(...args) {
    // Logs disabled for performance
}

/**
 * Creates a timeout promise for fetch requests
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Promise that rejects after timeout
 */
function createTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
}

/**
 * Enhanced fetch with timeout and retry logic
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<Response>} Fetch response
 */
async function enhancedFetch(url, options = {}, retries = CONFIG.MAX_RETRY_ATTEMPTS) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            // Wait before retry (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }
}

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @returns {object|null} Parsed object or null if invalid
 */
function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        debugLog('JSON parse error:', error);
        return null;
    }
}

/**
 * Extracts access token from cookie data
 * @param {string} cookieValue - Raw cookie value
 * @returns {string|null} Access token or null
 */
function extractAccessToken(cookieValue) {
    try {
        const decodedValue = decodeURIComponent(cookieValue);
        const tokenData = safeJsonParse(decodedValue);

        if (tokenData) {
            return tokenData.access_token || tokenData.token || null;
        }

        return cookieValue;
    } catch (error) {
        debugLog('Token extraction error:', error);
        return cookieValue;
    }
}

// ===== AUTH FUNCTIONS (PRESERVED FLOW) =====

// Get auth token from cookies
async function getAuthToken() {
    try {
        // First check if we have a cached token from localhost
        if (cachedAuthToken) {
            debugLog('Have cached token, verifying it is still valid...');

            // Verify the cached token is still valid by checking if cookie still exists
            const isStillValid = await verifyCachedToken();
            if (isStillValid) {
                debugLog('Using cached auth token from localhost');
                return cachedAuthToken;
            } else {
                debugLog('Cached token is invalid, clearing cache and getting new token');
                cachedAuthToken = null;
            }
        }

        // Try to get token from localStorage via content script
        try {
            const tabs = await chrome.tabs.query({});
            const appTabs = tabs.filter(
                (tab) =>
                    tab.url &&
                    (tab.url.includes('carrio-app.vercel.app') ||
                        tab.url.includes('carrio.netlify.app') ||
                        tab.url.includes('localhost:3000') ||
                        tab.url.includes('127.0.0.1:3000')),
            );

            if (appTabs.length > 0) {
                debugLog(`Found ${appTabs.length} Carrio app tabs, trying to get token`);

                for (const tab of appTabs) {
                    try {
                        const result = await chrome.tabs.sendMessage(tab.id, {
                            type: 'GET_AUTH_TOKEN',
                        });

                        if (result && result.token) {
                            debugLog('Got token from Carrio app tab');
                            cachedAuthToken = result.token;
                            return result.token;
                        }
                    } catch (scriptError) {
                        debugLog('Error getting token from tab:', scriptError);
                    }
                }
            }
        } catch (tabError) {
            debugLog('Error accessing Carrio app tabs:', tabError);
        }

        // Check multiple domains for the auth token
        debugLog('Starting cookie search across domains:', SUPPORTED_DOMAINS);

        for (const domain of SUPPORTED_DOMAINS) {
            try {
                debugLog(`Checking domain: ${domain}`);

                // Get ALL cookies for this domain to debug
                const allCookies = await chrome.cookies.getAll({
                    url: domain,
                });

                debugLog(
                    `Found ${allCookies.length} cookies for ${domain}:`,
                    allCookies.map((c) => ({
                        name: c.name,
                        domain: c.domain,
                        value: c.value.substring(0, 50) + '...',
                    })),
                );

                // Look for Supabase auth cookies (different patterns)
                for (const pattern of AUTH_COOKIE_PATTERNS) {
                    const cookies = await chrome.cookies.getAll({
                        url: domain,
                        name: pattern,
                    });

                    if (cookies.length > 0) {
                        const tokenCookie = cookies[0];
                        debugLog('Found auth token cookie:', tokenCookie.name, 'from domain:', domain);
                        debugLog('Cookie value preview:', tokenCookie.value.substring(0, 100) + '...');

                        const token = extractAccessToken(tokenCookie.value);
                        if (token) {
                            cachedAuthToken = token;
                            return token;
                        }
                    }
                }

                // Also check for any cookie that contains 'auth' or 'token'
                const authRelatedCookies = allCookies.filter(
                    (cookie) =>
                        cookie.name.toLowerCase().includes('auth') ||
                        cookie.name.toLowerCase().includes('token') ||
                        cookie.name.startsWith('sb-'),
                );

                if (authRelatedCookies.length > 0) {
                    debugLog(
                        'Found auth-related cookies:',
                        authRelatedCookies.map((c) => c.name),
                    );
                }
            } catch (domainError) {
                debugLog('Error checking domain:', domain, domainError);
            }
        }

        debugLog('No auth token found in any domain');
        return null;
    } catch (error) {
        debugLog('Error getting auth token:', error);
        return null;
    }
}

// ===== API FUNCTIONS =====

/**
 * Check if application already exists
 * @param {object} jobData - Job data to check
 * @param {string} authToken - Authentication token
 * @returns {Promise<boolean>} True if application exists
 */
async function checkApplicationExists(jobData, authToken) {
    try {
        const response = await enhancedFetch(`${CONFIG.API_BASE_URL}${API_ENDPOINTS.CHECK_APPLICATION}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                company_name: jobData.company_name,
                position: jobData.position,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            return Boolean(result.exists);
        }

        return false;
    } catch (error) {
        debugLog('Error checking application existence:', error);
        return false;
    }
}

/**
 * Create application via API
 * @param {object} jobData - Job data to create
 * @param {string} authToken - Authentication token
 * @returns {Promise<object>} Creation result
 */
async function createApplication(jobData, authToken) {
    try {
        debugLog('Creating application with data:', jobData);

        const applicationData = {
            company_name: jobData.company_name,
            position: jobData.position,
            status: 'pending',
            application_date: new Date().toISOString().split('T')[0],
            source: 'LinkedIn',
            company_website: jobData.jobUrl || null,
        };

        const response = await enhancedFetch(`${CONFIG.API_BASE_URL}${API_ENDPOINTS.CREATE_APPLICATION}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(applicationData),
        });

        const result = await response.json();

        if (response.ok) {
            debugLog('Application created successfully:', result);
            return { success: true, data: result };
        } else {
            debugLog('Failed to create application:', result);
            return {
                success: false,
                error: result.error || 'Failed to create application',
            };
        }
    } catch (error) {
        debugLog('Error creating application:', error);
        return {
            success: false,
            error: error.message || 'Network error',
        };
    }
}

/**
 * Verify if cached token is still valid
 * @returns {Promise<boolean>} True if token is valid
 */
async function verifyCachedToken() {
    try {
        // Method 1: Check if the cookie still exists in Carrio app tabs
        const tabs = await chrome.tabs.query({});
        const appTabs = tabs.filter(
            (tab) =>
                tab.url &&
                (tab.url.includes('carrio-app.vercel.app') ||
                    tab.url.includes('carrio.netlify.app') ||
                    tab.url.includes('localhost:3000') ||
                    tab.url.includes('127.0.0.1:3000')),
        );

        if (appTabs.length > 0) {
            for (const tab of appTabs) {
                try {
                    const result = await chrome.tabs.sendMessage(tab.id, {
                        type: 'CHECK_AUTH_COOKIE',
                    });

                    if (result?.exists) {
                        debugLog('Auth cookie still exists, cached token is valid');
                        return true;
                    }
                } catch (scriptError) {
                    debugLog('Error checking auth cookie:', scriptError);
                }
            }
        }

        // Method 2: Try to validate token with API
        if (cachedAuthToken) {
            try {
                const response = await enhancedFetch(`${CONFIG.API_BASE_URL}${API_ENDPOINTS.CHECK_APPLICATION}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cachedAuthToken}`,
                    },
                    body: JSON.stringify({
                        company_name: 'test',
                        position: 'test',
                    }),
                });

                // If we get 401, token is invalid
                if (response.status === 401) {
                    debugLog('Token validation failed with 401, token is invalid');
                    return false;
                }

                debugLog('Token validation successful');
                return true;
            } catch (apiError) {
                debugLog('Token validation error:', apiError);
                return false;
            }
        }

        debugLog('No Carrio app tabs found and no valid token');
        return false;
    } catch (error) {
        debugLog('Error verifying cached token:', error);
        return false;
    }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debugLog('Received message:', message);

    if (message.type === 'TRACK_APPLICATION') {
        handleTrackApplication(message.data)
            .then((response) => {
                debugLog('Sending response to content script:', response);
                sendResponse(response);
            })
            .catch((error) => {
                debugLog('Error handling track application:', error);
                sendResponse({
                    success: false,
                    error: error.message || 'Unknown error occurred',
                });
            });

        // Return true to indicate we'll send response asynchronously
        return true;
    }

    if (message.type === 'GET_AUTH_STATUS') {
        handleGetAuthStatus()
            .then((response) => {
                sendResponse(response);
            })
            .catch((error) => {
                sendResponse({ authenticated: false, error: error.message });
            });

        return true;
    }

    if (message.type === 'AUTH_TOKEN_FOUND') {
        debugLog('Auth token received from Carrio app:', message.token ? 'token present' : 'no token');
        cachedAuthToken = message.token;

        // Notify popup if it's open
        chrome.runtime
            .sendMessage({
                type: 'AUTH_STATUS_CHANGED',
                authenticated: !!message.token,
            })
            .catch(() => {
                // Popup might not be open, ignore error
            });

        sendResponse({ received: true });
        return true;
    }

    if (message.type === 'AUTH_TOKEN_LOST') {
        debugLog('Auth token lost - user logged out');
        cachedAuthToken = null;

        // Notify popup if it's open
        chrome.runtime
            .sendMessage({
                type: 'AUTH_STATUS_CHANGED',
                authenticated: false,
            })
            .catch(() => {
                // Popup might not be open, ignore error
            });

        sendResponse({ received: true });
        return true;
    }

    if (message.type === 'GET_SETTINGS') {
        sendResponse(extensionSettings);
        return true;
    }

    if (message.type === 'UPDATE_SETTINGS') {
        extensionSettings.autoTracking = message.autoTracking ?? extensionSettings.autoTracking;
        extensionSettings.notifications = message.notifications ?? extensionSettings.notifications;

        debugLog('Settings updated:', extensionSettings);

        // Notify all content scripts about settings change
        chrome.tabs.query({ url: ['*://*.linkedin.com/*'] }, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs
                    .sendMessage(tab.id, {
                        type: 'UPDATE_SETTINGS',
                        autoTracking: extensionSettings.autoTracking,
                        notifications: extensionSettings.notifications,
                    })
                    .catch(() => {
                        // Ignore errors for tabs without content script
                    });
            });
        });

        sendResponse({ success: true });
        return true;
    }

    if (message.type === 'GET_RECENT_APPLICATIONS') {
        getRecentApplications()
            .then((applications) => {
                sendResponse({ success: true, applications });
            })
            .catch((error) => {
                debugLog('Error getting recent applications:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

// ===== MESSAGE HANDLERS =====

/**
 * Handle application tracking request
 * @param {object} jobData - Job data to track
 * @returns {Promise<object>} Tracking result
 */
async function handleTrackApplication(jobData) {
    try {
        // Validate required job data
        if (!jobData?.company_name || !jobData?.position) {
            throw new Error('Missing required fields: company_name and position');
        }

        // Sanitize input data
        const sanitizedJobData = {
            company_name: String(jobData.company_name).trim(),
            position: String(jobData.position).trim(),
            jobUrl: jobData.jobUrl ? String(jobData.jobUrl).trim() : null,
        };

        // Get auth token
        const authToken = await getAuthToken();
        if (!authToken) {
            throw new Error('User not authenticated. Please log in to Carrio.');
        }

        // Check if application already exists
        const exists = await checkApplicationExists(sanitizedJobData, authToken);
        if (exists) {
            return {
                success: false,
                duplicate: true,
                message: 'Application already exists in your tracker',
            };
        }

        // Create the application
        const result = await createApplication(sanitizedJobData, authToken);

        if (result.success) {
            return {
                success: true,
                message: 'Application tracked successfully!',
                data: result.data,
            };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        debugLog('Error in handleTrackApplication:', error);
        return {
            success: false,
            error: error.message || 'Failed to track application',
        };
    }
}

/**
 * Handle authentication status check
 * @returns {Promise<object>} Authentication status
 */
async function handleGetAuthStatus() {
    try {
        const authToken = await getAuthToken();
        return {
            authenticated: Boolean(authToken),
            token: authToken ? 'present' : 'missing',
        };
    } catch (error) {
        debugLog('Error checking auth status:', error);
        return {
            authenticated: false,
            error: error.message,
        };
    }
}

/**
 * Get recent applications from API
 * @param {number} limit - Maximum number of applications to fetch
 * @returns {Promise<Array>} Array of recent applications
 */
async function getRecentApplications(limit = 5) {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const sanitizedLimit = Math.max(1, Math.min(50, Number(limit) || 5));
        const response = await enhancedFetch(
            `${CONFIG.API_BASE_URL}${API_ENDPOINTS.GET_APPLICATIONS}?limit=${sanitizedLimit}&sort=created_at:desc`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch applications: ${response.status}`);
        }

        const result = await response.json();
        return Array.isArray(result.applications) ? result.applications : Array.isArray(result) ? result : [];
    } catch (error) {
        debugLog('Error fetching recent applications:', error);
        throw error;
    }
}

// ===== EVENT LISTENERS =====

/**
 * Handle extension installation and updates
 */
chrome.runtime.onInstalled.addListener((details) => {
    debugLog('Extension installed/updated:', details.reason);

    if (details.reason === 'install') {
        chrome.tabs
            .create({
                url: `${CONFIG.API_BASE_URL}/?extension=installed`,
            })
            .catch((error) => {
                debugLog('Failed to open welcome page:', error);
            });
    }
});

/**
 * Monitor tab updates for LinkedIn job pages
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === 'complete' &&
        tab.url &&
        (tab.url.includes('linkedin.com/jobs') || tab.url.includes('www.linkedin.com/jobs'))
    ) {
        debugLog('LinkedIn jobs page loaded:', tab.url);
        // Optional: Send settings to newly loaded LinkedIn pages
        chrome.tabs
            .sendMessage(tabId, {
                type: 'UPDATE_SETTINGS',
                autoTracking: extensionSettings.autoTracking,
                notifications: extensionSettings.notifications,
            })
            .catch(() => {
                // Content script might not be ready yet, ignore error
            });
    }
});

// ===== INITIALIZATION =====
debugLog('Background script initialized successfully');
