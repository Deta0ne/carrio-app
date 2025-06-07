// Enhanced Popup Script for Carrio LinkedIn Job Tracker
console.log('🚀 [CARRIO POPUP] Starting popup...');

class CarrioPopup {
    constructor() {
        this.isAuthenticated = false;
        this.settings = {
            autoTracking: true,
            notifications: true,
        };
        this.recentApplications = [];

        this.init();
    }

    async init() {
        try {
            console.log('🚀 [CARRIO POPUP] Initializing...');

            // Setup event listeners
            this.setupEventListeners();

            // Check authentication status
            await this.checkAuthStatus();

            // If authenticated, load settings and recent applications
            if (this.isAuthenticated) {
                await this.loadSettings();
                await this.loadRecentApplications();
            }

            // Update UI
            this.updateUI();

            console.log('✅ [CARRIO POPUP] Initialized successfully');
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Initialization error:', error);
            this.showError('Initialization failed: ' + error.message);
        }
    }

    setupEventListeners() {
        // Dashboard buttons
        document.getElementById('open-dashboard')?.addEventListener('click', () => {
            this.openDashboard();
        });

        document.getElementById('open-dashboard-unauth')?.addEventListener('click', () => {
            this.openDashboard();
        });

        document.getElementById('open-carrio')?.addEventListener('click', () => {
            this.openDashboard();
        });

        // Settings toggles
        document.getElementById('auto-tracking-toggle')?.addEventListener('click', () => {
            this.toggleAutoTracking();
        });

        document.getElementById('notifications-toggle')?.addEventListener('click', () => {
            this.toggleNotifications();
        });

        // Test tracking button
        document.getElementById('test-tracking')?.addEventListener('click', () => {
            this.testTracking();
        });

        // Help link
        document.getElementById('help-link')?.addEventListener('click', () => {
            this.openHelp();
        });
    }

    async checkAuthStatus() {
        try {
            console.log('🔐 [CARRIO POPUP] Checking auth status...');

            const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });

            console.log('🔐 [CARRIO POPUP] Auth response:', response);

            this.isAuthenticated = response && response.authenticated;

