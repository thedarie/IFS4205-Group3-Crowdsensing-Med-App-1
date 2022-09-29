import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorApi } from "./DoctorAPI";
import styles from "./Examine.module.css";
import ConfirmationPopUp from "./ConfirmationPopUp";

const Submit_Examination = () => {
  const { send_exam_record } = DoctorApi();

  const patientName = localStorage.getItem("patientName");
  const token = localStorage.getItem("accessToken");
  const tokenString = " Token " + token;

  const navigate = useNavigate();

  const [prescription, setPrescription] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const cancelSubmit = () => {
    setIsSubmitted(false);
  };

  const confirmSubmit = () => {
    setIsConfirmed(true);
  };

  useEffect(() => {
    async function postData() {
      const data = {
        prescription: prescription,
        code: code,
        tokenString: tokenString,
      };

      const response = await send_exam_record(data);

      if (response.status === 200) {
        navigate("/doctor");
      } else {
        setErrMsg(response.message);
      }
    }

    if (isSubmitted && isConfirmed) {
      postData();
    }
  }, [isSubmitted, isConfirmed, prescription, code, tokenString, send_exam_record, navigate]);

  const handleViewRecords = async () => {
    navigate("/doctorviewrecords");
  };

  return (
    <div className={styles.container}>
      <section>
        <p
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        {(isSubmitted && !isConfirmed) ? <ConfirmationPopUp closePopUp={cancelSubmit} readyToSend={confirmSubmit} prescription={prescription} code={code}/> : null}

        <h1>You are prescribing {patientName}</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="prescription">Prescription:</label>
            <input
              type="text"
              id="prescription"
              autoComplete="off"
              onChange={(e) => setPrescription(e.target.value)}
              value={prescription}
              required
            />
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              autoComplete="off"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              required
            />
            <button>Submit</button>
				</form>

        <button class={styles.back_button} onClick={handleViewRecords}>View Patient Records</button>
      </section>
    </div>
  );
};
export default Submit_Examination;
