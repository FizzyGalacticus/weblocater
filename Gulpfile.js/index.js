const { src, dest, watch, parallel, series } = require('gulp');
const browserify = require('browserify');
const livereactload = require('livereactload');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const eslint = require('gulp-eslint');
const server = require('simple-server');

const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

const env = process.env.NODE_ENV;

const sourceDir = 'src';
const destDir = 'docs';

const builder = browserify(`${sourceDir}/js/app.js`, {
    cache: {},
    packageCache: {},
    plugin: env !== 'production' ? [livereactload] : undefined
}).transform('babelify');

const lint = () => {
    return src(`${sourceDir}/**/*.js`).pipe(eslint({ fix: true }));
};

const transpile = () => {
    return builder
        .bundle()
        .on('error', function(err) {
            /* eslint-disable */
            console.error(err.stack);
            writeFile('build_err.txt', JSON.stringify(err.stack));
            this.emit('end');
            /* eslint-enable */
        })
        .pipe(source('app.js'))
        .pipe(dest(`${destDir}/js`));
};

const minifyJs = () => {
    return src(`${destDir}/js/app.js`)
        .pipe(uglify())
        .pipe(dest(`${destDir}/js`));
};

const buildJs = series(lint, transpile, minifyJs);

const minHtml = () => {
    return src(`${sourceDir}/index.html`)
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                minifyURLs: true,
                minifyCSS: true,
                minifyJS: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true
            })
        )
        .pipe(dest(`${destDir}/`));
};

const devMode = () => {
    if (env === 'dev') {
        watch(`${sourceDir}/index.html`, minHtml);
        watch(`${sourceDir}/**/*.js`, series(lint, transpile));

        server(`${destDir}/`, 3001);

        setTimeout(() => {
            console.log('You can view your changes here: http://localhost:3001');
        }, 3000);
    }

    return Promise.resolve();
};

const all = parallel(buildJs, minHtml, devMode);

module.exports = {
    default: all
};
