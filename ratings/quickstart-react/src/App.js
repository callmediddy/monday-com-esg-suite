import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
import Favorite from "monday-ui-react-core/dist/icons/Favorite"

const monday = mondaySdk();

const OLD_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE3NjYwMTI4NCwidWlkIjozMzQ2MDkzNCwiaWFkIjoiMjAyMi0wOC0yMVQwMDoxMDo0Ni4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTMxNTgyMzEsInJnbiI6InVzZTEifQ.LUmDgx0ng9YKgiqKtv0Em6p1mZ0mZNMFAOpOnvjwecQ'
const NEW_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE3OTU2MzY2MCwidWlkIjozNDA3NjA0MCwiaWFkIjoiMjAyMi0wOS0wN1QwODoyMjoyMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTMzNDMxMjQsInJnbiI6InVzZTEifQ.OSWJsGaVs4Wf1C9YLAIvscYhBAL33Kf3R1w3CuUDJ-I'

const App = () => {


  const [mainBoardID, setMainBoardID] = useState(null)
  const [mainBoardItems, setMainBoardItems] = useState([])
  const [score, setScore] = useState(5)
  const [antiScore, setAntiScore] = useState(0)

  function fetchMainBoard() {
    if (mainBoardID) {
      let query = `query {boards (ids:${mainBoardID}){items { column_values (ids:["rating"]) {
        id text 
      }}}} `;

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

  function calculateRating() {
    let totalScore = 0
    if (mainBoardItems.length > 0) {
      console.log("Main board items are")
      mainBoardItems.forEach(element => {
        totalScore += parseFloat(element.column_values[0].text)
      });
      let averageScore = totalScore / mainBoardItems.length
      let roundedScore = Math.round(averageScore)
      setScore(roundedScore)
      setAntiScore(5 - roundedScore)
    }
    console.log(score)
    console.log(antiScore)
  }

  useEffect(() => {
    fetchContextBoard()
  }, [])


  useEffect(() => {
    fetchMainBoard()
  }, [mainBoardID])

  useEffect(() => {
    calculateRating()
  }, [mainBoardItems])


  return (
    <div className="App">
      {[...Array(score)].map((e, i) => <div style={{ color: "var(--color-egg_yolk)" }}><Favorite size="huge" /></div>)}
      {[...Array(antiScore)].map((e, i) => <div style={{ color: "var(--color-american_gray)" }}><Favorite size="huge" /></div>)}
    </div>
  )
}

export default App;
