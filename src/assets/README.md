### Assets

This folder consists of the assets that have been used in the project developement stages

1. `exeecutor.sh` : This was used when the project was in the first phase. We would run the test cases and show the diff output using bash alone
2. `Makefile` and `Makefile.ejs` : This was used when the project was in the second phase. We moved from the bash script to a single make command using the Makefile. We used EJS Templating engine to generate **problem specific Makefile**
3. `.config.json` : This was the third improvement that was planned. The idea was to embed a `.config.json` into each and every problem folder and then use a node executor script that uses an abstraction of `child_process` module called as [shell js](https://www.npmjs.com/package/shelljs). We completely ditched using makefile / bash script at this point of time
