# GFW AoI count per RW API user

This repo contains a script that counts the number of GFW API Areas of Interest per RW API user.

To run the script, simply run `yarn install` to install dependencies and `yarn run` to run the script.

Make sure you provide the URL for the connection to the correct MongoDB instance by providing `MONGO_URI` as environment variable.

The output of the script is generated and dumped into a CSV file called `countAreas.csv` in the root of the project.
