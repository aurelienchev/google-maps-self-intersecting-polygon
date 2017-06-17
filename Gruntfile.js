module.exports = function(grunt) {
	grunt.initConfig({
        uglify: {
            target: {
                files: [{
                    expand: true,
                    src: ['./js/**/*.js', '!./js/**/*.min.js'],
                    ext: '.min.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};