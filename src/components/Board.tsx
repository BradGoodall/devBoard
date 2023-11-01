import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Button, Spinner } from "react-bootstrap";

type BoardData = {
  backgroundURL: string;
  boardName: string;
  ownerID: string;
  timeCreated: Timestamp;
};

type Lane = {};

function Board() {
  const [isBoardFetched, setIsBoardFetched] = useState(false);
  const [boardData, setBoardData] = useState<BoardData | undefined>(undefined);
  const authUser = useContext(UserContext);

  const createBoard = async () => {
    try {
      const docRef = await addDoc(collection(db, "boards"), {
        boardTitle: authUser?.displayName,
        timeCreated: Timestamp.fromDate(new Date()),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchBoard = async () => {
    // Get the board
    const boardDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX");
    const boardDocument = await getDoc(boardDocRef);
    setBoardData(boardDocument.data() as BoardData);
    setIsBoardFetched(true);
  };

  const fetchLanes = async () => {
    // Get the lanes
    const lanesDocRef = collection(
      db,
      "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/lanes/"
    );
    const lanesData = await getDocs(lanesDocRef);
    lanesData.docs.map((doc) => ({ ...doc.data() } as Lane));
    // Sort the lanes by lanePosition
    // const sortedLanes = lanesData.docs
    //   .map((doc) => ({ ...doc.data() } as Lane))
    //   .sort((a, b) => a.lanePosition - b.lanePosition);
    // setLanes(sortedLanes);
    // setBoardData(boardData);
    // setNewBoardName(boardData.boardName);
    // setBackgroundURL(boardData.backgroundURL);
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  return (
    <>
      {!isBoardFetched && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {isBoardFetched && (
        <>
          <h1 className="text-3xl">{boardData?.boardName}</h1>
          <h2 className="text-xl">
            Created on {boardData?.timeCreated.toDate().toUTCString()}
          </h2>
          <Button variant="success" onClick={createBoard}>
            Create Board
          </Button>
        </>
      )}
    </>
  );
}
export default Board;
