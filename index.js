const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:8080/'

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let author, books;

async function connect() {
  try {
    await client.connect()
    const database = client.db('Библиотека')
    
    // Create collections
    author = database.collection('Автор')
    books = database.collection('Книги')
    publisher = database.collection('Издательство')
    books_author = database.collection('Книги-Автор')
    
    await books.createIndex({ book_index: 1, publisher_index: 1 }, { unique: true })  
    await author.createIndex({ author_index: 1,  }, { unique: true })  
    await publisher.createIndex({ publisher_index: 1 }, { unique: true })
    await books_author.createIndex({ author_index: 1, book_index: 1 }, { unique: false })
  
    await database.command({
      collMod: 'Автор',
      validator: {
        $jsonSchema: {
          required: [ 'author_index', 'first_name', 'second_name', 'fm_name', 'birthday', 'address', 'note'],
          properties: {
            author_index: {
              bsonType: 'number',
              description: 'must be a number and is required',
            },
            first_name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            second_name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            fm_name: {
              bsonType: 'string',
              description: 'must be a date and is required'
            },
            birthday: {
              bsonType: 'string',
              description: 'must be a date and is required'
            },
            address: {
              bsonType: 'string',
              description: 'must be a date and is required'
            },
            note: {
              bsonType: 'string',
              description: 'must be a date and is required'
            }
          }
        }
      }
    })
    
    await database.command({
      collMod: 'Книги',
      validator: {
        $jsonSchema: {
          required: [ 'book_index', 'name', 'publish_year', 'publisher_index', 'subject', 'format', 'cover_type', 'cost', 'count', 'isAvailable', 'address'],
          properties: {
            book_index: {
              bsonType: 'number',
              description: 'must be a number and is required',
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            publish_year: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            publisher_index: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            subject: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            format: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            cover_type: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            cost: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            count: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            isAvailable: {
              bsonType: 'bool',
              description: 'must be a bool and is required'
            },
            address: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    })

    await database.command({
      collMod: 'Издательство',
      validator: {
        $jsonSchema: {
          required: [ 'publisher_index', 'name', 'address', 'phone', 'fax'],
          properties: {
            publisher_index: {
              bsonType: 'number',
              description: 'must be a number and is required',
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            address: {
              bsonType: 'string',
              description: 'must be a date and is required'
            },
            phone: {
              bsonType: 'string',
              description: 'must be a date and is required'
            },
            fax: {
              bsonType: 'string',
              description: 'must be a date and is required'
            }
          }
        }
      }
    }) 

    await database.command({
      collMod: 'Книги-Автор',
      validator: {
        $jsonSchema: {
          required: [ 'publisher_index', 'book_index'],
          properties: {
            publisher_index: {
              bsonType: 'number',
              description: 'must be a number and is required',
            },
            book_index: {
              bsonType: 'number',
              description: 'must be a number and is required',
            }
          }
        }
      }
    })

    await exec(database)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
connect().catch(console.error)

async function exec(db) {
  const author_doc = await fill_author(db.collection('Автор'))
  const book_doc = await fill_books(db.collection('Книги'))
  await change_book(db.collection('Книги'), book_doc.book_index, { cover_type: 'Мягкая' })
  const publisher = await fill_publisher(db.collection('Издательство'))
  const books_author = await fill_books_publisher(db.collection('Книги-Автор'))
}

async function fill_author(author) {
  try {
    const doc = {
      author_index: 1,
      first_name: 'Юваль',
      second_name: 'Ной',
      fm_name: 'Харари',
      birthday: '1976',
      address: 'null',
      note: 'Some notes here...'
    }
    return await author.insertOne(doc) && doc
  } catch (error) {
    return error
  }
}

async function fill_books(books) {
  try {
    const doc = {
      book_index: 1,
      name: '21 урок для XXI века',
      publish_year: '2018',
      publisher_index: 1,
      subject: 'Future',
      format: 'ebook',
      cover_type: 'Жесткая',
      cost: 400,
      count: 100,
      isAvailable: true,
      address: 'some adress here'
    }
    return await books.insertOne(doc) && doc
  } catch (error) {
    return error
  } 
}

async function fill_publisher(publisher) {
  try {
    const doc = {
      publisher_index: 1,
      name: 'none',
      address: 'some adress here...',
      phone: '12341234123',
      fax: '123'
    }
    return await publisher.insertOne(doc) && doc
  } catch (error) {
    return error
  } 
}

async function fill_books_publisher(books_publisher) {
  try {
    const doc = {
      publisher_index: 1,
      book_index: 1
    }
    return await books_publisher.insertOne(doc) && doc
  } catch (error) {
    return error
  } 
}

async function change_book(books, book_index, updateDocument) {
  return await books.updateOne({ book_index }, { $set: updateDocument });
}