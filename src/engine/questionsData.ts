// Question bank for the Technopoly Game Master.
//
// SOURCE: This content is LOCALLY AUTHORED for this application. The
// Technopoly rules PDF does not include a specific question bank. The rules
// only specify:
//   • Properties, houses/hotels, challenges, jail exits, and chance draws
//     each require an answered question.
//   • Questions have a "level" (used as difficulty).
//   • The document is titled "Code Your Way to the Top" with the game's cover
//     art referencing Data Structures & Algorithms (Arrays, Linked Lists,
//     Stacks, Queues, Trees, Graphs) and the C programming language
//     (Variables, Pointers, Functions, Arrays, Structures, File Handling).
//     So the theme is CS / programming / tech.
//
// Every question is tagged with { difficulty, category }. The question engine
// filters by the requirement of the current game action, then picks randomly
// from the remaining pool while avoiding immediate reuse. The Game Master can
// add or edit questions in the in-app Settings (JSON editor).
//
// Nothing in this file is presented as an "official" Technopoly question.
// This is the locally-authored default question set.

import type { Question } from './types'

export const DEFAULT_QUESTIONS: Question[] = [
  // ────────────────────────── EASY — DSA ──────────────────────────
  { id: 'q-e-01', difficulty: 'easy', category: 'DSA', question: 'Which data structure follows the FIFO (First-In, First-Out) principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'], correctIndex: 1,
    explanation: 'A queue processes elements in the order they were added (FIFO).' },
  { id: 'q-e-02', difficulty: 'easy', category: 'DSA', question: 'Which data structure follows the LIFO (Last-In, First-Out) principle?',
    options: ['Queue', 'Stack', 'Linked list', 'Array'], correctIndex: 1,
    explanation: 'A stack removes the most recently added element first.' },
  { id: 'q-e-03', difficulty: 'easy', category: 'DSA', question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correctIndex: 2,
    explanation: 'Array indexing is a direct memory offset — constant time.' },
  { id: 'q-e-04', difficulty: 'easy', category: 'DSA', question: 'In a singly linked list, each node contains data and a pointer to the ___ node.',
    options: ['Previous', 'Next', 'Head', 'Tail'], correctIndex: 1,
    explanation: 'Each node in a singly linked list points to the next node only.' },
  { id: 'q-e-05', difficulty: 'easy', category: 'DSA', question: 'Which of the following is a linear data structure?',
    options: ['Tree', 'Graph', 'Array', 'Heap'], correctIndex: 2,
    explanation: 'An array stores elements in a linear sequence.' },

  // ────────────────────────── EASY — C ────────────────────────────
  { id: 'q-e-06', difficulty: 'easy', category: 'C', question: 'Which symbol is used to obtain the address of a variable in C?',
    options: ['*', '&', '#', '%'], correctIndex: 1,
    explanation: 'The `&` operator returns the address of its operand.' },
  { id: 'q-e-07', difficulty: 'easy', category: 'C', question: 'Which header must be included to use printf()?',
    options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'], correctIndex: 1,
    explanation: 'printf() is declared in <stdio.h>.' },
  { id: 'q-e-08', difficulty: 'easy', category: 'C', question: 'What is the size of the char type in C (guaranteed by the standard)?',
    options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'], correctIndex: 0,
    explanation: 'sizeof(char) is always 1 by the C standard.' },
  { id: 'q-e-09', difficulty: 'easy', category: 'C', question: 'Which operator is used to access a member of a struct through a pointer?',
    options: ['.', '::', '->', ':'], correctIndex: 2,
    explanation: 'p->member is shorthand for (*p).member.' },
  { id: 'q-e-10', difficulty: 'easy', category: 'C', question: 'The main() function typically returns which type by default?',
    options: ['void', 'int', 'float', 'char'], correctIndex: 1,
    explanation: 'The standard signature returns int (0 for success).' },

  // ─────────────────── EASY — General programming ────────────────
  { id: 'q-e-11', difficulty: 'easy', category: 'General', question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Machine Loop', 'HighText Markup Loop'], correctIndex: 0 },
  { id: 'q-e-12', difficulty: 'easy', category: 'General', question: 'Which of these is NOT a programming language?',
    options: ['Python', 'HTML', 'Java', 'Rust'], correctIndex: 1,
    explanation: 'HTML is a markup language, not a programming language.' },
  { id: 'q-e-13', difficulty: 'easy', category: 'General', question: 'What does "IDE" stand for?',
    options: ['Integrated Development Environment', 'Internal Debug Engine', 'Interactive Design Editor', 'Internet Data Exchange'], correctIndex: 0 },
  { id: 'q-e-14', difficulty: 'easy', category: 'General', question: 'Binary uses which two digits?',
    options: ['0 and 1', '1 and 2', '0 and 9', 'A and B'], correctIndex: 0 },
  { id: 'q-e-15', difficulty: 'easy', category: 'General', question: 'What does the "CPU" stand for?',
    options: ['Central Program Unit', 'Central Processing Unit', 'Computer Power Unit', 'Control Processing Utility'], correctIndex: 1 },

  // ──────────────────────── MEDIUM — DSA ──────────────────────────
  { id: 'q-m-01', difficulty: 'medium', category: 'DSA', question: 'The worst-case time complexity of Quick Sort is:',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 2,
    explanation: 'Worst case is when the pivot is always the smallest or largest element.' },
  { id: 'q-m-02', difficulty: 'medium', category: 'DSA', question: 'Which traversal of a Binary Search Tree yields sorted output?',
    options: ['Preorder', 'Inorder', 'Postorder', 'Level order'], correctIndex: 1,
    explanation: 'Left → Root → Right visits keys in ascending order for a BST.' },
  { id: 'q-m-03', difficulty: 'medium', category: 'DSA', question: 'A hash table with chaining has an average lookup time of:',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 0,
    explanation: 'With a good hash function and load factor bounded, expected lookup is O(1).' },
  { id: 'q-m-04', difficulty: 'medium', category: 'DSA', question: 'Which algorithm is used to find the shortest path in a weighted graph with non-negative weights?',
    options: ['DFS', 'BFS', 'Dijkstra\'s', 'Kruskal\'s'], correctIndex: 2 },
  { id: 'q-m-05', difficulty: 'medium', category: 'DSA', question: 'A complete binary tree with n nodes has height:',
    options: ['n', 'n/2', 'log₂(n)', '√n'], correctIndex: 2,
    explanation: 'Height is ⌊log₂(n)⌋ for a complete binary tree.' },

  // ──────────────────────── MEDIUM — C ────────────────────────────
  { id: 'q-m-06', difficulty: 'medium', category: 'C', question: 'What is the output of `printf("%d", sizeof("hello"));` on a typical system?',
    options: ['5', '6', '4', 'undefined'], correctIndex: 1,
    explanation: 'Includes the null terminator: h, e, l, l, o, \\0 = 6 bytes.' },
  { id: 'q-m-07', difficulty: 'medium', category: 'C', question: 'Which storage class limits a variable\'s scope to the file it is declared in?',
    options: ['auto', 'extern', 'static', 'register'], correctIndex: 2,
    explanation: 'File-scope static gives internal linkage.' },
  { id: 'q-m-08', difficulty: 'medium', category: 'C', question: 'What does `malloc(0)` return in standard C?',
    options: ['NULL', 'A valid pointer that must not be dereferenced', 'Either NULL or a unique non-dereferenceable pointer', 'Undefined behaviour'], correctIndex: 2 },
  { id: 'q-m-09', difficulty: 'medium', category: 'C', question: 'Which of these is a valid way to declare a function pointer to a function returning int and taking two ints?',
    options: ['int *fp(int, int);', 'int (*fp)(int, int);', 'int *fp(int)(int);', '(int*) fp(int, int);'], correctIndex: 1 },
  { id: 'q-m-10', difficulty: 'medium', category: 'C', question: 'What happens when you free() a pointer twice?',
    options: ['Nothing', 'Memory is freed twice', 'Undefined behaviour', 'The OS reclaims automatically'], correctIndex: 2 },

  // ────────────────────── MEDIUM — General ────────────────────────
  { id: 'q-m-11', difficulty: 'medium', category: 'General', question: 'Which HTTP method is idempotent AND safe?',
    options: ['POST', 'GET', 'DELETE', 'PATCH'], correctIndex: 1,
    explanation: 'GET does not modify state and can be repeated freely.' },
  { id: 'q-m-12', difficulty: 'medium', category: 'General', question: 'In OOP, which pillar allows a subclass to provide a specific implementation of a method already defined in its superclass?',
    options: ['Encapsulation', 'Abstraction', 'Polymorphism', 'Inheritance'], correctIndex: 2 },
  { id: 'q-m-13', difficulty: 'medium', category: 'General', question: 'What is the primary purpose of Git\'s "rebase" command?',
    options: ['Merge branches', 'Rewrite commit history onto a new base', 'Undo a commit', 'Clone a repository'], correctIndex: 1 },
  { id: 'q-m-14', difficulty: 'medium', category: 'General', question: 'Which of these is NOT an OSI layer?',
    options: ['Session', 'Presentation', 'Compression', 'Transport'], correctIndex: 2 },
  { id: 'q-m-15', difficulty: 'medium', category: 'General', question: 'In SQL, which keyword removes duplicate rows from a result?',
    options: ['UNIQUE', 'DISTINCT', 'REMOVE', 'PURGE'], correctIndex: 1 },

  // ──────────────────────── HARD — DSA ────────────────────────────
  { id: 'q-h-01', difficulty: 'hard', category: 'DSA', question: 'The amortized time complexity of appending to a dynamic array is:',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 0,
    explanation: 'Doubling strategy gives O(1) amortized per push.' },
  { id: 'q-h-02', difficulty: 'hard', category: 'DSA', question: 'A red-black tree guarantees which of the following properties?',
    options: ['Balanced within a factor of 2', 'Constant-time insertion', 'Perfectly balanced', 'FIFO order'], correctIndex: 0,
    explanation: 'The longest path is at most twice the shortest.' },
  { id: 'q-h-03', difficulty: 'hard', category: 'DSA', question: 'Which algorithm finds strongly connected components in linear time?',
    options: ['Prim\'s', 'Dijkstra\'s', 'Tarjan\'s', 'Bellman-Ford'], correctIndex: 2 },
  { id: 'q-h-04', difficulty: 'hard', category: 'DSA', question: 'What is the space complexity of iterative in-order traversal of a BST using an explicit stack?',
    options: ['O(1)', 'O(log n)', 'O(h) where h is height', 'O(n²)'], correctIndex: 2 },
  { id: 'q-h-05', difficulty: 'hard', category: 'DSA', question: 'Dynamic programming solves problems by:',
    options: ['Randomised sampling', 'Storing overlapping subproblem results', 'Sorting inputs first', 'Using recursion only'], correctIndex: 1 },

  // ──────────────────────── HARD — C ──────────────────────────────
  { id: 'q-h-06', difficulty: 'hard', category: 'C', question: 'What does `volatile` mean when applied to a variable in C?',
    options: ['Value is immutable', 'Value may change outside program control; compiler must not optimise reads', 'Memory is allocated on the heap', 'Thread-local storage'], correctIndex: 1 },
  { id: 'q-h-07', difficulty: 'hard', category: 'C', question: 'Which of these is TRUE about `const int *p`?',
    options: ['p cannot be reassigned', 'The value pointed to cannot be modified via p', 'Both p and the value are constant', 'It is a syntax error'], correctIndex: 1 },
  { id: 'q-h-08', difficulty: 'hard', category: 'C', question: 'Given `int a[5] = {1,2,3,4,5};`, the expression `*(a + 2)` evaluates to:',
    options: ['1', '2', '3', 'undefined'], correctIndex: 2,
    explanation: 'a decays to a pointer to a[0]; a+2 points to a[2] which is 3.' },
  { id: 'q-h-09', difficulty: 'hard', category: 'C', question: 'What is the difference between `struct` and `union` in C?',
    options: ['No difference', 'union members share memory; struct members each have their own', 'struct is dynamic; union is static', 'union supports methods'], correctIndex: 1 },
  { id: 'q-h-10', difficulty: 'hard', category: 'C', question: 'In `fopen("file.bin", "rb")`, what does `rb` mean?',
    options: ['Read binary', 'Read blocked', 'Reset buffer', 'Random block'], correctIndex: 0 },

  // ────────────────────── HARD — General ──────────────────────────
  { id: 'q-h-11', difficulty: 'hard', category: 'General', question: 'In distributed systems, the CAP theorem trades off Consistency, Availability, and:',
    options: ['Persistence', 'Partition tolerance', 'Performance', 'Parallelism'], correctIndex: 1 },
  { id: 'q-h-12', difficulty: 'hard', category: 'General', question: 'Which of these is NOT a valid HTTP status code?',
    options: ['418', '306', '444', '299'], correctIndex: 3,
    explanation: '299 is not defined. 418 (I\'m a teapot), 306 (reserved), 444 (nginx-only) all exist.' },
  { id: 'q-h-13', difficulty: 'hard', category: 'General', question: 'The time complexity of the Fast Fourier Transform (FFT) is:',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 1 },
  { id: 'q-h-14', difficulty: 'hard', category: 'General', question: 'Which consensus protocol is used by Bitcoin?',
    options: ['Raft', 'Paxos', 'Proof of Work', 'PBFT'], correctIndex: 2 },
  { id: 'q-h-15', difficulty: 'hard', category: 'General', question: 'In SQL, a "left outer join" of A and B returns:',
    options: ['Only matching rows', 'All rows in A plus matching in B (NULL if none)', 'All rows in both', 'All rows in B plus matching in A'], correctIndex: 1 }
]
