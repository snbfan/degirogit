## Prerequisites
- nodejs
- npm

### Installing the build dependencies.
npm i

### Tests (Unit+E2E)
gulp test-all

### Building (including tests, minifications etc.)
gulp build-all 

### Built project
/dist/index.html


### The task

In the test I would like to see if you can implement a basic AJAX functionality, able to work with RESTfull web services, and how you organise your code. 
The task is to make a web page with simple style would integrate with the Github Public API (see htts://developer.github.corn/v3/). 
Below in the task I will tell you exactly you should be able to download from Github and display in page via their API. 
The test should take you about two hours.
Create a table of Github public repositories. Table should have pagination with dropdown in which user can set the page size: 25, 50, 100.

Add the filters block the table:
[] Language, - dropdown with a list of popular languages of programming - language of the repo
[] From - date field - bottom line for created_at of repo
[] To - date field - top line for created_at of repo

All filters and number of the page should sync with URL params. 

From [__] To [__] Language [Javascript (v)] Page [25 (v)]

Id  | Repo name | Language    | Owner login
1   | reponame  | javascript  | login
......

< 1 2 3 4 >                 
