// LinkedIn Content Script for Carrio Job Tracker

(function () {
    'use strict';

    // All console logs disabled for performance

    // Test if we can access Chrome extension APIs
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        return;
    }

    // Configuration
    const CONFIG = {
        DEBUG: false,
        TRACKING_DELAY: 2000, // Wait 2 seconds after action
        RETRY_ATTEMPTS: 3,
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

    let isTracking = false;
    let lastTrackedJob = null;
    let observerActive = false;

    // Settings for auto-tracking and notifications
    let autoTrackingEnabled = true;
    let notificationsEnabled = true;

    // Listen for settings updates from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'UPDATE_SETTINGS') {
            autoTrackingEnabled = message.autoTracking;
            notificationsEnabled = message.notifications;
            debugLog('Settings updated:', { autoTrackingEnabled, notificationsEnabled });
            sendResponse({ success: true });
        }
        return true;
    });

    // Get initial settings from background
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
        if (response) {
            autoTrackingEnabled = response.autoTracking ?? true;
            notificationsEnabled = response.notifications ?? true;
            debugLog('Initial settings loaded:', { autoTrackingEnabled, notificationsEnabled });
        }
    });

    // Utility functions
    function debugLog(...args) {
        // Logs disabled
    }

    function getElementText(selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent?.trim() || '';
                if (text) {
                    debugLog(`Found text for selector "${selector}":`, text);
                    return text;
                }
            }
        }
        debugLog('No text found for selectors:', selectors);
        return '';
    }

    function getCurrentJobUrl() {
        return window.location.href;
    }

    function extractJobId() {
        const urlMatch = window.location.href.match(/\/jobs\/view\/(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    // Extract job details from current page
    function extractJobDetails() {
        const jobTitle = getElementText(CONFIG.SELECTORS.jobTitle);
        const companyName = getElementText(CONFIG.SELECTORS.companyName);
        const location = getElementText(CONFIG.SELECTORS.location);
        const description = getElementText(CONFIG.SELECTORS.description);
        const salary = getElementText(CONFIG.SELECTORS.salary);
        const jobId = extractJobId();
        const jobUrl = getCurrentJobUrl();

        // Raw data extraction logging disabled for performance

        // Clean up extracted data
        const cleanedData = {
            position: jobTitle.replace(/\n/g, ' ').trim(),
            company_name: companyName.replace(/\n/g, ' ').trim(),
            location: location.replace(/\n/g, ' ').split('•')[0].trim(), // Take first part before bullet
            description: description.substring(0, 500).trim(), // Limit description length
            salary: salary.includes('$') ? salary.trim() : '',
            jobId: jobId,
            jobUrl: jobUrl,
            applicationType: 'standard',
        };

        //console.log('✅ [CARRIO] Cleaned data:', cleanedData);
        debugLog('Extracted job details:', cleanedData);

        // Validate required fields
        if (!cleanedData.position || !cleanedData.company_name) {
            console.error('❌ [CARRIO] Validation failed:', {
                position: cleanedData.position,
                company_name: cleanedData.company_name,
                positionEmpty: !cleanedData.position,
                companyEmpty: !cleanedData.company_name,
                positionLength: cleanedData.position?.length || 0,
                companyLength: cleanedData.company_name?.length || 0,
                originalJobTitle: jobTitle,
                hasDotInOriginal: /\./.test(jobTitle),
            });
            debugLog('Missing required fields:', {
                position: cleanedData.position,
                company_name: cleanedData.company_name,
            });
            return null;
        }

        //console.log('✅ [CARRIO] Validation passed');
        return cleanedData;
    }

    // Track application
    async function trackApplication(applicationType = 'standard') {
        if (isTracking) {
            debugLog('Already tracking an application, skipping');
            return;
        }

        // Check if auto-tracking is enabled
        if (!autoTrackingEnabled) {
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
            //console.log('📤 [CARRIO] Sending to background script...');

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
                            //console.log('✅ [CARRIO] Background script response:', response);
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

    // Show tracking success notification
    function showTrackingSuccess(jobDetails, applicationType) {
        const typeText = applicationType === 'easy' ? 'Hızlı Başvuru' : 'Standart Başvuru';
        const notification = createNotification(
            'success',
            '✅ Başvuru Takip Edildi!',
            `${jobDetails.position} - ${jobDetails.company_name} (${typeText})`,
        );
        showNotification(notification);
    }

    // Show duplicate notice
    function showDuplicateNotice(jobDetails) {
        const notification = createNotification(
            'warning',
            '⚠️ Zaten Takip Ediliyor',
            `${jobDetails.position} - ${jobDetails.company_name} zaten takip listenizde`,
        );
        showNotification(notification);
    }

    // Show tracking error
    function showTrackingError(message) {
        const notification = createNotification('error', '❌ Takip Başarısız', message);
        showNotification(notification);
    }

    // Create notification element
    function createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#EF4444'};
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

    // Show notification
    function showNotification(notification) {
        // Check if notifications are enabled
        if (!notificationsEnabled) {
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
        }, 4000);
    }

    // Detect apply button clicks
    function addApplyButtonListeners() {
        // Helper function to check if button contains apply-related text
        function isApplyButton(button) {
            const text = button.textContent?.toLowerCase() || '';
            const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

            // Enhanced logging disabled for performance

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
                'hızlı',
                'kolay',
                'kolayca',
            ];

            // Check for easy apply first (more specific)
            for (const keyword of easyApplyKeywords) {
                if (text.includes(keyword) || ariaLabel.includes(keyword)) {
                    //console.log('✅ [CARRIO] Easy Apply button detected:', button.textContent?.trim());
                    return 'easy';
                }
            }

            // Check for regular apply
            for (const keyword of applyKeywords) {
                if (text.includes(keyword) || ariaLabel.includes(keyword)) {
                    // Make sure it's not an easy apply button
                    const isNotEasy = !easyApplyKeywords.some(
                        (easy) => text.includes(easy) || ariaLabel.includes(easy),
                    );

                    if (isNotEasy) {
                        //console.log('✅ [CARRIO] Standard Apply button detected:', button.textContent?.trim());
                        return 'standard';
                    }
                }
            }

            return null;
        }

        // Find all potential apply buttons
        const allButtons = document.querySelectorAll('button');

        allButtons.forEach((button) => {
            if (button.dataset.carrioListener) return; // Already processed

            const buttonType = isApplyButton(button);
            if (!buttonType) return;

            button.dataset.carrioListener = 'true';

            button.addEventListener('click', () => {
                debugLog(
                    `${buttonType === 'easy' ? 'Easy Apply' : 'Apply'} button clicked (${button.textContent?.trim()})`,
                );
                setTimeout(() => trackApplication(buttonType), CONFIG.TRACKING_DELAY);
            });

            debugLog(`Added listener to ${buttonType} button:`, button.textContent?.trim());
        });

        // Also use the original selectors as fallback
        CONFIG.SELECTORS.easyApplyButton.forEach((selector) => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach((button) => {
                if (!button.dataset.carrioListener) {
                    button.dataset.carrioListener = 'true';
                    button.addEventListener('click', () => {
                        debugLog('Easy Apply button clicked (selector match)');
                        setTimeout(() => trackApplication('easy'), CONFIG.TRACKING_DELAY);
                    });
                }
            });
        });

        CONFIG.SELECTORS.applyButton.forEach((selector) => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach((button) => {
                if (!button.dataset.carrioListener) {
                    // Make sure it's not an Easy Apply button
                    const text = button.textContent?.toLowerCase() || '';
                    const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

                    const isEasy =
                        text.includes('easy') ||
                        text.includes('hızlı') ||
                        text.includes('kolay') ||
                        text.includes('kolayca') ||
                        ariaLabel.includes('easy') ||
                        ariaLabel.includes('hızlı') ||
                        ariaLabel.includes('kolay') ||
                        ariaLabel.includes('kolayca');

                    if (!isEasy) {
                        button.dataset.carrioListener = 'true';
                        button.addEventListener('click', () => {
                            debugLog('Apply button clicked (selector match)');
                            setTimeout(() => trackApplication('standard'), CONFIG.TRACKING_DELAY);
                        });
                    }
                }
            });
        });
    }

    // Watch for DOM changes
    function setupObserver() {
        if (observerActive) return;

        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                // Debounce the check
                clearTimeout(window.carrioObserverTimeout);
                window.carrioObserverTimeout = setTimeout(() => {
                    addApplyButtonListeners();
                }, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        observerActive = true;
        debugLog('DOM observer setup complete');
    }

    // Initialize the tracker
    function initialize() {
        //console.log('🔧 [CARRIO] Initialize function called');
        debugLog('Initializing LinkedIn tracker');
        debugLog(
            'Language detection: Looking for Turkish (Başvur, Uygula, Kolay Başvuru) and English (Apply, Easy Apply) buttons',
        );

        //console.log('🔍 [CARRIO] Starting button detection...');

        // Initial setup
        addApplyButtonListeners();
        setupObserver();

        //console.log('📡 [CARRIO] Observer setup complete');

        // Listen for URL changes (SPA navigation)
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                debugLog('URL changed, reinitializing button listeners');
                setTimeout(() => {
                    addApplyButtonListeners();
                }, 1000);
            }
        }, 1000);

        //console.log('🔄 [CARRIO] URL change listener setup');

        // Debug: Show available buttons after initialization
        setTimeout(() => {
            //console.log('🔍 [CARRIO] Scanning for buttons after 2 seconds...');

            const allButtons = document.querySelectorAll('button');
            //console.log(`🔍 [CARRIO] Total buttons found: ${allButtons.length}`);

            const applyButtons = Array.from(allButtons).filter((btn) => {
                const text = btn.textContent?.toLowerCase() || '';
                const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
                return (
                    text.includes('apply') ||
                    text.includes('başvur') ||
                    text.includes('uygula') ||
                    text.includes('kolay') ||
                    text.includes('hızlı') ||
                    ariaLabel.includes('apply') ||
                    ariaLabel.includes('başvur') ||
                    ariaLabel.includes('uygula') ||
                    ariaLabel.includes('kolay') ||
                    ariaLabel.includes('hızlı') ||
                    ariaLabel.includes('kolayca')
                );
            });

            //console.log(`🎯 [CARRIO] Apply buttons found: ${applyButtons.length}`);

            // Button details logging disabled for performance

            debugLog(
                `Found ${applyButtons.length} potential apply buttons on page:`,
                applyButtons.map((btn) => ({
                    text: btn.textContent?.trim(),
                    ariaLabel: btn.getAttribute('aria-label'),
                    className: btn.className,
                    hasListener: !!btn.dataset.carrioListener,
                })),
            );

            // Create test button for manual testing
            if (applyButtons.length === 0) {
                //console.log('⚠️ [CARRIO] No apply buttons found! Creating manual test button...');
                createManualTestButton();
            }
        }, 2000);

        // Create manual test function
        function createManualTestButton() {
            const testButton = document.createElement('button');
            testButton.innerHTML = '🧪 Test Carrio Tracking';
            testButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10000;
                background: #0073b1;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;

            testButton.addEventListener('click', () => {
                //console.log('🧪 [CARRIO] Manual test triggered');
                trackApplication('manual');
            });

            document.body.appendChild(testButton);
            //console.log('✅ [CARRIO] Manual test button created');

            // Remove after 30 seconds
            setTimeout(() => {
                testButton.remove();
                //console.log('🗑️ [CARRIO] Manual test button removed');
            }, 30000);
        }

        //console.log('✅ [CARRIO] LinkedIn tracker initialized successfully');
        debugLog('LinkedIn tracker initialized successfully');
    }

    // Start when DOM is ready
    //console.log('🚀 [CARRIO] Script execution reached startup section');
    //console.log('🚀 [CARRIO] Document ready state:', document.readyState);

    if (document.readyState === 'loading') {
        //console.log('🕐 [CARRIO] DOM still loading, adding event listener...');
        document.addEventListener('DOMContentLoaded', () => {
            //console.log('🎉 [CARRIO] DOMContentLoaded event fired!');
            initialize();
        });
    } else {
        //console.log('🎉 [CARRIO] DOM already ready, initializing immediately...');
        initialize();
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        debugLog('Content script received message:', message);

        if (message.type === 'TEST_EXTRACTION') {
            try {
                const jobDetails = extractJobDetails();
                if (jobDetails) {
                    sendResponse({
                        success: true,
                        data: jobDetails,
                        message: 'Job details extracted successfully',
                    });
                } else {
                    sendResponse({
                        success: false,
                        error: 'Could not extract job details from current page',
                    });
                }
            } catch (error) {
                sendResponse({
                    success: false,
                    error: error.message,
                });
            }
        }
    });

    //console.log('🏁 [CARRIO] Script setup complete!');
})();
