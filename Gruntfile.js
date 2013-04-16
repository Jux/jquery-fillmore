module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'src/Fillmore.js',
          'src/FillmoreCss3.js',
          'src/FillmoreCss3Frame.js',
          'src/FillmoreCss3Cover.js',
          'src/FillmoreImageStretch.js',
          'src/jQueryAdapter.js'
        ],
        dest: 'jquery.fillmore.js'
      }
    },
    uglify: {
      options: {
        banner: [
          '/*!',
          ' * jQuery Fillmore',
          ' * Version <%= pkg.version %>',
          ' * https://github.com/gregjacobs/jquery-fillmore',
          ' *',
          ' * Add a dynamically-resized background image to any element',
          ' *',
          ' * Copyright (c) 2012 Gregory Jacobs with Aidan Feldman (jux.com)',
          ' * Dual licensed under the MIT and GPL licenses.',
          ' */\n'
        ].join('\n')
      },
      min: {
        files: {
          'jquery.fillmore.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      files: ['<%= concat.dist.src %>'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};
