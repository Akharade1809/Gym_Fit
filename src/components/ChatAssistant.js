import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';


const ChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Initialize SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const currentTranscript = event.results[event.results.length - 1][0].transcript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);

      // Clear the input field
      setInput('');
      
      const togetherApiKey = process.env.REACT_APP_TOGETHER_API_KEY;
      // console.log(togetherApiKey);

      try {
        // Using fetch to make the API call to Together API
        const response = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${togetherApiKey}`, // Make sure API key is stored in .env file
          },
          body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            messages: [
              { role: 'system', content: 'You are a helpful gym mentor.' },
              { role: 'user', content: input },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage = {
          text: data.choices[0].message.content,
          sender: 'assistant',
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error('Error fetching response:', error);
        const errorMessage = {
          text: "I'm sorry, I couldn't process your request at the moment.",
          sender: 'assistant',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setInput(transcript);  // Use the last transcript as the message input
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* Chat Header */}
      <Box p={2} width="100%" textAlign="center" bgcolor="primary.main" color="white">
        <Typography variant="h6">Gym Assistant</Typography>
      </Box>

      {/* Messages Display */}
      <Box
        flex="1"
        p={2}
        width="100%"
        overflow="auto"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: '#f1f1f1',
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            bgcolor={message.sender === 'user' ? '#DCF8C6' : '#E8E8E8'}
            p={1.5}
            borderRadius={2}
            maxWidth="75%"
          >
            <Typography variant="body2" color="text.primary">
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider />

      {/* Input Area */}
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          p: '4px 8px',
          boxShadow: 'none',
          borderTop: '1px solid #ddd',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          sx={{ marginRight: '8px' }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
        <IconButton color="secondary" onClick={toggleListening}>
          {isListening ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatAssistant;
