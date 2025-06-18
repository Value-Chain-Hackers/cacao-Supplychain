const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// API endpoint for chat completions
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        // Make request to OpenWebUI API
        const response = await fetch('https://openwebui.valuchainhackers.xyz/api/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENWEBUI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'chocy',
                messages
            })
        });

        if (!response.ok) {
            throw new Error('OpenWebUI API request failed');
        }

        const data = await response.json();
        
        res.status(200).json({
            success: true,
            message: data.choices[0].message.content
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request'
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
