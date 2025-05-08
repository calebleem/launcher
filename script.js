document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const gameTitleDisplay = document.querySelector('.game-title');

    // Generic selectors for elements within content sections
    const selectedItemDisplays = document.querySelectorAll('.selected-item-display');
    const launchActionButtons = document.querySelectorAll('.launch-action-button');
    const launchActionStatuses = document.querySelectorAll('.launch-action-status');
    const itemLists = document.querySelectorAll('.item-list-ul');

    // Keep track of selected items per content type
    let selectedItems = {
        java: null,
        hack: null
    };

    // Version URLs map
    const versionUrls = {
        "Indev": "https://eaglercraft.com/mc/indev/",
        "alpha 1.2.6": "https://eaglercraft.com/mc/a1.2.6/",
        "beta 1.3": "https://eaglercraft.com/mc/b1.3/",
        "beta 1.7.3": "https://eaglercraft.com/mc/b1.7.3/",
        "release 1.5.2": "https://eaglercraft.com/mc/1.5.2/",
        "release 1.8.8": "https://eaglercraft.com/mc/1.8.8/",
        "release 1.12.2": "https://eaglercraft.com/mc/1.12.2/"
    };

    // Hack Client URLs map
    const hackUrls = {
        "Wurst-X (1.8.8)": "./wurst.html",
        "Dragon-X (1.8.8)": "./dragon.html",
        "Oddfuture (1.5.2)": "./odd.html",
        "Nit (1.5.2)": "./nit.html"
    };

    // Function to get elements for the currently active section
    const getActiveSectionElements = () => {
        const activeSection = document.querySelector('.content-section:not(.hidden)');
        if (!activeSection) return null;

        const type = activeSection.id === 'java-edition-content' ? 'java' : activeSection.id === 'hacks-content' ? 'hack' : null;
        if (!type) return null;

        return {
            type: type,
            selectedDisplay: activeSection.querySelector('.selected-item-display'),
            launchButton: activeSection.querySelector('.launch-action-button'),
            launchStatus: activeSection.querySelector('.launch-action-status'),
            itemList: activeSection.querySelector('.item-list-ul')
        };
    };

    // Function to show a specific content section
    const showContent = (contentId) => {
        contentSections.forEach(section => {
            section.classList.add('hidden');
        });
        const activeSection = document.getElementById(contentId);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            // Update the header title based on the selected nav item text (exclude icon alt text)
            const navItemElement = document.querySelector(`.nav-item[data-content="${contentId}"]`);
            // Get only the text node content, ignoring child elements like img
            const navItemText = Array.from(navItemElement.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(''); // Join text nodes, handles potential multiple nodes

            gameTitleDisplay.textContent = navItemText;
        }

        // Initialize state for the newly shown section
        const activeElements = getActiveSectionElements();
        if (activeElements) {
            const type = activeElements.type;
            const selectedItem = selectedItems[type];
            const selectedDisplay = activeElements.selectedDisplay;
            const launchButton = activeElements.launchButton;
            const launchStatus = activeElements.launchStatus;

            if (type === 'java') {
                selectedDisplay.textContent = selectedItem ? `Selected: ${selectedItem}` : 'Select a version to launch';
            } else if (type === 'hack') {
                selectedDisplay.textContent = selectedItem ? `Selected: ${selectedItem}` : 'Select a hack client to launch';
            }

            launchButton.disabled = !selectedItem;
            launchStatus.textContent = selectedItem ? '' : (type === 'java' ? 'Select a version to launch' : 'Select a hack client to launch');
        }
    };

    // Event listeners for left navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove selected class from all nav items
            navItems.forEach(nav => nav.classList.remove('selected'));

            // Add selected class to the clicked item
            item.classList.add('selected');

            // Show the corresponding content section
            const contentId = item.dataset.content;
            showContent(contentId);
        });
    });

    // Event listeners for item lists in content sections
    itemLists.forEach(list => {
        list.addEventListener('click', (event) => {
            const clickedElement = event.target.closest('li');
            if (clickedElement) {
                // Get active section elements
                const activeElements = getActiveSectionElements();
                if (activeElements) {
                    const type = activeElements.type;
                    const selectedItemDisplay = activeElements.selectedDisplay;
                    const launchButton = activeElements.launchButton;
                    const launchStatus = activeElements.launchStatus;

                    // Remove selected class from all items in the list
                    list.querySelectorAll('li').forEach(item => item.classList.remove('selected'));

                    // Add selected class to the clicked item
                    clickedElement.classList.add('selected');

                    // Update selected item
                    const selectedItem = clickedElement.dataset.version || clickedElement.textContent.trim();
                    selectedItems[type] = selectedItem;

                    // Update selected item display
                    if (type === 'java') {
                        selectedItemDisplay.textContent = `Selected: ${selectedItem}`;
                    } else if (type === 'hack') {
                        selectedItemDisplay.textContent = `Selected: ${selectedItem}`;
                    }

                    // Enable launch button
                    launchButton.disabled = false;

                    // Clear previous status message
                    launchStatus.textContent = '';
                }
            }
        });
    });

    // Event listeners for launch buttons in content sections
    launchActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get active section elements
            const activeElements = getActiveSectionElements();
            if (activeElements) {
                const type = activeElements.type;
                const launchStatus = activeElements.launchStatus;

                // Check if a version or hack client is selected
                if (selectedItems[type]) {
                    // Launch the game or hack client
                    if (type === 'java') {
                        const gameUrl = versionUrls[selectedItems[type]];
                        launchStatus.textContent = `Launching Minecraft ${selectedItems[type]}...`;
                        button.disabled = true; // Disable during launch
                        navItems.forEach(item => item.style.pointerEvents = 'none'); // Disable navigation during launch preparation

                        // Navigate the current page to the game URL
                        setTimeout(() => { // Small delay to show "Launching..." message
                            window.location.href = gameUrl;
                        }, 500);
                    } else if (type === 'hack') {
                        const hackUrl = hackUrls[selectedItems[type]];
                        launchStatus.textContent = `Launching ${selectedItems[type]}...`;
                        button.disabled = true; // Disable during launch
                        navItems.forEach(item => item.style.pointerEvents = 'none'); // Disable navigation during launch preparation

                        // Navigate the current page to the hack client URL
                        setTimeout(() => { // Small delay to show "Launching..." message
                            window.location.href = hackUrl;
                        }, 500);
                    }
                } else {
                    launchStatus.textContent = type === 'java' ? 'Please select a version first.' : 'Please select a hack client first.';
                }
            }
        });
    });

    // Initial display: show the default selected content (Java Edition)
    const initialContentId = document.querySelector('.nav-item.selected').dataset.content;
    showContent(initialContentId);
});