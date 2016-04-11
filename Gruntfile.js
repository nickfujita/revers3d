module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      single: {
        src: 'app/build/singleConcat.js',
        dest: 'app/game/single.min.js'
      },
      multi: {
        src: 'app/build/multiConcat.js',
        dest: 'app/game/multi.min.js'
      }
    },

    concat: {
      single: {
        src: [
          "app/scripts/utils/StereoEffect.js",
          "app/scripts/utils/DeviceOrientationControls.js",
          "app/scripts/utils/PointerLockControls.js",
          "app/scripts/utils/TapTouchControls.js",
          "app/scripts/utils/GeometryUtils.js",
          "app/scripts/enableControls.js",
          "app/scripts/Tile.js",
          "app/scripts/GameState.js",
          "app/scripts/Board.js",
          "app/scripts/game.js",
        ],
        dest: 'app/build/singleConcat.js'
      },
      multi: {
        src: [
          "app/scripts/utils/StereoEffect.js",
          "app/scripts/utils/DeviceOrientationControls.js",
          "app/scripts/utils/PointerLockControls.js",
          "app/scripts/utils/TapTouchControls.js",
          "app/scripts/utils/GeometryUtils.js",
          "app/scripts/enableControls.js",
          "app/scripts/Tile.js",
          "app/scripts/GameState.js",
          "app/scripts/Board.js",
          "app/scripts/game.js",
        ],
        dest: 'app/build/multiConcat.js'
      },
    },

    watch: {
      scripts: {
        files: [
          'app/scripts/**',
        ],
        tasks: ['build'],
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
  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['concat', 'uglify']);
};
