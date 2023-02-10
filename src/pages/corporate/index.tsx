import * as React from 'react';
import { Box, Stack, Typography, Button, Modal, IconButton, Grid, CircularProgress, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DataTable from './coporateGrid'
import Header from './header';
import Head from "next/head";
import Image from 'next/image';
import { useState } from 'react';
import UserBar from 'components/UserBar/UserBar';

export default function Diagnostic() {

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [number, setNumber] = useState(0);
  var [count1, setCount1] = useState(0);
  var [count2, setCount2] = useState(0);
  var [count3, setCount3] = useState(0);

  const callAPI = async () => {

    /* Prevents call if the field is empty*/
    if (url != ""){
      setOpen(true);
    try {
      const urlencoded = new URLSearchParams({
        "url" : url
      });
      setIsLoading(true);
      const res = await fetch("https://asia-southeast1-starlit-array-328711.cloudfunctions.net/hack4good/api/test",
        { method: "post",
          mode: "cors",
          body: urlencoded }
      ).then(function (response) {
        setIsLoading(false);
        return response.json();
      }).then(function(data){
        /* Gets the number of total violations*/
        const number = Object.keys(data.result.violations).length
        const problems = data.result.violations
        setNumber(number);

        for (var i = 0; i < problems.length; i++) {
          console.log(problems[i].impact);
          if (problems[i].impact == "minor"){
            setCount1(++count1);
          } else if (problems[i].impact == "moderate"){
            setCount2(++count2);
          } else{
            setCount3(++count3)
          }
        }
      })
      
    } catch (err) {
      console.log(err);
    }
    }
    
  };

  const handleClose = ()  => {
    setUrl('');
    setCount1(0);
    setCount2(0);
    setCount3(0);
    setOpen(false);
  }


  return (
    <Box sx={{height:'100vh', background: '#f9f9f9', padding: '20px'}}>
      <Head>
        <title>Corporate Page</title>
      </Head>
      <div
        style={{
          overflow: "hidden",
          objectPosition: "bottom",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Image src="/InclusionLabLogo.png" alt="me" width="500" height="118" />
      </div>
      <UserBar isAssessor={false}/>
      <Stack spacing={10}>
    <Box display='flex' flex='1' justifyContent='space-around' height= '30vh' sx={{
        backgroundColor: '#f9f9f9', }}>
        <DataTable/>
    </Box>
      <Box display='flex' flex='1' justifyContent='center' 
      sx={{backgroundColor: '##f9f9f9', paddingX: '8%'}}>
        <Box display='flex' flex='1' justifyContent='center' 
        sx={{backgroundColor: '#17475F', paddingX: '8%', paddingY: '3%', borderRadius: '20px'}}>
          <Stack width={'100%'} alignItems='center' spacing={5}>
          <Header/>
          <Box
            sx={{
                width: '80%',
                maxWidth: '80%',
                background: 'white',
                borderRadius: '15px'
            }}
            >
            <TextField fullWidth 
              variant="filled" 
              label="Enter URL here" 
              id="fullWidth" 
              sx={{borderRadius: '1px'}} 
              onChange={(event) => {setUrl(event.target.value)}}
              value = {url}
              />
            </Box>
            <Button onClick={callAPI} startIcon={<AddIcon/>} 
              sx={{backgroundColor: "white", 
              color: "#000000DE", 
              borderRadius: "15px", 
              width: '171px', 
              height: '50px', 
              fontSize: '15px'}}
              disableFocusRipple
              disableRipple
              >
              Test Website
            </Button>
          </Stack>
        </Box>
        </Box>
      </Stack>

      {/* Pop up modal for automatic diagnostic*/}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '80vh',
          bgcolor: 'background.paper',
          border: '1px solid #000',
          boxShadow: 24,
          p: 4}}>
          <IconButton onClick={handleClose}>
            <CloseIcon/>
          </IconButton>
          {isLoading?
          <Box sx={{ display: 'flex',position: 'fixed', /* or absolute */
          top: '40%',
          left: '47%' }}>
            <CircularProgress size={'5rem'}/>
          </Box> :
          /* Load result when done */
          <Box justifyItems={"center"} sx={{width: '100%', paddingTop: '5%', paddingLeft: '2%'}}>
          <Grid container>
            <Grid xs={6}>
              <Typography id="modal-modal-title" variant="h4" component="h4" sx={{color: 'black'}}>
               TESTING: {url}
              </Typography>
              <Typography id="modal-modal-description" variant='h6' sx={{ mt: 2, color: 'black', paddingTop: '3%' }}>
                There are a total of <Typography variant='h4' color={(number >= 10) ? "red" : (number == 0 ? 'green' : 'orange')}>{number}</Typography> 
                {(number == 1) ? "issue" : "issues"} with your website
              </Typography>

              <Grid container sx={{paddingTop: '5%'}}>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography id="modal-modal-description"
                       variant='h6' 
                       sx={{ mt: 2, color: 'black', paddingTop: '3%' }}>
                        <Typography sx={{color: 'green',}} variant='h4'>{count1}</Typography> of them is minor
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography 
                      id="modal-modal-description" 
                      variant='h6' 
                      sx={{ mt: 2, color: 'black', paddingTop: '3%' }}>
                        <Typography sx={{color: 'orange',}} variant='h4'>{count2}</Typography> of them is moderate
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography id="modal-modal-description" variant='h6' sx={{ mt: 2, color: 'black', paddingTop: '3%' }}>
                    <Typography sx={{color: 'red',}} variant='h4'>{count3}</Typography> of them is serious
                    </Typography>
                  </Grid>
              

              </Grid>
            </Grid>
            <Grid xs={6}>
              <Stack alignItems={'center'} spacing ={2}>
                <Typography id="modal-modal-description"
                 variant='h6' 
                 sx={{ mt: 2, color: 'black', paddingTop: '3%' }}>
                  Automatic Testing can only discover so many issues. 
                  Get a new assessment to have your website manually accessed for a full report
                </Typography>
                <Box display={'flex'} flex={3} justifyContent={'center'} sx={{paddingTop: '5%'}}>
                <Grid display={'flex'} spacing={3}>
                    <Button startIcon ={<AddIcon/>} 
                      sx={{backgroundColor: "#E0E0E0", 
                      color: "#000000DE", 
                      borderRadius: "15px", 
                      marginBottom: '2%', 
                      gap: '10px'}}>
                        New Assesment
                    </Button>
                </Grid>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          </Box>}
        </Box>
      </Modal> 
    </Box>
  );
}