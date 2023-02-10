import { Stack } from "@mui/system";
import UserBar from "components/UserBar/UserBar";
import Head from "next/head";
import Image from "next/image";
import cx from "classnames";
import styles from "./evaluation.module.css";
import Fab from "@mui/material/Fab";
import TagBox from "components/TagBox/TagBox";
import { useState } from "react";
import axios from "axios";
function assessorEvaluation() {
  const [currStage, setStage] = useState(0);
  const [stageArr, setStageArr] = useState([[], [], [], []] as string[][]);
  const [remarks, setRemarks] = useState(["", "", "", ""]);

  const handleResult = (result: string[]) => {
    setStageArr((prev) => {
      const newArr = [...prev];
      newArr[currStage] = result;
      return newArr;
    });
  };
  const handleForward = () => {
    setStage(currStage + 1);
    console.log(stageArr);
  };

  const handleBack = () => {
    setStage(currStage - 1);
    console.log(stageArr);
  };
  const handleRemarks = (remark: string) => {
    console.log(remarks);
    setRemarks((prev) => {
      const newArr = [...prev];
      newArr[currStage] = remark;
      return newArr;
    });
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const response = await axios.post(
        "https://asia-southeast1-starlit-array-328711.cloudfunctions.net/hack4good/api/assessment/result/add",
        {
          url: "https://twilio.com",
          disability: "Dyslexia and Epilepsy",
          evalTags: JSON.stringify(stageArr),
          evalRemarks: JSON.stringify(remarks),
        },
        config
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <Head>
        <title>Assessor Evaluation Page</title>
      </Head>

      <div
        style={{
          overflow: "hidden",
          objectPosition: "bottom",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Image src="/InclusionLabLogo.png" alt="me" width="500" height="118" />
      </div>

      <div className={cx(styles["evaluation-form"])}>
        <UserBar isAssessor />
        <div className={styles.maincontent}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "40%",
              alignItems: "center",
              margin: "0px 20px",
            }}
          >
            <h3>ASSESSMENT INFORMATION:</h3>
            <textarea style={{ height: "400px", width: "100%" }}></textarea>
            <Fab
              sx={{
                backgroundColor: "#17475f",
                margin: "10px 20px",
                width: "300px",
                height: "50px",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              aria-label="visit-website"
              variant="extended"
              onClick={() => {
                console.log("go to website!!!");
              }}
            >
              VISIT WEBSITE
            </Fab>
          </div>
          <TagBox
            key={currStage}
            resultArr={stageArr}
            setResult={handleResult}
            back={handleBack}
            forward={handleForward}
            stage={currStage}
            remarks={handleRemarks}
            submit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default assessorEvaluation;