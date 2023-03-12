import { useRef, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import axios from "axios";
import classes from "./NewReq.module.css";
import AuthContext from '../../store/auth-context';

const Me = (props) => {
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const explanationInputRef = useRef()
  const [isEmpty, setIsEmpty] = useState(false)


  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      if (explanationInputRef.current.value !== '') {
        setIsEmpty(false)
        const res = await axios.post("/requests", {
          name: props.reqName,
          explanation: explanationInputRef.current.value,
        }, {
            headers: {'Authorization': 'Bearer '+ authCtx.token}
          
        })
        explanationInputRef.current.value = ''
        console.log(res.data);
        navigate('/me', {replace: true})
      } else {
        setIsEmpty(true)
      }
    } catch (e) {
      console.log(e.message);
    }

  }


  return <form onSubmit={submitHandler}>
    <h1 className={classes.header}>{props.reqName}</h1>
    <textarea type="text"  placeholder='יש להקליד כאן את סיבת הבקשה' ref={explanationInputRef} />
     {isEmpty && <p className={classes.errorMessage}>יש לכתוב מהי סיבת הגשת הבקשה.</p>}
     <button>הגשת בקשה</button>
  </form >
}

export default Me;
