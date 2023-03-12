import axios from "axios";
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import classes from './Me.module.css'
import LoadingSpinner from "../UI/LoadingSpinner";
import moment from 'moment';

const Me = () => {
  const authCtx = useContext(AuthContext);
  const [userRequests, setUserRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // let userRequests;

  console.log(authCtx);

  async function getID() {
    const response = await axios.get(`/requests`, { 
      headers: { 'Authorization': "Bearer " + authCtx.token },
    });
    console.log(response);
    return response.data;
  }

  async function getData () {
    const userReq = await getID();
    console.log("userReq");
    console.log(userReq);
    setUserRequests(userReq);
    setIsLoading(false)
  }

  useEffect(() => {
    console.log("123");
    try {
      getData();
    //   console.log(userRequests);
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  return (
    <div className={classes.allContainer}>
      {isLoading ? <LoadingSpinner /> :
      <>
      { userRequests.length === 0 ? <h1 className={classes.header}>אופס! עדיין לא הגשת בקשות</h1> : <h1 className={classes.header}>הבקשות שלי:</h1>}
      <Link to='/changeDetails'><button className={classes.changeDetailsBtn}>שינוי פרטים אישיים</button></Link>
      <ul type="none">{userRequests?.map( (request) => 
         <li className={classes.reqContainer}>
            <p className={classes.reqHeader}>{request.name}</p>
            {request.status === 'הבקשה פתוחה'&& <p className={classes.statusOpen}>{request.status}</p>}
            {request.status === 'הבקשה אושרה'&& <p className={classes.statusApproved}>{request.status}</p>}
            {request.status === 'הבקשה נדחתה'&& 
            <div>
                <p className={classes.statusDecline}>{request.status}</p>
                {request.declineExplanation !== '' && <p>סיבת דחייה: {request.declineExplanation}</p>}
            </div>}
            <p>{request.explanation}</p>
            <p>{moment(request.createdAt).format('DD/MM/YYYY')}</p>
        </li>
        )}
        </ul>
      </>
      
      }
    </div>
  );
};

export default Me;
