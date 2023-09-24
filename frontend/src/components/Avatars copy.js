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



export default function LetterAvatars(props) {
    const listing = props.listing
    const chubbyStyles = useGradientBtnStyles({ chubby: true });

    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const colors = [deepOrange, deepPurple, teal, lightBlue, amber, deepOrange]
  return (
    <div>
      {/* {listing.map((name, i) => {
        let color = colors[colors%6];
        return (<Avatar key={{i}} sx={{ "bgcolor": deepOrange }}>{name}</Avatar>)
      })} */}
      
      <FormControl>
  <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={value}
    onChange={handleChange}
  >
    {/* <Stack direction="row" spacing={7}> */}

      <Avatar sx={{ "bgcolor": deepOrange[500] }}>John</Avatar>
      <FormControlLabel value="John" control={<Radio />} label="John" />

    
      <Avatar sx={{ "bgcolor": lightBlue[500] }}>,Mary</Avatar>
      <FormControlLabel value="Mary" control={<Radio />} label="Mary" />
    

    
    <Avatar sx={{ "bgcolor": deepPurple[500] }}>Henry</Avatar>
      <FormControlLabel value="Henry" control={<Radio />} label="Henry" />
    
    
    {/* </Stack> */}
  </RadioGroup>
</FormControl>


      
      
      
      

      <Button classes={chubbyStyles}>Chubby</Button>

      
    </div>
  );
}