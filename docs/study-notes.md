class Rating: 
    def __init__(self, value, user):
        self.value=value
        self.user=user
    def is_positive(self):
        self.value >=4


r = Rating(1, "Anna")
print(r.isPositive())

self is the object the method is working on. r.is_positive() is the same as Rating.is_positive(r), and Python passes r in as self for you

__init__ is a “dunder” (double underscore) method that Python calls itself. Another one you have in your code is __str__, which decides what print(object) shows.

2. Inheritance and super()
A class can inherit from another class. The child gets everything the parent has and can override (replace) methods.

class Animal: 
    def speak(self): 
        return "..."

class Dog(Animal): 
    def speak(self): 
        return "woof"

# Dog is a child of Animal

super() means “the parent’s version”. You use it when you want to add to the parent’s behaviour instead of replacing it:

class LoudDog(Dog):
    def speak(self):
        return super().speak().upper() + "!"   # ask Dog first, then change the result


# self in Python
self parameter refers to the current object of a class. It helps Python identify the object on which a method is called, allowing each object to access and maintain its own data independently.

self is not a keyword, but a naming convention
When you call a method using an object, Python automatically passes that object as the first argument to the method.
When defining methods inside a class, the first parameter is always self.

Naming convention - A naming convention is an agreed-upon set of rules or guidelines for how to name things—such as files, variables, database tables, or marketing campaigns—so that information can be easily deduced and organized

class Car {
    def __init__(self, model, brand):
        self.model = model
        self.brand = brand
    
    def display(self):
        print(f"{self.brand} {self.modal}")
}

v = Car("7th stroke", "Lambrogini")
v.display()

# The inner class Meta
class Story(models.Model):
    ...
    class Meta:
        ordering = ["-created_at"]

A class can be written inside another class. There’s no special Python magic: Meta is simply a place to put settings. Django looks for a class called exactly Meta and reads its attributes (ordering, model, fields, constraints). If you rename it, Django ignores it.

# *args and **kwargs
Sometimes you don't know how many arguments are passed to your function 
So the star of double star kwargs, they can allow our function to accept any number of arguments
It is totally flexible, we can send one value or any other unknown amount of values
 * positional argument (one star)
 ** keyword arguments (two stars)

example: 
def total(*args): 
    print(sum(args))

total(1, 2, 3)
total(1, 2, 3, 5)

args acts like a tuple and even is a type of tuple collecting all of the parameters
but it we can use args if we have same type of values.

When we have different type of values, example: "Alice", 1
then we need to use 2 star args.Kwargs is a type of dictionary
Example: 

#create user profile

def create_user(**kwargs):
    print(kwargs)
create_user(first_name="Aiga", last_name="Kira", age=25, country="KG")

# Decorators
A decorator is a function that takes another function and wraps it. The @name line above a function applies it:
def shout(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    return "hello " + name      # greet("anna") now returns "HELLO ANNA"

# The __str__() Method
The __str__() method is a magic method that controls what is returned when the object is printed, or passed to str().

Without __str__(), printing an object shows its memory address:
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("Emil", 36)
print(p1)

#Return a readable text representation of the object:

class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

  def __str__(self):
    return f"{self.name} ({self.age})"

p1 = Person("Tobias", 25)
print(p1) // Tobias (25)

# THE WEB

The web is a conversation between two programs:

The client (your browser, React, or curl) sends a request.
The server (Django) sends back a response.
Then the conversation is over. The server doesn’t remember you. It keeps no memory between requests, which is called being stateless. That’s why the frontend must send the token with every single request.

React (localhost:5173)  --request-->  Django (localhost:8000)
                        <--response--

Headers:

Headers are labels attached to a request or response. Four matter in your project:

Content-Type: application/json tells the receiver the body is JSON.
Authorization: Bearer <token> is how you prove who you are. “Bearer” means “whoever holds this token”.
Origin: http://localhost:5173 is added by the browser, and says which website the request came from.
Access-Control-Allow-Origin is the server’s answer, saying which origin the browser may let read the response. That’s CORS. Browsers block a page from reading answers from another origin unless the server allows it, which is why CORS_ORIGINS is in your .env. curl isn’t a browser, so it ignores CORS completely.

#curl cheat sheet

curl is a command-line client. Think of it as your React app without the page.

Flag	Meaning
-i	Show the response headers and status line too
-s	Silent (hide the progress bar)
-X POST	The method
-H "Name: value"	Add a header
-d '{"a": 1}'	The request body
`	python3 -m json.tool`
Tip: quote any URL that contains &, and keep each command on one line (you’ve seen what stray backslashes do).

curl -i -X POST localhost:8000/api/stories/ -H "Content-Type: application/json" -d '{"title":"x","content":"<p>x</p>"}'      
curl -i -X POST localhost:8000/api/auth/token/ -H "Content-Type: application/json" -d '{"username":"demo_01","password":"wrong"}'
TOKEN=$(curl -s -X POST localhost:8000/api/auth/token/ -H "Content-Type: application/json" -d '{"username":"demo_01","password":"demo-pass-1234"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access'])")

after this now TOKEN variable has token value inside
echo ${TOKEN:0:20}

curl -s localhost:8000/api/stories/?mine=1 -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -8

curl -s localhost:8000/api/stories/?mine=1 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzkyNzA0OTEyLCJpYXQiOjE3OTI3MDMxMTIsImp0aSI6IjQyNzg2NWRmZDQyZTQ2NWFhMjQ0NGMzOWY1ZWIwMWUwIiwidXNlcl9pZCI6IjI5In0.-p3UIJS5CwUsUv9urNxFO0mLhbTB6NgcX42mkjYADCw" | python3 -m json.tool | head -8

Permissions: 401 vs 403

bash
curl -i localhost:8000/api/admin/users/                                     # 8a: no token
curl -i localhost:8000/api/admin/users/ -H "Authorization: Bearer $TOKEN"   # 8b: a normal user's token

Query strings

bash
curl -s "localhost:8000/api/stories/?genre=fantasy" | python3 -m json.tool | grep '"title"'                                     # 9a
curl -s "localhost:8000/api/stories/?search=zzzzzz" | python3 -m json.tool  

