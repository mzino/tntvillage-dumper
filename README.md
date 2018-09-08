# TNTVillage dumper
Node.js script to dump the TNTVillage index to a txt/csv file.


## Install
1. `git clone https://github.com/mzino/tntvillage-dumper.git`
2. `cd tntvillage-dumper`
3. `npm install`


## Usage
**Tested with node 8.11.4 LTS.**

`node index.js [query] [startpage] [endpage] [lastrelease (optional)]`

Eaxmple: `node index.js linux 1 3` will search TNTVillage for "linux" and dump pages from 1 to 3 of the results.

Use `+` as wildcard query.

The `lastrelease` optional argument is useful to do differential dumps without re-dumping the entire database. Insert the numeric post ID of the latest release in your previous dump and the script will stop when it reaches the same release.