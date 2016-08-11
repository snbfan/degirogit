## Prerequisites
- nodejs
- npm

### Installing the build dependencies.
npm i

### Tests (Unit+E2E)
gulp test-all

### Building (including tests, minifications etc.)
gulp build-all 

### Run the project
1. cd dist && ws
2. Open http://127.0.0.1:8000 in browser

### The task

SPA with simple style integrates with the Github Public API (see htts://developer.github.corn/v3/). 
Shows a table of Github public repositories. 
Table has pagination with dropdown in which user can set the page size: 25, 50, 100.

Available filters:
[] Language, - dropdown with a list of popular languages of programming - language of the repo
[] From - date field - bottom line for created_at of repo
[] To - date field - top line for created_at of repo

All filters and number of the page are in sync with URL params. 
Generally looks like this:

From [ . . . . ]   To [ . . . . ]   Language [Javascript (v)]   Page [25 (v)]

Id  | Repo name | Language    | Owner login

1   | reponame  | javascript  | login

......

< 1 2 3 4 >                 
