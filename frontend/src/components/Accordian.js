import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LetterAvatars from "./Avatars"

export default function SimpleAccordion(props) {
    console.log("props inside SimpleAccordion: ", JSON.stringify(props.topics[0]));
  //   {"publicKey":"3zddqHJBwuFeyXehQXS9bke8PqjJY2rncN832eV4XXng",
  //   "account":
  //       {"author":"3xfx7HR2X4RV99zeZZcCkiv5BLsrG1ydbypmx8RRHVmK",
  //       "timestamp":"62e3ee4a",
  //       "topic":"Next president for 2022",
  //       "options":"Donald Trump, Jane Doe, Clinton, John Doe",
  //       "voters":["9tsBt6QWSVN7VfwEAPZgda56ensra39VbErVp96AehFW"],
  //       "votes":["00"]}
  // }
    let votetopics = props["topics"][0]
    // .toBase58()
    console.log("votetopics ", votetopics)
    // console.log(votetopics[0]["publicKey"])
    // console.log(votetopics[0].account)

    // create model for each votetopic:
  return (
    <div>

      {props.topics.map((item, i) => {
        return (
          // <div key={i} style={{color: "white"}}>Hello</div>
          <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{item["account"]["topic"]}</Typography>
            {/* <p>Address: {item["publicKey"].toBase58()}</p> */}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {item["account"]["options"].split(",")}

              <LetterAvatars listing={item["account"]["options"].split(",")} />
            </Typography>
          </AccordionDetails>
        </Accordion>
        )
      })}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion> */}
    </div>
  );
}
