/**
 * I have `assets/style/all.css` & `assets/style/all.css.map`.
 * Then I want to use `gulp-postcss` to process `assets/style/all.css`,
 * and hope it will preserve the previous source map.
 */

var gutil = require('gulp-util')
var sourceMaps = require('gulp-sourcemaps')
var postcss = require('../index')
var path = require('path')
var fs = require('fs')

var init = sourceMaps.init({loadMaps: true})
var css = postcss([])

init.pipe(css)

css.on('data', function (file) {
  console.log(file.sourceMap)
  fs.writeFileSync(
    __dirname + '/assets/style/result.css',
    file.contents.toString() + `/*# sourceMappingURL=result.css.map */`
  )
  fs.writeFileSync(
    __dirname + '/assets/style/result.css.map',
    JSON.stringify(file.sourceMap)
  )
  /**
  { version: 3,
   sources:
    [ '../../demo/assets/assets/style/style/a.css',
      '../../demo/assets/assets/style/style/b.css' ],
   names: [],
   mappings: 'AAAA,MAAA,YAAA,CAAA;;ACAA,MAAA,UAAA,CAAA',
   file: 'assets/style/all.css',
   sourcesContent: [ 'body {color: #333;}\n', 'body {margin: 0;}\n' ] }
   */
  // The mappings are right.
  // To https://github.com/postcss/gulp-postcss/issues/109 ,
  // it seems mappings are right.
  //
  // However, new source map's sources are not correct.
})

init.write(new gutil.File({
  base: __dirname,
  path: __dirname + '/assets/style/all.css',
  contents: fs.readFileSync(__dirname + '/assets/style/all.css')
}))

init.end()