module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-growl');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      less: {
        options: {
          debounceDelay: 250
        },
        files: 'src/less/*.less',
        tasks: ['growl:less', 'less']
      },
      js: {
        options: {
          debounceDelay: 250
        },
        files: 'src/js/*.js',
        tasks: ['growl:js', 'jshint']
      },
      manifest: {
        options: {
          debounceDelay: 250
        },
        files: ['src/index.html', 'src/css/**', 'src/js/**', 'src/img/**', 'src/sounds/**'],
        tasks: ['growl:manifest', 'manifest:src']
      }
    },

    growl: {
      less: {
        title : "Grunt",
        message : "LESS compilation…"
      },
      js: {
        title : "Grunt",
        message : "JS hint…"
      },
      manifest: {
        title : "Grunt",
        message : "Updating manifest.appcache…"
      }
    },

    less: {
      src: {
        files: {
          "src/css/styles.css": "src/less/styles.less"
        }
      }
    },

    clean: {
      dist: {
        src: 'dist/'
      }
    },

    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'src/', src: ['.htaccess', 'esviji-icon.png', 'favicon.ico', 'index.html', 'manifest.webapp'], dest: 'dist/' },
          { expand: true, cwd: 'src/', src: ['css/font/*'], dest: 'dist/' },
          { expand: true, cwd: 'src/', src: ['img/favicon.png', 'img/firefox-os/*', 'img/ios/*', 'img/windows-8/*'], dest: 'dist/' },
          { expand: true, cwd: 'src/', src: ['sounds/sprite.{mp3,ogg}'], dest: 'dist/' }
        ]
      }
    },

    useminPrepare: {
      options: {
        dest: 'dist/'
      },
      html: 'src/index.html'
    },
    usemin: {
      html: 'dist/index.html'
    },

    concat: {
      options: {
        separator: ';'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> - Copyright (c) 1992-<%= grunt.template.today("yyyy") %> Nicolas Hoizey <nicolas@hoizey.com> */',
        report:'min',
        compress: {
          global_defs: {
            'DEBUG': false
          }
        }
      }
    },

    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> - Copyright (c) 1992-<%= grunt.template.today("yyyy") %> Nicolas Hoizey <nicolas@hoizey.com> */'
      }
    },

    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: [
            'dist/css/styles.css',
            'dist/js/app.js'
          ]
        }]
      }
    },

    manifest: {
      src: {
        options: {
          basePath: 'src/',
          network: ['*'],
          verbose: true,
          timestamp: true
        },
        src: [
          'favicon.ico',
          'img/favicon.png',
          'js/**/*.js',
          'css/styles.css',
          'css/font/*',
          'sounds/*.{ogg,mp3}'
        ],
        dest: 'src/manifest.appcache'
      },
      dist: {
        options: {
          basePath: 'dist/',
          network: ['*'],
          verbose: true,
          timestamp: true
        },
        src: [
          'favicon.ico',
          'img/favicon.png',
          'js/app.js',
          'css/styles.css',
          'css/font/*',
          'sounds/*.{ogg,mp3}'
        ],
        dest: 'dist/manifest.appcache'
      }
    },

    sed: {
      version: {
        path: 'dist/',
        recursive: true,
        pattern: '%VERSION%',
        replacement: '<%= pkg.version %>'
      }
    },

    docco: {
      debug: {
        src: ['src/js/esviji.js'],
        options: {
          output: 'docs/'
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'manifest:src', 'watch']);
  grunt.registerTask('compile', ['growl:less', 'less', 'growl:manifest', 'manifest:src']);
  grunt.registerTask('package', [], function() {
    // cf https://github.com/gruntjs/grunt/issues/975#issuecomment-29058707
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-docco');
    grunt.task.run('less', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin', 'manifest:dist', 'sed', 'docco');
  });
};
