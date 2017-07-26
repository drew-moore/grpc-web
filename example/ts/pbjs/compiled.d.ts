import * as $protobuf from "protobufjs";

/** Namespace examplecom. */
export namespace examplecom {

    /** Namespace library. */
    namespace library {

        /** Properties of a Book. */
        interface IBook {

            /** Book isbn */
            isbn?: (number|Long);

            /** Book title */
            title?: string;

            /** Book author */
            author?: string;
        }

        /** Represents a Book. */
        class Book {

            /**
             * Constructs a new Book.
             * @param [properties] Properties to set
             */
            constructor(properties?: examplecom.library.IBook);

            /** Book isbn. */
            public isbn: (number|Long);

            /** Book title. */
            public title: string;

            /** Book author. */
            public author: string;

            /**
             * Creates a new Book instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Book instance
             */
            public static create(properties?: examplecom.library.IBook): examplecom.library.Book;

            /**
             * Encodes the specified Book message. Does not implicitly {@link examplecom.library.Book.verify|verify} messages.
             * @param message Book message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: examplecom.library.IBook, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Book message, length delimited. Does not implicitly {@link examplecom.library.Book.verify|verify} messages.
             * @param message Book message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: examplecom.library.IBook, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Book message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Book
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): examplecom.library.Book;

            /**
             * Decodes a Book message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Book
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): examplecom.library.Book;

            /**
             * Verifies a Book message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Book message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Book
             */
            public static fromObject(object: { [k: string]: any }): examplecom.library.Book;

            /**
             * Creates a plain object from a Book message. Also converts values to other types if specified.
             * @param message Book
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: examplecom.library.Book, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Book to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a GetBookRequest. */
        interface IGetBookRequest {

            /** GetBookRequest isbn */
            isbn?: (number|Long);
        }

        /** Represents a GetBookRequest. */
        class GetBookRequest {

            /**
             * Constructs a new GetBookRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: examplecom.library.IGetBookRequest);

            /** GetBookRequest isbn. */
            public isbn: (number|Long);

            /**
             * Creates a new GetBookRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetBookRequest instance
             */
            public static create(properties?: examplecom.library.IGetBookRequest): examplecom.library.GetBookRequest;

            /**
             * Encodes the specified GetBookRequest message. Does not implicitly {@link examplecom.library.GetBookRequest.verify|verify} messages.
             * @param message GetBookRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: examplecom.library.IGetBookRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetBookRequest message, length delimited. Does not implicitly {@link examplecom.library.GetBookRequest.verify|verify} messages.
             * @param message GetBookRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: examplecom.library.IGetBookRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetBookRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetBookRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): examplecom.library.GetBookRequest;

            /**
             * Decodes a GetBookRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetBookRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): examplecom.library.GetBookRequest;

            /**
             * Verifies a GetBookRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetBookRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetBookRequest
             */
            public static fromObject(object: { [k: string]: any }): examplecom.library.GetBookRequest;

            /**
             * Creates a plain object from a GetBookRequest message. Also converts values to other types if specified.
             * @param message GetBookRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: examplecom.library.GetBookRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetBookRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a QueryBooksRequest. */
        interface IQueryBooksRequest {

            /** QueryBooksRequest authorPrefix */
            authorPrefix?: string;
        }

        /** Represents a QueryBooksRequest. */
        class QueryBooksRequest {

            /**
             * Constructs a new QueryBooksRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: examplecom.library.IQueryBooksRequest);

            /** QueryBooksRequest authorPrefix. */
            public authorPrefix: string;

            /**
             * Creates a new QueryBooksRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns QueryBooksRequest instance
             */
            public static create(properties?: examplecom.library.IQueryBooksRequest): examplecom.library.QueryBooksRequest;

            /**
             * Encodes the specified QueryBooksRequest message. Does not implicitly {@link examplecom.library.QueryBooksRequest.verify|verify} messages.
             * @param message QueryBooksRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: examplecom.library.IQueryBooksRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified QueryBooksRequest message, length delimited. Does not implicitly {@link examplecom.library.QueryBooksRequest.verify|verify} messages.
             * @param message QueryBooksRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: examplecom.library.IQueryBooksRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a QueryBooksRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns QueryBooksRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): examplecom.library.QueryBooksRequest;

            /**
             * Decodes a QueryBooksRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns QueryBooksRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): examplecom.library.QueryBooksRequest;

            /**
             * Verifies a QueryBooksRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a QueryBooksRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns QueryBooksRequest
             */
            public static fromObject(object: { [k: string]: any }): examplecom.library.QueryBooksRequest;

            /**
             * Creates a plain object from a QueryBooksRequest message. Also converts values to other types if specified.
             * @param message QueryBooksRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: examplecom.library.QueryBooksRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this QueryBooksRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Represents a BookService */
        class BookService extends $protobuf.rpc.Service {

            /**
             * Constructs a new BookService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new BookService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): BookService;

            /**
             * Calls GetBook.
             * @param request GetBookRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Book
             */
            public getBook(request: examplecom.library.IGetBookRequest, callback: examplecom.library.BookService.GetBookCallback): void;

            /**
             * Calls GetBook.
             * @param request GetBookRequest message or plain object
             * @returns Promise
             */
            public getBook(request: examplecom.library.IGetBookRequest): Promise<examplecom.library.Book>;

            /**
             * Calls QueryBooks.
             * @param request QueryBooksRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Book
             */
            public queryBooks(request: examplecom.library.IQueryBooksRequest, callback: examplecom.library.BookService.QueryBooksCallback): void;

            /**
             * Calls QueryBooks.
             * @param request QueryBooksRequest message or plain object
             * @returns Promise
             */
            public queryBooks(request: examplecom.library.IQueryBooksRequest): Promise<examplecom.library.Book>;
        }

        namespace BookService {

            /**
             * Callback as used by {@link examplecom.library.BookService#getBook}.
             * @param error Error, if any
             * @param [response] Book
             */
            type GetBookCallback = (error: (Error|null), response?: examplecom.library.Book) => void;

            /**
             * Callback as used by {@link examplecom.library.BookService#queryBooks}.
             * @param error Error, if any
             * @param [response] Book
             */
            type QueryBooksCallback = (error: (Error|null), response?: examplecom.library.Book) => void;
        }
    }
}
