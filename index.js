const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.get("/getTopBooksByReviewCount", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/getTopBooksByReviewCount?age=${age}`
    );
    const returndata = JSON.stringify(await resData.json());
    res.send(returndata);
  } catch (err) {
    next(err);
  }
});
app.get("/popularBooks", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/get-most-popular-set?age=${age}&count=40&category_limit=30`
    );
    const returndata = await resData.json();
    const catagoryBooks = new Map();
    const catagorySet = new Set();
    returndata.books.map((data) => {
      data.categories.map((cate) => {
        const catagory = cate.category.name;
        catagorySet.add(catagory);
      });
    });
    catagorySet.forEach((catagory) => {
      catagoryBooks.set(catagory, []);
    });
    returndata.books.map((data) => {
      data.categories.forEach((cat) => {
        const {
          name,
          description,
          min_age,
          max_age,
          image,
          rating,
          review_count,
          stock_available,
          pages,
        } = data;
        const bookDetails = {
          name: name,
          description: description,
          min_age: min_age,
          max_age: max_age,
          image: image,
          rating: rating,
          review_count: review_count,
          stock_available: stock_available,
          pages: pages,
        };
        catagoryBooks.get(cat.category.name).push(bookDetails);
      });
    });
    const bookDetails = JSON.stringify(Object.fromEntries(catagoryBooks));
    res.send(bookDetails);
  } catch (err) {
    next(err);
  }
});
app.get("/globalBestSeller", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/getGlobalBestsellersByAge?age=${age}`
    );
    const returndata = JSON.stringify(await resData.json());
    const bookDetails = JSON.parse(returndata).book_set[0].books;
    res.send(bookDetails);
  } catch (err) {
    next(err);
  }
});
app.get("/teachersPick", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/getTeacherPicksByAge?age=${age}`
    );
    const returndata = JSON.stringify(await resData.json());
    const bookDetails = JSON.parse(returndata).book_set[0].books;
    res.send(bookDetails);
  } catch (err) {
    next(err);
  }
});
app.get("/browseLibrary", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/get-book-set?age=${age}&section_name=Browse+Library&start=0&end=60`
    );
    const returndata = await resData.json();
    const success = returndata.success;
    const bookDetails = returndata.book_set.map((bookDetails) => {
      const catagory = bookDetails.category;
      const details = bookDetails.books.map((book) => {
        const {
          id,
          name,
          description,
          min_age,
          max_age,
          rating,
          review_count,
          image,
        } = book;
        return {
          id,
          name,
          description,
          min_age,
          max_age,
          rating,
          review_count,
          image,
        };
      });
      return { ...details, catagory, success };
    });
    const resultData = JSON.stringify(await bookDetails);
    res.send(resultData);
  } catch (err) {
    next(err);
  }
});
app.get("/browseGenre", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/get-books-by-genre?age=${age}&start=0&end=1`
    );
    const returndata = JSON.stringify(await resData.json());
    const bookDetails = JSON.parse(returndata).book_set;
    res.send(bookDetails);
  } catch (err) {
    next(err);
  }
});
app.get("/mustRead", async (req, res, next) => {
  try {
    const age = req.query.age;
    const resData = await fetch(
      `https://server.brightr.club/api_v2_books/get-must-read-set?category_count=4&book_count=7&section_name=Best+Seller+Series&randomize_books=true&age=${age}&show_unavailable=true`
    );
    const returndata = JSON.stringify(await resData.json());
    const bookDetails = JSON.parse(returndata).book_set;
    res.send(bookDetails);
  } catch (err) {
    next(err);
  }
});
app.listen(process.env.PORT, () => {
  console.log("running on Port ", process.env.PORT);
});
