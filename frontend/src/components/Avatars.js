import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import {deepPurple, teal, lightBlue, amber, deepOrange } from '@mui/material/colors';
import GradientBtn from "./Button"
import { useGradientBtnStyles } from '@mui-treasury/styles/button/gradient';


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { AreaClosed } from '@visx/shape';
import { GradientPinkBlue } from '@visx/gradient';

import { LinearGradient, RadialGradient } from '@visx/gradient';



const GradientArea = () => {
  return (
    <svg>
      <GradientPinkBlue id="gradient" />
      <AreaClosed fill="url('#gradient')" />
    </svg>
  );
};


export default function LetterAvatars(props) {
    const listing = props.listing
    console.log("listing: ", listing)
    const chubbyStyles = useGradientBtnStyles({ chubby: true, color: "pink" });
    // console.log(useGradientBtnStyles())

    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const [age, setAge] = React.useState('');

    const handleChange2 = (event) => {
      setAge(event.target.value);
    };

    const colors = [deepOrange, deepPurple, teal, lightBlue, amber, deepOrange]
  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      {/* {listing.map((name, i) => {
        let color = colors[colors%6];
        return (<Avatar key={{i}} sx={{ "bgcolor": deepOrange }}>{name}</Avatar>)
      })} */}
      <Stack direction="row" spacing={7}>
      
    {/* <Stack direction="row" spacing={7}> */}

      <Avatar sx={{ "bgcolor": deepOrange[500] }}>John</Avatar>
      

    
      <Avatar sx={{ "bgcolor": lightBlue[500] }}>Mary</Avatar>
    
    

    
    <Avatar sx={{ "bgcolor": deepPurple[500] }}>Henry</Avatar>
      
    <div>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Candidate</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange2}
          autoWidth
          label="Candidate"
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          <MenuItem value={10}>John</MenuItem>
          <MenuItem value={21}>Mary</MenuItem>
          <MenuItem value={22}>Henry</MenuItem>
        </Select>
      </FormControl>
    </div>
    
    
      {/* </Stack> */}
</Stack>


      
      
      
      

      {/* <Button classes={chubbyStyles}>Vote</Button> */}
      {/* <Button style={{backgroundColor: "pink"}} classes={chubbyStyles}>Register</Button>
      <div style={{backgroundColor: "linear-gradient( 90deg,Color1,Color2 )"}}>sadf</div> */}
      {/* <GradientArea /> */}
      {/* <LinearGradient from="#a18cd1" to="#fbc2eb" />; */}
      <button  className="cta-button connect-wallet-button2"></button> 
      <button  className="cta-button connect-wallet-button3"></button>
      {/* <h1 className="gradient-text ">hrnlkj</h1> */}
    </div>
  );
}