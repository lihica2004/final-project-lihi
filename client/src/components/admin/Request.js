import classes from './AdminOpen.module.css'
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useState, useContext, useEffect } from "react";
import moment from 'moment';
import DeclineReason from "../UI/DeclineReason";


const Request = ({request}) => {
    const authCtx = useContext(AuthContext);
    const [isDecline, setIsDecline] = useState(false);
    const [username, setUsername] = useState('');

    async function getUsers() {
      const response = await axios.get(`/users`, {
        headers: { Authorization: "Bearer " + authCtx.token },
      });
      // console.log(response.data);
      return response.data;
    }

    useEffect(() => {
      const x = async () => {
        try {
          const users = await getUsers();
          const username = users.find((person) => person._id === request.owner).email
          setUsername(username)
            console.log(username);
        } catch (e) {
          console.log(e.message);
        }
      };
      x();
    }, []);
  

    const approvedHandler = async (id) => {
        try {
          await approveRequest(id);
          window.location.reload(true);
        } catch (e) {
          console.log(e.message);
        }
  }

  async function approveRequest(id) {
       await axios.patch(`/requests/${id}`, { 
          status: 'הבקשה אושרה'
        },{
            headers: { 'Authorization': "Bearer " + authCtx.token },
        }
        );
  }

  const declineButton = () => {
    setIsDecline(true)
  }


    return (
        <li className={classes.reqContainer}>
            <p className={classes.reqHeader}>{request.name}</p>
            <div className={classes.btnContainer}>
              <button className={classes.statusYes} onClick={ () => approvedHandler(request._id)}>אישור</button>
              <button onClick={declineButton} className={classes.statusNo}>סירוב</button>
            </div>
            <p className={classes.reqExp}>{request.explanation}</p>
            <p>{username}</p>
            <p>{moment(request.createdAt).format('DD/MM/YYYY')}</p>
            {isDecline && <DeclineReason id={request._id} />}
        </li>
    )
}

export default Request;