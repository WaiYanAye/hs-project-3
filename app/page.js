'use client'

import { Box, Button, Stack, TextField, Typography, Chip, Paper } from '@mui/material'
import { useState } from 'react'


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi. I am here to make your day better.",
    },
  ])
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
    // Mock authentication logic
    if (email === 'user@example.com' && password === 'password123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials, please try again.');
    }
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    // Optionally, clear any stored tokens or session data
  };


 // State for recommended questions
const recommendedQuestions = [
  "What are your services?",
  "How can I reset my password?",
  "Can you connect me to an agent?",
  "What is your office hour?"
];


// Function to handle recommendation clicks
const handleRecommendationClick = (question) => {
  setMessage(question);
  sendMessage(question); // Automatically send the selected recommendation
};

  

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  

  if (!isAuthenticated) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f0f0f0"
      >
        <Paper elevation={3} style={{ width: '400px', padding: '2rem' }}>
          <Typography variant="h5" mb={3}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f0f0"
    >
      <Paper elevation={3} style={{ width: '500px', height: '700px', display: 'flex', flexDirection: 'column' }}>
        <Box p={2} bgcolor="primary.main" color="white" borderRadius="8px 8px 0 0">
          <Typography variant="h6">Customer Support AI</Typography>
        </Box>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          p={2}
          bgcolor="#ffffff"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? '#f5f5f5'
                    : 'secondary.main'
                }
                color={message.role === 'assistant' ? 'black' : 'white'}
                borderRadius={16}
                p={2}
                maxWidth="75%"
                boxShadow={1}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>


{/*       
<Stack direction="row" spacing={1} p={2} bgcolor="#f7f7f7" flexWrap="wrap">
  {recommendedQuestions.map((question, index) => (
    <Chip
      key={index}
      label={question}
      onClick={() => handleRecommendationClick(question)}
      sx={{ cursor: 'pointer', margin: '4px' }}
    />
  ))}
</Stack> */}

   {/* Show recommended questions only if no user messages exist */}
   {messages.filter(msg => msg.role === 'user').length === 0 && (
          <Stack direction="row" spacing={1} p={2} bgcolor="#f7f7f7" flexWrap="wrap">
            {recommendedQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => handleRecommendationClick(question)}
                sx={{ cursor: 'pointer', margin: '4px' }}
              />
            ))}
          </Stack>
        )}


        <Stack
          direction={'row'}
          spacing={2}
          p={2}
          bgcolor="#f7f7f7"
          borderRadius="0 0 8px 8px"
        >
          <TextField
            label="Type your message..."
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ borderRadius: 4 }}
          />
          <Button variant="contained" color="primary" onClick={sendMessage} sx={{ borderRadius: 4 }}>
            Send
          </Button>

        </Stack>  
        
        <Button onClick={handleLogout} variant="contained" color="primary">
                Logout
              </Button>
      </Paper>
        
    </Box>

    
  )
}
