'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
  	rev = require('gulp-rev'),
  	// imagemin = require('gulp-imagemin'),
  	uglify = require('gulp-uglify'),
  	minifyCSS =  require('gulp-minify-css'),
  	clean = require('gulp-clean'),
  	revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence'),
  	path = require('path'), //require优化
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass');


gulp.task('clean', () =>
    gulp.src('build/public')
    .pipe(clean())
);

gulp.task('clean1', () =>
    gulp.src('build/app.js')
    .pipe(clean())
);

gulp.task('clean2', () =>
    gulp.src('build/routes')
    .pipe(clean())
);

gulp.task('lessCSS', function() {
	gulp.src('public/css/*/*.less')
	.pipe(less())
	.pipe(gulp.dest('public/css'))
});

gulp.task('renameCSS', () =>
    gulp.src('public/css/*/*.css')
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('build/public/css'))
        .pipe(rev.manifest())
		.pipe(gulp.dest('build/public/assets/css'))
);

gulp.task('renameFont', () =>
    gulp.src('public/iconFont/*')
        .pipe(rev())
        .pipe(gulp.dest('build/public/iconFont'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/public/assets/iconFont'))
);

// gulp.task('iconCSS',() =>
// 	gulp.src(['build/public/assets/*/rev-manifest.json', 'build/public/css/common/reset-*.css'])
// 		   .pipe(revCollector())
// 		   .pipe(gulp.dest('build/public/css/common'))
// );

gulp.task('renameJS', () =>
    gulp.src('public/js/*/*.js')
        // .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('build/public/js'))
        .pipe(rev.manifest())
		.pipe(gulp.dest('build/public/assets/js'))
);

gulp.task('renameSeaJs', () =>
    gulp.src(['build/public/assets/*/rev-manifest.json', 'build/public/js/ibCommon/sea-*.base.js'])
        .pipe(revCollector())
		.pipe(gulp.dest('build/public/js/ibCommon'))
);

gulp.task('renameImage', () =>
    gulp.src(['public/images/*/*.*','public/images/*/*/*.*','!public/images/bank/*.*','!public/images/personal/banks/*.*'])
        .pipe(rev())
        .pipe(gulp.dest('build/public/images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/public/assets/images'))
);

gulp.task('bankImage', () =>
    gulp.src(['public/images/bank/*.*'])
        .pipe(gulp.dest('build/public/images/bank'))
);
gulp.task('bankImage1', () =>
gulp.src(['public/images/personal/banks/*.*'])
    .pipe(gulp.dest('build/public/images/personal/banks'))
);


gulp.task('reCSSFile',() =>
  gulp.src(['build/public/assets/*/rev-manifest.json', 'build/public/css/*/*.css'])
       .pipe(revCollector())
       .pipe(gulp.dest('build/public/css'))
);

gulp.task('reJSFile',() =>
  gulp.src(['build/public/assets/*/rev-manifest.json', 'build/public/js/*/*.js'])
       .pipe(revCollector())
       .pipe(gulp.dest('build/public/js'))
);

// /*压缩并复制图片*/
// gulp.task('compress-img',function () {
//     gulp.src('webContent/images/**/*.*')    //原图片的位置
//         .pipe(imagemin())                   //执行图片压缩
//         .pipe(gulp.dest('dist/images'));    //压缩后的图片输出的位置
// });

gulp.task('template',() =>
	gulp.src(['build/public/assets/*/rev-manifest.json', 'views/**/*.html'])
		   .pipe(revCollector())
		   .pipe(gulp.dest('build/views'))
);

gulp.task('copy1', () =>
    gulp.src(['app.js','config.js','pm2.json','package.json'])
        .pipe(gulp.dest('build'))
);

gulp.task('copy2', () =>
    gulp.src('public/favicon.ico')
        .pipe(gulp.dest('build/public'))
);


gulp.task('copy3', () =>
    gulp.src('routes/**/*.js')
        .pipe(gulp.dest('build/routes'))
);

gulp.task('copy4', () =>
    gulp.src('data/*.js')
        .pipe(gulp.dest('build/data'))
);

gulp.task('copy5', () =>
    gulp.src('bin/www')
        .pipe(gulp.dest('build/bin'))
);

gulp.task('watch', function() {
    gulp.watch(['build/public/*'], ['clean']);
    gulp.watch(['build/app.js'], ['clean1']);
    gulp.watch(['build/routes/*'], ['clean2']);
    gulp.watch(['public/css/*/*.less'], ['lessCSS']);
    gulp.watch(['public/css/*/*.css'], ['renameCSS']);
    gulp.watch(['public/js/*/*.js'], ['renameJS']);
    gulp.watch(['public/images/*'], ['renameImage']);
    gulp.watch(['public/images/*'], ['bankImage']);
    gulp.watch(['public/images/*'], ['bankImage1']);
    gulp.watch(['public/images/*'], ['renameFont']);
    gulp.watch(['views/**/*.html'], ['template']);
    gulp.watch(['app.js'], ['copy1']);
    gulp.watch(['routes/*'], ['copy2']);
});

gulp.task('default',['build']);
gulp.task('build', function (done) {
    runSequence(
         ['clean'],
         ['clean1'],
         ['clean2'],
         ['lessCSS'],
         ['renameFont'],
         ['renameJS'],
         ['renameSeaJs'],
         ['renameCSS'],
         ['renameFont'],
         ['renameImage'],
         ['bankImage'],
         ['bankImage1'],
         ['template'],
         ['reCSSFile'],
         ['reJSFile'],
         ['copy1'],
         ['copy2'],
         ['copy3'],
         ['copy4'],
         ['copy5'],
         ['watch'],
    done);
});


// 浏览器同步，用7000端口去代理Express的3008端口
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    notify: false,//关闭页面通知
    proxy: "http://localhost:3000",
    files: ["views/*.*","views/*/*.*","views/*/*/*.*","public/scss/*.*","public/scss/*/*.*","public/js/*.*","public/js/*/*.*","public/images/*.*"],
    browser: "chrome",
    port: 7000,
  });
});

// 开启Express服务
gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: 'bin/www'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});
//sass编译
gulp.task('sass', function () {
  return gulp.src('public/scss/*/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/'));
});
//启动服务
gulp.task('server',['browser-sync'],function(){
    gulp.watch('public/scss/*/*.scss', ['sass']);
    gulp.watch('public/css/*/*.less', ['lessCSS']);
});
