// Wait for the document to be fully loaded before initializing
(function() {
    // Function to initialize everything when the DOM is ready
    function initializeAll() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70, // Offset for the sticky header
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize the cacao production map
        initCacaoMap();
        
        // Animate supply chain steps on scroll
        const steps = document.querySelectorAll('.step');
        
        function checkScroll() {
            steps.forEach(step => {
                const stepTop = step.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (stepTop < windowHeight * 0.8) {
                    step.classList.add('visible');
                }
            });
        }
        
        // Initial check in case elements are already in view
        checkScroll();
        
        // Check on scroll
        window.addEventListener('scroll', checkScroll);
        
        // Back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.classList.add('back-to-top');
        document.body.appendChild(backToTopBtn);
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        
        window.addEventListener('scroll', toggleBackToTopButton);
        
        // Chat Bot Functionality
        initChatBot();
    }

    // Check if the document is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        // Document already loaded, run initialization immediately
        initializeAll();
    }
})();

// Function to initialize the chat bot
function initChatBot() {
    // Get chat bot elements
    const chatBotBubble = document.getElementById('chatBotBubble');
    const chatBotPanel = document.getElementById('chatBotPanel');
    const chatBotClose = document.getElementById('chatBotClose');
    const chatBotInput = document.getElementById('chatBotInput');
    const chatBotSend = document.getElementById('chatBotSend');
    const chatBotMessages = document.getElementById('chatBotMessages');
    
    // Check if all elements exist
    if (!chatBotBubble || !chatBotPanel || !chatBotClose || !chatBotInput || !chatBotSend || !chatBotMessages) {
        console.error('Chat bot elements not found. Chat functionality will not be available.');
        return;
    }
    
    // API configuration
    const API_URL = 'https://openwebui.valuechainhackers.xyz/api/chat/completions';
    const MODEL_ID = 'chocy';
    
    // Chat history to maintain context
    let chatHistory = [
        {
            role: 'system',
            content: 'You are a helpful assistant that provides information about the cacao supply chain.'
        }
    ];
    
    // Toggle chat panel when bubble is clicked
    chatBotBubble.addEventListener('click', function() {
        chatBotPanel.classList.toggle('active');
        if (chatBotPanel.classList.contains('active')) {
            chatBotInput.focus();
        }
    });
    
    // Close chat panel when close button is clicked
    chatBotClose.addEventListener('click', function() {
        chatBotPanel.classList.remove('active');
    });
    
    // Send message when send button is clicked
    chatBotSend.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed in the input field
    chatBotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = chatBotInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        
        // Add to chat history
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        // Clear input
        chatBotInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message to API
        sendMessageToAPI(message);
    }
    
    // Function to add message to chat
    function addMessageToChat(sender, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bot-message', sender);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('chat-bot-message-content');
        messageContent.textContent = content;
        
        messageElement.appendChild(messageContent);
        chatBotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('chat-bot-message', 'bot', 'typing-indicator');
        
        const typingContent = document.createElement('div');
        typingContent.classList.add('chat-bot-typing');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('chat-bot-typing-dot');
            typingContent.appendChild(dot);
        }
        
        typingElement.appendChild(typingContent);
        chatBotMessages.appendChild(typingElement);
        
        // Scroll to bottom
        chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
        
        return typingElement;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatBotMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatBotMessages.removeChild(typingIndicator);
        }
    }
    
    // Function to send message to API
    function sendMessageToAPI(message) {
        try {
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: chatHistory
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Remove typing indicator
                removeTypingIndicator();
                
                if (data.success && data.message) {
                    // Add bot response to chat
                    addMessageToChat('bot', data.message);
                    
                    // Add to chat history
                    chatHistory.push({
                        role: 'assistant',
                        content: data.message
                    });
                } else {
                    addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add error message to chat
                addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
            });
            
            // In a real implementation with API key, you would make an actual API call like this:
            /*
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer YOUR_API_KEY`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: MODEL_ID,
                    messages: chatHistory
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add bot response to chat
                if (data.choices && data.choices.length > 0) {
                    const botResponse = data.choices[0].message.content;
                    addMessageToChat('bot', botResponse);
                    
                    // Add to chat history
                    chatHistory.push({
                        role: 'assistant',
                        content: botResponse
                    });
                } else {
                    addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error sending message to API:', error);
                
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add error message to chat
                addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
            });
            */
            
        } catch (error) {
            console.error('Error sending message to API:', error);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add error message to chat
            addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

// Function to initialize the cacao production map
function initCacaoMap() {
    // Check if the map element exists
    const mapElement = document.getElementById('cacao-map');
    if (!mapElement) return;
    
    // Initialize the map centered at 0,0 with zoom level 2 (world view)
    const map = L.map('cacao-map').setView([0, 0], 2);
    
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Define cacao production locations with details
    const locations = [
        // Farming locations
        {
            name: "Ivory Coast",
            type: "farm",
            coordinates: [7.54, -5.55],
            description: "The world's largest cacao producer, accounting for approximately 40% of global production. Most farms are small family operations of 2-5 hectares.",
            production: "2.2 million metric tons annually",
            challenges: "Deforestation, child labor concerns, and low farmer incomes"
        },
        {
            name: "Ghana",
            type: "farm",
            coordinates: [7.95, -1.03],
            description: "The world's second-largest cacao producer known for high-quality beans. Ghana's Cocoa Board (COCOBOD) regulates the industry.",
            production: "800,000 metric tons annually",
            challenges: "Aging farmer population, climate change impacts"
        },
        {
            name: "Ecuador",
            type: "farm",
            coordinates: [-1.83, -78.18],
            description: "Producer of fine flavor 'Nacional' cacao, known for floral aroma profiles. Ecuador is famous for its high-quality, aromatic cacao varieties.",
            production: "325,000 metric tons annually",
            challenges: "Disease pressure, maintaining genetic diversity"
        },
        {
            name: "Indonesia",
            type: "farm",
            coordinates: [-0.79, 113.92],
            description: "The third-largest cacao producer globally, primarily on the island of Sulawesi. Known for bulk cacao production.",
            production: "600,000 metric tons annually",
            challenges: "Pest management, quality consistency"
        },
        {
            name: "Brazil",
            type: "farm",
            coordinates: [-14.24, -51.93],
            description: "Once the world's largest producer, now focused on the domestic market. The Bahia region is known for its cacao farms.",
            production: "200,000 metric tons annually",
            challenges: "Witches' broom disease, market competition"
        },
        
        // Processing locations
        {
            name: "Amsterdam, Netherlands",
            type: "processing",
            coordinates: [52.37, 4.90],
            description: "Major cacao processing hub with large grinding facilities. The Port of Amsterdam is one of the world's largest cacao ports.",
            capacity: "Processing over 600,000 tons annually",
            companies: "Cargill, Olam, Barry Callebaut"
        },
        {
            name: "Abidjan, Ivory Coast",
            type: "processing",
            coordinates: [5.36, -4.01],
            description: "Growing processing center as Ivory Coast aims to process more cacao domestically rather than just exporting raw beans.",
            capacity: "Processing capacity expanding to 1 million tons",
            companies: "Cémoi, Barry Callebaut, Cargill"
        },
        {
            name: "Singapore",
            type: "processing",
            coordinates: [1.35, 103.82],
            description: "Strategic Asian processing hub with state-of-the-art facilities. Gateway for Asian chocolate markets.",
            capacity: "Processing over 350,000 tons annually",
            companies: "Olam, Cargill"
        },
        
        // Manufacturing locations
        {
            name: "Hershey, Pennsylvania, USA",
            type: "manufacturing",
            coordinates: [40.29, -76.65],
            description: "Home to The Hershey Company, one of the world's largest chocolate manufacturers. The town was built around the chocolate factory.",
            products: "Hershey's Kisses, Reese's, Kit Kat (US)",
            founded: "1894"
        },
        {
            name: "Vevey, Switzerland",
            type: "manufacturing",
            coordinates: [46.46, 6.84],
            description: "Headquarters of Nestlé, one of the world's largest food companies with significant chocolate production.",
            products: "KitKat (global), Crunch, various premium chocolate brands",
            founded: "1866"
        },
        {
            name: "Birmingham, UK",
            type: "manufacturing",
            coordinates: [52.48, -1.90],
            description: "Home to Cadbury's Bournville factory, a historic chocolate manufacturing site.",
            products: "Dairy Milk, Creme Egg, Roses",
            founded: "1824"
        },
        {
            name: "Cologne, Germany",
            type: "manufacturing",
            coordinates: [50.94, 6.96],
            description: "Location of Stollwerck chocolate factory and other German chocolate manufacturers. Germany has a strong tradition of chocolate making.",
            products: "Various premium and mass-market chocolate products",
            founded: "Multiple companies dating back to the 19th century"
        },
        
        // Distribution centers
        {
            name: "Rotterdam, Netherlands",
            type: "distribution",
            coordinates: [51.91, 4.48],
            description: "Europe's largest port and a major hub for cacao and chocolate distribution throughout Europe.",
            capacity: "Handles millions of tons of cacao products annually",
            reach: "Primary distribution point for European markets"
        },
        {
            name: "Dubai, UAE",
            type: "distribution",
            coordinates: [25.20, 55.27],
            description: "Strategic distribution hub connecting chocolate markets in Europe, Asia, and Africa. Growing importance in global chocolate trade.",
            capacity: "Expanding rapidly with state-of-the-art logistics",
            reach: "Middle East, North Africa, and parts of Asia"
        },
        {
            name: "Shanghai, China",
            type: "distribution",
            coordinates: [31.23, 121.47],
            description: "Key distribution center for the rapidly growing Asian chocolate market. China's chocolate consumption is increasing significantly.",
            capacity: "Handles distribution for the world's most populous country",
            reach: "China and East Asian markets"
        }
    ];
    
    // Create custom icons for different location types
    const icons = {
        farm: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        processing: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        manufacturing: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        distribution: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    };
    
    // Add markers for each location
    locations.forEach(location => {
        // Create popup content based on location type
        let popupContent = `
            <div class="map-popup">
                <h4>${location.name}</h4>
        `;
        
        // Add type badge with appropriate class
        let typeLabel = '';
        switch(location.type) {
            case 'farm':
                typeLabel = 'Farming';
                break;
            case 'processing':
                typeLabel = 'Processing';
                break;
            case 'manufacturing':
                typeLabel = 'Manufacturing';
                break;
            case 'distribution':
                typeLabel = 'Distribution';
                break;
        }
        
        popupContent += `<span class="location-type type-${location.type}">${typeLabel}</span>`;
        
        // Add description
        popupContent += `<p>${location.description}</p>`;
        
        // Add type-specific details
        if (location.type === 'farm') {
            popupContent += `
                <p><strong>Production:</strong> ${location.production}</p>
                <p><strong>Challenges:</strong> ${location.challenges}</p>
            `;
        } else if (location.type === 'processing') {
            popupContent += `
                <p><strong>Capacity:</strong> ${location.capacity}</p>
                <p><strong>Companies:</strong> ${location.companies}</p>
            `;
        } else if (location.type === 'manufacturing') {
            popupContent += `
                <p><strong>Products:</strong> ${location.products}</p>
                <p><strong>Founded:</strong> ${location.founded}</p>
            `;
        } else if (location.type === 'distribution') {
            popupContent += `
                <p><strong>Capacity:</strong> ${location.capacity}</p>
                <p><strong>Market Reach:</strong> ${location.reach}</p>
            `;
        }
        
        popupContent += `</div>`;
        
        // Create marker with appropriate icon and add to map
        L.marker(location.coordinates, {icon: icons[location.type]})
            .addTo(map)
            .bindPopup(popupContent);
    });
    
    // Add a legend to explain the marker colors
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
        
        div.innerHTML = '<h4 style="margin-top:0; margin-bottom:10px; font-size:14px;">Location Types</h4>';
        
        const types = [
            {type: 'farm', label: 'Farming'},
            {type: 'processing', label: 'Processing'},
            {type: 'manufacturing', label: 'Manufacturing'},
            {type: 'distribution', label: 'Distribution'}
        ];
        
        types.forEach(item => {
            const markerUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
                item.type === 'farm' ? 'green' : 
                item.type === 'processing' ? 'blue' : 
                item.type === 'manufacturing' ? 'orange' : 'violet'
            }.png`;
            
            div.innerHTML += `
                <div style="display:flex; align-items:center; margin-bottom:5px;">
                    <img src="${markerUrl}" style="width:12px; margin-right:5px;">
                    <span>${item.label}</span>
                </div>
            `;
        });
        
        return div;
    };
    
    legend.addTo(map);
}
