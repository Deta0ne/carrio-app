// Carrio Chrome Extension Background Script

// Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000', // Change to production URL when deployed
    TIMEOUT: 10000, // 10 seconds timeout
    DEBUG: false,
};

// Utility functions
function debugLog(...args) {
    // Logs disabled
}

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
            const localhostTabs = tabs.filter(
                (tab) => tab.url && (tab.url.includes('localhost:3000') || tab.url.includes('127.0.0.1:3000')),
            );

            if (localhostTabs.length > 0) {
                debugLog(`Found ${localhostTabs.length} localhost tabs, trying to get token`);

                for (const tab of localhostTabs) {
                    try {
                        const result = await chrome.tabs.sendMessage(tab.id, {
                            type: 'GET_AUTH_TOKEN',
                        });

                        if (result && result.token) {
                            debugLog('Got token from localhost tab');
                            cachedAuthToken = result.token;
                            return result.token;
                        }
                    } catch (scriptError) {
                        debugLog('Error getting token from tab:', scriptError);
                    }
                }
            }
        } catch (tabError) {
            debugLog('Error accessing localhost tabs:', tabError);
        }

        // Check multiple domains for the auth token
        const domains = ['http://localhost:3000', 'https://localhost:3000', 'https://carrio.app'];

        debugLog('Starting cookie search across domains:', domains);

        for (const domain of domains) {
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
                const authCookiePatterns = [
                    'sb-icelfwwfakovrgbqfwhl-auth-token',
                    'sb-localhost-auth-token',
                    'supabase-auth-token',
                    'supabase.auth.token',
                ];

                for (const pattern of authCookiePatterns) {
                    const cookies = await chrome.cookies.getAll({
                        url: domain,
                        name: pattern,
                    });

                    if (cookies.length > 0) {
                        const tokenCookie = cookies[0];
                        debugLog('Found auth token cookie:', tokenCookie.name, 'from domain:', domain);
                        debugLog('Cookie value preview:', tokenCookie.value.substring(0, 100) + '...');

                        // Parse the token value (it might be URL encoded JSON)
                        try {
                            const decodedValue = decodeURIComponent(tokenCookie.value);
                            const tokenData = JSON.parse(decodedValue);
                            debugLog('Parsed token data structure:', Object.keys(tokenData));
                            return tokenData.access_token || tokenData.token || tokenData;
                        } catch (parseError) {
                            debugLog('Failed to parse token data, using raw value:', parseError);
                            return tokenCookie.value;
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

// Check if application already exists
async function checkApplicationExists(jobData, authToken) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/applications/check`, {
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
            return result.exists;
        }

        return false;
    } catch (error) {
        debugLog('Error checking application existence:', error);
        return false;
    }
}

// Create application via API
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

        const response = await fetch(`${CONFIG.API_BASE_URL}/api/applications/create`, {
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
            return { success: false, error: result.message || 'Failed to create application' };
        }
    } catch (error) {
        debugLog('Error creating application:', error);
        return { success: false, error: error.message };
    }
}

// Store auth token when received from localhost
let cachedAuthToken = null;

// Settings storage
let settings = {
    autoTracking: true,
    notifications: true,
};

// Verify if cached token is still valid
async function verifyCachedToken() {
    try {
        // Method 1: Check if the cookie still exists
        const tabs = await chrome.tabs.query({});
        const localhostTabs = tabs.filter(
            (tab) => tab.url && (tab.url.includes('localhost:3000') || tab.url.includes('127.0.0.1:3000')),
        );

        if (localhostTabs.length > 0) {
            for (const tab of localhostTabs) {
                try {
                    const result = await chrome.tabs.sendMessage(tab.id, {
                        type: 'CHECK_AUTH_COOKIE',
                    });

                    if (result && result.exists) {
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
                const response = await fetch(`${CONFIG.API_BASE_URL}/api/applications/check`, {
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

        debugLog('No localhost tabs found and no valid token');
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
        debugLog('Auth token received from localhost:', message.token ? 'token present' : 'no token');
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
        sendResponse(settings);
        return true;
    }

    if (message.type === 'UPDATE_SETTINGS') {
        settings.autoTracking = message.autoTracking ?? settings.autoTracking;
        settings.notifications = message.notifications ?? settings.notifications;

        debugLog('Settings updated:', settings);

        // Notify all content scripts about settings change
        chrome.tabs.query({ url: ['*://*.linkedin.com/*'] }, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs
                    .sendMessage(tab.id, {
                        type: 'UPDATE_SETTINGS',
                        autoTracking: settings.autoTracking,
                        notifications: settings.notifications,
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

// Handle application tracking
async function handleTrackApplication(jobData) {
    try {
        // Validate job data
        if (!jobData.company_name || !jobData.position) {
            throw new Error('Missing required fields: company_name and position');
        }

        // Get auth token
        const authToken = await getAuthToken();
        if (!authToken) {
            throw new Error('User not authenticated. Please log in to Carrio.');
        }

        // Check if application already exists
        const exists = await checkApplicationExists(jobData, authToken);
        if (exists) {
            return {
                success: false,
                duplicate: true,
                message: 'Application already exists in your tracker',
            };
        }

        // Create the application
        const result = await createApplication(jobData, authToken);

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

// Handle auth status check
async function handleGetAuthStatus() {
    try {
        const authToken = await getAuthToken();
        return {
            authenticated: !!authToken,
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

// Get recent applications
async function getRecentApplications(limit = 5) {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/api/applications?limit=${limit}&sort=created_at:desc`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        const result = await response.json();
        return result.applications || result || [];
    } catch (error) {
        debugLog('Error fetching recent applications:', error);
        throw error;
    }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    debugLog('Extension installed/updated:', details.reason);

    if (details.reason === 'install') {
        // Open welcome page or show notification
        chrome.tabs.create({
            url: `${CONFIG.API_BASE_URL}/welcome?extension=installed`,
        });
    }
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === 'complete' &&
        tab.url &&
        (tab.url.includes('linkedin.com/jobs') || tab.url.includes('www.linkedin.com/jobs'))
    ) {
        debugLog('LinkedIn jobs page loaded:', tab.url);
    }
});

debugLog('Background script initialized successfully');
