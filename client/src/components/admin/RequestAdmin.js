import classes from "./Admin.module.css";
import moment from 'moment';

const RequestAdmin = ({request}) => {
  
  return (
        <li className={classes.reqContainer}>
              <p className={classes.reqHeader}>{request.name}</p>
              {request.status === "הבקשה פתוחה" && (
                <p className={classes.statusOpen}>{request.status}</p>
              )}
              {request.status === "הבקשה אושרה" && (
                <p className={classes.statusApproved}>{request.status}</p>
              )}
              {request.status === 'הבקשה נדחתה'&& 
            <div>
                <p className={classes.statusDecline}>{request.status}</p>
                {request.declineExplanation !== '' && <p>סיבת דחייה: {request.declineExplanation}</p>}
            </div>}
              <p>{request.explanation}</p>
              <p>{moment(request.createdAt).format('DD/MM/YYYY')}</p>
        </li>
    )
}

export default RequestAdmin;