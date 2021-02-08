<p align="center"><img src="https://media0.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif" align="center" width="200"></p>
<h1 align="center">Rocket Competitive Programming</h1>

A command line client for parsing and making folders and files for test cases using the competitive companion extension and testing the solution. Building this with an 🎯 aim of making Competitive Programming More Productive

---------------
Usage [As of development stage]:

<img src="./assets/demo.gif">

---------------

Checklist:
- [x] Parse the post request data from the extension
- [x] Create files for the problems recieved
- [ ] Change the file creation into folder creation with a Makefile
    - Makefile Checklist:
        - [ ] run the program agains the test cases 
        - [ ] show the difference in a user readable format (chalk for node js coloring/ bash based coloring)
- [ ] Make a template directory and copy the template
    - Template Checklist:
        - [ ] add the problem metadata on the top of the problem file [modify the touchp file by passing in the metadata in the form of object]
- [ ] Config files storing user preferences
- [ ] Ship a binary instead of running the commands using node js. Refer cftool for example (or atleast a npm package that can be installed globally)

Things to figure out (way above my head as of now):
- [ ] Running the js script from inside the problem directory
- [ ] Making a npm package that can be installed globally ??
- [ ] Make an extension like competitive companion 😁 for codechef and codeforces
- [ ] Submit the problem to cf from the cli. 
    - Network checklist:
        - [ ] Check and understand the csrf token stuff
        - [ ] Deep dive into the network tab
- [ ] If it is that the extension is developed incorporate usage of advanced DOM manipulations and web scraping and parsing and extend the extension to many other sites

--------------------
Dependencies:
- [ ] Aim to use the least dependencies and Especially not use a web framework and build the application using vanilla node js
- [ ] **mkdirp** - Will rewrite after studying more about path lib and seperators and POSIX and NON POSIX URL Like paths

Recall:
- Donot involve complexities like using env variables at the start
- Make a working version and then focus on refactoring and abstraction

Techinal details used:
- PORT for listening to post requests from the extension: 10045
