import React, { useState } from 'react';
import { Box, Fab, Modal, Paper } from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';

import Exercises from '../components/Exercises';
import SearchExercises from '../components/SearchExercises';
import HeroBanner from '../components/HeroBanner';
import ChatAssistant from '../components/ChatAssistant';

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFabClick = () => {
    setIsChatOpen(true);
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  return (
    <Box position="relative">
      <HeroBanner />
      <SearchExercises setExercises={setExercises} bodyPart={bodyPart} setBodyPart={setBodyPart} />
      <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />
    

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleFabClick}
        sx={{
          position: 'fixed',
          bottom:48,
          right:48,
          zIndex: 1000,
          width: 80, // Custom width
          height: 80, // Custom height
        }}
      >
        <AssistantIcon sx = {{fontSize: 40}}/>
      </Fab>

      {/* Modal for ChatAssistant */}
      <Modal open={isChatOpen} onClose={handleClose}>
        <Paper 
          sx={{
            width: '90%',
            maxWidth: '600px',
            margin: 'auto',
            marginTop: '5%',
            padding: 2,
            borderRadius: '8px',
            boxShadow: 24,
            overflow: 'hidden'
          }}
        >
          <ChatAssistant />
        </Paper>
      </Modal>
    </Box>
  );
};

export default Home;
