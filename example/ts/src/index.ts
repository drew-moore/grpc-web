import {grpc, Code, Metadata} from "grpc-web-client";
import {examplecom} from "../pbjs/compiled";
import GetBookRequest = examplecom.library.GetBookRequest;
import BookService = examplecom.library.BookService;
import QueryBooksRequest = examplecom.library.QueryBooksRequest;
import Book = examplecom.library.Book;
import UnaryOutput = grpc.UnaryOutput;

declare const USE_TLS: boolean;
const host = USE_TLS ? "https://localhost:9091" : "http://localhost:9090";

export class MyBookService {
  static serviceName = "examplecom.library.BookService";
}
export namespace MyBookService {
  export class GetBook {
    static readonly methodName = "GetBook";
    static readonly service = MyBookService;
    static readonly requestStream = false;
    static readonly responseStream = false;
    static readonly requestType = GetBookRequest;
    static readonly responseType = Book;
  }
  export class QueryBooks {
    static readonly methodName = "QueryBooks";
    static readonly service = MyBookService;
    static readonly requestStream = false;
    static readonly responseStream = true;
    static readonly requestType = QueryBooksRequest;
    static readonly responseType = Book;
  }
}
function getBook() {
  const getBookRequest = new GetBookRequest();
  getBookRequest.isbn = 60929871;
  // getBookRequest.setIsbn(60929871);
  grpc.unary(MyBookService.GetBook, {
    request: getBookRequest,
    host: host,
    onEnd: (res: UnaryOutput<Book>) => {
      const { status, statusMessage, headers, message, trailers } = res;
      console.log("getBook.onEnd.status", status, statusMessage);
      console.log("getBook.onEnd.headers", headers);
      if (status === Code.OK && message) {
        console.log("getBook.onEnd.message", message.toJSON());
      }
      console.log("getBook.onEnd.trailers", trailers);
      queryBooks();
    }
  });
}

getBook();

function queryBooks() {
  const queryBooksRequest = new QueryBooksRequest({
    authorPrefix: "Geor"
  });
  grpc.invoke(MyBookService.QueryBooks, {
    request: queryBooksRequest,
    host: host,
    onHeaders: (headers: Metadata) => {
      console.log("queryBooks.onHeaders", headers);
    },
    onMessage: (message: Book) => {
      console.log("queryBooks.onMessage", message.toJSON());
    },
    onEnd: (code: Code, msg: string, trailers: Metadata) => {
      console.log("queryBooks.onEnd", code, msg, trailers);
    }
  });
}
