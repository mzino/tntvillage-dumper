// Requirements
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

// Main variables
const stream = fs.createWriteStream('tntvillage_dump_'+Date.now()+'.txt', {flags:'a'})
var query = process.argv.slice(2)[0] // Use '+' as wildcard
var startpage = parseInt(process.argv.slice(2)[1])
var endpage = parseInt(process.argv.slice(2)[2])
var lastRelease = parseInt(process.argv.slice(2)[3])
if (!lastRelease) {
	var lastRelease = 0
}
String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

// DUMPER
if ( !query || !startpage || !endpage ) {
	return console.log('Arguments not properly defined.')
} else {
	// Cycle queried range of pages sequentially
	var range = Array.from({length: endpage+1-startpage}, (x,i) => i+startpage)
	async.eachSeries(range, (page, nextPage) => {
		console.log('Dumping page',page)
		// Dump page
		request.post({
				url: 'http://tntvillage.scambioetico.org/src/releaselist.php',
				form: {
					cat: '0',
					page: page,
					srcrel: query
				}
			}, (err,httpResponse,body) => {
				if (err) {
					return console.log(err)
				}
				var $ = cheerio.load(body,{decodeEntities: false})
				// Find all release rows
				var rows = $('.showrelease_tb').find('tr')
				// Cycle all rows sequentially (except the first which contains headers and the new one with the video)
				async.eachSeries(rows.slice(2,23), (row, nextRow) => {
					// Magnet link
					var magnet_column = $(row).children().eq(1).children().eq(0)
					var magnet_html = $.html(magnet_column)
					var magnet = $(magnet_html).attr('href')
					// Category
					var cat_column = $(row).children().eq(2).children().eq(0)
					var cat_html = $.html(cat_column)
					var cat_link = $(cat_html).attr('href')
					var cat_code = cat_link.substr(cat_link.indexOfEnd('cat='), 2)
					if (cat_code=='1') {
						var cat = 'tvshows'
					} else if (cat_code=='2') {
						var cat = 'music'
					} else if (cat_code=='3') {
						var cat = 'books'
					} else if (cat_code=='4') {
						var cat = 'movies'
					} else if (cat_code=='6') {
						var cat = 'linux'
					} else if (cat_code=='7') {
						var cat = 'anime'
					} else if (cat_code=='8') {
						var cat = 'cartoons'
					} else if (cat_code=='9') {
						var cat = 'mac'
					} else if (cat_code=='10') {
						var cat = 'windows'
					} else if (cat_code=='11') {
						var cat = 'pcgames'
					} else if (cat_code=='12') {
						var cat = 'playstation'
					} else if (cat_code=='13') {
						var cat = 'students'
					} else if (cat_code=='14') {
						var cat = 'documentaries'
					} else if (cat_code=='21') {
						var cat = 'musicvideos'
					} else if (cat_code=='22') {
						var cat = 'sport'
					} else if (cat_code=='23') {
						var cat = 'theater'
					} else if (cat_code=='24') {
						var cat = 'wrestling'
					} else if (cat_code=='25') {
						var cat = 'misc'
					} else if (cat_code=='26') {
						var cat = 'xbox'
					} else if (cat_code=='27') {
						var cat = 'wallpapers'
					} else if (cat_code=='28') {
						var cat = 'othergames'
					} else if (cat_code=='29') {
						var cat = 'tvseries'
					} else if (cat_code=='30') {
						var cat = 'comics'
					} else if (cat_code=='31') {
						var cat = 'trash'
					} else if (cat_code=='32') {
						var cat = 'nintendo'
					} else if (cat_code=='34') {
						var cat = 'audiobooks'
					} else if (cat_code=='35') {
						var cat = 'podcasts'
					} else if (cat_code=='36') {
						var cat = 'magazines'
					} else if (cat_code=='37') {
						var cat = 'mobile'
					} else if (cat_code=='') {
						var cat = 'misc'
					}
					// Release title
					var title_column = $(row).children().eq(6).children().eq(0)
					var title_raw = $.text(title_column)
					var title = title_raw.replace(/	/g, '')
					// Release link
					var link_column = $(row).children().eq(6).children().eq(0)
					var link_html = $.html(link_column)
					var link = $(link_html).attr('href')
					// Release description
					var desc_column = $(row).children().eq(6)
					var desc_html = $.html(desc_column)
					var desc_raw = desc_html.substring(
						desc_html.lastIndexOf('</a>')+5,
						desc_html.lastIndexOf('</td>')
					)
					var desc = desc_raw.replace(/	/g, '')
					// Break loop if the target release is reached
					var release_id = parseInt(link.substr(link.indexOfEnd('showtopic='),8))
					if (lastRelease>=release_id){
						const endDiffDump = new Error()
						endDiffDump.type = 'endDiffDump'
						return nextPage(endDiffDump)
					} else {
						// Compose tab-separated line and append it to text file
						var text_line = title + '\t' + desc + '\t' + cat + '\t' + link + '\t' + magnet
						stream.write(text_line+'\n')
						nextRow()
					}
				}, (innerError) => {
					if (innerError) {
						return console.log(innerError)
					} else {
						nextPage()
					}
				})
			}
		)
	}, (err) => {
		if (err && err.type!=='endDiffDump') {
			return console.log(err)
		} else if (err && err.type==='endDiffDump') {
			stream.end()
			return console.log('Differential dump done!')
		} else {
			stream.end()
			return console.log('Complete dump done!')
		}
	})
}
