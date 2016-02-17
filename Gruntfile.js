module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      scripts: {
        src: 'app/build/scripts.js',
        dest: 'app/build/scripts.min.js'
      },
      othello: {
        src: 'app/build/othello.js',
        dest: 'app/othello/scripts.min.js'
      },
      components: {
        src: 'app/build/components.js',
        dest: 'app/build/components.min.js'
      }
    },

    concat: {
      scripts: {
        src: [
          'app/cube/scripts/cube.js',
          'app/othello/scripts/othello.js',
        ],
        dest: 'app/build/scripts.js'
      },
      othello: {
        src: [
          'app/othello/scripts/**',
        ],
        dest: 'app/build/othello.js'
      },
      components: {
        src: ['app/bower_components/three.js/build/three.min.js'],
        dest: 'app/build/components.js'
      }
    },

    watch: {
      // scripts: {
      //   files: [
      //     'app/**/*.js',
      //     '!app/build/**'
      //   ],
      //   tasks: ['build-scripts'],
      //   options: {
      //     // spawn: false,
      //   },
      // },
      othello: {
        files: [
          'app/othello/**',
          '!app/othello/*.min.js'
        ],
        tasks: ['build-othello'],
        options: {
          // spawn: false,
        },
      },
      components: {
        files: [
          'app/bower_components/**'
        ],
        tasks: ['build'],
        options: {
          // spawn: false,
        },
      },
      styles: {
        files: ['**/*.css'],
        tasks: [],
        options: {
          // spawn: false,
        },
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register tasks
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('build-othello', ['concat:othello', 'uglify:othello']);
  grunt.registerTask('build-scripts', ['concat:scripts', 'uglify:scripts']);


};
