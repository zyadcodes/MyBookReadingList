// This is the file which will handle the APIs that interact with the books
import fetch from "node-fetch";

// This function will return 5 book objects in terms of relevance for the title that
// is being searched
const searchForBook = async (bookTitle) => {
  if (bookTitle.trim() === "") {
    return [];
  }
  const url =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    bookTitle +
    "&maxResults=5";
  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await result.json();

  let finalArray = json.items.map((eachItem) => eachItem.volumeInfo);
  finalArray = finalArray.filter(
    (eachItem) =>
      eachItem.title &&
      eachItem.imageLinks &&
      eachItem.imageLinks.smallThumbnail &&
      eachItem.authors
  );

  return finalArray;
};

// Exports the named functions
export { searchForBook };
