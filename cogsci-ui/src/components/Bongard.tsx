import './Pin.css';

import { useState, useRef, useEffect} from 'react';
import type {KeyboardEvent, MouseEvent} from 'react'
import {v4 as uuid} from 'uuid';

import { Container, Row, Ratio, Col, Form, Button, InputGroup, Image, Badge } from 'react-bootstrap';
import { Stack, Card } from 'react-bootstrap';


let my_problem = {
    image : "p0001.png",
    alpha : 2.0/3,
    correct : 0,
    alts : ["Vänster: Inget, Höger: Något", "Vänster: Små saker, Höger: Stora saker", "Vänster: Linjer, Höger: Mönster"],
};
let my_problem2 = {
    image : "p0002.png",
    alpha : 3.0/3,
    correct : 2,
    alts : ["Vänster: Ovaler, Höger: rektanglar", "Vänster: Vita former, Höger: Svarta former", "Vänster: Stora saker, Höger: små saker"],
};
let my_problem3 = {
    image : "p0005.png",
    alpha : 2.0/3,
    correct : 0,
    alts : ["Vänster: Hårda kanter, Höger: mjuka kanter", "Vänster: Konvexa former, Höger: konkava former", "Vänster: rektanglar, Höger: Tomt"],
};
let my_problem4 = {
    image : "p0008.png",
    alpha : 0.0/3,
    correct : 1,
    alts : ["Vänster: Hårda kanter, Höger: mjuka kanter", "Vänster: Allt är på höger sida, Höger: Allt är på vänster sida", "Vänster: Linjer, Höger: Mönster"],
};
let problems_list = [my_problem, my_problem2, my_problem3, my_problem4];


function getProbability(alpha : number, index : number, correct : number) : number{
    if (index == correct){
        return alpha;
    }
    else {
        return (1.0 - alpha) / 2.0;
    }
}
function getPoints(myChoice: number, aiChoice: number, correct: number): Array<number> {
    if (myChoice == correct && aiChoice != correct) return [10, 0];
    else if (myChoice == correct && myChoice == aiChoice) return [5,5];
    else if (myChoice != correct && aiChoice == correct) return [0, 10];
    else return [0,0]
}
function weightedSample(items : Array<Any>, weights : Array<number>) {
  let random = Math.random();

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random < 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}


function selectButtonVariant(idx:number, correct:number, myChoice:number, aiChoice:number) : String {
    if (myChoice === -1 || aiChoice === -1) {
        console.assert(myChoice === aiChoice, "Both choices should be -1");
        return "secondary";
    }
    if (idx === correct) return "success";
    if (idx === myChoice) return "danger";
    if (idx === aiChoice) return "info";
    else return "secondary"
}


function Pin({ text = "You are here", variant = "danger", visible=false }) {
  return (
    <div className={`d-inline-block ${visible ? "visible" : "invisible"} mb-2`}>
      <Badge rounded-pill bg={variant} className={`pin-badge pin-${variant} px-3 py-2 fs-6 shadow-sm`}>
        {text}
      </Badge>
    </div>
  );
}

function AlternativeButton({key, alt, index, onClick, variant, disabled=false, pinVisible=false}) {

    let myOnClick = (e) => {
        onClick(index)
    }

    return (<div className="p-2 text-center">
        <Pin text="AI" variant="info" visible={pinVisible} />
        <Button variant={variant} key={key} onClick={myOnClick} disabled={disabled}>
            <Card>
                {alt}
            </Card>
        </Button>
    </div>);
}


function FinishScreen({myPoints, aiPoints})
{

    const didWin = myPoints > aiPoints;
    const didTie = myPoints === aiPoints;
    const didLose = myPoints < aiPoints
    const title = didWin ? 
        "Grattis du vann mot AI!" : didTie ? 
        "Du spelade lika, kanske är du bättre i alla fall?" : 
        "Du förlorade. Det är bäst att förbereda sig på Terminator!";

    return (<Container fluid>
        <h1>{title}</h1>
        <p>{`Dina poäng: ${myPoints}, AI poäng: ${aiPoints}`}</p>
    </Container>)
}


function Bongard() {

    let [problem_index, setProblemIndex] = useState(0);
    let [myPoints, setMyPoints] = useState(0);
    let [aiPoints, setAiPoints] = useState(0);

    let [myChoice, setMyChoice] = useState(-1);
    let [aiChoice, setAiChoice] = useState(-1);

    let problem = problems_list[problem_index];

    let onButtonClick = (index) => {
        if (myChoice != -1 && aiChoice != -1) return;

        let myChoice_ = index;

        let indexList = [0,1,2];
        let probsList = indexList.map((idx) => getProbability(problem.alpha, idx, problem.correct))
        let aiChoice_ = weightedSample(indexList, probsList);

        let [myPointsAdd, aiPointsAdd] = getPoints(myChoice_, aiChoice_, problem.correct);
        setMyPoints(myPoints + myPointsAdd);
        setAiPoints(aiPoints + aiPointsAdd);

        console.log("I chose:", myChoice_);
        console.log("AI chose:", aiChoice_)

        setMyChoice(myChoice_);
        setAiChoice(aiChoice_);
    };
    let handleFreeClick = () => {
        if (myChoice == -1 && aiChoice == -1) return;

        setProblemIndex((ix)=> ix + 1);
        setMyChoice(_ => -1);
        setAiChoice(_ => -1);
    }

    
    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (
                event.target.closest('button') ||
                event.target.closest('a') ||
                event.target.closest('.ignore-proceed')
            ) {
                return;
            }
            handleFreeClick();
        };
        // Attach the event listener to the document
        document.addEventListener('click', handleGlobalClick);
        // Clean up the listener when the component unmounts
        return () => {document.removeEventListener('click', handleGlobalClick);};
    }, [myChoice, aiChoice, problem_index]);
    const isFinished = problem_index >= problems_list.length;
    return isFinished ? (<FinishScreen myPoints={myPoints} aiPoints={aiPoints}/>) : (
        <Container fluid>
        <h1>Vad är mönstret?</h1>
        <p>Poäng: {myPoints}, AI poäng: {aiPoints}</p>
        
        <Stack direction="vertical" gap={2} className="margin-top-2">
            
            <Container style={{ width: '50' }} className="border border-danger">
                <Ratio aspectRatio="16x9">
                    <Image src={`/images/Bongards/${problem.image}`} alt={`Bongard problem ${problem_index + 1}`} rounded/>
                </Ratio>
            </Container>

            <Stack direction="horizontal" gap={4} className="justify-content-center border border-danger">
                {problem.alts.map((alt, index) => (
                    <AlternativeButton 
                        key={uuid} 
                        alt={alt}
                        index={index}
                        onClick={onButtonClick}
                        variant={selectButtonVariant(index, problem.correct, myChoice, aiChoice)}
                        pinVisible={aiChoice != -1 ? (index == aiChoice) : false }
                        disabled={myChoice != -1}
                    />
                ))}
            </Stack>
        </Stack>
    </Container>)
}
export default Bongard;