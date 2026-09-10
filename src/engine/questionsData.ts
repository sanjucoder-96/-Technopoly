import type { Question } from './types'

export const DEFAULT_QUESTIONS: Question[] = [
  // ── EASY (60 questions) ──
  { id: 'q-e-01', difficulty: 'easy', category: 'DSA-Arrays',
    question: 'What is printed?',
    code: `int a[] = {12, 7, 19, 5, 24};
printf("%d", a[2] - a[4]);`,
    options: ['12', '-5', '5', '-12'],
    correctIndex: 1 },
  { id: 'q-e-02', difficulty: 'easy', category: 'DSA-Arrays',
    question: 'What is printed?',
    code: `int a[] = {2, 4, 6, 8};
for(int i = 0;
i < 4;
i += 2)
printf("%d ", a[i]);`,
    options: ['2 4', '2 6', '4 8', '2 4 6 8'],
    correctIndex: 1 },
  { id: 'q-e-03', difficulty: 'easy', category: 'DSA-Arrays',
    question: 'What is the final value of a[1]?',
    code: `int a[] = {10, 20, 30};
a[1] = a[0] + a[2];`,
    options: ['20', '30', '40', '50'],
    correctIndex: 2 },
  { id: 'q-e-04', difficulty: 'easy', category: 'DSA-Arrays',
    question: 'What is printed?',
    code: `int a[] = {10, 20, 30, 40};
printf("%d", 2[a]);`,
    options: ['2', '20', '30', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-e-05', difficulty: 'easy', category: 'DSA-Stacks',
    question: 'A stack is initially empty.\nWhat is at the top?',
    code: `push(10)
push(20)
pop()
push(30)`,
    options: ['10', '20', '30', 'Empty'],
    correctIndex: 2 },
  { id: 'q-e-06', difficulty: 'easy', category: 'DSA-Stacks',
    question: 'A stack contains 10, 20, 30, 40, where 40 is at the top.\nTwo pop() operations are performed, followed by push(50).\nWhat is the new top?',
    options: ['20', '30', '40', '50'],
    correctIndex: 3 },
  { id: 'q-e-07', difficulty: 'easy', category: 'DSA-Stacks',
    question: 'Which sequence of operations leaves 20 at the top?',
    options: ['push(10), push(20), push(30), pop()', 'push(10), push(20), pop()', 'push(20), push(10), pop()', 'push(10), pop(), push(20)'],
    correctIndex: 3 },
  { id: 'q-e-08', difficulty: 'easy', category: 'DSA-Stacks',
    question: 'A stack contains 10, 20, 30, with 30 at the top.\nWhat happens after: pop(), pop(), push(40)?',
    options: ['Top is 10', 'Top is 20', 'Top is 30', 'Top is 40'],
    correctIndex: 3 },
  { id: 'q-e-09', difficulty: 'easy', category: 'DSA-Queues',
    question: 'A queue contains 10 → 20 → 30, with 10 at the front.\nAfter one dequeue() and one enqueue(40), what is the queue?',
    options: ['10 20 30 40', '20 30 40', '20 30', '10 20 40'],
    correctIndex: 1 },
  { id: 'q-e-10', difficulty: 'easy', category: 'DSA-Queues',
    question: 'Which element leaves first from a normal queue?\n5 → 8 → 12 → 20, with 5 at the front.',
    options: ['5', '8', '12', '20'],
    correctIndex: 0 },
  { id: 'q-e-11', difficulty: 'easy', category: 'DSA-Queues',
    question: 'A queue initially contains 10, 20, 30.\nOperations: dequeue(), enqueue(40), dequeue()\nWhat remains?',
    options: ['10 40', '20 30', '30 40', '20 40'],
    correctIndex: 2 },
  { id: 'q-e-12', difficulty: 'easy', category: 'DSA-Recursion',
    question: 'What is printed?',
    code: `void fun(int n) {
    if(n == 0) return;
    printf("%d ", n);
    fun(n - 1);
}
fun(4);`,
    options: ['1 2 3 4', '4 3 2 1', '4 3 2 1 0', '0 1 2 3 4'],
    correctIndex: 1 },
  { id: 'q-e-13', difficulty: 'easy', category: 'DSA-Recursion',
    question: 'For fun(4), what is returned?',
    code: `int fun(int n) {
    if(n <= 1) return 1;
    return n * fun(n - 1);
}`,
    options: ['4', '8', '12', '24'],
    correctIndex: 3 },
  { id: 'q-e-14', difficulty: 'easy', category: 'DSA-Recursion',
    question: 'What is printed?',
    code: `void fun(int n) {
    if(n == 0) return;
    fun(n - 1);
    printf("%d ", n);
}
fun(3);`,
    options: ['3 2 1', '1 2 3', '3 1 2', '0 1 2 3'],
    correctIndex: 1 },
  { id: 'q-e-15', difficulty: 'easy', category: 'DSA-Basics',
    question: 'Which data structure is most naturally used to implement a browser\'s Back operation?',
    options: ['Queue', 'Stack', 'Array', 'Tree'],
    correctIndex: 1 },
  { id: 'q-e-16', difficulty: 'easy', category: 'C-Pointers',
    question: 'What is printed?',
    code: `int x = 25;
int *p = &x;
*p = 40;
printf("%d", x);`,
    options: ['25', '40', 'Address of x', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-e-17', difficulty: 'easy', category: 'C-Pointers',
    question: 'What is printed?',
    code: `int a[] = {10, 20, 30, 40};
int *p = a;
printf("%d", *(p + 2));`,
    options: ['10', '20', '30', '40'],
    correctIndex: 2 },
  { id: 'q-e-18', difficulty: 'easy', category: 'C-Pointers',
    question: 'What is printed?',
    code: `int a = 10;
int *p = &a;
(*p)++;
printf("%d", a);`,
    options: ['10', '11', '12', 'Address of a'],
    correctIndex: 1 },
  { id: 'q-e-19', difficulty: 'easy', category: 'C-Pointers',
    question: 'What is printed?',
    code: `int a[] = {10, 20, 30};
int *p = a;
printf("%d", *p + 1);`,
    options: ['10', '11', '20', '30'],
    correctIndex: 1 },
  { id: 'q-e-20', difficulty: 'easy', category: 'C-Pointers',
    question: 'What is printed?',
    code: `int a[] = {10, 20, 30};
int *p = a;
printf("%d", *(p + 1) + 5);`,
    options: ['15', '20', '25', '35'],
    correctIndex: 2 },
  { id: 'q-e-21', difficulty: 'easy', category: 'C-Basics',
    question: 'What is printed?',
    code: `void change(int a[]) {
    a[0] = 100;
}

int main() {
    int x[] = {10, 20};
    change(x);
    printf("%d", x[0]);
}`,
    options: ['10', '20', '100', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-e-22', difficulty: 'easy', category: 'C-Basics',
    question: 'Assume int occupies 4 bytes.',
    code: `int a[5];
printf("%zu", sizeof(a));`,
    options: ['4', '5', '20', 'Depends on the values'],
    correctIndex: 2 },
  { id: 'q-e-23', difficulty: 'easy', category: 'C-Basics',
    question: 'What is printed?',
    code: `void fun(int x) {
    x = 50;
}

int main() {
    int a = 10;
    fun(a);
    printf("%d", a);
}`,
    options: ['10', '50', '0', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-e-24', difficulty: 'easy', category: 'C-Basics',
    question: 'What is printed?',
    code: `void fun() {
    static int x = 0;
    x++;
    printf("%d ", x);
}

fun();
fun();
fun();`,
    options: ['1 1 1', '0 1 2', '1 2 3', '0 0 0'],
    correctIndex: 2 },
  { id: 'q-e-25', difficulty: 'easy', category: 'C-Structures',
    question: 'What is printed?',
    code: `struct Student {
    int roll;
    int marks;
};

struct Student s = {101, 85};
printf("%d", s.marks);`,
    options: ['101', '85', '186', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-26', difficulty: 'easy', category: 'C-Structures',
    question: 'What is printed?',
    code: `struct Student {
    int roll;
    int marks;
};

struct Student s[2] = {{101, 80}, {102, 90}};
printf("%d", s[1].marks);`,
    options: ['80', '90', '102', '170'],
    correctIndex: 1 },
  { id: 'q-e-27', difficulty: 'easy', category: 'C-Structures',
    question: 'What is printed?',
    code: `struct Student {
    int marks;
};
struct Student s = {90};
struct Student *p = &s;
printf("%d", p->marks);`,
    options: ['Address of marks', '90', '0', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-e-28', difficulty: 'easy', category: 'C-Structures',
    question: 'Which expression accesses marks through a structure pointer p?',
    options: ['p.marks', 'p->marks', '*p.marks', '&p.marks'],
    correctIndex: 1 },
  { id: 'q-e-29', difficulty: 'easy', category: 'C-Preprocessor',
    question: 'What is printed?',
    code: `#define DOUBLE(x) x + x
printf("%d", DOUBLE(3) * 2);`,
    options: ['6', '9', '12', '18'],
    correctIndex: 1 },
  { id: 'q-e-30', difficulty: 'easy', category: 'C-Preprocessor',
    question: 'Which statement is correct about #include <stdio.h>?',
    options: ['It creates a variable called stdio', 'It asks the preprocessor to include the header\'s contents', 'It executes the file at runtime', 'It defines a macro'],
    correctIndex: 1 },
  { id: 'q-e-31', difficulty: 'easy', category: 'Python-Lists',
    question: 'What is printed?',
    code: `a = [1, 2, 3]
b = a
b[0] = 10
print(a)`,
    options: ['[1, 2, 3]', '[10, 2, 3]', '[10]', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-32', difficulty: 'easy', category: 'Python-Lists',
    question: 'What is printed?',
    code: `x = [10, 20, 30, 40]
print(x[-2])`,
    options: ['20', '30', '40', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-33', difficulty: 'easy', category: 'Python-Lists',
    question: 'What is printed?',
    code: `x = [10, 20, 30, 40, 50]
print(x[1:4])`,
    options: ['[10, 20, 30]', '[20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30, 40]'],
    correctIndex: 1 },
  { id: 'q-e-34', difficulty: 'easy', category: 'Python-Lists',
    question: 'What is printed?',
    code: `x = [10, 20, 30, 40, 50]
print(x[:3])`,
    options: ['[10, 20]', '[10, 20, 30]', '[20, 30, 40]', '[10, 20, 30, 40]'],
    correctIndex: 1 },
  { id: 'q-e-35', difficulty: 'easy', category: 'Python-Loops',
    question: 'What is printed?',
    code: `for i in range(2, 7, 2):
print(i, end=" ")`,
    options: ['2 4 6', '2 4 6 8', '1 3 5 7', '2 3 4 5 6'],
    correctIndex: 0 },
  { id: 'q-e-36', difficulty: 'easy', category: 'Python-Loops',
    question: 'What is printed?',
    code: `for i in range(3):
print(i)
else:
print("Done")`,
    options: ['0 1 2', '0 1 2 Done', 'Done 0 1 2', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-37', difficulty: 'easy', category: 'Python-Loops',
    question: 'What is printed?',
    code: `for i in range(5):
if i == 2:
break
print(i)
else:
print("Done")`,
    options: ['0 1 Done', '0 1', '0 1 2 Done', 'Done'],
    correctIndex: 1 },
  { id: 'q-e-38', difficulty: 'easy', category: 'Python-Lists',
    question: 'What is printed?',
    code: `x = [10, 20, 30, 40]
x.pop(1)
print(x)`,
    options: ['[10, 30, 40]', '[20, 30, 40]', '[10, 20, 40]', '[10, 20, 30]'],
    correctIndex: 0 },
  { id: 'q-e-39', difficulty: 'easy', category: 'Python-Functions',
    question: 'What is printed?',
    code: `def add(x, items=[]):
items.append(x)
return items

print(add(1))
print(add(2))`,
    options: ['[1] / [2]', '[1] / [1, 2]', '[1, 2] / [1, 2]', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-40', difficulty: 'easy', category: 'Python-Basics',
    question: 'Which statement is correct?',
    options: ['Tuples cannot contain lists', 'Tuples are generally immutable', 'Tuples can only contain numbers', 'Tuples cannot be indexed'],
    correctIndex: 1 },
  { id: 'q-e-41', difficulty: 'easy', category: 'Python-Dictionaries',
    question: 'What is printed?',
    code: `d = {"a": 10, "b": 20}
d["a"] = 50
print(d["a"])`,
    options: ['10', '20', '50', 'Error'],
    correctIndex: 2 },
  { id: 'q-e-42', difficulty: 'easy', category: 'Python-Basics',
    question: 'What is printed?',
    code: `x = []
if x:
print("A")
else:
print("B")`,
    options: ['A', 'B', '[]', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-43', difficulty: 'easy', category: 'Python-Basics',
    question: 'What is printed?',
    code: `a = [1, 2]
b = [1, 2]
print(a == b)`,
    options: ['True', 'False', 'None', 'Error'],
    correctIndex: 0 },
  { id: 'q-e-44', difficulty: 'easy', category: 'Python-Basics',
    question: 'What does is primarily test?',
    options: ['Whether two values are equal', 'Whether two references refer to the same object', 'Whether two numbers are integers', 'Whether two lists have the same length'],
    correctIndex: 1 },
  { id: 'q-e-45', difficulty: 'easy', category: 'Python-Strings',
    question: 'What is printed?',
    code: `s = "PYTHON"
print(s[1:5])`,
    options: ['PYTH', 'YTHO', 'YTH', 'THON'],
    correctIndex: 1 },
  { id: 'q-e-46', difficulty: 'easy', category: 'Java-Classes-Objects',
    question: 'What is printed?',
    code: `class Student {
    int marks = 80;
}

Student s = new Student();
System.out.println(s.marks);`,
    options: ['0', '80', 'Student', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-e-47', difficulty: 'easy', category: 'Java-Constructors',
    question: 'What is printed?',
    code: `class Student {
    Student() {
        System.out.println("Created");
    }
}

Student s = new Student();`,
    options: ['Nothing', 'Student', 'Created', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-e-48', difficulty: 'easy', category: 'Java-Constructors',
    question: 'Which statement about a constructor is correct?',
    options: ['It must have the same name as the class', 'It must have a return type', 'It must be static', 'It can have any name'],
    correctIndex: 0 },
  { id: 'q-e-49', difficulty: 'easy', category: 'Java-Basics',
    question: 'What does this.marks refer to?',
    code: `class Student {
    int marks;

    Student(int marks) {
        this.marks = marks;
    }
}`,
    options: ['The constructor parameter', 'The object\'s marks variable', 'A static variable', 'A new variable'],
    correctIndex: 1 },
  { id: 'q-e-50', difficulty: 'easy', category: 'Java-Encapsulation',
    question: 'A class keeps its data members private and provides public methods to access or modify them.\nWhich OOP concept is this?',
    options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Recursion'],
    correctIndex: 1 },
  { id: 'q-e-51', difficulty: 'easy', category: 'Java-Encapsulation',
    question: 'What happens?',
    code: `class Student {
    private int marks = 90;
}

Student s = new Student();
System.out.println(s.marks);`,
    options: ['Prints 90', 'Prints 0', 'Compilation error', 'Prints private'],
    correctIndex: 2 },
  { id: 'q-e-52', difficulty: 'easy', category: 'Java-Inheritance',
    question: 'Which statement is true?',
    code: `class Animal {
    void eat() {
        System.out.println("Eating");
    }
}

class Dog extends Animal {
}`,
    options: ['Dog cannot use eat()', 'Dog inherits eat()', 'Animal inherits from Dog', 'extends creates an object'],
    correctIndex: 1 },
  { id: 'q-e-53', difficulty: 'easy', category: 'Java-Polymorphism',
    question: 'Which is valid method overloading?',
    options: ['void add(int a) void add(int a, int b)', 'void add(int a) int add(int a)', 'void add(int a) void add(int a)', 'void add() void add()'],
    correctIndex: 0 },
  { id: 'q-e-54', difficulty: 'easy', category: 'Java-Polymorphism',
    question: 'Can these two methods exist in the same class as overloaded methods?',
    code: `int add(int a, int b)
double add(int a, int b)`,
    options: ['Yes', 'No, because only the return type is different', 'Yes, if double is larger', 'Only if both are static'],
    correctIndex: 1 },
  { id: 'q-e-55', difficulty: 'easy', category: 'Java-Inheritance',
    question: 'What is printed?',
    code: `class Animal {
    void sound() {
        System.out.println("Animal");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog");
    }
}

Dog d = new Dog();
d.sound();`,
    options: ['Animal', 'Dog', 'Animal Dog', 'Error'],
    correctIndex: 1 },
  { id: 'q-e-56', difficulty: 'easy', category: 'Java-Polymorphism',
    question: 'If Dog overrides sound(), which implementation runs?',
    code: `Animal a = new Dog();
a.sound();`,
    options: ['Animal\'s', 'Dog\'s', 'Both', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-e-57', difficulty: 'easy', category: 'Java-Inheritance',
    question: 'If a child class wants to call a method from its parent class, which keyword can it use?',
    options: ['this', 'parent', 'super', 'base'],
    correctIndex: 2 },
  { id: 'q-e-58', difficulty: 'easy', category: 'Java-Basics',
    question: 'What is printed?',
    code: `class Test {
    static int count = 10;
}

System.out.println(Test.count);`,
    options: ['0', '10', 'count', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-e-59', difficulty: 'easy', category: 'Java-Static',
    question: '',
    code: `class Test {
    static int count = 0;

    Test() {
        count++;
    }
}

new Test();
new Test();
new Test();

System.out.println(Test.count);`,
    options: ['0', '1', '2', '3'],
    correctIndex: 3 },
  { id: 'q-e-60', difficulty: 'easy', category: 'Java-Polymorphism',
    question: '',
    code: `class Vehicle {
    void move() {
        System.out.println("Vehicle");
    }
}

class Car extends Vehicle {
    void move() {
        System.out.println("Car");
    }
}

Vehicle v = new Car();
v.move();`,
    options: ['Vehicle', 'Car', 'VehicleCar', 'Compilation error'],
    correctIndex: 1 },

  // ── MEDIUM (60 questions) ──
  { id: 'q-m-01', difficulty: 'medium', category: 'DSA-Arrays',
    question: '',
    code: `int a[] = {2, 5, 8, 11};
for(int i = 1;
i < 4;
i++) a[i] = a[i] - a[i-1];
printf("%d", a[3]);`,
    options: ['6', '8', '9', '11'],
    correctIndex: 2 },
  { id: 'q-m-02', difficulty: 'medium', category: 'DSA-Arrays',
    question: '',
    code: `int a[] = {4, 7, 2, 9, 5};
int count = 0;
for(int i = 0;
i < 5;
i++) if(a[i] > a[0]) count++;
printf("%d", count);`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1 },
  { id: 'q-m-03', difficulty: 'medium', category: 'DSA-Arrays',
    question: '',
    code: `int a[] = {3, 8, 6, 10, 4};
int count = 0;
for(int i = 0;
i < 4;
i++) if(a[i] < a[i+1]) count++;
printf("%d", count);`,
    options: ['1', '2', '3', '4'],
    correctIndex: 1 },
  { id: 'q-m-04', difficulty: 'medium', category: 'C-Basics',
    question: 'What is the safest conclusion about this statement in C?',
    code: `int a[] = {10, 20, 30, 40};
int i = 1;
a[i] = a[i++] + 5;`,
    options: ['a[1] becomes 25', 'a[2] becomes 25', 'The expression has undefined behavior', 'Compilation always fails'],
    correctIndex: 2 },
  { id: 'q-m-05', difficulty: 'medium', category: 'DSA-Arrays',
    question: 'For an array of n elements, which pair of positions should be swapped first when reversing the array in-place?',
    options: ['0 and n', '0 and n-1', '1 and n-1', '1 and n'],
    correctIndex: 1 },
  { id: 'q-m-06', difficulty: 'medium', category: 'DSA-Arrays',
    question: 'Which value is encountered as a duplicate first when scanning left to right?',
    code: `int a[] = {1, 2, 1, 3, 2};`,
    options: ['1', '2', '3', 'No duplicate'],
    correctIndex: 0 },
  { id: 'q-m-07', difficulty: 'medium', category: 'DSA-Stacks',
    question: 'Which pop sequence is possible for a stack if elements are pushed in the order 1, 2, 3?',
    options: ['2, 1, 3', '3, 1, 2', '1, 3, 2', '2, 3, 1'],
    correctIndex: 2 },
  { id: 'q-m-08', difficulty: 'medium', category: 'DSA-Stacks',
    question: 'Starting empty: push(4), push(7), pop(), push(9), push(2), pop()\nWhat is the complete stack from bottom to top?',
    options: ['4, 9', '4, 7, 9', '4, 9, 2', '7, 9'],
    correctIndex: 0 },
  { id: 'q-m-09', difficulty: 'medium', category: 'DSA-Stacks',
    question: 'An editor stores each character typed so that Undo removes the most recently typed character. Which principle is used?',
    options: ['FIFO', 'LIFO', 'Random access', 'Priority ordering'],
    correctIndex: 1 },
  { id: 'q-m-10', difficulty: 'medium', category: 'DSA-Stacks',
    question: 'A stack has capacity 3 and currently contains three elements. What happens when another element is pushed, assuming no resizing?',
    options: ['Underflow', 'Overflow', 'Bottom element is removed', 'Top is replaced'],
    correctIndex: 1 },
  { id: 'q-m-11', difficulty: 'medium', category: 'DSA-Queues',
    question: 'Starting empty: enqueue(5), enqueue(8), dequeue(), enqueue(12), enqueue(15)\nWhat is the queue from front to rear?',
    options: ['5, 12, 15', '8, 12, 15', '8, 15, 12', '12, 15'],
    correctIndex: 1 },
  { id: 'q-m-12', difficulty: 'medium', category: 'DSA-Queues',
    question: 'Why are separate front and rear positions commonly maintained in an efficient array queue?',
    options: ['To sort the queue', 'To know where deletion and insertion occur', 'To store two copies of each element', 'To make it LIFO'],
    correctIndex: 1 },
  { id: 'q-m-13', difficulty: 'medium', category: 'DSA-Queues',
    question: 'In a circular queue, rear reaches the last array position while unused positions exist at the beginning. What can a correct implementation do?',
    options: ['Always report overflow', 'Wrap rear to the beginning', 'Delete the front automatically', 'Reverse the queue'],
    correctIndex: 1 },
  { id: 'q-m-14', difficulty: 'medium', category: 'DSA-Queues',
    question: 'A queue receives A, B, C, D. Then two elements are removed and E is inserted. What is the new front?',
    options: ['A', 'B', 'C', 'E'],
    correctIndex: 2 },
  { id: 'q-m-15', difficulty: 'medium', category: 'DSA-Basics',
    question: 'You need to repeatedly process the item that arrived earliest. Which structure most directly matches?',
    options: ['Stack', 'Queue', 'Binary tree', 'Hash table'],
    correctIndex: 1 },
  { id: 'q-m-16', difficulty: 'medium', category: 'DSA-Recursion',
    question: 'What does fun(4) return?',
    code: `int fun(int n) {
    if(n <= 1) return n;
    return fun(n-1) + 2;
}`,
    options: ['4', '5', '6', '7'],
    correctIndex: 2 },
  { id: 'q-m-17', difficulty: 'medium', category: 'DSA-Recursion',
    question: 'What is the last number printed by fun(5)?',
    code: `void fun(int n) {
    if(n == 0) return;
    printf("%d ", n);
    fun(n-1);
}`,
    options: ['5', '2', '1', '0'],
    correctIndex: 2 },
  { id: 'q-m-18', difficulty: 'medium', category: 'DSA-Recursion',
    question: 'What is sum(5)?',
    code: `int sum(int n) {
    if(n == 1) return 1;
    return n + sum(n-1);
}`,
    options: ['10', '15', '20', '25'],
    correctIndex: 1 },
  { id: 'q-m-19', difficulty: 'medium', category: 'DSA-Recursion',
    question: 'How many times is fun() called while evaluating fun(3), including the original call?',
    code: `int fun(int n) {
    if(n <= 1) return 1;
    return fun(n-1) + fun(n-2);
}`,
    options: ['3', '4', '5', '6'],
    correctIndex: 2 },
  { id: 'q-m-20', difficulty: 'medium', category: 'DSA-Recursion',
    question: 'What is printed by fun(2)?',
    code: `void fun(int n) {
    if(n == 0) return;
    fun(n-1);
    printf("%d ", n);
    fun(n-1);
}`,
    options: ['1 2 1', '2 1 1', '1 1 2', '2 1 2'],
    correctIndex: 0 },
  { id: 'q-m-21', difficulty: 'medium', category: 'C-Basics',
    question: '',
    code: `void change(int a[]) {
    a[1] = 99;
}
int main() {
    int a[] = {10,20,30};
    change(a);
    printf("%d", a[1]);
}`,
    options: ['20', '30', '99', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-m-22', difficulty: 'medium', category: 'C-Basics',
    question: '',
    code: `int x = 6, y = 4;
printf("%d", x & y);`,
    options: ['0', '2', '4', '10'],
    correctIndex: 2 },
  { id: 'q-m-23', difficulty: 'medium', category: 'C-Basics',
    question: 'What is printed?',
    code: `int x = 0;
if(x != 0 && 10/x > 1) printf("A");
else printf("B");`,
    options: ['A', 'B', 'Division by zero', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-24', difficulty: 'medium', category: 'C-Basics',
    question: '',
    code: `int x = 5;
if(x == 5 || ++x > 5) printf("%d", x);`,
    options: ['5', '6', '1', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-m-25', difficulty: 'medium', category: 'C-Pointers',
    question: '',
    code: `int x = 7;
int *p = &x;
int **q = &p;
**q = 12;
printf("%d", x);`,
    options: ['7', '12', 'Address of p', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-26', difficulty: 'medium', category: 'C-Pointers',
    question: 'What does q - p represent?',
    code: `int a[] = {10,20,30,40};
int *p = &a[0];
int *q = &a[3];`,
    options: ['3', '12 bytes always', '30', '4'],
    correctIndex: 0 },
  { id: 'q-m-27', difficulty: 'medium', category: 'C-Pointers',
    question: '',
    code: `int a[] = {10,20,30};
int *p = &a[0];
printf("%d ", *p);
p++;
printf("%d", *p);`,
    options: ['10 10', '10 20', '20 30', '10 30'],
    correctIndex: 1 },
  { id: 'q-m-28', difficulty: 'medium', category: 'C-Pointers',
    question: 'What is x?',
    code: `int x = 10;
int *p = &x;
int *q = p;
*q = 50;`,
    options: ['10', '50', 'Address of p', 'Undefined'],
    correctIndex: 1 },
  { id: 'q-m-29', difficulty: 'medium', category: 'C-Pointers',
    question: '',
    code: `int a[] = {10,20,30};
int *p = a;
printf("%d", *p + *(p+1));`,
    options: ['10', '20', '30', '40'],
    correctIndex: 2 },
  { id: 'q-m-30', difficulty: 'medium', category: 'C-Pointers',
    question: 'What value is printed?',
    code: `int x = 5;
int *p = &x;
printf("%d", *p++);`,
    options: ['5', '6', 'Address of x', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-m-31', difficulty: 'medium', category: 'C-Structures',
    question: 'What is a.x?',
    code: `struct Point {
    int x;
    int y;
};
struct Point a = {2, 3};
struct Point b = a;
b.x = 10;`,
    options: ['2', '3', '10', 'Undefined'],
    correctIndex: 0 },
  { id: 'q-m-32', difficulty: 'medium', category: 'C-Structures',
    question: '',
    code: `struct Student {
    int marks;
};
struct Student s[3] = {{60}, {75}, {90}};
for(int i = 0;
i < 3;
i++)
if(s[i].marks >= 75) printf("%d ", s[i].marks);`,
    options: ['60 75 90', '75 90', '60 90', '90'],
    correctIndex: 1 },
  { id: 'q-m-33', difficulty: 'medium', category: 'C-Structures',
    question: '',
    code: `struct Point {
    int x;
};
struct Point p = {10};
struct Point *q = &p;
(*q).x = 25;
printf("%d", p.x);`,
    options: ['10', '25', 'Address', 'Error'],
    correctIndex: 1 },
  { id: 'q-m-34', difficulty: 'medium', category: 'C-Structures',
    question: '',
    code: `struct Student {
    int marks;
};
struct Student a = {80};
struct Student b = a;
b.marks += 10;
printf("%d %d", a.marks, b.marks);`,
    options: ['80 80', '90 90', '80 90', '90 80'],
    correctIndex: 2 },
  { id: 'q-m-35', difficulty: 'medium', category: 'C-Preprocessor',
    question: '',
    code: `#define DOUBLE(x) (2 * (x))
printf("%d", DOUBLE(3 + 2));`,
    options: ['7', '10', '8', '12'],
    correctIndex: 1 },
  { id: 'q-m-36', difficulty: 'medium', category: 'C-Preprocessor',
    question: '',
    code: `#define SQUARE(x) ((x) * (x))
int a = 3;
printf("%d", SQUARE(a + 1));`,
    options: ['7', '12', '16', '10'],
    correctIndex: 2 },
  { id: 'q-m-37', difficulty: 'medium', category: 'C-Preprocessor',
    question: 'What is the main concern?',
    code: `#define MAX(a,b) ((a) > (b) ? (a) : (b))
int x = 4, y = 7;
printf("%d", MAX(x++, y++));`,
    options: ['MAX is always a function', 'An argument can be evaluated more than once', 'x and y cannot be incremented', 'Macro cannot use ?:'],
    correctIndex: 1 },
  { id: 'q-m-38', difficulty: 'medium', category: 'Python-Lists',
    question: '',
    code: `a = [1, 2, 3]
b = a
b[1] = 99
print(a[1])`,
    options: ['2', '3', '99', 'Error'],
    correctIndex: 2 },
  { id: 'q-m-39', difficulty: 'medium', category: 'Python-Lists',
    question: '',
    code: `a = [1, 2, 3]
b = a[:]
b[0] = 50
print(a[0])`,
    options: ['1', '50', '0', 'Error'],
    correctIndex: 0 },
  { id: 'q-m-40', difficulty: 'medium', category: 'Python-Lists',
    question: '',
    code: `x = [0,1,2,3,4,5]
print(x[1:5:2])`,
    options: ['[1,2,3,4]', '[1,3]', '[0,2,4]', '[2,4]'],
    correctIndex: 1 },
  { id: 'q-m-41', difficulty: 'medium', category: 'Python-Lists',
    question: '',
    code: `x = [1,2,3,4]
print(x[::-1])`,
    options: ['[1,2,3,4]', '[4,3,2,1]', '[4,3,2]', 'Error'],
    correctIndex: 1 },
  { id: 'q-m-42', difficulty: 'medium', category: 'Python-Loops',
    question: 'What is printed?',
    code: `for i in range(3):
if i == 1:
break
else:
print("Done")`,
    options: ['Done', '0', 'Nothing', '0 Done'],
    correctIndex: 2 },
  { id: 'q-m-43', difficulty: 'medium', category: 'Python-Lists',
    question: '',
    code: `a = [[1,2], [3,4]]
b = a.copy()
b[0][0] = 99
print(a[0][0])`,
    options: ['1', '2', '99', 'Error'],
    correctIndex: 2 },
  { id: 'q-m-44', difficulty: 'medium', category: 'Python-Functions',
    question: '',
    code: `def fun(x):
if x > 5:
return x * 2
return x + 2
print(fun(5))`,
    options: ['5', '7', '10', '12'],
    correctIndex: 1 },
  { id: 'q-m-45', difficulty: 'medium', category: 'Python-Basics',
    question: '',
    code: `x = {1, 2, 2, 3}
print(len(x))`,
    options: ['2', '3', '4', 'Error'],
    correctIndex: 1 },
  { id: 'q-m-46', difficulty: 'medium', category: 'Python-Basics',
    question: '',
    code: `x = [0]
if x:
print("True")
else:
print("False")`,
    options: ['True', 'False', '0', 'Error'],
    correctIndex: 0 },
  { id: 'q-m-47', difficulty: 'medium', category: 'Python-Dictionaries',
    question: '',
    code: `d = {"a": 1, "b": 2}
d["c"] = d["a"] + d["b"]
print(d["c"])`,
    options: ['1', '2', '3', 'Error'],
    correctIndex: 2 },
  { id: 'q-m-48', difficulty: 'medium', category: 'Python-Loops',
    question: '',
    code: `count = 0
for i in range(2):
for j in range(3):
count += 1
print(count)`,
    options: ['3', '5', '6', '9'],
    correctIndex: 2 },
  { id: 'q-m-49', difficulty: 'medium', category: 'Java-Constructors',
    question: '',
    code: `class A {
    int x;
    A() {
        x = 10;
    }
}
A obj = new A();
System.out.println(obj.x);`,
    options: ['0', '10', 'null', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-50', difficulty: 'medium', category: 'Java-Basics',
    question: 'What is obj.x?',
    code: `class A {
    int x = 5;
    void set(int x) {
        this.x = x;
    }
}
A obj = new A();
obj.set(20);`,
    options: ['5', '20', '25', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-51', difficulty: 'medium', category: 'Java-Polymorphism',
    question: '',
    code: `class Test {
    void show(int x) {
        System.out.println("int");
    }
    void show(double x) {
        System.out.println("double");
    }
}
Test t = new Test();
t.show(5);`,
    options: ['int', 'double', 'int double', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-m-52', difficulty: 'medium', category: 'Java-Inheritance',
    question: 'What can obj directly access?',
    code: `class A {
    int x = 10;
}
class B extends A {
    int y = 20;
}
B obj = new B();`,
    options: ['Only y', 'Only x', 'x and y', 'Neither'],
    correctIndex: 2 },
  { id: 'q-m-53', difficulty: 'medium', category: 'Java-Polymorphism',
    question: '',
    code: `class A {
    void show() {
        System.out.println("A");
    }
}
class B extends A {
    void show() {
        System.out.println("B");
    }
}
A obj = new B();
obj.show();`,
    options: ['A', 'B', 'A B', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-54', difficulty: 'medium', category: 'Java-Static',
    question: '',
    code: `class Test {
    static int x = 5;
}
Test a = new Test();
Test b = new Test();
a.x = 20;
System.out.println(b.x);`,
    options: ['5', '20', '0', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-55', difficulty: 'medium', category: 'Java-Encapsulation',
    question: '',
    code: `class Student {
    private int marks = 80;
    public int getMarks() {
        return marks;
    }
}
Student s = new Student();
System.out.println(s.getMarks());`,
    options: ['0', '80', 'private', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-56', difficulty: 'medium', category: 'Java-Inheritance',
    question: '',
    code: `class A {
    int x = 10;
}
class B extends A {
    int x = 20;
    void show() {
        System.out.println(super.x);
    }
}
new B().show();`,
    options: ['10', '20', '30', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-m-57', difficulty: 'medium', category: 'Java-Polymorphism',
    question: 'Which determines the overridden method that runs?',
    code: `class Animal {
    void sound() {
        System.out.println("Animal");
    }
}
class Dog extends Animal {
    void sound() {
        System.out.println("Dog");
    }
}
Animal a = new Dog();
a.sound();`,
    options: ['Only declared type', 'Actual object type at runtime', 'Class name of Animal', 'Constructor return type'],
    correctIndex: 1 },
  { id: 'q-m-58', difficulty: 'medium', category: 'Java-Constructors',
    question: '',
    code: `class Box {
    Box() {
        System.out.println("A");
    }
    Box(int x) {
        System.out.println("B");
    }
}
new Box(5);`,
    options: ['A', 'B', 'A B', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-m-59', difficulty: 'medium', category: 'Java-Static',
    question: '',
    code: `class Test {
    static int count = 0;
    Test() {
        count++;
    }
}
Test a = new Test();
Test b = new Test();
System.out.println(a.count);`,
    options: ['0', '1', '2', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-m-60', difficulty: 'medium', category: 'Java-Inheritance',
    question: '',
    code: `class A {
    void show() {
        System.out.print("A");
    }
}
class B extends A {
    void show() {
        super.show();
        System.out.print("B");
    }
}
new B().show();`,
    options: ['A', 'B', 'AB', 'BA'],
    correctIndex: 2 },

  // ── MEDIUM_HARD (60 questions) ──
  { id: 'q-mh-01', difficulty: 'medium_hard', category: 'DSA-Arrays',
    question: '',
    code: `int a[] = {2, 4, 6, 8};
for(int i = 1;
i < 4;
i++)
a[i] += a[i-1];
printf("%d %d", a[2], a[3]);`,
    options: ['6 8', '12 20', '12 26', '10 18'],
    correctIndex: 2 },
  { id: 'q-mh-02', difficulty: 'medium_hard', category: 'DSA-Arrays',
    question: 'What is the resulting array?',
    code: `int a[] = {1,2,3,4,5};
int temp = a[0];
for(int i = 0;
i < 4;
i++)
a[i] = a[i+1];
a[4] = temp;`,
    options: ['2 3 4 5 1', '5 1 2 3 4', '1 3 4 5 2', '2 1 3 4 5'],
    correctIndex: 0 },
  { id: 'q-mh-03', difficulty: 'medium_hard', category: 'DSA-Arrays',
    question: 'What is count?',
    code: `int a[] = {1, 3, 4, 6, 8};
int i = 0, j = 4, count = 0;

while(i < j) {
    if(a[i] + a[j] > 9)
    j--;
    else {
        count++;
        i++;
    }
}`,
    options: ['1', '2', '3', '4'],
    correctIndex: 2 },
  { id: 'q-mh-04', difficulty: 'medium_hard', category: 'C-Basics',
    question: 'Which statement is correct?',
    code: `int a[4] = {10,20,30,40};
for(int i = 0;
i <= 4;
i++)
printf("%d ", a[i]);`,
    options: ['It prints all four values safely', 'It prints five values, with the fifth being 0', 'Accessing a[4] is outside the array and causes undefined behavior', 'Compilation always fails'],
    correctIndex: 2 },
  { id: 'q-mh-05', difficulty: 'medium_hard', category: 'DSA-Arrays',
    question: 'What is count?',
    code: `int a[] = {2,3,2,4,3,2};
int count = 0;
for(int i = 0;
i < 6;
i++)
if(a[i] == 2) count++;`,
    options: ['2', '3', '4', '5'],
    correctIndex: 1 },
  { id: 'q-mh-06', difficulty: 'medium_hard', category: 'DSA-Arrays',
    question: 'After the first complete pass of selection sort in ascending order, what is the array?',
    code: `int a[] = {5,2,8,1,4};`,
    options: ['1 2 8 5 4', '1 2 5 8 4', '2 5 8 1 4', '1 4 8 5 2'],
    correctIndex: 0 },
  { id: 'q-mh-07', difficulty: 'medium_hard', category: 'DSA-Stacks',
    question: 'Push: 10, 20, 30\nPop\nPush: 40\nPop\nPop\nWhich value remains on top?',
    options: ['10', '20', '30', '40'],
    correctIndex: 1 },
  { id: 'q-mh-08', difficulty: 'medium_hard', category: 'DSA-Stacks',
    question: 'Elements 1, 2, 3, 4 are pushed in that order. Which output sequence is NOT possible from a stack?',
    options: ['4 3 2 1', '2 1 4 3', '3 2 4 1', '3 1 4 2'],
    correctIndex: 3 },
  { id: 'q-mh-09', difficulty: 'medium_hard', category: 'DSA-Stacks',
    question: 'A stack uses top = -1 initially. After three pushes and one pop, what is top?',
    options: ['0', '1', '2', '3'],
    correctIndex: 1 },
  { id: 'q-mh-10', difficulty: 'medium_hard', category: 'DSA-Stacks',
    question: 'A stack is used to check balanced parentheses. When a closing \')\' is encountered, what should normally happen?',
    options: ['Push it', 'Pop and compare with the matching opening symbol', 'Clear the stack', 'Ignore it'],
    correctIndex: 1 },
  { id: 'q-mh-11', difficulty: 'medium_hard', category: 'DSA-Queues',
    question: 'What is the front-to-rear order?',
    code: `Queue: front -> 11, 22, 33, 44
dequeue()
dequeue()
enqueue(55)
enqueue(66)`,
    options: ['33 44 55 66', '11 22 55 66', '44 33 55 66', '33 44 66 55'],
    correctIndex: 0 },
  { id: 'q-mh-12', difficulty: 'medium_hard', category: 'DSA-Queues',
    question: 'A circular queue has size 5 and rear is at index 4. One more enqueue is possible because index 0 is free. Where should rear move?',
    options: ['4', '5', '0', '-1'],
    correctIndex: 2 },
  { id: 'q-mh-13', difficulty: 'medium_hard', category: 'DSA-Queues',
    question: 'A queue is empty. Which operation is invalid if there is no special error handling?',
    options: ['Enqueue', 'Dequeue', 'Peek after enqueue', 'Enqueue twice'],
    correctIndex: 1 },
  { id: 'q-mh-14', difficulty: 'medium_hard', category: 'DSA-Queues',
    question: 'In a simple array implementation where dequeue shifts every remaining element one position toward the front, what is the worst-case time complexity of dequeue?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2 },
  { id: 'q-mh-15', difficulty: 'medium_hard', category: 'DSA-Queues',
    question: 'A circular queue has size 4. If front = 2 and rear = 1, which interpretation can be correct?',
    options: ['It must be empty', 'It can represent a full queue', 'It must contain exactly one element', 'It is always invalid'],
    correctIndex: 1 },
  { id: 'q-mh-16', difficulty: 'medium_hard', category: 'DSA-Recursion',
    question: 'What is f(6)?',
    code: `int f(int n) {
    if(n <= 0) return 0;
    return n + f(n-2);
}`,
    options: ['6', '9', '12', '21'],
    correctIndex: 1 },
  { id: 'q-mh-17', difficulty: 'medium_hard', category: 'DSA-Recursion',
    question: 'What is printed by f(3)?',
    code: `void f(int n) {
    if(n == 0) return;
    f(n-1);
    printf("%d ", n);
}`,
    options: ['3 2 1', '1 2 3', '0 1 2', '3 1 2'],
    correctIndex: 1 },
  { id: 'q-mh-18', difficulty: 'medium_hard', category: 'DSA-Recursion',
    question: 'What does digits(5082) return?',
    code: `int digits(int n) {
    if(n < 10) return 1;
    return 1 + digits(n/10);
}`,
    options: ['3', '4', '5', '508'],
    correctIndex: 1 },
  { id: 'q-mh-19', difficulty: 'medium_hard', category: 'DSA-Recursion',
    question: 'What is f(4)?',
    code: `int f(int n) {
    if(n == 0) return 1;
    return n * f(n-1);
}`,
    options: ['10', '16', '24', '25'],
    correctIndex: 2 },
  { id: 'q-mh-20', difficulty: 'medium_hard', category: 'DSA-Recursion',
    question: 'What is f(5)?',
    code: `int f(int n) {
    if(n <= 1) return n;
    return f(n-1) + f(n-2);
}`,
    options: ['3', '5', '8', '13'],
    correctIndex: 2 },
  { id: 'q-mh-21', difficulty: 'medium_hard', category: 'C-Basics',
    question: 'Which statement is correct in C?',
    code: `int x = 3;
printf("%d %d", x++, ++x);`,
    options: ['Always prints 3 5', 'Always prints 4 4', 'The expression has undefined behavior', 'It cannot compile'],
    correctIndex: 2 },
  { id: 'q-mh-22', difficulty: 'medium_hard', category: 'C-Basics',
    question: 'What is printed?',
    code: `int x = 2;
switch(x) {
    case 1: printf("A");
    case 2: printf("B");
    case 3: printf("C");
}`,
    options: ['B', 'BC', 'ABC', 'C'],
    correctIndex: 1 },
  { id: 'q-mh-23', difficulty: 'medium_hard', category: 'C-Basics',
    question: 'What is printed?',
    code: `void f() {
    static int x = 0;
    x++;
    printf("%d ", x);
}
f();
f();
f();`,
    options: ['1 1 1', '0 1 2', '1 2 3', '1 2 2'],
    correctIndex: 2 },
  { id: 'q-mh-24', difficulty: 'medium_hard', category: 'C-Basics',
    question: 'What does the expression represent?',
    code: `int a[5];
printf("%zu", sizeof(a) / sizeof(a[0]));`,
    options: ['Number of bytes in a', 'Number of elements in a', 'Size of one pointer', 'Always 5 bytes'],
    correctIndex: 1 },
  { id: 'q-mh-25', difficulty: 'medium_hard', category: 'C-Basics',
    question: '',
    code: `int x = 8, y = 3;
int z = x > y ? x - y : y - x;
printf("%d", z);`,
    options: ['3', '5', '8', '11'],
    correctIndex: 1 },
  { id: 'q-mh-26', difficulty: 'medium_hard', category: 'C-Pointers',
    question: 'What is a[1]?',
    code: `int a[] = {5,10,15};
int *p = a + 1;
*p = *p + *(p-1);`,
    options: ['5', '10', '15', '20'],
    correctIndex: 2 },
  { id: 'q-mh-27', difficulty: 'medium_hard', category: 'C-Pointers',
    question: '',
    code: `int a[] = {4,7,9,12};
int *p = a;
printf("%d ", *(p+2));
p += 1;
printf("%d", *p);`,
    options: ['4 7', '9 7', '9 9', '7 9'],
    correctIndex: 1 },
  { id: 'q-mh-28', difficulty: 'medium_hard', category: 'C-Pointers',
    question: 'What are x and y?',
    code: `void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}
int x=4, y=9;
swap(&x,&y);`,
    options: ['4 9', '9 4', '13 13', 'Addresses'],
    correctIndex: 1 },
  { id: 'q-mh-29', difficulty: 'medium_hard', category: 'C-Pointers',
    question: 'How many array elements apart are p and q?',
    code: `int a[] = {10,20,30,40};
int *p = &a[1];
int *q = &a[3];`,
    options: ['1', '2', '3', '8'],
    correctIndex: 1 },
  { id: 'q-mh-30', difficulty: 'medium_hard', category: 'C-Pointers',
    question: '',
    code: `int a[] = {10,20,30};
int *p = a;

printf("%d ", *p++);
printf("%d", *p);`,
    options: ['10 10', '10 20', '20 30', '11 20'],
    correctIndex: 1 },
  { id: 'q-mh-31', difficulty: 'medium_hard', category: 'C-Structures',
    question: 'What is s.marks?',
    code: `struct Student {
    int marks;
};
struct Student s = {70};
struct Student *p = &s;
p->marks += 15;`,
    options: ['70', '75', '85', '105'],
    correctIndex: 2 },
  { id: 'q-mh-32', difficulty: 'medium_hard', category: 'C-Structures',
    question: 'What is max?',
    code: `struct Item {
    int price;
};
struct Item a[3] = {{20}, {50}, {30}};

int max = a[0].price;
for(int i=1;
i<3;
i++)
if(a[i].price > max) max = a[i].price;`,
    options: ['20', '30', '50', '100'],
    correctIndex: 2 },
  { id: 'q-mh-33', difficulty: 'medium_hard', category: 'C-Structures',
    question: '',
    code: `struct Date {
    int day;
    int month;
};
struct Student {
    struct Date dob;
};

struct Student s = {{12, 8}};

printf("%d", s.dob.month);`,
    options: ['8', '12', '20', 'Error'],
    correctIndex: 0 },
  { id: 'q-mh-34', difficulty: 'medium_hard', category: 'C-Structures',
    question: 'Which expression correctly accesses y through q?',
    code: `struct Point {
    int x;
    int y;
};
struct Point p = {3,4};
struct Point *q = &p;`,
    options: ['q.y', '*q.y', 'q->y', '&q.y'],
    correctIndex: 2 },
  { id: 'q-mh-35', difficulty: 'medium_hard', category: 'C-Structures',
    question: '',
    code: `struct S {
    int x;
};
struct S a[2] = {{5},{10}};
struct S *p = a;
(p+1)->x += 5;

printf("%d", a[1].x);`,
    options: ['5', '10', '15', '20'],
    correctIndex: 2 },
  { id: 'q-mh-36', difficulty: 'medium_hard', category: 'C-Preprocessor',
    question: '',
    code: `#define SQUARE(x) x*x
int a = 2 + 3;
printf("%d", SQUARE(a));`,
    options: ['25', '10', '7', '11'],
    correctIndex: 1 },
  { id: 'q-mh-37', difficulty: 'medium_hard', category: 'C-Preprocessor',
    question: '',
    code: `#define ADD(a,b) a+b
printf("%d", 2 * ADD(3,4));`,
    options: ['14', '10', '9', '24'],
    correctIndex: 0 },
  { id: 'q-mh-38', difficulty: 'medium_hard', category: 'C-Preprocessor',
    question: 'What is printed?',
    code: `#define DEBUG
#ifdef DEBUG
printf("D");
#else
printf("N");
#endif`,
    options: ['D', 'N', 'DEBUG', 'Nothing'],
    correctIndex: 0 },
  { id: 'q-mh-39', difficulty: 'medium_hard', category: 'C-Preprocessor',
    question: 'What is b?',
    code: `#define INC(x) ((x)+1)
int a = 5;
int b = INC(a * 2);`,
    options: ['10', '11', '12', '6'],
    correctIndex: 1 },
  { id: 'q-mh-40', difficulty: 'medium_hard', category: 'C-Preprocessor',
    question: 'Which is the best answer?',
    code: `#define CUBE(x) ((x)*(x)*(x))
int x = 2;
printf("%d", CUBE(x++));`,
    options: ['8', '9', 'The expression has undefined behavior', 'Compilation always fails'],
    correctIndex: 2 },
  { id: 'q-mh-41', difficulty: 'medium_hard', category: 'Python-Functions',
    question: 'What is printed?',
    code: `def add(x, a=[]):
a.append(x)
return a

print(add(1))
print(add(2))`,
    options: ['[1] then [2]', '[1] then [1, 2]', '[1, 2] then [1, 2]', 'Error'],
    correctIndex: 1 },
  { id: 'q-mh-42', difficulty: 'medium_hard', category: 'Python-Lists',
    question: 'What is y?',
    code: `x = [1,2,3,4,5]
y = [n*n for n in x if n % 2 == 0]`,
    options: ['[1,4,9,16,25]', '[2,4]', '[4,16]', '[1,9,25]'],
    correctIndex: 2 },
  { id: 'q-mh-43', difficulty: 'medium_hard', category: 'Python-Dictionaries',
    question: '',
    code: `d = {"a": 10, "b": 20}
d["a"] += 5
d["c"] = d["a"] + d["b"]

print(d["c"])`,
    options: ['30', '35', '40', '45'],
    correctIndex: 2 },
  { id: 'q-mh-44', difficulty: 'medium_hard', category: 'Python-Loops',
    question: '',
    code: `x = 0
for i in range(1,5):
if i == 3:
continue
x += i

print(x)`,
    options: ['7', '8', '9', '10'],
    correctIndex: 1 },
  { id: 'q-mh-45', difficulty: 'medium_hard', category: 'Python-Lists',
    question: '',
    code: `a = [1,2,3,4]
a[1:3] = [8,9,10]

print(a)`,
    options: ['[1,8,9,4]', '[1,8,9,10,4]', '[8,9,10,4]', 'Error'],
    correctIndex: 1 },
  { id: 'q-mh-46', difficulty: 'medium_hard', category: 'Python-Basics',
    question: 'Which statement is true?',
    code: `a = [1,2]
b = [1,2]`,
    options: ['a is b and a == b', 'a is not b but a == b', 'a is b but a != b', 'Both are false'],
    correctIndex: 1 },
  { id: 'q-mh-47', difficulty: 'medium_hard', category: 'Python-Basics',
    question: 'What happens?',
    code: `s = "cat"
s[0] = "b"`,
    options: ['s becomes "bat"', 's becomes "cbt"', 'A TypeError occurs', 'Nothing happens'],
    correctIndex: 2 },
  { id: 'q-mh-48', difficulty: 'medium_hard', category: 'Python-Lists',
    question: 'What is a?',
    code: `a = [[1], [2]]
b = a[:]
b.append([3])
b[0].append(9)`,
    options: ['[[1], [2]]', '[[1,9], [2]]', '[[1], [2], [3]]', '[[1,9], [2], [3]]'],
    correctIndex: 1 },
  { id: 'q-mh-49', difficulty: 'medium_hard', category: 'Java-Inheritance',
    question: 'What is printed?',
    code: `class A {
    A() {
        System.out.print("A");
    }
}
class B extends A {
    B() {
        System.out.print("B");
    }
}
new B();`,
    options: ['A', 'B', 'AB', 'BA'],
    correctIndex: 2 },
  { id: 'q-mh-50', difficulty: 'medium_hard', category: 'Java-Polymorphism',
    question: '',
    code: `class Test {
    void show(int x) {
        System.out.print("I");
    }
    void show(double x) {
        System.out.print("D");
    }
}
new Test().show(3.0);`,
    options: ['I', 'D', 'ID', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-mh-51', difficulty: 'medium_hard', category: 'Java-Inheritance',
    question: '',
    code: `class A {
    int x = 10;
}
class B extends A {
    int x = 20;
}

A obj = new B();
System.out.println(obj.x);`,
    options: ['10', '20', '30', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-mh-52', difficulty: 'medium_hard', category: 'Java-Polymorphism',
    question: '',
    code: `class A {
    void show() {
        System.out.print("A");
    }
}
class B extends A {
    void show() {
        System.out.print("B");
    }
}

B b = new B();
A a = b;
a.show();`,
    options: ['A', 'B', 'AB', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-mh-53', difficulty: 'medium_hard', category: 'Java-Basics',
    question: 'What happens?',
    code: `final int x = 10;
x = 20;`,
    options: ['x becomes 20', 'x becomes 30', 'Compilation error', 'Runtime error only'],
    correctIndex: 2 },
  { id: 'q-mh-54', difficulty: 'medium_hard', category: 'Java-Encapsulation',
    question: 'Can B directly access A\'s private x?',
    code: `class A {
    private int x = 10;
}

class B extends A {
    void show() {
        // direct access to x here
    }
}`,
    options: ['Yes', 'No', 'Only with super.x', 'Only if x is static'],
    correctIndex: 1 },
  { id: 'q-mh-55', difficulty: 'medium_hard', category: 'Java-Static',
    question: '',
    code: `class Test {
    static int x = 10;
    static void change() {
        x += 5;
    }
}
Test.change();
System.out.println(Test.x);`,
    options: ['10', '15', '20', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-mh-56', difficulty: 'medium_hard', category: 'Java-Inheritance',
    question: 'Which statement is correct?',
    code: `class A {
}
class B extends A {
}

A obj = new B();
B ref = (B)obj;`,
    options: ['The cast is valid', 'The cast always creates a new B object', 'The cast changes obj\'s actual object', 'Casting is forbidden'],
    correctIndex: 0 },
  { id: 'q-mh-57', difficulty: 'medium_hard', category: 'Java-Constructors',
    question: 'What happens?',
    code: `class Test {
    int x;
    Test(int n) {
        x = n;
    }
}

Test t = new Test();`,
    options: ['x becomes 0', 'x becomes null', 'Compilation error because no no-argument constructor exists', 'Runtime error'],
    correctIndex: 2 },
  { id: 'q-mh-58', difficulty: 'medium_hard', category: 'Java-Inheritance',
    question: 'What is printed?',
    code: `class A {
    void show() {
        System.out.print("A");
    }
}
class B extends A {
    // no show() method
}
new B().show();`,
    options: ['A', 'B', 'Nothing', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-mh-59', difficulty: 'medium_hard', category: 'Java-Static',
    question: '',
    code: `class Counter {
    static int c = 0;
    Counter() {
        c++;
    }
}
Counter a = new Counter();
Counter b = new Counter();
Counter c = new Counter();

System.out.println(Counter.c);`,
    options: ['0', '1', '2', '3'],
    correctIndex: 3 },
  { id: 'q-mh-60', difficulty: 'medium_hard', category: 'Java-Polymorphism',
    question: '',
    code: `class A {
    void show() {
        System.out.print("A");
    }
}
class B extends A {
    void show() {
        System.out.print("B");
    }
}
class C extends B {
    void show() {
        super.show();
        System.out.print("C");
    }
}

A obj = new C();
obj.show();`,
    options: ['A', 'B', 'BC', 'ABC'],
    correctIndex: 2 },

  // ── HARD (60 questions) ──
  { id: 'q-h-01', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'Which is b?',
    code: `int a[] = {5, 2, 7, 4, 9, 6};
int b[6], k = 0;

for(int i=0;
i<6;
i++)
if(a[i] % 2 == 0) b[k++] = a[i];

for(int i=0;
i<6;
i++)
if(a[i] % 2 != 0) b[k++] = a[i];`,
    options: ['2 4 6 5 7 9', '6 4 2 9 7 5', '2 4 6 7 5 9', '5 7 9 2 4 6'],
    correctIndex: 0 },
  { id: 'q-h-02', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'For the array:\nWhat is the maximum possible sum of a contiguous subarray?',
    code: `{
    -2, 3, -1, 5, -6, 4
}`,
    options: ['6', '7', '8', '9'],
    correctIndex: 1 },
  { id: 'q-h-03', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'An integer array contains n elements, each in the range 1 to n-1, and exactly one value occurs at least twice.\nWhich approach can detect a duplicate without sorting the array and without using extra O(n) storage?',
    options: ['Nested loops only', 'Use Floyd\'s cycle-detection idea on the value-to-index mapping', 'Binary search directly on the unsorted array', 'Merge sort'],
    correctIndex: 1 },
  { id: 'q-h-04', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'An array [1,2,3,4,5,6,7] is rotated right by 3 positions using the standard three-reversal method.\nWhat is the final array?',
    options: ['4 5 6 7 1 2 3', '5 6 7 1 2 3 4', '7 6 5 4 3 2 1', '3 2 1 7 6 5 4'],
    correctIndex: 0 },
  { id: 'q-h-05', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'For [3, 1, 2], how many inversions are present (Two array elements arr[i] and arr[j] form an inversion if arr[i] > arr[j] and i < j.)?',
    options: ['1', '2', '3', '0'],
    correctIndex: 1 },
  { id: 'q-h-06', difficulty: 'hard', category: 'DSA-Arrays',
    question: 'A sorted array is [2,4,6,8,10,12]. A binary search is used to find 10.\nIf the search first checks the middle element at index 2, which index is checked next?',
    options: ['0', '1', '4', '5'],
    correctIndex: 2 },
  { id: 'q-h-07', difficulty: 'hard', category: 'DSA-Stacks',
    question: 'A queue can be implemented using two stacks. To make dequeue behave like a normal queue, when the output stack is empty, what should be done?',
    options: ['Push the newest item directly into output', 'Move all items from input stack to output stack', 'Pop both stacks simultaneously', 'Reverse only the first element'],
    correctIndex: 1 },
  { id: 'q-h-08', difficulty: 'hard', category: 'DSA-Stacks',
    question: 'A stack-based algorithm scans stock prices and wants, for each day, the next greater price to its right.\nWhich stack property is most useful?',
    options: ['Keep indices whose corresponding values are waiting for a greater value', 'Keep only the smallest value', 'Sort all prices first', 'Store values permanently after they are popped'],
    correctIndex: 0 },
  { id: 'q-h-09', difficulty: 'hard', category: 'DSA-Stacks',
    question: 'A fixed-size stack has capacity 5 and currently contains 5 elements.\nWhich operation is invalid unless an element is removed first?',
    options: ['peek', 'pop', 'push', 'checking empty'],
    correctIndex: 2 },
  { id: 'q-h-10', difficulty: 'hard', category: 'DSA-Stacks',
    question: 'A stack contains, from bottom to top:\n4, 7, 4, 9\nAfter two pop operations, what is the top?',
    options: ['4', '7', '9', 'Empty'],
    correctIndex: 1 },
  { id: 'q-h-11', difficulty: 'hard', category: 'DSA-Queues',
    question: 'A linear queue uses front and rear indices and never shifts elements. After several dequeues, front has moved forward while rear reaches the final array index.\nEven if there are empty cells at the beginning, what problem occurs?',
    options: ['Stack overflow', 'False overflow / inability to enqueue at the rear', 'Recursion overflow', 'Underflow on every enqueue'],
    correctIndex: 1 },
  { id: 'q-h-12', difficulty: 'hard', category: 'DSA-Queues',
    question: 'In a circular queue implementation that reserves one slot to distinguish full from empty, which condition commonly indicates full?',
    options: ['(rear + 1) % size == front', 'rear == size', 'front == -1 only', 'rear == front always'],
    correctIndex: 0 },
  { id: 'q-h-13', difficulty: 'hard', category: 'DSA-Queues',
    question: 'Which statement best describes a deque?',
    options: ['Insertion only at rear and deletion only at front', 'Insertion and deletion can occur at both ends', 'Only deletion at both ends', 'It is always implemented with two stacks'],
    correctIndex: 1 },
  { id: 'q-h-14', difficulty: 'hard', category: 'DSA-Queues',
    question: 'Processes enter a queue in this order:\nP1, P2, P3\nP1 completes after one time slice and is reinserted at the rear before P2 gets its slice.\nWhat is the queue order immediately after P1 is reinserted?',
    options: ['P1 P2 P3', 'P2 P3 P1', 'P3 P2 P1', 'P2 P1 P3'],
    correctIndex: 1 },
  { id: 'q-h-15', difficulty: 'hard', category: 'DSA-Recursion',
    question: 'What is f(7)?',
    code: `int f(int n) {
    if(n <= 0) return 0;
    if(n % 2 == 0) return n + f(n-2);
    return n + f(n-1);
}`,
    options: ['12', '16', '18', '28'],
    correctIndex: 2 },
  { id: 'q-h-16', difficulty: 'hard', category: 'DSA-Recursion',
    question: '',
    code: `int max(int a[], int n) {
    if(n == 1) return a[0];
    int m = max(a, n-1);
    return a[n-1] > m ? a[n-1] : m;
}

For {
    4, 9, 2, 11, 7
}, what is returned?`,
    options: ['7', '9', '11', '33'],
    correctIndex: 2 },
  { id: 'q-h-17', difficulty: 'hard', category: 'DSA-Recursion',
    question: 'What is power(2,5)?',
    code: `int power(int x, int n) {
    if(n == 0) return 1;
    return x * power(x, n-1);
}`,
    options: ['10', '16', '25', '32'],
    correctIndex: 3 },
  { id: 'q-h-18', difficulty: 'hard', category: 'DSA-Recursion',
    question: 'What does gcd(84, 30) return?',
    code: `int gcd(int a, int b) {
    if(b == 0) return a;
    return gcd(b, a % b);
}`,
    options: ['2', '6', '12', '14'],
    correctIndex: 1 },
  { id: 'q-h-19', difficulty: 'hard', category: 'DSA-Recursion',
    question: 'What happens when f(3) is called?',
    code: `void f(int n) {
    if(n == 0) return;
    f(n);
}`,
    options: ['It prints 3', 'It returns normally', 'It eventually causes stack overflow', 'It automatically treats n as n-1'],
    correctIndex: 2 },
  { id: 'q-h-20', difficulty: 'hard', category: 'DSA-Recursion',
    question: 'A recursive binary search checks the middle element. If the target is smaller than the middle element, which subproblem is correct?',
    options: ['Search the entire array again', 'Search only the left half', 'Search only the right half', 'Search the middle element repeatedly'],
    correctIndex: 1 },
  { id: 'q-h-21', difficulty: 'hard', category: 'C-Basics',
    question: 'What is printed?',
    code: `int a = 5;
double b = 2;
printf("%.1f", a / b);`,
    options: ['2.0', '2.5', '2', '3.0'],
    correctIndex: 1 },
  { id: 'q-h-22', difficulty: 'hard', category: 'C-Basics',
    question: 'What is x after the condition?',
    code: `int x = 0;
if(x && ++x)
printf("A");`,
    options: ['0', '1', 'Undefined', 'It depends on compiler'],
    correctIndex: 0 },
  { id: 'q-h-23', difficulty: 'hard', category: 'C-Basics',
    question: 'What is printed?',
    code: `int x = 5;
if(x || ++x)
printf("%d", x);`,
    options: ['5', '6', '1', 'Undefined'],
    correctIndex: 0 },
  { id: 'q-h-24', difficulty: 'hard', category: 'C-Basics',
    question: 'What is r?',
    code: `int x = 2, y = 3, z = 4;
int r = x + y * z > 10;`,
    options: ['0', '1', '14', '20'],
    correctIndex: 1 },
  { id: 'q-h-25', difficulty: 'hard', category: 'C-Pointers',
    question: '',
    code: `int a[] = {11,22,33,44,55};
int *p = &a[4];

p -= 3;

printf("%d", *p);`,
    options: ['11', '22', '33', '44'],
    correctIndex: 1 },
  { id: 'q-h-26', difficulty: 'hard', category: 'C-Pointers',
    question: 'What is y?',
    code: `int x = 10, y = 20;
int *p = &x;
int **q = &p;

p = &y;
**q += 5;`,
    options: ['20', '25', '30', '15'],
    correctIndex: 1 },
  { id: 'q-h-27', difficulty: 'hard', category: 'C-Pointers',
    question: 'Which expression gives the value 7?',
    code: `int x = 7;
int *p = &x;
int **q = &p;`,
    options: ['q', '*q', '**q', '&q'],
    correctIndex: 2 },
  { id: 'q-h-28', difficulty: 'hard', category: 'C-Pointers',
    question: 'Inside f, what does sizeof(a) measure?',
    code: `void f(int a[]) {
    printf("%zu", sizeof(a));
}

int x[10];
f(x);`,
    options: ['Size of the original 10-element array', 'Size of a pointer', 'Always 10 bytes', 'Size of one int'],
    correctIndex: 1 },
  { id: 'q-h-29', difficulty: 'hard', category: 'C-Pointers',
    question: 'Which statement is valid?',
    code: `int x = 4, y = 9;
int *const p = &x;`,
    options: ['p = &y;', '*p = 10;', 'p cannot be dereferenced', 'Both A and B'],
    correctIndex: 1 },
  { id: 'q-h-30', difficulty: 'hard', category: 'C-Pointers',
    question: 'Which is valid?',
    code: `int x = 4, y = 9;
const int *p = &x;`,
    options: ['*p = 7;', 'p = &y;', 'p = NULL is forbidden', 'Both A and B'],
    correctIndex: 1 },
  { id: 'q-h-31', difficulty: 'hard', category: 'C-Structures',
    question: 'Why can sizeof(struct A) be greater than sizeof(char) + sizeof(int)?',
    code: `struct A {
    char c;
    int x;
};`,
    options: ['Structures always duplicate every field', 'Padding may be inserted for alignment', 'int is stored twice', 'char is converted to double'],
    correctIndex: 1 },
  { id: 'q-h-32', difficulty: 'hard', category: 'C-Structures',
    question: '',
    code: `struct S {
    int x;
    int y;
};
struct S a[2] = {{1,2},{3,4}};
struct S *p = a;

printf("%d", (p+1)->y);`,
    options: ['1', '2', '3', '4'],
    correctIndex: 3 },
  { id: 'q-h-33', difficulty: 'hard', category: 'C-Structures',
    question: 'What is a.x?',
    code: `struct S {
    int x;
};
struct S a = {5};
struct S b = a;
b.x = 9;`,
    options: ['5', '9', '14', 'Undefined'],
    correctIndex: 0 },
  { id: 'q-h-34', difficulty: 'hard', category: 'C-Structures',
    question: 'What is idx?',
    code: `struct Student {
    int marks;
};

struct Student s[4] = {{72},{91},{68},{85}};
int idx = 0;

for(int i=1;
i<4;
i++)
if(s[i].marks > s[idx].marks)
idx = i;`,
    options: ['0', '1', '2', '3'],
    correctIndex: 1 },
  { id: 'q-h-35', difficulty: 'hard', category: 'C-Structures',
    question: 'What is q.x?',
    code: `struct P {
    int x;
};

struct P make() {
    struct P p = {12};
    return p;
}

struct P q = make();`,
    options: ['0', '1', '12', 'Undefined'],
    correctIndex: 2 },
  { id: 'q-h-36', difficulty: 'hard', category: 'C-Preprocessor',
    question: 'What is printed?',
    code: `#define STR(x) #x
printf("%s", STR(hello));`,
    options: ['hello', '"hello"', 'x', 'STR'],
    correctIndex: 0 },
  { id: 'q-h-37', difficulty: 'hard', category: 'C-Preprocessor',
    question: 'What is printed?',
    code: `#define JOIN(a,b) a##b
int xy = 25;
printf("%d", JOIN(x,y));`,
    options: ['25', 'xy', 'x y', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-h-38', difficulty: 'hard', category: 'C-Preprocessor',
    question: 'What is the main purpose of this pattern?',
    code: `#ifndef MY_H
#define MY_H
/* declarations */
#endif`,
    options: ['Speed up loops', 'Prevent repeated inclusion of the same header contents', 'Allocate heap memory', 'Define a recursive function'],
    correctIndex: 1 },
  { id: 'q-h-39', difficulty: 'hard', category: 'C-Preprocessor',
    question: 'What is x?',
    code: `#define FLAG 0

#if FLAG
int x = 1;
#else
int x = 2;
#endif`,
    options: ['0', '1', '2', 'Compilation error'],
    correctIndex: 2 },
  { id: 'q-h-40', difficulty: 'hard', category: 'C-Preprocessor',
    question: 'What is y?',
    code: `#define NEG(x) -(x)

int x = 3;
int y = 2 * NEG(x);`,
    options: ['-6', '-3', '6', '0'],
    correctIndex: 0 },
  { id: 'q-h-41', difficulty: 'hard', category: 'Python-Lists',
    question: '',
    code: `a = [[0], [1]]
b = a.copy()
b[0] += [2]

print(a)`,
    options: ['[[0],[1]]', '[[0,2],[1]]', '[[2],[1]]', 'Error'],
    correctIndex: 1 },
  { id: 'q-h-42', difficulty: 'hard', category: 'Python-Lists',
    question: '',
    code: `a = [1,2,3]
b = a
b = b + [4]

print(a)`,
    options: ['[1,2,3]', '[1,2,3,4]', '[4]', 'Error'],
    correctIndex: 0 },
  { id: 'q-h-43', difficulty: 'hard', category: 'Python-Lists',
    question: '',
    code: `a = [1,2]
b = a
b += [3]

print(a)`,
    options: ['[1,2]', '[1,2,3]', '[3]', 'Error'],
    correctIndex: 1 },
  { id: 'q-h-44', difficulty: 'hard', category: 'Python-Functions',
    question: 'What is printed?',
    code: `g = (x*x for x in range(3))

print(next(g))
print(next(g))`,
    options: ['0 then 0', '0 then 1', '1 then 4', '1 then 1'],
    correctIndex: 1 },
  { id: 'q-h-45', difficulty: 'hard', category: 'Python-Basics',
    question: '',
    code: `x = {1,2,2,3,3,3}
print(len(x))`,
    options: ['3', '4', '5', '6'],
    correctIndex: 0 },
  { id: 'q-h-46', difficulty: 'hard', category: 'Python-Dictionaries',
    question: 'What is len(d)?',
    code: `d = {1: "a", True: "b"}`,
    options: ['0', '1', '2', 'Error'],
    correctIndex: 1 },
  { id: 'q-h-47', difficulty: 'hard', category: 'Python-Scope',
    question: '',
    code: `x = 10

def f():
x = 20
return x

print(f(), x)`,
    options: ['10 20', '20 20', '20 10', '10 10'],
    correctIndex: 2 },
  { id: 'q-h-48', difficulty: 'hard', category: 'Python-Loops',
    question: 'What is printed?',
    code: `for i in range(3):
if i == 5:
break
else:
print("DONE")`,
    options: ['Nothing', 'DONE', '5', 'Error'],
    correctIndex: 1 },
  { id: 'q-h-49', difficulty: 'hard', category: 'Java-Initialization',
    question: 'What is printed?',
    code: `class A {
    static {
        System.out.print("S");
    }
    {
        System.out.print("I");
    }
    A() {
        System.out.print("C");
    }
}

new A();
new A();`,
    options: ['SIC SIC', 'SICSIC', 'SICIC', 'SS IICC'],
    correctIndex: 2 },
  { id: 'q-h-50', difficulty: 'hard', category: 'Java-Polymorphism',
    question: 'Which overload is selected?',
    code: `void f(long x) {
    System.out.print("L");
}
void f(double x) {
    System.out.print("D");
}

f(5);`,
    options: ['L', 'D', 'Both', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-h-51', difficulty: 'hard', category: 'Java-Polymorphism',
    question: 'Which method is selected?',
    code: `void f(String s) {
    System.out.print("S");
}
void f(Object o) {
    System.out.print("O");
}

f(null);`,
    options: ['S', 'O', 'Both', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-h-52', difficulty: 'hard', category: 'Java-Basics',
    question: 'Which statement is correct?',
    code: `final int[] a = {1,2};
a[0] = 9;`,
    options: ['Compilation error because a is final', 'Array contents can change even though the reference cannot be reassigned', 'Both reference and contents become immutable', 'Runtime error'],
    correctIndex: 1 },
  { id: 'q-h-53', difficulty: 'hard', category: 'Java-Basics',
    question: 'Which is true?',
    code: `String a = new String("CAT");
String b = new String("CAT");`,
    options: ['a == b is true', 'a.equals(b) is true', 'Both are false', 'Both are true'],
    correctIndex: 1 },
  { id: 'q-h-54', difficulty: 'hard', category: 'Java-Basics',
    question: 'What is printed?',
    code: `String s = null;

System.out.println(s instanceof String);`,
    options: ['true', 'false', 'null', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-h-55', difficulty: 'hard', category: 'Java-Constructors',
    question: 'What is printed?',
    code: `class A {
    A() {
        this(5);
    }
    A(int x) {
        System.out.print(x);
    }
}

new A();`,
    options: ['0', '5', 'A5', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-h-56', difficulty: 'hard', category: 'Java-OOP',
    question: 'Can A be instantiated directly with new A()?',
    code: `abstract class A {
    abstract void show();
}`,
    options: ['Yes', 'No', 'Only if show() is static', 'Only inside A'],
    correctIndex: 1 },
  { id: 'q-h-57', difficulty: 'hard', category: 'Java-OOP',
    question: 'What is printed?',
    code: `interface I {
    void show();
}
class A implements I {
    public void show() {
        System.out.print("A");
    }
}

I x = new A();
x.show();`,
    options: ['I', 'A', 'Nothing', 'Compilation error'],
    correctIndex: 1 },
  { id: 'q-h-58', difficulty: 'hard', category: 'Java-Inheritance',
    question: 'Which statement is correct?',
    code: `class A {
    protected void show() {
    }
}
class B extends A {
    public void show() {
    }
}`,
    options: ['Invalid because visibility cannot change', 'Valid because overriding can widen access', 'Invalid because public is narrower', 'Valid only if show is static'],
    correctIndex: 1 },
  { id: 'q-h-59', difficulty: 'hard', category: 'Java-Basics',
    question: 'What is printed?',
    code: `try {
    int[] a = new int[2];
    System.out.println(a[3]);
}catch (ArrayIndexOutOfBoundsException e) {
    System.out.print("X");
}`,
    options: ['X', '3', '0', 'Compilation error'],
    correctIndex: 0 },
  { id: 'q-h-60', difficulty: 'hard', category: 'Java-Polymorphism',
    question: 'Is B.get() a valid override?',
    code: `class A {
    Object get() {
        return new Object();
    }
}
class B extends A {
    String get() {
        return "OK";
    }
}`,
    options: ['No, return types must always be identical', 'Yes, String is a subtype of Object', 'Only if get() is static', 'Only if Object is final'],
    correctIndex: 1 },

]
