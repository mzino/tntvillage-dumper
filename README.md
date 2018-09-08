# TNTVillage dumper
Node.js script to dump the TNTVillage index to a txt file.


## Install
**Tested with node 8.11.4 LTS.**
1. `git clone https://github.com/mzino/tntvillage-dumper.git`
2. `cd tntvillage-dumper`
3. `npm install`


## Usage
`node index.js [query] [startpage] [endpage] [lastrelease (optional)]`

Example: `node index.js linux 1 3` will search TNTVillage for "linux" and dump pages from 1 to 3 of the results.

To dump the entire TNTVillage index, use `+` as wildcard query and use a very high number for `endpage` (>7000).

The `lastrelease` optional argument is useful to do differential dumps without re-dumping the entire database. Input the numeric post ID of the latest release in your previous dump (which is the first release you find in the dump txt) and the script will stop when it reaches the same release. Example: `node index.js + 1 7000 123456` will dump everything released after release #123456.
