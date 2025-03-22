// content.js
(function() {
    const DEBUG = false;
    
    // Time options configuration
    const TIME_OPTIONS = {
        '3600': 'Past 1 hour',
        '21600': 'Past 6 hours',
        '43200': 'Past 12 hours',
        '86400': 'Past 24 hours',
        '604800': 'Past week',
        '2592000': 'Past month'
    };

    const CUSTOM_OPTIONS = [
        { id: '1hour', value: '3600', text: 'Past 1 hour' },
        { id: '6hours', value: '21600', text: 'Past 6 hours' },
        { id: '12hours', value: '43200', text: 'Past 12 hours' }
    ];

    // Helper Functions
    const log = (message, type = 'info') => {
        if (DEBUG) console.log(`[QuickApply] ${type.toUpperCase()}: ${message}`);
    };

    const updateSelectedText = (value) => {
        const selectedTextElement = document.querySelector('#searchFilter_timePostedRange');
        if (!selectedTextElement) {
            log('Selected text element not found', 'error');
            return;
        }

        const displayText = TIME_OPTIONS[value] || 'Any time';

        // Update text while preserving SVG
        const childNodes = Array.from(selectedTextElement.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
        });
        selectedTextElement.insertBefore(document.createTextNode(displayText), selectedTextElement.firstChild);
    };

    const removeDuplicateOptions = () => {
        const timeFilterList = document.querySelector('.search-reusables__collection-values-container');
        if (!timeFilterList) return;

        const radioInputs = timeFilterList.querySelectorAll('input[name="date-posted-filter-value"]');
        const seenValues = new Map();

        // First pass: collect all options and keep the custom ones
        radioInputs.forEach(input => {
            const value = input.value.replace('r', '');
            const listItem = input.closest('li');
            const isCustom = input.id.includes('custom');
            
            if (!seenValues.has(value) || isCustom) {
                seenValues.set(value, { element: listItem, isCustom });
            }
        });

        // Second pass: remove duplicates, keeping custom options
        radioInputs.forEach(input => {
            const value = input.value.replace('r', '');
            const listItem = input.closest('li');
            const isCustom = input.id.includes('custom');
            const stored = seenValues.get(value);

            if (stored && stored.element !== listItem && !isCustom) {
                listItem.remove();
            }
        });
    };

    const createOptionElement = (option) => {
        const li = document.createElement('li');
        li.className = 'search-reusables__collection-values-item';
        li.innerHTML = `
            <input name="date-posted-filter-value" 
                   id="timePostedRange-custom-${option.id}" 
                   class="search-reusables__select-input" 
                   type="radio" 
                   value="r${option.value}">
            <label for="timePostedRange-custom-${option.id}" class="search-reusables__value-label">
                <p class="display-flex">
                    <span class="t-14 t-black--light t-normal" aria-hidden="true">
                        ${option.text}
                    </span>
                    <span class="visually-hidden">
                        Filter by ${option.text}
                    </span>
                </p>
            </label>
        `;
        return li;
    };

    const handleOptionChange = (value) => {
        updateUrlParameter(value);
        updateSelectedText(value);
        const showResultsButton = document.querySelector('.artdeco-button--primary');
        if (showResultsButton) showResultsButton.click();
    };

    const addCustomTimeOptions = () => {
        const timeFilterList = document.querySelector('.search-reusables__collection-values-container');
        if (!timeFilterList || document.getElementById('timePostedRange-custom-1hour')) return;

        removeDuplicateOptions();

        const anyTimeOption = timeFilterList.querySelector('li');
        
        // Add custom options in reverse order
        CUSTOM_OPTIONS.slice().reverse().forEach(option => {
            const optionElement = createOptionElement(option);
            if (anyTimeOption) {
                timeFilterList.insertBefore(optionElement, anyTimeOption.nextSibling);
            } else {
                timeFilterList.appendChild(optionElement);
            }

            // Add event listener
            const radio = optionElement.querySelector('input');
            if (radio) {
                radio.addEventListener('change', () => {
                    if (radio.checked) handleOptionChange(option.value);
                });
            }
        });

        // Add click handlers to existing radio buttons
        const existingRadios = timeFilterList.querySelectorAll('input[name="date-posted-filter-value"]:not([id*="custom"])');
        existingRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    const value = radio.value.replace('r', '');
                    updateSelectedText(value);
                }
            });
        });

        // Check URL and select appropriate option
        const url = new URL(window.location.href);
        const fTPRValue = url.searchParams.get('f_TPR');
        if (fTPRValue) {
            const value = fTPRValue.replace('r', '');
            const radioToSelect = timeFilterList.querySelector(`input[value="r${value}"]`);
            if (radioToSelect) {
                radioToSelect.checked = true;
                updateSelectedText(value);
            }
        }

        log('Custom time options added successfully');
    };

    const updateUrlParameter = (value) => {
        try {
            const url = new URL(window.location.href);
            const currentValue = url.searchParams.get('f_TPR');
            const newValue = `r${value}`;

            if (currentValue !== newValue) {
                url.searchParams.set('f_TPR', newValue);
                window.location.href = url.href;
            }
        } catch (error) {
            log(`Error updating URL: ${error.message}`, 'error');
        }
    };

    const updateTextFromUrl = () => {
        try {
            const url = new URL(window.location.href);
            const fTPRValue = url.searchParams.get('f_TPR');
            if (fTPRValue) {
                const value = fTPRValue.replace('r', '');
                updateSelectedText(value);
                
                const timeFilterList = document.querySelector('.search-reusables__collection-values-container');
                if (timeFilterList) {
                    const radioToSelect = timeFilterList.querySelector(`input[value="r${value}"]`);
                    if (radioToSelect) radioToSelect.checked = true;
                }
            }
        } catch (error) {
            log(`Error updating text from URL: ${error.message}`, 'error');
        }
    };

    const initialize = () => {
        chrome.storage.local.get(['extension_enabled'], (data) => {
            if (chrome.runtime.lastError || data.extension_enabled === false) return;

            addCustomTimeOptions();
            updateTextFromUrl();

            const checkInterval = setInterval(() => {
                const filterDropdown = document.getElementById('hoverable-outlet-date-posted-filter-value');
                if (filterDropdown) {
                    addCustomTimeOptions();
                    updateTextFromUrl();
                    clearInterval(checkInterval);
                }
            }, 100);
        });
    };

    // Initialize and set up observers
    initialize();

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.extension_enabled?.newValue) {
            initialize();
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'aria-hidden' && 
                mutation.target.classList.contains('artdeco-hoverable-content') &&
                mutation.target.getAttribute('aria-hidden') === 'false') {
                addCustomTimeOptions();
                updateTextFromUrl();
            }
        });
    });

    const filterDropdown = document.getElementById('hoverable-outlet-date-posted-filter-value');
    if (filterDropdown) {
        observer.observe(filterDropdown, {
            attributes: true,
            attributeFilter: ['aria-hidden']
        });
    }
})();