            console.log('🔐 [CARRIO POPUP] Is authenticated:', this.isAuthenticated);
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Auth check error:', error);
            this.isAuthenticated = false;
        }
    }

    async loadSettings() {
        try {
            console.log('⚙️ [CARRIO POPUP] Loading settings...');

            const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });

            if (response) {
                this.settings = {
                    autoTracking: response.autoTracking ?? true,
                    notifications: response.notifications ?? true,
                };
                console.log('⚙️ [CARRIO POPUP] Settings loaded:', this.settings);
            }
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Settings load error:', error);
        }
    }

    async loadRecentApplications() {
        try {
            console.log('📋 [CARRIO POPUP] Loading recent applications...');

            // Show loading
            this.showApplicationsLoading(true);

            const response = await chrome.runtime.sendMessage({ type: 'GET_RECENT_APPLICATIONS' });

            if (response && response.success) {
                this.recentApplications = response.applications || [];
                console.log('📋 [CARRIO POPUP] Applications loaded:', this.recentApplications.length);
            } else {
                console.log('📋 [CARRIO POPUP] No applications found or error:', response?.error);
                this.recentApplications = [];
            }

            this.showApplicationsLoading(false);
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Applications load error:', error);
            this.recentApplications = [];
            this.showApplicationsLoading(false);
        }
    }

    updateUI() {
        this.updateAuthStatus();
        this.updateViewVisibility();

        if (this.isAuthenticated) {
            this.updateSettingsToggles();
            this.updateRecentApplications();
        } else {
            this.updatePageStatus();
        }
    }

    updateAuthStatus() {
        const authIcon = document.getElementById('auth-icon');
        const authTitle = document.getElementById('auth-title');
        const authDescription = document.getElementById('auth-description');

        if (this.isAuthenticated) {
            authIcon.textContent = '✅';
            authTitle.textContent = 'Successfully Connected';
            authDescription.textContent = 'Connected to your Carrio account. Auto-tracking is ready!';
        } else {
            authIcon.textContent = '❌';
            authTitle.textContent = 'Not Connected';
            authDescription.textContent = 'Please login to Carrio to start tracking applications.';
        }
    }

    updateViewVisibility() {
        const authenticatedView = document.getElementById('authenticated-view');
        const unauthenticatedView = document.getElementById('unauthenticated-view');

        if (this.isAuthenticated) {
            authenticatedView?.classList.remove('hidden');
            unauthenticatedView?.classList.add('hidden');
        } else {
            authenticatedView?.classList.add('hidden');
            unauthenticatedView?.classList.remove('hidden');
        }
    }

    updateSettingsToggles() {
        const autoTrackingSwitch = document.getElementById('auto-tracking-switch');
        const notificationsSwitch = document.getElementById('notifications-switch');

        if (autoTrackingSwitch) {
            autoTrackingSwitch.classList.toggle('active', this.settings.autoTracking);
        }

        if (notificationsSwitch) {
            notificationsSwitch.classList.toggle('active', this.settings.notifications);
        }
    }

    updateRecentApplications() {
        const container = document.getElementById('recent-applications');
        const noApplicationsMsg = document.getElementById('no-applications');

        if (!container) return;

        if (this.recentApplications.length === 0) {
            noApplicationsMsg?.classList.remove('hidden');
            // Clear any existing application items
            const items = container.querySelectorAll('.application-item');
            items.forEach((item) => item.remove());
        } else {
            noApplicationsMsg?.classList.add('hidden');

            // Clear existing items
            const items = container.querySelectorAll('.application-item');
            items.forEach((item) => item.remove());

            // Add new items
            this.recentApplications.slice(0, 5).forEach((app) => {
                const item = this.createApplicationItem(app);
                container.appendChild(item);
            });
        }
    }

    createApplicationItem(application) {
        const item = document.createElement('div');
        item.className = 'application-item';

        const date = new Date(application.application_date || application.created_at);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
        });

        item.innerHTML = `
            <div class="application-company">${this.escapeHtml(application.company_name)}</div>
            <div class="application-position">${this.escapeHtml(application.position)}</div>
            <div class="application-date">${formattedDate}</div>
        `;

        return item;
    }

    updatePageStatus() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const pageStatus = document.getElementById('page-status');
            if (!pageStatus) return;

            if (tabs.length > 0) {
                const url = tabs[0].url;
                if (url?.includes('linkedin.com')) {
                    if (url.includes('/jobs/')) {
                        pageStatus.textContent = '✅ LinkedIn job page detected. Ready to track applications!';
                    } else {
                        pageStatus.textContent = '📍 LinkedIn detected. Navigate to a job posting to start tracking.';
                    }
                } else {
                    pageStatus.textContent = '❌ Not on LinkedIn. Please visit LinkedIn to track job applications.';
                }
            } else {
                pageStatus.textContent = '❓ Unable to detect current page.';
            }
        });
    }

    showApplicationsLoading(show) {
        const loading = document.getElementById('applications-loading');
        if (loading) {
            loading.style.display = show ? 'inline-block' : 'none';
        }
    }

    async toggleAutoTracking() {
        try {
            this.settings.autoTracking = !this.settings.autoTracking;

            await chrome.runtime.sendMessage({
                type: 'UPDATE_SETTINGS',
                autoTracking: this.settings.autoTracking,
                notifications: this.settings.notifications,
            });

            this.updateSettingsToggles();
            console.log('⚙️ [CARRIO POPUP] Auto-tracking toggled:', this.settings.autoTracking);
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Toggle auto-tracking error:', error);
            // Revert on error
            this.settings.autoTracking = !this.settings.autoTracking;
            this.updateSettingsToggles();
        }
    }

    async toggleNotifications() {
        try {
            this.settings.notifications = !this.settings.notifications;

            await chrome.runtime.sendMessage({
                type: 'UPDATE_SETTINGS',
                autoTracking: this.settings.autoTracking,
                notifications: this.settings.notifications,
            });

            this.updateSettingsToggles();
            console.log('⚙️ [CARRIO POPUP] Notifications toggled:', this.settings.notifications);
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Toggle notifications error:', error);
            // Revert on error
            this.settings.notifications = !this.settings.notifications;
            this.updateSettingsToggles();
        }
    }

    openDashboard() {
        chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
        window.close();
    }

    openHelp() {
        chrome.tabs.create({ url: 'https://github.com/your-repo/carrio-chrome-extension#readme' });
        window.close();
    }

    async testTracking() {
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'TEST_TRACKING' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Test tracking error:', chrome.runtime.lastError);
                            this.showError('Please navigate to a LinkedIn job page first.');
                        } else {
                            console.log('Test tracking response:', response);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('❌ [CARRIO POPUP] Test tracking error:', error);
            this.showError('Test tracking failed: ' + error.message);
        }
    }

    showError(message) {
        const authMessage = document.getElementById('auth-message');
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = 'error';
            authMessage.classList.remove('hidden');

            setTimeout(() => {
                authMessage.classList.add('hidden');
            }, 5000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarrioPopup();
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 [CARRIO POPUP] Received message:', message);

    if (message.type === 'AUTH_STATUS_CHANGED') {
        // Re-initialize popup when auth status changes
        setTimeout(() => {
            location.reload();
        }, 100);
    }

    return true;
});
