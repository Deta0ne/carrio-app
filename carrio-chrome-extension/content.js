// LinkedIn Content Script for Carrio Job Tracker

(function () {
    'use strict';

    // ===== INITIALIZATION CHECKS =====

    // Test if we can access Chrome extension APIs
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.warn('[CARRIO] Chrome extension APIs not available');
        return;
    }

    // Prevent multiple instances of the script
    if (window.carrioExtensionLoaded) {
        console.warn('[CARRIO] Extension already loaded, skipping');
        return;
    }
    window.carrioExtensionLoaded = true;

    // ===== CONFIGURATION =====

    const CONFIG = {
        DEBUG: false,
        TRACKING_DELAY: 2000, // Wait 2 seconds after action
        RETRY_ATTEMPTS: 3,
        MAX_DESCRIPTION_LENGTH: 500,
        NOTIFICATION_DURATION: 5000,
        SELECTORS: {
            // Job details
            jobTitle: [
                'h1.job-title',
                'h1[data-test-id="job-title"]',
                '.job-details-jobs-unified-top-card__job-title h1',
                '.jobs-unified-top-card__job-title a',
                '.job-details-module__job-title',
                '.t-24.t-bold.inline',
                '.jobs-unified-top-card__job-title-link',
                '.job-details-jobs-unified-top-card__job-title-link',
                '.job-details-jobs-unified-top-card__job-title',
                '.jobs-unified-top-card__job-title',
            ],
            companyName: [
                '.job-details-jobs-unified-top-card__company-name a',
                '.jobs-unified-top-card__company-name a',
                '.job-details-module__company-name a',
                '.job-poster .job-poster__profile-link',
                'a[data-control-name="job_details_topcard_company_url"]',
                '.jobs-unified-top-card__company-name span',
                '.job-details-jobs-unified-top-card__company-name span',
                '.job-details-jobs-unified-top-card__company-name',
                '.jobs-unified-top-card__company-name',
            ],
            location: [
                '.job-details-jobs-unified-top-card__bullet',
                '.jobs-unified-top-card__bullet',
                '.job-details-module__location',
                '.job-poster__location',
                '.jobs-unified-top-card__bullet:last-child',
                '.job-details-jobs-unified-top-card__primary-description .tvm__text',
                '.job-details-jobs-unified-top-card__primary-description',
            ],
            description: [
                '.jobs-description-content__text',
                '.job-details-module__content',
                '.jobs-box__html-content',
                '.jobs-description__text',
                '.jobs-description .jobs-description-content__text',
                '.jobs-description-content',
                '[data-test-job-description]',
            ],
            salary: [
                '.job-details-jobs-unified-top-card__job-insight',
                '.jobs-unified-top-card__job-insight',
                '.salary-main-rail__salary-info',
            ],
            // Application buttons - Enhanced for Turkish LinkedIn
            applyButton: [
                // English
                'button[aria-label*="Apply"]',
                'button[aria-label*="apply"]',
                // Turkish variations
                'button[aria-label*="başvur"]',
                'button[aria-label*="Başvur"]',
                'button[aria-label*="uygula"]',
                'button[aria-label*="Uygula"]',
                'button[aria-label*="BAŞVUR"]',
                'button[aria-label*="UYGULA"]',
                // CSS selectors
                'button.jobs-apply-button',
                'button[data-control-name="jobdetails_topcard_inapply"]',
                '.jobs-apply-button--top-card button',
                '.jobs-apply-button:not([aria-label*="Easy"]):not([aria-label*="Kolay"]):not([aria-label*="Hızlı"])',
                // New LinkedIn selectors
                'button[data-test-id="apply-button"]',
                'button.jobs-apply-button--primary:not([aria-label*="Easy"]):not([aria-label*="Kolay"])',
            ],
            easyApplyButton: [
                // English
                'button[aria-label*="Easy Apply"]',
                'button[aria-label*="easy apply"]',
                // Turkish variations - all possible combinations
                'button[aria-label*="Hızlı Başvuru"]',
                'button[aria-label*="hızlı başvuru"]',
                'button[aria-label*="Kolay Başvuru"]',
                'button[aria-label*="kolay başvuru"]',
                'button[aria-label*="kolayca başvur"]',
                'button[aria-label*="Kolayca başvur"]',
                'button[aria-label*="kolayca başvurun"]',
                'button[aria-label*="Kolayca başvurun"]',
                'button[aria-label*="KOLAY BAŞVURU"]',
                'button[aria-label*="HIZLI BAŞVURU"]',
                // CSS selectors
                'button.jobs-apply-button--primary',
                'button[data-control-name="jobdetails_topcard_inapply_easy"]',
                '.jobs-apply-button[aria-label*="Easy"]',
                '.jobs-apply-button[aria-label*="Kolay"]',
                '.jobs-apply-button[aria-label*="Hızlı"]',
                // New LinkedIn selectors
                'button[data-test-id="easy-apply-button"]',
            ],
        },
    };

    // ===== GLOBAL STATE =====

    let isTracking = false;
    let lastTrackedJob = null;
    let observerActive = false;

    // Extension settings
    let extensionSettings = {
        autoTracking: true,
        notifications: true,
    };

    // ===== UTILITY FUNCTIONS =====

    function debugLog(...args) {
        // Logs disabled for performance
    }

    /**
     * Safely update extension settings
     * @param {object} newSettings - New settings object
     */
    function updateSettings(newSettings) {
        extensionSettings = {
            ...extensionSettings,
            ...newSettings,
        };
        debugLog('Settings updated:', extensionSettings);
    }

    /**
     * Extract text from DOM elements using multiple selectors
     * @param {Array<string>} selectors - CSS selectors to try
     * @returns {string} Found text or empty string
     */
    function getElementText(selectors) {
        for (const selector of selectors) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.textContent?.trim() || '';
                    if (text) {
                        debugLog(`Found text for selector "${selector}":`, text);
                        return text;
                    }
                }
            } catch (error) {
                debugLog(`Error with selector "${selector}":`, error);
            }
        }
        debugLog('No text found for selectors:', selectors);
        return '';
    }

    /**
     * Get current job URL
     * @returns {string} Current URL
     */
    function getCurrentJobUrl() {
        return window.location.href;
    }

    /**
     * Extract LinkedIn job ID from URL
     * @returns {string|null} Job ID or null if not found
     */
    function extractJobId() {
        const urlMatch = window.location.href.match(/\/jobs\/view\/(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    /**
     * Clean and format text data
     * @param {string} text - Raw text to clean
     * @returns {string} Cleaned text
     */
    function cleanText(text) {
        return text?.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() || '';
    }

    // ===== MESSAGE HANDLING =====

    // Listen for settings updates from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'UPDATE_SETTINGS') {
            updateSettings({
                autoTracking: message.autoTracking,
                notifications: message.notifications,
            });
            sendResponse({ success: true });
        }
        return true;
    });

    // Get initial settings from background
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
        if (response) {
            updateSettings({
                autoTracking: response.autoTracking ?? true,
                notifications: response.notifications ?? true,
            });
            debugLog('Initial settings loaded:', extensionSettings);
        }
    });

    // ===== JOB DATA EXTRACTION =====

    /**
     * Extract job details from current LinkedIn page
     * @returns {object|null} Job details object or null if validation fails
     */
    function extractJobDetails() {
        try {
            const jobTitle = getElementText(CONFIG.SELECTORS.jobTitle);
            const companyName = getElementText(CONFIG.SELECTORS.companyName);
            const location = getElementText(CONFIG.SELECTORS.location);
            const description = getElementText(CONFIG.SELECTORS.description);
            const salary = getElementText(CONFIG.SELECTORS.salary);
            const jobId = extractJobId();
            const jobUrl = getCurrentJobUrl();

            // Clean up extracted data
            const cleanedData = {
                position: cleanText(jobTitle),
                company_name: cleanText(companyName),
                location: cleanText(location.split('•')[0]), // Take first part before bullet
                description: description.substring(0, CONFIG.MAX_DESCRIPTION_LENGTH).trim(),
                salary: salary.includes('$') ? cleanText(salary) : '',
                jobId,
                jobUrl,
                applicationType: 'standard',
            };

            debugLog('Extracted job details:', cleanedData);

            // Validate required fields
            if (!cleanedData.position || !cleanedData.company_name) {
                console.error('❌ [CARRIO] Validation failed:', {
                    position: cleanedData.position,
                    company_name: cleanedData.company_name,
                });
                return null;
            }

            return cleanedData;
        } catch (error) {
            console.error('❌ [CARRIO] Error extracting job details:', error);
            return null;
        }
    }

    // ===== APPLICATION TRACKING =====

    /**
     * Track application with the background script
     * @param {string} applicationType - Type of application ('standard' or 'easy')
     */
    async function trackApplication(applicationType = 'standard') {
        if (isTracking) {
            debugLog('Already tracking an application, skipping');
            return;
        }

        // Check if auto-tracking is enabled
        if (!extensionSettings.autoTracking) {
            debugLog('Auto-tracking is disabled, skipping');
            return;
        }

        isTracking = true;

        try {
            const jobDetails = extractJobDetails();
            if (!jobDetails) {
                throw new Error('Could not extract job details');
            }

            jobDetails.applicationType = applicationType;

            // Check if this is the same job we just tracked
            const jobKey = `${jobDetails.company_name}_${jobDetails.position}`;
            if (lastTrackedJob === jobKey) {
                debugLog('Same job already tracked recently, skipping');
                return;
            }

            debugLog('Tracking application:', jobDetails);

            // Send to background script
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    {
                        type: 'TRACK_APPLICATION',
                        data: jobDetails,
                    },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('❌ [CARRIO] Background script error:', chrome.runtime.lastError.message);
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    },
                );
            });

            // Handle response
            if (response.success) {
                lastTrackedJob = jobKey;
                showTrackingSuccess(jobDetails, applicationType);
            } else if (response.duplicate) {
                showDuplicateNotice(jobDetails);
            } else {
                throw new Error(response.error || 'Failed to track application');
            }
        } catch (error) {
            console.error('💥 [CARRIO] Tracking error:', error);
            debugLog('Error tracking application:', error);

            // Handle extension context invalidation with simple user instruction
            if (error.message.includes('context invalidated')) {
                showTrackingError('Extension restarted. Please refresh this page (F5) and try again.');
            } else {
                showTrackingError(error.message);
            }
        } finally {
            isTracking = false;
        }
    }

    // ===== NOTIFICATION SYSTEM =====

    /**
     * Show tracking success notification
     * @param {object} jobDetails - Job details object
     * @param {string} applicationType - Application type
     */
    function showTrackingSuccess(jobDetails, applicationType) {
        const typeText = applicationType === 'easy' ? 'Hızlı Başvuru' : 'Standart Başvuru';
        const notification = createNotification(
            'success',
            '✅ Başvuru Takip Edildi!',
            `${jobDetails.position} - ${jobDetails.company_name} (${typeText})`,
        );
        showNotification(notification);
    }

    /**
     * Show duplicate application notice
     * @param {object} jobDetails - Job details object
     */
    function showDuplicateNotice(jobDetails) {
        const notification = createNotification(
            'warning',
            '⚠️ Zaten Takip Ediliyor',
            `${jobDetails.position} - ${jobDetails.company_name} zaten takip listenizde`,
        );
        showNotification(notification);
    }

    /**
     * Show tracking error notification
     * @param {string} message - Error message
     */
    function showTrackingError(message) {
        const notification = createNotification('error', '❌ Takip Başarısız', message);
        showNotification(notification);
    }

    /**
     * Create notification DOM element
     * @param {string} type - Notification type ('success', 'warning', 'error')
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @returns {HTMLElement} Notification element
     */
    function createNotification(type, title, message) {
        const notification = document.createElement('div');

        const colors = {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
            <div style="opacity: 0.9;">${message}</div>
        `;

        // Add animation styles
        if (!document.getElementById('carrio-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'carrio-notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        return notification;
    }

    /**
     * Show notification to user
     * @param {HTMLElement} notification - Notification element
     */
    function showNotification(notification) {
        // Check if notifications are enabled
        if (!extensionSettings.notifications) {
            debugLog('Notifications are disabled, not showing notification');
            return;
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, CONFIG.NOTIFICATION_DURATION);
    }

    // ===== BUTTON DETECTION =====

    /**
     * Add event listeners to apply buttons
     */
    function addApplyButtonListeners() {
        /**
         * Check if button is an apply button
         * @param {HTMLElement} button - Button element to check
         * @returns {object} Button analysis result
         */
        function isApplyButton(button) {
            const text = button.textContent?.toLowerCase() || '';
            const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

            // Turkish and English keywords for apply buttons
            const applyKeywords = [
                'apply',
                'başvur',
                'başvurun',
                'uygula',
                'uygulan',
                'iş başvurusu',
                'başvur yap',
                'apply now',
            ];

            const easyApplyKeywords = [
                'easy apply',
                'hızlı başvuru',
                'kolay başvuru',
                'kolayca başvur',
                'kolayca başvurun',
            ];

            const isStandardApply = applyKeywords.some(
                (keyword) => text.includes(keyword) || ariaLabel.includes(keyword),
            );

            const isEasyApply = easyApplyKeywords.some(
                (keyword) => text.includes(keyword) || ariaLabel.includes(keyword),
            );

            return {
                isApply: isStandardApply || isEasyApply,
                isEasy: isEasyApply,
                text,
                ariaLabel,
            };
        }

        // Find and attach listeners to apply buttons
        const allButtons = document.querySelectorAll('button');

        allButtons.forEach((button) => {
            const analysis = isApplyButton(button);

            if (analysis.isApply && !button.hasCarrioListener) {
                button.hasCarrioListener = true;

                button.addEventListener('click', () => {
                    debugLog('Apply button clicked:', analysis);
                    setTimeout(() => {
                        const applicationType = analysis.isEasy ? 'easy' : 'standard';
                        trackApplication(applicationType);
                    }, CONFIG.TRACKING_DELAY);
                });
            }
        });
    }

    // ===== PAGE MONITORING =====

    /**
     * Setup DOM observer to watch for new apply buttons
     */
    function setupObserver() {
        if (observerActive) return;

        const observer = new MutationObserver((mutations) => {
            let shouldCheckButtons = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'BUTTON' || node.querySelector('button')) {
                                shouldCheckButtons = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheckButtons) {
                addApplyButtonListeners();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        observerActive = true;
        debugLog('DOM observer started');
    }

    // ===== INITIALIZATION =====

    /**
     * Initialize the extension on LinkedIn job pages
     */
    function initialize() {
        // Check if we're on a LinkedIn job page
        if (!window.location.href.includes('linkedin.com/jobs')) {
            debugLog('Not on LinkedIn jobs page, skipping initialization');
            return;
        }

        debugLog('Initializing Carrio extension on LinkedIn jobs page');

        // Initial setup
        addApplyButtonListeners();
        setupObserver();

        // Re-scan periodically for dynamic content
        setInterval(() => {
            addApplyButtonListeners();
        }, 5000);

        // Debug mode features
        if (CONFIG.DEBUG) {
            createManualTestButton();
        }

        debugLog('Carrio extension initialized successfully');
    }

    /**
     * Create manual test button for debugging
     */
    function createManualTestButton() {
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Test Carrio Tracking';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0066cc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 12px;
        `;

        testButton.addEventListener('click', () => {
            trackApplication('manual');
        });

        document.body.appendChild(testButton);
        debugLog('Manual test button created');
    }

    // ===== STARTUP =====

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
