/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.examplecom = (function() {

    /**
     * Namespace examplecom.
     * @exports examplecom
     * @namespace
     */
    var examplecom = {};

    examplecom.library = (function() {

        /**
         * Namespace library.
         * @memberof examplecom
         * @namespace
         */
        var library = {};

        library.Book = (function() {

            /**
             * Properties of a Book.
             * @memberof examplecom.library
             * @interface IBook
             * @property {number|Long} [isbn] Book isbn
             * @property {string} [title] Book title
             * @property {string} [author] Book author
             */

            /**
             * Constructs a new Book.
             * @memberof examplecom.library
             * @classdesc Represents a Book.
             * @constructor
             * @param {examplecom.library.IBook=} [properties] Properties to set
             */
            function Book(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Book isbn.
             * @member {number|Long}isbn
             * @memberof examplecom.library.Book
             * @instance
             */
            Book.prototype.isbn = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Book title.
             * @member {string}title
             * @memberof examplecom.library.Book
             * @instance
             */
            Book.prototype.title = "";

            /**
             * Book author.
             * @member {string}author
             * @memberof examplecom.library.Book
             * @instance
             */
            Book.prototype.author = "";

            /**
             * Creates a new Book instance using the specified properties.
             * @function create
             * @memberof examplecom.library.Book
             * @static
             * @param {examplecom.library.IBook=} [properties] Properties to set
             * @returns {examplecom.library.Book} Book instance
             */
            Book.create = function create(properties) {
                return new Book(properties);
            };

            /**
             * Encodes the specified Book message. Does not implicitly {@link examplecom.library.Book.verify|verify} messages.
             * @function encode
             * @memberof examplecom.library.Book
             * @static
             * @param {examplecom.library.IBook} message Book message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Book.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.isbn);
                if (message.title != null && message.hasOwnProperty("title"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                if (message.author != null && message.hasOwnProperty("author"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.author);
                return writer;
            };

            /**
             * Encodes the specified Book message, length delimited. Does not implicitly {@link examplecom.library.Book.verify|verify} messages.
             * @function encodeDelimited
             * @memberof examplecom.library.Book
             * @static
             * @param {examplecom.library.IBook} message Book message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Book.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Book message from the specified reader or buffer.
             * @function decode
             * @memberof examplecom.library.Book
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {examplecom.library.Book} Book
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Book.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.examplecom.library.Book();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.isbn = reader.int64();
                        break;
                    case 2:
                        message.title = reader.string();
                        break;
                    case 3:
                        message.author = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Book message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof examplecom.library.Book
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {examplecom.library.Book} Book
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Book.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Book message.
             * @function verify
             * @memberof examplecom.library.Book
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Book.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    if (!$util.isInteger(message.isbn) && !(message.isbn && $util.isInteger(message.isbn.low) && $util.isInteger(message.isbn.high)))
                        return "isbn: integer|Long expected";
                if (message.title != null && message.hasOwnProperty("title"))
                    if (!$util.isString(message.title))
                        return "title: string expected";
                if (message.author != null && message.hasOwnProperty("author"))
                    if (!$util.isString(message.author))
                        return "author: string expected";
                return null;
            };

            /**
             * Creates a Book message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof examplecom.library.Book
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {examplecom.library.Book} Book
             */
            Book.fromObject = function fromObject(object) {
                if (object instanceof $root.examplecom.library.Book)
                    return object;
                var message = new $root.examplecom.library.Book();
                if (object.isbn != null)
                    if ($util.Long)
                        (message.isbn = $util.Long.fromValue(object.isbn)).unsigned = false;
                    else if (typeof object.isbn === "string")
                        message.isbn = parseInt(object.isbn, 10);
                    else if (typeof object.isbn === "number")
                        message.isbn = object.isbn;
                    else if (typeof object.isbn === "object")
                        message.isbn = new $util.LongBits(object.isbn.low >>> 0, object.isbn.high >>> 0).toNumber();
                if (object.title != null)
                    message.title = String(object.title);
                if (object.author != null)
                    message.author = String(object.author);
                return message;
            };

            /**
             * Creates a plain object from a Book message. Also converts values to other types if specified.
             * @function toObject
             * @memberof examplecom.library.Book
             * @static
             * @param {examplecom.library.Book} message Book
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Book.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.isbn = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.isbn = options.longs === String ? "0" : 0;
                    object.title = "";
                    object.author = "";
                }
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    if (typeof message.isbn === "number")
                        object.isbn = options.longs === String ? String(message.isbn) : message.isbn;
                    else
                        object.isbn = options.longs === String ? $util.Long.prototype.toString.call(message.isbn) : options.longs === Number ? new $util.LongBits(message.isbn.low >>> 0, message.isbn.high >>> 0).toNumber() : message.isbn;
                if (message.title != null && message.hasOwnProperty("title"))
                    object.title = message.title;
                if (message.author != null && message.hasOwnProperty("author"))
                    object.author = message.author;
                return object;
            };

            /**
             * Converts this Book to JSON.
             * @function toJSON
             * @memberof examplecom.library.Book
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Book.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Book;
        })();

        library.GetBookRequest = (function() {

            /**
             * Properties of a GetBookRequest.
             * @memberof examplecom.library
             * @interface IGetBookRequest
             * @property {number|Long} [isbn] GetBookRequest isbn
             */

            /**
             * Constructs a new GetBookRequest.
             * @memberof examplecom.library
             * @classdesc Represents a GetBookRequest.
             * @constructor
             * @param {examplecom.library.IGetBookRequest=} [properties] Properties to set
             */
            function GetBookRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetBookRequest isbn.
             * @member {number|Long}isbn
             * @memberof examplecom.library.GetBookRequest
             * @instance
             */
            GetBookRequest.prototype.isbn = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new GetBookRequest instance using the specified properties.
             * @function create
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {examplecom.library.IGetBookRequest=} [properties] Properties to set
             * @returns {examplecom.library.GetBookRequest} GetBookRequest instance
             */
            GetBookRequest.create = function create(properties) {
                return new GetBookRequest(properties);
            };

            /**
             * Encodes the specified GetBookRequest message. Does not implicitly {@link examplecom.library.GetBookRequest.verify|verify} messages.
             * @function encode
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {examplecom.library.IGetBookRequest} message GetBookRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBookRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.isbn);
                return writer;
            };

            /**
             * Encodes the specified GetBookRequest message, length delimited. Does not implicitly {@link examplecom.library.GetBookRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {examplecom.library.IGetBookRequest} message GetBookRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetBookRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetBookRequest message from the specified reader or buffer.
             * @function decode
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {examplecom.library.GetBookRequest} GetBookRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBookRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.examplecom.library.GetBookRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.isbn = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GetBookRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {examplecom.library.GetBookRequest} GetBookRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetBookRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetBookRequest message.
             * @function verify
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetBookRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    if (!$util.isInteger(message.isbn) && !(message.isbn && $util.isInteger(message.isbn.low) && $util.isInteger(message.isbn.high)))
                        return "isbn: integer|Long expected";
                return null;
            };

            /**
             * Creates a GetBookRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {examplecom.library.GetBookRequest} GetBookRequest
             */
            GetBookRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.examplecom.library.GetBookRequest)
                    return object;
                var message = new $root.examplecom.library.GetBookRequest();
                if (object.isbn != null)
                    if ($util.Long)
                        (message.isbn = $util.Long.fromValue(object.isbn)).unsigned = false;
                    else if (typeof object.isbn === "string")
                        message.isbn = parseInt(object.isbn, 10);
                    else if (typeof object.isbn === "number")
                        message.isbn = object.isbn;
                    else if (typeof object.isbn === "object")
                        message.isbn = new $util.LongBits(object.isbn.low >>> 0, object.isbn.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a GetBookRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof examplecom.library.GetBookRequest
             * @static
             * @param {examplecom.library.GetBookRequest} message GetBookRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetBookRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.isbn = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.isbn = options.longs === String ? "0" : 0;
                if (message.isbn != null && message.hasOwnProperty("isbn"))
                    if (typeof message.isbn === "number")
                        object.isbn = options.longs === String ? String(message.isbn) : message.isbn;
                    else
                        object.isbn = options.longs === String ? $util.Long.prototype.toString.call(message.isbn) : options.longs === Number ? new $util.LongBits(message.isbn.low >>> 0, message.isbn.high >>> 0).toNumber() : message.isbn;
                return object;
            };

            /**
             * Converts this GetBookRequest to JSON.
             * @function toJSON
             * @memberof examplecom.library.GetBookRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetBookRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GetBookRequest;
        })();

        library.QueryBooksRequest = (function() {

            /**
             * Properties of a QueryBooksRequest.
             * @memberof examplecom.library
             * @interface IQueryBooksRequest
             * @property {string} [authorPrefix] QueryBooksRequest authorPrefix
             */

            /**
             * Constructs a new QueryBooksRequest.
             * @memberof examplecom.library
             * @classdesc Represents a QueryBooksRequest.
             * @constructor
             * @param {examplecom.library.IQueryBooksRequest=} [properties] Properties to set
             */
            function QueryBooksRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * QueryBooksRequest authorPrefix.
             * @member {string}authorPrefix
             * @memberof examplecom.library.QueryBooksRequest
             * @instance
             */
            QueryBooksRequest.prototype.authorPrefix = "";

            /**
             * Creates a new QueryBooksRequest instance using the specified properties.
             * @function create
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {examplecom.library.IQueryBooksRequest=} [properties] Properties to set
             * @returns {examplecom.library.QueryBooksRequest} QueryBooksRequest instance
             */
            QueryBooksRequest.create = function create(properties) {
                return new QueryBooksRequest(properties);
            };

            /**
             * Encodes the specified QueryBooksRequest message. Does not implicitly {@link examplecom.library.QueryBooksRequest.verify|verify} messages.
             * @function encode
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {examplecom.library.IQueryBooksRequest} message QueryBooksRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QueryBooksRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.authorPrefix != null && message.hasOwnProperty("authorPrefix"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.authorPrefix);
                return writer;
            };

            /**
             * Encodes the specified QueryBooksRequest message, length delimited. Does not implicitly {@link examplecom.library.QueryBooksRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {examplecom.library.IQueryBooksRequest} message QueryBooksRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QueryBooksRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a QueryBooksRequest message from the specified reader or buffer.
             * @function decode
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {examplecom.library.QueryBooksRequest} QueryBooksRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QueryBooksRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.examplecom.library.QueryBooksRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.authorPrefix = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a QueryBooksRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {examplecom.library.QueryBooksRequest} QueryBooksRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QueryBooksRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a QueryBooksRequest message.
             * @function verify
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            QueryBooksRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.authorPrefix != null && message.hasOwnProperty("authorPrefix"))
                    if (!$util.isString(message.authorPrefix))
                        return "authorPrefix: string expected";
                return null;
            };

            /**
             * Creates a QueryBooksRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {examplecom.library.QueryBooksRequest} QueryBooksRequest
             */
            QueryBooksRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.examplecom.library.QueryBooksRequest)
                    return object;
                var message = new $root.examplecom.library.QueryBooksRequest();
                if (object.authorPrefix != null)
                    message.authorPrefix = String(object.authorPrefix);
                return message;
            };

            /**
             * Creates a plain object from a QueryBooksRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof examplecom.library.QueryBooksRequest
             * @static
             * @param {examplecom.library.QueryBooksRequest} message QueryBooksRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            QueryBooksRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.authorPrefix = "";
                if (message.authorPrefix != null && message.hasOwnProperty("authorPrefix"))
                    object.authorPrefix = message.authorPrefix;
                return object;
            };

            /**
             * Converts this QueryBooksRequest to JSON.
             * @function toJSON
             * @memberof examplecom.library.QueryBooksRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            QueryBooksRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return QueryBooksRequest;
        })();

        library.BookService = (function() {

            /**
             * Constructs a new BookService service.
             * @memberof examplecom.library
             * @classdesc Represents a BookService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function BookService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (BookService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = BookService;

            /**
             * Creates new BookService service using the specified rpc implementation.
             * @function create
             * @memberof examplecom.library.BookService
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {BookService} RPC service. Useful where requests and/or responses are streamed.
             */
            BookService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link examplecom.library.BookService#getBook}.
             * @memberof examplecom.library.BookService
             * @typedef GetBookCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {examplecom.library.Book} [response] Book
             */

            /**
             * Calls GetBook.
             * @function .getBook
             * @memberof examplecom.library.BookService
             * @instance
             * @param {examplecom.library.IGetBookRequest} request GetBookRequest message or plain object
             * @param {examplecom.library.BookService.GetBookCallback} callback Node-style callback called with the error, if any, and Book
             * @returns {undefined}
             * @variation 1
             */
            BookService.prototype.getBook = function getBook(request, callback) {
                return this.rpcCall(getBook, $root.examplecom.library.GetBookRequest, $root.examplecom.library.Book, request, callback);
            };

            /**
             * Calls GetBook.
             * @function getBook
             * @memberof examplecom.library.BookService
             * @instance
             * @param {examplecom.library.IGetBookRequest} request GetBookRequest message or plain object
             * @returns {Promise<examplecom.library.Book>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link examplecom.library.BookService#queryBooks}.
             * @memberof examplecom.library.BookService
             * @typedef QueryBooksCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {examplecom.library.Book} [response] Book
             */

            /**
             * Calls QueryBooks.
             * @function .queryBooks
             * @memberof examplecom.library.BookService
             * @instance
             * @param {examplecom.library.IQueryBooksRequest} request QueryBooksRequest message or plain object
             * @param {examplecom.library.BookService.QueryBooksCallback} callback Node-style callback called with the error, if any, and Book
             * @returns {undefined}
             * @variation 1
             */
            BookService.prototype.queryBooks = function queryBooks(request, callback) {
                return this.rpcCall(queryBooks, $root.examplecom.library.QueryBooksRequest, $root.examplecom.library.Book, request, callback);
            };

            /**
             * Calls QueryBooks.
             * @function queryBooks
             * @memberof examplecom.library.BookService
             * @instance
             * @param {examplecom.library.IQueryBooksRequest} request QueryBooksRequest message or plain object
             * @returns {Promise<examplecom.library.Book>} Promise
             * @variation 2
             */

            return BookService;
        })();

        return library;
    })();

    return examplecom;
})();

module.exports = $root;
