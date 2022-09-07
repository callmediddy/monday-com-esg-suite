import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/

const monday = mondaySdk();
const OLD_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE3NjYwMTI4NCwidWlkIjozMzQ2MDkzNCwiaWFkIjoiMjAyMi0wOC0yMVQwMDoxMDo0Ni4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTMxNTgyMzEsInJnbiI6InVzZTEifQ.LUmDgx0ng9YKgiqKtv0Em6p1mZ0mZNMFAOpOnvjwecQ'
const NEW_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE3OTU2MzY2MCwidWlkIjozNDA3NjA0MCwiaWFkIjoiMjAyMi0wOS0wN1QwODoyMjoyMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTMzNDMxMjQsInJnbiI6InVzZTEifQ.OSWJsGaVs4Wf1C9YLAIvscYhBAL33Kf3R1w3CuUDJ-I'

const App = () => {

  const [score, setScore] = useState(10)
  const [rating, setRating] = useState("AAA")
  const [color, setColor] = useState("black")

  const [mainBoardID, setMainBoardID] = useState(null)
  const [mainBoardItems, setMainBoardItems] = useState(null)


  function fetchMainBoard() {
    if (mainBoardID) {
      // let query = `query {boards (ids:${mainBoardID}){items { column_values (ids:["numbers", "status", "text2", "text4"]) {
      //   id text 
      // }}}} `;

      let query = `query {boards (ids:3198784137){items { column_values (ids:["rating"]) {
        id text value
      }}}}`

      fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': NEW_TOKEN
        },
        body: JSON.stringify({
          'query': query
        })
      })
        .then(res => res.json())
        .then(res => {
          setMainBoardItems(res.data.boards[0].items)
        });
    }
  }

  function fetchContextBoard() {
    monday.listen("context", res => {
      console.log("Inside the use effect Context object changed: ", res.data.boardIds[0]);
      if (res.data.boardIds[0] !== undefined) {
        setMainBoardID(res.data.boardIds[0])
        console.log("Board ID fetched")
      }
    })
  }

  function calculateScore() {
    if (mainBoardItems) {
      let tempScore = 1
      mainBoardItems.forEach(element => {
        let col = element.column_values
        let goal = col[0].text
        let status = col[1].text
        let goal_track = col[2].text
        let weight = col[3].text

        if (status === "Working on it") {
          let ratio = (goal_track - goal) / goal * weight
          tempScore += ratio
        }

        if (status === "Overused") {
          let ratio = (goal - goal_track) / goal * weight
          tempScore += ratio
        }

        if (status === "Underused") {
          let ratio = (goal - goal_track) / goal * weight
          tempScore += ratio
        }

        if (status === "Done") {
          let ratio = (goal_track - goal) / goal * weight
          tempScore += ratio
        }
      });
      console.log(tempScore * 10)
      setScore(tempScore * 10)
    }
  }

  function convertScoreToRating() {
    if (score > 9.0) {
      setRating("AAA")
      setColor("#258750")
      return
    }
    if (score > 8.0) {
      setRating("AA")
      setColor("#9cd326")
      return
    }
    if (score > 7.0) {
      setRating("BBB")
      setColor("#ffcb00")
      return
    }
    if (score > 6.0) {
      setRating("BB")
      setColor("#fdab3d")
      return
    }
    if (score > 5.0) {
      setRating("CCC")
      setColor("#ff7575")
      return
    }
    if (score > 4.0) {
      setRating("CC")
      setColor("#e2445c")
      return
    }
    setRating("F")
    setColor("#bb3354")
  }

  function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
  }
  function randomScore() {
    let randScore = getRandomFloat(0.0, 10.0, 2);
    console.log(randScore)
    setScore(randScore)
  }


  useEffect(() => {
    fetchContextBoard()
    // fetchBoards()
  }, [])

  useEffect(() => {
    convertScoreToRating()
  }, [score])

  useEffect(() => {
    fetchMainBoard()
  }, [mainBoardID])


  useEffect(() => {
    calculateScore()
  }, [mainBoardItems])

  return (
    <div className="App">
      <h1 style={{ fontSize: '40vh', color: `${color}` }}>{rating}</h1>
    </div>
  )
}

export default App;
