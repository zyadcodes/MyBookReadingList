// This is the main website where the user will be able to add books to their lists
import React, { useEffect, useState } from "react";
import "./App.test";
import "./App.css";
import { searchForBook } from "./BooksAPI";
import { TextField } from "@material-ui/core";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Modal from "react-awesome-modal";
import querystring from "query-string";

// Creates the functional component
const App = (props) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [bookClicked, setBookClicked] = useState("");
  const [clickVisible, setClickVisible] = useState(false);
  const [bookStatus, setBookStatus] = useState("");
  const [bookRating, setBookRating] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [notes, setNotes] = useState("");

  // Sets the initial user's list
  useEffect(() => {
    retrieveSavedList();
  }, []);

  // Retrieves the saved list
  const retrieveSavedList = async () => {
    const savedList = await localStorage.getItem("savedList");
    if (savedList) {
      setCurrentList(JSON.parse(savedList));
    }
  };

  // This is going to search for the books and control the state of the scree
  const searchForBookFunction = async (bookTitle) => {
    const arrayOfResults = await searchForBook(bookTitle);
    setSearchResults(arrayOfResults);
  };

  const saveBook = async () => {
    const object = {
      bookClicked,
      bookStatus: bookStatus.value ? bookStatus.value : "",
      bookRating: bookRating.value ? bookRating.value : "",
      bookNotes: notes ? notes : "",
    };
    setClickVisible(false);
    let newList = currentList;
    newList.push(object);
    setCurrentList(newList);
    await localStorage.setItem("savedList", JSON.stringify(newList));
    setBookClicked("");
    setSearch("");
    setSearchResults("");
    setBookStatus("");
    setBookRating("");
  };

  return (
    <div className={"container"}>
      <div className={"titleText"}>My Reading Book List</div>
      <div className={"textFieldContainer"}>
        <TextField
          id="outlined-basic"
          label="Search Book Title"
          variant="outlined"
          fullWidth
          onChange={(event) => {
            setSearch(event.target.value);
            searchForBookFunction(event.target.value);
          }}
          placeholder={"Type a book's title..."}
          value={search}
        />
      </div>
      {searchResults.length === 0 || search.trim() === "" ? (
        ""
      ) : (
        <div className={"resultsContainer"}>
          {searchResults.map((eachResult) => (
            <div
              className={"eachResultContainer"}
              onClick={() => {
                setBookClicked(eachResult);
                setClickVisible(true);
              }}
            >
              <img
                className={"thumbnailStyle"}
                src={eachResult.imageLinks.smallThumbnail}
              />
              <div className={"resultsText"}>
                <div>{eachResult.title}</div>
                <div className={"verticalSpacer"} />
                <div className={"authorText"}>{eachResult.authors[0]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={"bookListContainer"}>
        {currentList.length > 0
          ? currentList.map((eachBook) => {
              return (
                <div
                  className={"bookListItemContainer"}
                  onClick={() => {
                    setBookClicked(eachBook.bookClicked);
                    setBookStatus(eachBook.bookStatus);
                    setBookRating(eachBook.bookRating);
                    setClickVisible(true);
                  }}
                >
                  <div
                    className={
                      eachBook.bookStatus === "Reading"
                        ? "bar blue"
                        : eachBook.bookStatus === "Completed"
                        ? "bar green"
                        : eachBook.bookStatus === "Plan to Read"
                        ? "bar gray"
                        : "bar white"
                    }
                  />
                  <img
                    src={eachBook.bookClicked.imageLinks.smallThumbnail}
                    className={"bookListImage"}
                  />
                  <div className={"resultsText textStart"}>
                    <div>{eachBook.bookClicked.title}</div>
                    <div className={"verticalSpacer"} />
                    <div>By {eachBook.bookClicked.authors[0]}</div>
                  </div>
                  <div className={"resultsText textStart"}>
                    <div>Status</div>
                    <div className={"verticalSpacer"} />
                    <div>
                      {eachBook.bookStatus ? eachBook.bookStatus : "No Status"}
                    </div>
                  </div>
                  <div className={"resultsText textStart"}>
                    <div>Rating</div>
                    <div className={"verticalSpacer"} />
                    <div>
                      {eachBook.bookRating ? eachBook.bookRating : "No Rating"}
                    </div>
                  </div>
                  <div className={"resultsText textStart"}>
                    <div>Notes</div>
                    <div className={"verticalSpacer"} />
                    <div>
                      {eachBook.bookNotes ? eachBook.bookNotes : "No Additional Notes"}
                    </div>
                  </div>
                  <div />
                  <div />
                </div>
              );
            })
          : ""}
      </div>
      <Modal
        visible={clickVisible}
        width="600"
        height="675"
        effect="fadeInUp"
        onClickAway={() => setClickVisible(false)}
      >
        <div className={"modalContainer"}>
          <div className={"bookInfoContainer"}>
            <div className={"verticalSpacer"} />
            <img
              className={"bigImageThumbnail"}
              src={bookClicked ? bookClicked.imageLinks.smallThumbnail : ""}
            />
            <div className={"verticalSpacer"} />
            <div className={"resultsText textCenter"}>
              <div>{bookClicked ? bookClicked.title : ""}</div>
              <div className={"verticalSpacer"} />
              <div className={"authorText"}>
                {bookClicked ? bookClicked.authors[0] : ""}
              </div>
            </div>
            <div className={"verticalSpacer"} />
            <button
              onClick={() => {
                window.open(bookClicked.infoLink);
              }}
              className={"button green"}
            >
              View Book
            </button>
            <div className={"verticalSpacer"} />
          </div>
          <div className={"inputRow"}>
            <div className={"resultsText"}>Status</div>
            <Dropdown
              className={"dropdownContainer"}
              options={["Reading", "Completed", "Plan to Read"]}
              onChange={(newValue) => setBookStatus(newValue)}
              value={bookStatus}
              placeholder="Book Status"
            />
          </div>
          <div className={"inputRow"}>
            <div className={"resultsText"}>Your Rating</div>
            <Dropdown
              className={"dropdownContainer"}
              options={[
                "(10) Masterpiece",
                "(9) Great",
                "(8) Very Good",
                "(7) Good",
                "(6) Fine",
                "(5) Average",
                "(4) Bad",
                "(3) Very Bad",
                "(2) Horrible",
                "(1) Appalling",
              ]}
              onChange={(newValue) => setBookRating(newValue)}
              value={bookRating}
              placeholder="Book Rating"
            />
          </div>
          <div className={"verticalSpacer"} />
          <div className={"resultsText"}>Notes</div>
          <div className={"verticalSpacer"} />
          <div>
            <textarea
              style={{ resize: "none", overflow: "hidden" }}
              className={"notesSection"}
              type={"text"}
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </div>
          <div className={"buttonsContainer"}>
            <button
              onClick={() => setClickVisible(false)}
              className={"button gray colorWhite"}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                saveBook();
              }}
              className={"button green"}
            >
              Submit
            </button>
          </div>
          <div className={"verticalSpacer"} />
        </div>
      </Modal>
    </div>
  );
};

// Exports the component
export default App;
