# Deps
gulp         = require 'gulp'
rename       = require 'gulp-rename'
sourcemaps   = require 'gulp-sourcemaps'
uglify       = require 'gulp-uglify'
coffee       = require 'gulp-coffee'
coffeelint   = require 'gulp-coffeelint'
stripDebug   = require 'gulp-strip-debug'

class GulpTasks

	paths:
		coffee:
			source: '_src/**/*.coffee'
			dest:   '_dist'

	watch: => gulp.watch( @paths.coffee.source, this.coffee )

	build: => this.coffee()

	coffee: =>

		gulp
			.src  @paths.coffee.source
			.pipe sourcemaps.init()
			.pipe coffee()
			.pipe gulp.dest( @paths.coffee.dest )
			.pipe uglify()
			.pipe rename( suffix: '.min' )
			.pipe sourcemaps.write( './maps' )
			.pipe gulp.dest( @paths.coffee.dest )

	coffeelint: =>

		gulp
			.src  @paths.coffee.source
			.pipe coffeelint()
			.pipe coffeelint.reporter( 'coffeelint-stylish' )

tasks = new GulpTasks


# CoffeeScript tasks
gulp.task 'coffee', tasks.coffee
gulp.task 'lint', tasks.coffeelint

# Rebuild a file changes
gulp.task 'watch', tasks.watch

# Build task
gulp.task 'build', tasks.build
gulp.task 'compile', tasks.build

# Default task (called when you run `gulp` from cli)
gulp.task 'default', gulp.series( 'build', 'watch' )
