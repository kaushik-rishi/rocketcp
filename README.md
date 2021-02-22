<p align="center"><img src="https://media0.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif" align="center" width="200"></p>
<h1 align="center">Rocket Competitive Programming</h1>

A command line client for parsing and making folders and files for test cases using the competitive companion extension and testing the solution. Building this with an 🎯 aim of making Competitive Programming More Productive

---------------
Usage [As of development stage]:

<img src="./assets/demo.gif">

---------------

### Note:
- I don't have much knowledge about wether the file operations should be synchronous or asynchronous.
- I'm trying to keep most of the (infact all of the) functions as synchronous.

### Checklist:
- [x] Parse the post request data from the extension
- [x] Create files for the problems recieved
- [x] Change the file creation into folder creation
- [ ] Make a template directory and copy the template
    - Template Checklist:
        - [ ] add the problem metadata on the top of the problem file
        - [ ] add only the metadata if template not found
- [ ] Create make file for each folder
    - Makefile Checklist:
        - [ ] run the program agains the test cases 
        - [ ] show the difference in a user readable format (chalk for node js coloring/ bash based coloring)
        - [ ] Can we have a Makefile in a directory and then use that makefile for all the sub folders [ may be have smaller make files in each sub dir ] - Aim: memory efficient
- [ ] 
- [ ] Config files storing user preferences
- [ ] Ship a binary instead of running the commands using node js. Refer cftool for example (or atleast a npm package that can be installed globally)

Things to figure out (way above my head as of now):
- [ ] Running the js script from inside the problem directory
	- [ ] May be use a hash bang `#/usr/bin/env node` and link the file to `bin` using `ln`
- [ ] Making a npm package that can be installed globally ??
- [ ] Make an extension like `competitive companion` for codechef and codeforces
- [ ] Submit the problem to cf from the cli. 
    - Network checklist:
        - [ ] Check and understand the csrf token stuff
        - [ ] Deep dive into the network tab
- [ ] If it is that the extension is developed incorporate usage of advanced DOM manipulations and web scraping and parsing and extend the extension to many other sites

--------------------
### Dependencies:
- [ ] Aim to use the least dependencies and Especially not use a web framework and build the application using vanilla node js
- [ ] **mkdirp** - Will rewrite after studying more about path library and seperators and POSIX and NON POSIX URL Like paths
- [ ] Prefer having less dependencies to having less SLOC

### Recall:
- Donot involve complexities like using env variables at the start
- Think of cross platformeness later
- Make a working version and then focus on refactoring and abstraction

### Technical details used:
- PORT for listening to post requests from the extension: 10045
