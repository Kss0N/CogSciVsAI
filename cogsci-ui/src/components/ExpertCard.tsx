
import {Card} from "react-bootstrap"
import type {LucideIcon} from "lucide-react"

import { ChefHat, ChessQueen, Feather } from 'lucide-react';



//FIXME: put this in some cfg
const RESOURCES = {
    "cook" : {label: "köksmästaren",icon: (<ChefHat/>)},
    "chess": {label: "Grandmaster", icon: (<ChessQueen/>)},
    "poet" : {label: "Poeten",      icon:(<Feather/>)},
} as { [key: string] : {label:string, icon:React.JSX.Element}; };


export default function ExpertCard({name}: {name:string}){


    const {label, icon} = RESOURCES[name];

    return (<Card className="text-center shadow-sm m-0" style={{ width: '18rem' }}>
        <div className="bg-light p-4 d-flex justify-content-center align-items-center" style={{ fontSize: '2rem' }}>
            {icon}
        </div> 
        <Card.Body>
            <Card.Title>{label}</Card.Title>
        </Card.Body>
    </Card>)
}
