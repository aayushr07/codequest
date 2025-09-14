export const mcqQuestions = [
  // ---------- Syntax Completion (10) ----------
  {
    question: "Complete the Python code to define a function:\n___ greet():\n    print('Hello')",
    options: ["function", "def", "func", "method"],
    correct_option: 1,
  },
  {
    question: "Fill in the missing part of this C loop:\nfor(int i = 0; i < 5; ___) { printf(\"%d\", i); }",
    options: ["i++", "++i", "i--", "--i"],
    correct_option: 0,
  },
  {
    question: "Choose the correct way to import React in JavaScript:\n___ React from 'react';",
    options: ["import", "require", "include", "using"],
    correct_option: 0,
  },
  {
    question: "Fill the blank to select all rows from 'students' table:\nSELECT ___ FROM students;",
    options: ["ALL", "*", "rows", "everything"],
    correct_option: 1,
  },
  {
    question: "Complete the Java print statement:\nSystem.out.___(\"Hello World\");",
    options: ["print", "println", "write", "printf"],
    correct_option: 1,
  },
  {
    question: "Fill the missing operator in JavaScript:\nif(a ___ b) { console.log('Equal'); }",
    options: ["=", "==", "===", "!="],
    correct_option: 2,
  },
  {
    question: "Complete the HTML input tag:\n<input type=\"text\" ___=\"username\" />",
    options: ["id", "key", "name", "var"],
    correct_option: 2,
  },
  {
    question: "Which keyword completes this SQL query?\n___ TABLE users (id INT, name VARCHAR(50));",
    options: ["INSERT", "CREATE", "MAKE", "BUILD"],
    correct_option: 1,
  },
  {
    question: "Complete the arrow function in JavaScript:\nconst add = (a, b) => ___;",
    options: ["a plus b", "a + b", "sum(a,b)", "return a + b"],
    correct_option: 1,
  },
  {
    question: "Choose the correct syntax to declare an array in C:\nint arr ___ {1, 2, 3};",
    options: ["[] =", "[]", "()", "={ }"],
    correct_option: 0,
  },

  // ---------- Technical Skills (10) ----------
  {
    question: "Which data structure uses FIFO (First In First Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correct_option: 1,
  },
  {
    question: "Which SQL command is used to remove a table from a database?",
    options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
    correct_option: 2,
  },
  {
    question: "Which keyword is used to define a constant in JavaScript?",
    options: ["let", "var", "const", "static"],
    correct_option: 2,
  },
  {
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    correct_option: 2,
  },
  {
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
    correct_option: 1,
  },
  {
    question: "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct_option: 1,
  },
  {
    question: "Which database normalization form removes transitive dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct_option: 2,
  },
  {
    question: "In operating systems, which algorithm is used to prevent deadlock?",
    options: ["Round Robin", "Banker's Algorithm", "FIFO", "LRU"],
    correct_option: 1,
  },
  {
    question: "Which of the following is NOT a NoSQL database?",
    options: ["MongoDB", "Cassandra", "Redis", "PostgreSQL"],
    correct_option: 3,
  },
  {
    question: "Which layer of the OSI model handles routing?",
    options: ["Data Link", "Transport", "Network", "Session"],
    correct_option: 2,
  },

  // ---------- Soft Skills (5) ----------
  {
    question: "Which of the following best demonstrates active listening?",
    options: [
      "Interrupting to give advice",
      "Waiting to respond without listening",
      "Paraphrasing what the speaker said",
      "Nodding without paying attention"
    ],
    correct_option: 2,
  },
  {
    question: "What is the most effective way to handle workplace conflict?",
    options: [
      "Avoid the conflict entirely",
      "Address it directly with respect",
      "Report immediately without discussion",
      "Ignore and wait for it to pass"
    ],
    correct_option: 1,
  },
  {
    question: "Which of the following is an example of good teamwork?",
    options: [
      "Taking credit for team success individually",
      "Sharing responsibilities and supporting each other",
      "Avoiding collaboration to work faster",
      "Letting only one member contribute"
    ],
    correct_option: 1,
  },
  {
    question: "What is the most professional way to respond when you don’t know an answer in an interview?",
    options: [
      "Make up an answer confidently",
      "Admit you don’t know and stay silent",
      "Say you’re unsure but explain how you’d find the answer",
      "Change the subject"
    ],
    correct_option: 2,
  },
  {
    question: "Which is a key aspect of emotional intelligence?",
    options: [
      "Ignoring others' feelings",
      "Controlling and understanding emotions",
      "Suppressing emotions always",
      "Speaking without empathy"
    ],
    correct_option: 1,
  }
];
