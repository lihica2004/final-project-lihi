import './DeclineReason.css'
import { Link } from 'react-router-dom'; 
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useState, useContext, useRef } from "react";

const DeclineReason = (props) => {
    const explanationInputRef = useRef()
    const authCtx = useContext(AuthContext);


    const cancelHandler = () => {
        window.location.reload(true);
    }
    

    const declineHandler = async () => {
        try {
          await axios.patch(`/requests/${props.id}`, { 
         status: 'הבקשה נדחתה',
         declineExplanation: explanationInputRef.current.value
       },{
           headers: { 'Authorization': "Bearer " + authCtx.token },
       }
       );
          window.location.reload(true);
        } catch (e) {
          console.log(e.message);
        }
  }

    

      

    return (
        <div className="dark">
            <div className='card'>
                <h1>דחיית בקשה</h1>
                <textarea placeholder='אופציונלי: יש לכתוב כאן את הסיבה לדחיית הבקשה' ref={explanationInputRef}/>
                <button onClick={declineHandler}>שלח</button>
                <button className='btnCancel' onClick={cancelHandler}>X</button>
            </div>
        </div>
    )
}

export default DeclineReason;