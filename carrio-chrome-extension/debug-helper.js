// LinkedIn Button Debug Helper
// This script runs additional diagnostics to help troubleshoot button detection

console.log('🛠️ [CARRIO DEBUG] LinkedIn Button Diagnostic Tool Loaded');

function runDiagnostics() {
    console.log('🔍 [DEBUG] Starting LinkedIn Button Diagnostics...');
    console.log('🔍 [DEBUG] Current URL:', window.location.href);
    console.log('🔍 [DEBUG] Page Title:', document.title);

    // Check if we're on a LinkedIn job page
    const isJobPage = window.location.href.includes('/jobs/view/') || window.location.href.includes('/jobs/search/');
    console.log('🔍 [DEBUG] Is LinkedIn Job Page:', isJobPage);

    // Get all buttons on page
    const allButtons = document.querySelectorAll('button');
    console.log(`🔍 [DEBUG] Total buttons found: ${allButtons.length}`);

    // Group buttons by text content
    const buttonGroups = {};
    allButtons.forEach((btn, index) => {
        const text = btn.textContent?.trim() || '[No Text]';
        const ariaLabel = btn.getAttribute('aria-label') || '[No Aria Label]';

        if (!buttonGroups[text]) {
            buttonGroups[text] = [];
        }

        buttonGroups[text].push({
            index,
            text,
            ariaLabel,
            className: btn.className,
            id: btn.id || '[No ID]',
            dataset: Object.keys(btn.dataset),
        });
    });

    console.log('📊 [DEBUG] Button Groups:', buttonGroups);

    // Look for potential apply buttons
    const applyKeywords = [
        'apply',
        'başvur',
        'uygula',
        'kolay',
        'hızlı',
        'easy',
        'başvurun',
        'kolayca',
        'uygulan',
        'başvurul',
    ];

    const potentialApplyButtons = [];

    allButtons.forEach((btn, index) => {
        const text = btn.textContent?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';

        const matchedKeywords = applyKeywords.filter(
            (keyword) => text.includes(keyword) || ariaLabel.includes(keyword),
        );

        if (matchedKeywords.length > 0) {
            potentialApplyButtons.push({
                index,
                text: btn.textContent?.trim(),
                ariaLabel: btn.getAttribute('aria-label'),
                className: btn.className,
                matchedKeywords,
                isVisible: btn.offsetParent !== null,
                isEnabled: !btn.disabled,
                boundingRect: btn.getBoundingClientRect(),
            });
        }
    });

    console.log(`🎯 [DEBUG] Found ${potentialApplyButtons.length} potential apply buttons:`);
    potentialApplyButtons.forEach((btn, i) => {
        console.log(`  ${i + 1}.`, btn);
    });

    // Check for specific LinkedIn selectors
    const linkedinSelectors = [
        'button[aria-label*="Apply"]',
        'button[aria-label*="başvur"]',
        'button[aria-label*="Easy Apply"]',
        'button[aria-label*="Kolay Başvuru"]',
        'button.jobs-apply-button',
        'button[data-control-name*="apply"]',
        '.jobs-apply-button',
        '.jobs-apply-button--primary',
    ];

    console.log('🔎 [DEBUG] Testing LinkedIn-specific selectors:');
    linkedinSelectors.forEach((selector) => {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`  ✅ "${selector}": ${elements.length} matches`);
                elements.forEach((el, i) => {
                    console.log(
                        `    ${i + 1}. Text: "${el.textContent?.trim()}", Aria: "${el.getAttribute('aria-label')}"`,
                    );
                });
            } else {
                console.log(`  ❌ "${selector}": no matches`);
            }
        } catch (e) {
            console.log(`  ⚠️ "${selector}": selector error -`, e.message);
        }
    });

    // Check for Turkish LinkedIn interface
    const pageText = document.body.textContent?.toLowerCase() || '';
    const hasTurkish =
        pageText.includes('başvur') ||
        pageText.includes('iş') ||
        pageText.includes('şirket') ||
        pageText.includes('kolay');
    console.log('🇹🇷 [DEBUG] Turkish interface detected:', hasTurkish);

    // Check if Carrio extension is already loaded
    const carrioElements = document.querySelectorAll('[data-carrio-listener]');
    console.log(`🔧 [DEBUG] Elements with Carrio listeners: ${carrioElements.length}`);

    // Try to extract job details for testing
    const jobTitleSelectors = [
        'h1.job-title',
        '.job-details-jobs-unified-top-card__job-title h1',
        '.jobs-unified-top-card__job-title a',
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-unified-top-card__job-title',
    ];

    let jobTitle = '';
    for (const selector of jobTitleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
            jobTitle = element.textContent.trim();
            console.log(`📝 [DEBUG] Job title found with "${selector}": "${jobTitle}"`);
            break;
        }
    }

    if (!jobTitle) {
        console.log('❌ [DEBUG] No job title found');
    }

    // Company name extraction test
    const companySelectors = [
        '.job-details-jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name a',
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name',
    ];

    let companyName = '';
    for (const selector of companySelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
            companyName = element.textContent.trim();
            console.log(`🏢 [DEBUG] Company name found with "${selector}": "${companyName}"`);
            break;
        }
    }

    if (!companyName) {
        console.log('❌ [DEBUG] No company name found');
    }

    // Final diagnostic summary
    console.log('📋 [DEBUG] Diagnostic Summary:');
    console.log('  - Job Page:', isJobPage);
    console.log('  - Total Buttons:', allButtons.length);
    console.log('  - Apply Buttons:', potentialApplyButtons.length);
    console.log('  - Job Title:', jobTitle || 'Not found');
    console.log('  - Company:', companyName || 'Not found');
    console.log('  - Turkish Interface:', hasTurkish);
    console.log('  - Carrio Elements:', carrioElements.length);

    return {
        isJobPage,
        totalButtons: allButtons.length,
        applyButtons: potentialApplyButtons.length,
        jobTitle,
        companyName,
        hasTurkish,
        carrioElements: carrioElements.length,
        potentialApplyButtons,
    };
}

// Auto-run diagnostics after page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runDiagnostics, 2000);
    });
} else {
    setTimeout(runDiagnostics, 2000);
}

// Add global function for manual testing
window.carrioDebug = {
    runDiagnostics,
    testButtonDetection: () => {
        console.log('🧪 [DEBUG] Manual button detection test...');
        return runDiagnostics();
    },
    simulateClick: (buttonIndex) => {
        const buttons = document.querySelectorAll('button');
        if (buttons[buttonIndex]) {
            console.log(`🖱️ [DEBUG] Simulating click on button ${buttonIndex}:`, buttons[buttonIndex]);
            buttons[buttonIndex].click();
        } else {
            console.log(`❌ [DEBUG] Button ${buttonIndex} not found`);
        }
    },
};

console.log('✅ [CARRIO DEBUG] Diagnostic tools ready. Use window.carrioDebug.runDiagnostics() to test manually.');
