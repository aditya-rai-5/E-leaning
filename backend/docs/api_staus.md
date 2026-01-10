## http://localhost:5000/api/auth/register // functional

     {
          "name": "Aditya Rai",
          "email": "aditya@example.com",
          "password": "helloworld",
          "phone": "+919876543210",
          "role": "student",
          "interests": [
               "data-structures",
               "system-design",
               "machine-learning"
          ]
     }

## http://localhost:5000/api/auth/login //funtional

     {
          "email": "aditya@example.com",
          "password": "helloworld"
     }

## http://localhost:5000/api/create-course/

     {
          "title": "Advanced Data Structures and Algorithms",
          "slug": "advanced-data-structures-algorithms",
          "description": "In-depth coverage of advanced data structures, problem-solving strategies, and competitive programming techniques.",
          "instructorId": "66b8f0a4c2f1a9e1d3b7a901",
          "category": "computer-science",
          "level": "advanced",
          "language": "English",
          "thumbnail": "https://cdn.example.com/thumbnails/dsa-advanced.png",
          "price": 4999
     }

### output
     {
          "success": true,
          "message": "Advanced Data Structures and Algorithms is created succesfully at 1767422817755",
          "data": {
               "title": "Advanced Data Structures and Algorithms",
               "slug": "advanced-data-structures-and-algorithms-1767422817732",
               "description": "In-depth coverage of advanced data structures, problem-solving strategies, and competitive programming techniques.",
               "instructorId": "6958ba6f66e3f38dd0ddb43a",
               "category": "computer-science",
               "level": "advanced",
               "language": "English",
               "price": 4999,
               "isPublished": false,
               "_id": "6958bb6166e3f38dd0ddb442",
               "createdAt": "2026-01-03T06:46:57.734Z",
               "updatedAt": "2026-01-03T06:46:57.734Z",
               "__v": 0
          }
     }

## http://localhost:5000/api/courses/6958bb6166e3f38dd0ddb442/sections //works

     {
          "success": true,
          "data": {
               "title": "Introduction",
               "courseId": {
                    "_id": "6958bb6166e3f38dd0ddb442",
                    "title": "Advanced Data Structures and Algorithms"
               },
               "order": 1,
               "_id": "6958bc3466e3f38dd0ddb44c",
               "createdAt": "2026-01-03T06:50:28.045Z",
               "updatedAt": "2026-01-03T06:50:28.045Z",
               "__v": 0
          },
          "message": "Section created successfully"
     }

### output 

     {
          "success": true,
          "data": {
               "title": "Introduction",
               "courseId": {
                    "_id": "6958bb6166e3f38dd0ddb442",
                    "title": "Advanced Data Structures and Algorithms"
               },
               "order": 1,
               "_id": "6958bc3466e3f38dd0ddb44c",
               "createdAt": "2026-01-03T06:50:28.045Z",
               "updatedAt": "2026-01-03T06:50:28.045Z",
               "__v": 0
          },
          "message": "Section created successfully"
     }

## http://localhost:5000/api/sections/6958bc3466e3f38dd0ddb44c/lessons

     {
          "title": "Time Complexity Basics",
          "type": "article",
          "content": "<h1>Time Complexity</h1><p>Big-O notation explained with examples.</p>",
          "duration": 12,
          "order": 2,
          "attachments": [
               {
                    "title": "Time Complexity Notes",
                    "url": "https://cdn.example.com/files/time-complexity.pdf",
                    "fileType": "pdf",
                    "size": 820
               },
               {
                    "title": "Practice Problems",
                    "url": "https://cdn.example.com/files/practice.zip",
                    "fileType": "zip",
                    "size": 2048
               }
          ]
     }
### output:

     {
          "success": true,
          "data": {
               "title": "Time Complexity Basics",
               "sectionId": {
                    "_id": "6958bc3466e3f38dd0ddb44c",
                    "title": "Introduction"
               },
               "courseId": {
                    "_id": "6958bb6166e3f38dd0ddb442",
                    "title": "Advanced Data Structures and Algorithms"
               },
               "type": "article",
               "content": "<h1>Time Complexity</h1><p>Big-O notation explained with examples.</p>",
               "duration": 12,
               "order": 1,
               "attachments": [
                    {
                         "title": "Time Complexity Notes",
                         "url": "https://cdn.example.com/files/time-complexity.pdf",
                         "fileType": "pdf",
                         "size": 820,
                         "_id": "6958bd1d66e3f38dd0ddb459"
                    },
                    {
                         "title": "Practice Problems",
                         "url": "https://cdn.example.com/files/practice.zip",
                         "fileType": "zip",
                         "size": 2048,
                         "_id": "6958bd1d66e3f38dd0ddb45a"
                    }
               ],
               "_id": "6958bd1d66e3f38dd0ddb458",
               "createdAt": "2026-01-03T06:54:21.112Z",
               "updatedAt": "2026-01-03T06:54:21.112Z",
               "__v": 0
          },
          "message": "Lesson created successfully"
     }

## http://localhost:5000/api/lessons/6958bd1d66e3f38dd0ddb458/attachments // works before and after publish both

     {
          "title": "Extra Practice Sheet",
          "url": "https://cdn.test.com/practice.pdf",
          "fileType": "pdf",
          "size": 600
     }
### output 
     {
          "success": true,
          "data": [
               {
                    "title": "Time Complexity Notes",
                    "url": "https://cdn.example.com/files/time-complexity.pdf",
                    "fileType": "pdf",
                    "size": 820,
                    "_id": "6958bd1d66e3f38dd0ddb459"
               },
               {
                    "title": "Practice Problems",
                    "url": "https://cdn.example.com/files/practice.zip",
                    "fileType": "zip",
                    "size": 2048,
                    "_id": "6958bd1d66e3f38dd0ddb45a"
               },
               {
                    "title": "Extra Practice Sheet",
                    "url": "https://cdn.test.com/practice.pdf",
                    "fileType": "pdf",
                    "size": 600,
                    "_id": "6958c3e1b73859622470a7cf"
               }
          ]
     }

## publish api also works 

## http://localhost:5000/api/courses/6958bb6166e3f38dd0ddb442/enroll  // ernorllment api works successfully 

## 