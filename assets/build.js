const Bundler = require('parcel-bundler')
const { execSync } = require('child_process')
const fs = require('fs')

const entryFiles = [
  './static/**',
  './js/app.js',
  './css/app.scss'
]

const options = {
  outDir: '../priv/static/',
  hmr: false,
  contentHash: false
};

(async () => {
  cleanPrivStatic()

  const bundler = new Bundler(entryFiles, options)

  bundler.on('buildEnd', () => {
    putStaticFilesInTheRightPlace()
    fixStaticFileReferences()
  })

  await bundler.bundle()
})()

function cleanPrivStatic () {
  execSync('rm -rf ../priv/static/')
}
function fixStaticFileReferences () {
  execSync(String.raw`find ../priv/static/css/ -maxdepth 1 -name '*.css' -exec sed -i -e 's/static\//..\//g' {} \;`)
}
function putStaticFilesInTheRightPlace () {
  if (fs.existsSync('../priv/static/static/')) {
    execSync('mv ../priv/static/static/** ../priv/static/')
    execSync('rm -rf ../priv/static/static/')
  }
}
