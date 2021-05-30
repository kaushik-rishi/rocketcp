<p align="center"><img src="https://media0.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif" align="center" width="200"></p>
<h1 align="center">Rocket Competitive Programming</h1>

A command-line client for parsing and making folders and files for test cases using the competitive companion extension and testing the solution. Building this with an 🎯 aim of making Competitive Programming More Productive

---

## Tech Stack:

-   In the current version

<img alt="NodeJS" src="https://img.shields.io/badge/vanilla node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>
<img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>

-   Used for the previous releases

<img alt="Make-File" src="https://img.shields.io/badge/makefile%20-%23107C10.svg?&style=for-the-badge&logo=makefile&logoColor=white"/> 
<img alt="E JS" src="https://img.shields.io/badge/E%20js%20-%23000000.svg?&style=for-the-badge&logo=E.js&logoColor=white"/> 
<img alt="Shell" src="https://img.shields.io/badge/shell%20-%23121011.svg?&style=for-the-badge&logo=gnu-bash&logoColor=white"/>

## Usage

<img src="./docs_assets/project videos/demo.gif">

---

### Here is our discord server link - [https://discord.com/channels/818724344359288842/818724344359288845](https://discord.com/channels/818724344359288842/818724344359288845)

#### Join the discord server if you:

-   have queries related to the development of the project
-   want to contribute to the project
-   need help in getting the tool up and running

### Checklist:

-   [x] Parse the post request data from the extension
-   [x] Create files for the problems received
-   [x] Change the file creation into folder creation
-   [x] Make a template directory and copy the template
    -   Template Checklist:
        -   [x] add the problem metadata on the top of the problem file
        -   [x] add only the metadata if the template not found
-   [x] Create make a file for each folder
    -   Makefile Checklist:
        -   [x] run the program against the test cases
        -   [x] show the difference in a user-readable format (chalk for node js coloring/ bash based coloring)
        -   [x] Can we have a Makefile in a directory and then use that makefile for all the subfolders [ may be have smaller make files in each sub dir ] - Aim: memory-efficient
-   [ ] Config files storing user preferences
-   [ ] Ship a binary instead of running the commands using node js. Refer cftool for example (or at least a npm package that can be installed globally)

Things to figure out (way above my head as of now):

-   [x] Running the js script from inside the problem directory
    -   [x] Maybe use a hashbang `#/usr/bin/env node` and link the file to `bin` using `ln`
-   [x] Making an npm package that can be installed globally ??
-   [ ] Make an extension like `competitive companion` for CodeChef and code forces
-   [ ] Submit the problem to cf from the cli.
    -   Network checklist:
        -   [ ] Check and understand the csrf token stuff
            -   Figured out doing this using python `request.sessions`
        -   [ ] Deep dive into the network tab
-   [ ] If it is that the extension is developed incorporate usage of advanced DOM manipulations and web scraping and parsing and extend the extension to many other sites

---

### Dependencies:

        Aim to use the least dependencies and Especially not use a web framework and build the application using vanilla node js

-   **argparse** - parse the options provided to the CLI tool
-   **mkdirp** - Will rewrite after studying more about path library and separators and POSIX and NON POSIX URL Like paths
-   **shelljs** - For the executor script
-   **ejs** - For creating make files based on the file name
-   **fast-diff** - Providing interactive difference
-   **find-free-port** - Checks if a current port is free or not

**Styling Dependencies**

-   **chalk** - For colored terminal printing as this is a CLI tool.
-   **ora** - For spinner

**Development Dependencies**

-   **husky** - for git precommit hooks
-   **husky-talisman** - for security purposes
-   **prettier** - used to format the code in the pre commit hook
-   **jest** - for writing unit tests
-   **nodemon** - running the server while development

### Small note to contributors:

-   Do not involve complexities like using `environment variables` at the start
-   Think of cross platforms later
-   Make a working version and then focus on refactoring and abstraction

### Technical details used:

-   PORT for listening to post requests from the extension: ~~10045~~ We have a list of possible ports and the application check's which port is free and chooses the port accordingly

## For Developers and Open source contributor's

-   [Watch Project Introduction Video](https://youtu.be/3hCQKaUxKRQ)
-   Please first go through our [Code Of Conduct](https://github.com/kaushik-rishi/rocketcp/blob/develop/CODE_OF_CONDUCT.md) and [Contribution Guidelines](https://github.com/kaushik-rishi/rocketcp/blob/develop/CONTRIBUTING.md)

---

-   The issue and PR's have linked templates, when you go ahead and create an issue or a PR please follow the template so that it will be easy for the maintainers to review your pull request or validate your issue
-   The project maintainer(s) will let you know if there is any merge conflict and then it's you're job to resolve the merge conflict by taking the help of the mentor.

## Contributors:

### Credits goes to these people: ✨

<table>
	<tr>
		<td>
   <a href="https://github.com/kaushik-rishi/rocketcp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kaushik-rishi/rocketcp" />
</a>
		</td>
	</tr>
</table>
