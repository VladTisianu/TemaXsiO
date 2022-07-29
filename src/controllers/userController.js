import datastore from "../datastore.js";
import games from "../games.js";
var gamecounter = 1;
import { v4 as uuidv4 } from 'uuid';
var myString="";
var tempstring ="";
var fullstring="";
var indexesstring="";
var numbers =[1,2,3,4,5,6,7,8,9];
var myMap = new Map();
myMap.set(1,[0,0]);
myMap.set(2,[0,1]);
myMap.set(3,[0,2]);
myMap.set(4,[1,0]);
myMap.set(5,[1,1]);
myMap.set(6,[1,2]);
myMap.set(7,[2,0]);
myMap.set(8,[2,1]);
myMap.set(9,[2,2]);
const elements2 = [
  ["-","-","-"],
  ["-","-","-"],
  ["-","-","-"]
];
const indexes=[
  ["|1 ","|2|"," 3|"],
  ["|4 ","|5|"," 6|"],
  ["|7 ","|8|"," 9|"]
]
for(let i=0;i<3;i++){
  tempstring="";

  for(let j=0;j<3;j++){
    tempstring+=indexes[i][j];
  }
  indexesstring+=`${tempstring}\n`

}
function makeBoard(elements){
  fullstring="";
for(let i=0;i<3;i++){
  tempstring="|";

  for(let j=0;j<3;j++){
    tempstring +=elements[i][j];
    tempstring +=""+"|";
  }
  fullstring += `${tempstring}\n`
}
return fullstring;
}

function checkIfWon(elements){
    if(elements[0][0]==elements[0][1]&&elements[0][1]==elements[0][2]&&elements[0][0]!="-") return [1,elements[0][0]];//check row 1
    if(elements[1][0]==elements[1][1]&&elements[1][1]==elements[1][2]&&elements[1][0]!="-") return [1,elements[1][0]];//check row 2
    if(elements[2][0]==elements[2][1]&&elements[2][1]==elements[2][2]&&elements[2][0]!="-") return [1,elements[2][0]];//check row 3

    if(elements[0][0]==elements[1][0]&&elements[1][0]==elements[2][0]&&elements[0][0]!="-") return [1,elements[0][0]];//check column 1
    if(elements[0][1]==elements[1][1]&&elements[1][1]==elements[2][1]&&elements[0][1]!="-") return [1,elements[0][1]];//check column 2
    if(elements[0][2]==elements[1][2]&&elements[1][2]==elements[2][2]&&elements[0][2]!="-") return [1,elements[0][2]];//check column 3

    if(elements[0][0]==elements[1][1]&&elements[1][1]==elements[2][2]&&elements[0][0]!="-") return [1,elements[0][0]];//check diag 1
    if(elements[0][2]==elements[1][1]&&elements[1][1]==elements[2][0]&&elements[0][2]!="-") return [1,elements[0][2]];//check diag 2

  return 0;
}




const createID = (req,res,next) =>{
  try{
    if(req.params.user=='asd'){
      throw("Username already exists");
    }
    let userID = uuidv4();
    datastore.push(`${userID} -- ${req.params.user}`)
    res.json(`${userID} -- ${req.params.user}`);
  }
  catch(err){
    res.json(err);
  }
}

const createGame = (req,res,next) =>{
  try{
    games.push({
      gameID:gamecounter,
      gameStatus:"PENDING",
      currentlyJoined:1,
      elements:elements2
    })
    res.json(`Created game with ID: ${gamecounter}`)
    gamecounter+=1;   
  }
  catch(err){
    console.error(err);
  }
}

const getGames = (req,res,next) =>{
  try{
    myString="Games IDs: ";
    games.forEach(obj=>{
      myString+=`${obj.gameID} ,`
    });
    res.json(myString)
  }
  catch(err){
    console.error(err);
  }
}

const getGamesStatus = (req,res,next) =>{
  try{
    let status = req.params.status
    if(status==='pending'||status=='finished'||status=='active'){
      status=status.toUpperCase();
    }
    myString=`Games with ${status} status IDs: `;
    games.forEach(obj=>{
      if(obj.gameStatus==status){
      myString+=`${obj.gameID},`;
      }
    });
    if(myString==`Games with ${status} status IDs: `){
      res.json("No games with that status found")
      throw("No games found")
    }
    res.json(myString)
  }
  catch(err){
    console.error(err);
  }
}

const deleteGame = (req,res,next) =>{
  try{
    let delGameID=req.params.id;
    for(let i=0;i<games.length;i++){
      if(games[i].gameID==delGameID){
        games.splice(i,1);
        break;
      }
    }
    res.json("Game deleted");
  }
  
  catch(err){
    console.error("err");
  }
}

const addPlayer = (req,res,next) =>{
  try{
    let counter=0;
    let gameID = req.params.id;
    games.forEach(obj=>{
      if(obj.gameID==gameID){
        counter=1;
        if(obj.currentlyJoined<2){
          obj.currentlyJoined+=1;
          obj.gameStatus="ACTIVE";
          res.json("You entered the table.");
        }
        else{
          res.json("Table already full");
        }

      }
    })
    if(counter==0){
      res.json("Game not found");
    }

  }
  catch(err){
    console.error("err");
  }
}

const getGameByID = (req,res,next) =>{
  try{
    let gameID=req.params.id;
    let counter=0;
    games.forEach(obj=>{
      if(obj.gameID==gameID&&obj.gameStatus=="ACTIVE"){
        counter+=1;
        let tableString = makeBoard(obj.elements);
        res.send("The current board is: \n"+fullstring+" \n Indexes are: \n"+indexesstring);
      }

    })
    if(counter==0){
      res.json("There are no active games by that ID.");
    }
  }
  catch(err){
    console.error("err");
  }
}
const addMove = (req,res,next) =>{
  try{
    let gameID=req.params.id;
    let inputs = req.body;
    let counter=0;
    var fullstring="";
    inputs.position=parseInt(inputs.position)
    if(numbers.includes(inputs.position)){
      if(inputs.value=="X"||inputs.value=="O"){
        let arrayPositions=myMap.get(inputs.position)
        let i = arrayPositions[0];
        let j= arrayPositions[1];
        
        games.forEach(obj=>{
          if(obj.gameID==gameID&&obj.elements[i][j]=="-"&&obj.gameStatus=="ACTIVE"){
            obj.elements[i][j]=inputs.value;
            counter+=1;
            fullstring = makeBoard(obj.elements);
            let myResult = checkIfWon(obj.elements);
            if(myResult[0] ==1){
              res.send(`Player with ${myResult[1]} won! Game status is now finished!`)
              obj.gameStatus="FINISHED";
              console.log(obj.gameStatus);
              return;
            }
            res.send("Position updated. Next player. \n"+fullstring+"\nPositions: \n"+indexesstring)
            return;

          }
          else{
            fullstring = makeBoard(obj.elements);
            res.send("Game is not active or there is already an element there. \n"+fullstring+"\nPositions: \n"+indexesstring)
            return;
          }
        })
        
      }
      else{
        res.send("Invalid value. \n"+fullstring+"\nPositions: \n"+indexesstring)
        return;
      }
    }
    if(counter==0){
      res.send("No game found");
      return;
    }


  }
  catch(err){
    console.error(err);
  }
}

export default { createID,createGame,getGames,getGamesStatus,deleteGame,addPlayer,getGameByID,addMove };
