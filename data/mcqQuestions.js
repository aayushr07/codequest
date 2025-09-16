export const mcqQuestions = [
  // ---------- Advanced Data Structures & Algorithms (20) ----------
  {
    question: "What is the time complexity of finding the kth smallest element in an unsorted array using quickselect algorithm?",
    options: ["O(k log n)", "O(n) average, O(n²) worst", "O(n log k)", "O(k²)"],
    correct_option: 1,
  },
  {
    question: "In a Red-Black tree, what is the maximum possible height for a tree with n nodes?",
    options: ["log₂(n)", "2 log₂(n+1)", "3 log₂(n)", "n"],
    correct_option: 1,
  },
  {
    question: "Which data structure is most efficient for implementing Dijkstra's algorithm on dense graphs?",
    options: ["Binary Heap", "Fibonacci Heap", "Array", "Balanced BST"],
    correct_option: 1,
  },
  {
    question: "What is the space complexity of the iterative deepening depth-first search algorithm?",
    options: ["O(b^d)", "O(bd)", "O(d)", "O(b)"],
    correct_option: 2,
  },
  {
    question: "In dynamic programming, what technique is used when the state space is too large to store all subproblems?",
    options: ["Memoization", "Space optimization", "Iterative approach", "State compression"],
    correct_option: 3,
  },
  {
    question: "What is the minimum number of colors needed to color any planar graph according to the Four Color Theorem?",
    options: ["3", "4", "5", "6"],
    correct_option: 1,
  },
  {
    question: "In a B-tree of order m, what is the maximum number of children a non-root node can have?",
    options: ["m", "m-1", "m+1", "2m"],
    correct_option: 0,
  },
  {
    question: "Which algorithm is used to find strongly connected components in O(V+E) time?",
    options: ["Kruskal's", "Prim's", "Tarjan's", "Floyd-Warshall"],
    correct_option: 2,
  },
  {
    question: "What is the expected number of comparisons in a successful search in a skip list?",
    options: ["O(1)", "O(log n)", "O(√n)", "O(n)"],
    correct_option: 1,
  },
  {
    question: "In the context of computational geometry, what is the time complexity of the Graham scan algorithm for convex hull?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
    correct_option: 1,
  },
  {
    question: "What is the amortized time complexity of union operation in Union-Find with path compression and union by rank?",
    options: ["O(1)", "O(log n)", "O(α(n))", "O(n)"],
    correct_option: 2,
  },
  {
    question: "Which algorithm solves the All-Pairs Shortest Path problem in O(V³) time?",
    options: ["Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "Johnson's"],
    correct_option: 2,
  },
  {
    question: "In a Fenwick Tree (Binary Indexed Tree), what is the time complexity of range sum queries?",
    options: ["O(1)", "O(log n)", "O(√n)", "O(n)"],
    correct_option: 1,
  },
  {
    question: "What is the minimum number of edges that must be removed to make a connected graph acyclic?",
    options: ["V-1", "E-V+1", "E-V", "V"],
    correct_option: 1,
  },
  {
    question: "Which string matching algorithm has the best worst-case time complexity?",
    options: ["Naive", "KMP", "Rabin-Karp", "Boyer-Moore"],
    correct_option: 1,
  },
  {
    question: "What is the space complexity of merge sort when implemented iteratively?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct_option: 2,
  },
  {
    question: "In a suffix array, what additional data structure is commonly used to answer LCP (Longest Common Prefix) queries efficiently?",
    options: ["Segment Tree", "LCP Array", "Sparse Table", "All of the above"],
    correct_option: 3,
  },
  {
    question: "What is the time complexity of finding the median of two sorted arrays of sizes m and n?",
    options: ["O(m+n)", "O(log(m+n))", "O(min(m,n))", "O(log(min(m,n)))"],
    correct_option: 3,
  },
  {
    question: "Which data structure is most suitable for implementing persistent data structures?",
    options: ["Arrays", "Linked Lists", "Trees with path copying", "Hash Tables"],
    correct_option: 2,
  },
  {
    question: "What is the expected time complexity of building a randomized treap?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correct_option: 1,
  },

  // ---------- System Design & Architecture (15) ----------
  {
    question: "In CAP theorem, what does 'P' stand for and why is it considered unavoidable in distributed systems?",
    options: [
      "Performance - systems must be fast",
      "Partition tolerance - network failures are inevitable",
      "Persistence - data must be durable",
      "Parallelism - systems must handle concurrent requests"
    ],
    correct_option: 1,
  },
  {
    question: "Which consistency model guarantees that all nodes see the same data at the same time?",
    options: ["Eventual consistency", "Strong consistency", "Causal consistency", "Session consistency"],
    correct_option: 1,
  },
  {
    question: "What is the primary advantage of using a Content Delivery Network (CDN)?",
    options: [
      "Increased storage capacity",
      "Reduced latency through geographic distribution",
      "Better security encryption",
      "Automatic data backup"
    ],
    correct_option: 1,
  },
  {
    question: "In microservices architecture, what pattern is used to maintain data consistency across services?",
    options: ["ACID transactions", "Saga pattern", "Two-phase locking", "Optimistic locking"],
    correct_option: 1,
  },
  {
    question: "Which caching strategy provides the best cache hit ratio for read-heavy workloads?",
    options: ["Write-through", "Write-back", "Cache-aside", "Write-around"],
    correct_option: 2,
  },
  {
    question: "What is the main purpose of a circuit breaker pattern in distributed systems?",
    options: [
      "Load balancing",
      "Data encryption",
      "Preventing cascading failures",
      "Database connection pooling"
    ],
    correct_option: 2,
  },
  {
    question: "In database sharding, what is the main challenge with resharding?",
    options: [
      "Data loss",
      "Downtime and data redistribution complexity",
      "Security vulnerabilities",
      "Increased storage costs"
    ],
    correct_option: 1,
  },
  {
    question: "Which Apache Kafka concept ensures message ordering within a topic?",
    options: ["Brokers", "Partitions", "Consumers", "Producers"],
    correct_option: 1,
  },
  {
    question: "What is the primary difference between horizontal and vertical scaling?",
    options: [
      "Cost efficiency",
      "Adding more machines vs. upgrading existing hardware",
      "Security implications",
      "Database compatibility"
    ],
    correct_option: 1,
  },
  {
    question: "In Redis, which data structure is most efficient for implementing a leaderboard?",
    options: ["Lists", "Sets", "Sorted Sets", "Hash"],
    correct_option: 2,
  },
  {
    question: "What is the main advantage of using Database Connection Pooling?",
    options: [
      "Better query performance",
      "Reduced connection overhead and resource management",
      "Automatic query optimization",
      "Enhanced data security"
    ],
    correct_option: 1,
  },
  {
    question: "Which protocol is most commonly used for real-time bidirectional communication in web applications?",
    options: ["HTTP/1.1", "HTTP/2", "WebSocket", "gRPC"],
    correct_option: 2,
  },
  {
    question: "In event-driven architecture, what is the main benefit of using an event sourcing pattern?",
    options: [
      "Faster queries",
      "Complete audit trail and ability to recreate state",
      "Reduced storage requirements",
      "Simplified codebase"
    ],
    correct_option: 1,
  },
  {
    question: "What is the primary purpose of using a reverse proxy like Nginx?",
    options: [
      "Database optimization",
      "Load balancing and SSL termination",
      "Code compilation",
      "Data encryption"
    ],
    correct_option: 1,
  },
  {
    question: "Which consensus algorithm is used by Ethereum for transaction validation?",
    options: ["Proof of Work", "Proof of Stake", "Practical Byzantine Fault Tolerance", "Raft"],
    correct_option: 1,
  },

  // ---------- Advanced Programming Concepts (15) ----------
  {
    question: "In functional programming, what is a monad primarily used for?",
    options: [
      "Performance optimization",
      "Composing operations while handling context/effects",
      "Memory management",
      "Parallel processing"
    ],
    correct_option: 1,
  },
  {
    question: "Which design pattern is violated when a class depends on concrete implementations rather than abstractions?",
    options: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Dependency Inversion"],
    correct_option: 3,
  },
  {
    question: "In concurrent programming, what problem does the ABA problem refer to?",
    options: [
      "Deadlock between three threads",
      "Race condition in lock-free algorithms",
      "Memory leak in garbage collection",
      "Stack overflow in recursive calls"
    ],
    correct_option: 1,
  },
  {
    question: "What is the main advantage of copy-on-write (COW) strategy?",
    options: [
      "Faster writes",
      "Memory efficiency until modification occurs",
      "Better security",
      "Simplified debugging"
    ],
    correct_option: 1,
  },
  {
    question: "In compiler design, what is the purpose of the intermediate representation (IR)?",
    options: [
      "Faster execution",
      "Platform-independent optimization and translation",
      "Better error messages",
      "Reduced memory usage"
    ],
    correct_option: 1,
  },
  {
    question: "Which memory management technique is used by languages like Rust to prevent memory leaks?",
    options: ["Garbage Collection", "Reference Counting", "Ownership and Borrowing", "Manual Management"],
    correct_option: 2,
  },
  {
    question: "In reactive programming, what does the term 'backpressure' refer to?",
    options: [
      "Handling slow consumers in data streams",
      "Optimizing database queries",
      "Managing thread priorities",
      "Compressing network data"
    ],
    correct_option: 0,
  },
  {
    question: "What is tail call optimization primarily used for?",
    options: [
      "Faster function calls",
      "Preventing stack overflow in recursive functions",
      "Better memory allocation",
      "Improved error handling"
    ],
    correct_option: 1,
  },
  {
    question: "In the context of JavaScript engines, what does JIT compilation stand for?",
    options: ["Just In Time", "Java Integration Tool", "JavaScript Interpreted Transform", "Joint Interface Technology"],
    correct_option: 0,
  },
  {
    question: "Which concurrency model is used by Go programming language?",
    options: ["Actor model", "Communicating Sequential Processes", "Event-driven", "Shared memory threading"],
    correct_option: 1,
  },
  {
    question: "What is the primary benefit of immutable data structures?",
    options: [
      "Better performance",
      "Thread safety and easier reasoning about code",
      "Less memory usage",
      "Faster serialization"
    ],
    correct_option: 1,
  },
  {
    question: "In aspect-oriented programming, what is a 'pointcut'?",
    options: [
      "A debugging tool",
      "A specification of where aspects should be applied",
      "A type of exception",
      "A memory allocation strategy"
    ],
    correct_option: 1,
  },
  {
    question: "What is the main difference between composition and inheritance in object-oriented design?",
    options: [
      "Performance implications",
      "'Has-a' relationship vs 'Is-a' relationship",
      "Memory usage patterns",
      "Compilation speed"
    ],
    correct_option: 1,
  },
  {
    question: "In distributed computing, what does the term 'eventual consistency' guarantee?",
    options: [
      "Data will be consistent immediately",
      "Data will become consistent given enough time without updates",
      "Data will never be inconsistent",
      "Data consistency is not guaranteed"
    ],
    correct_option: 1,
  },
  {
    question: "Which technique is used to prevent the diamond problem in multiple inheritance?",
    options: ["Method overriding", "Virtual inheritance", "Abstract classes", "Interface segregation"],
    correct_option: 1,
  },

  // ---------- Advanced Soft Skills & Leadership (10) ----------
  {
    question: "As a technical lead, your team is behind schedule on a critical project. Two team members are in conflict about the technical approach. What's the most effective leadership strategy?",
    options: [
      "Make the technical decision yourself to save time",
      "Facilitate a structured discussion to reach consensus while focusing on project goals",
      "Assign the decision to the senior-most developer",
      "Escalate to upper management immediately"
    ],
    correct_option: 1,
  },
  {
    question: "During a code review, you notice a junior developer has implemented a working solution that doesn't follow best practices. How should you provide feedback?",
    options: [
      "Reject the code immediately and ask for a rewrite",
      "Accept it since it works and avoid discouraging the developer",
      "Provide specific, constructive feedback with examples and resources for improvement",
      "Have a senior developer rewrite it without explanation"
    ],
    correct_option: 2,
  },
  {
    question: "You're leading a cross-functional team with members from different cultural backgrounds and time zones. What's the most important factor for success?",
    options: [
      "Establishing a single communication language and timezone",
      "Creating inclusive communication protocols and cultural awareness",
      "Minimizing meetings to avoid timezone conflicts",
      "Assigning roles based on geographic location"
    ],
    correct_option: 1,
  },
  {
    question: "A stakeholder is pressuring you to cut testing time to meet a deadline. You know this increases risk significantly. What's the most professional approach?",
    options: [
      "Comply immediately to maintain relationships",
      "Present data-driven risk analysis and propose alternative solutions",
      "Refuse outright without explanation",
      "Secretly maintain testing while reporting faster progress"
    ],
    correct_option: 1,
  },
  {
    question: "You discover a significant architectural flaw in a system that's about to go live, but fixing it would delay the release by two months. How do you handle this ethical dilemma?",
    options: [
      "Deploy anyway and fix it in the next iteration",
      "Present the issue transparently with risk assessment and recommendations",
      "Fix it quietly without informing stakeholders about the delay",
      "Escalate the decision upward without providing your recommendation"
    ],
    correct_option: 1,
  },
  {
    question: "When mentoring a struggling team member, what approach demonstrates emotional intelligence?",
    options: [
      "Focus solely on technical skills improvement",
      "Understand their perspective, provide support, and create development opportunities",
      "Compare them to other team members to motivate improvement",
      "Document performance issues for HR immediately"
    ],
    correct_option: 1,
  },
  {
    question: "During a technical presentation to non-technical executives, you realize they're not understanding key concepts. What should you do?",
    options: [
      "Continue with the technical explanation as planned",
      "Pause and adapt your communication style with analogies and business impact",
      "Speed through the technical parts to get to conclusions",
      "Suggest they bring technical advisors to future meetings"
    ],
    correct_option: 1,
  },
  {
    question: "You're asked to provide an estimate for a complex project with many unknowns. What's the most responsible approach?",
    options: [
      "Give a rough estimate based on similar projects",
      "Provide ranges with confidence levels and explain assumptions and risks",
      "Refuse to estimate until all requirements are clear",
      "Provide a padded estimate without explaining the uncertainty"
    ],
    correct_option: 1,
  },
  {
    question: "A team member consistently dominates meetings and interrupts others. As a leader, how do you address this?",
    options: [
      "Ignore it to avoid confrontation",
      "Address it privately first, then establish meeting ground rules if needed",
      "Call them out publicly during the next meeting",
      "Start having meetings without them"
    ],
    correct_option: 1,
  },
  {
    question: "You need to deliver bad news about a project delay to stakeholders. What communication strategy is most effective?",
    options: [
      "Delay the communication until you have solutions",
      "Be transparent early, explain causes, and present mitigation plans",
      "Focus blame on external factors beyond your control",
      "Present multiple scenarios without recommending one"
    ],
    correct_option: 1,
  }
];
