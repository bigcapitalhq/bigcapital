/**
 * # Gulp Configuration.
 * ------------------------------------------------------------------
 */

const RESOURCES_PATH = '../resources/';
module.exports = {
  banner: [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    '**/',
    '',
  ].join('\n'),

  // Browser Sync
  browsersync: {
    files: ['**/*', '!**.map', '!**.css'], // Exclude map files.
    notify: false, //
    open: true, // Set it to false if you don't like the browser window opening automatically.
    port: 8080, //
    proxy: 'localhost/customatic', //
    watchOptions: {
      debounceDelay: 2000, // This introduces a small delay when watching for file change events to avoid triggering too many reloads
    },
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**'],
    },
  },

  // Style Related.
  style: {
    clean: ['style.css', 'style.min.css', 'style-rtl.css', 'style-rtl.min.css'],
    build: [
      {
        src: `${RESOURCES_PATH}/scss/modules/invoice.scss`,
        dest: `${RESOURCES_PATH}/css/modules`,
        // sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        // minify: true, // Allow to enable/disable minify the source.
      },
      {
        src: `${RESOURCES_PATH}/scss/modules/estimate.scss`,
        dest: `${RESOURCES_PATH}/css/modules`,
        // sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        // minify: true, // Allow to enable/disable minify the source.
      },
      {
        src: `${RESOURCES_PATH}/scss/modules/receipt.scss`,
        dest: `${RESOURCES_PATH}/css/modules`,
        // sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        // minify: true, // Allow to enable/disable minify the source.
      },
      {
        src: `${RESOURCES_PATH}/scss/modules/credit.scss`,
        dest: `${RESOURCES_PATH}/css/modules`,
        // sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        // minify: true, // Allow to enable/disable minify the source.
      },
      {
        src: `${RESOURCES_PATH}/scss/modules/payment.scss`,
        dest: `${RESOURCES_PATH}/css/modules`,
        // sourcemaps: true, // Allow to enable/disable sourcemaps or pass object to configure it.
        // minify: true, // Allow to enable/disable minify the source.
      },
    //   {
    //     src: './assets/sass/editor-style.scss',
    //     dest: './assets/css',
    //     sourcemaps: true,
    //     minify: true,
    //   },
    ],
    // RTL builds.
    rtl: [
      {
        src: `${RESOURCES_PATH}/css/modules/invoice.css`,
        dest: `${RESOURCES_PATH}/css/modules`,
      },
      {
        src: `${RESOURCES_PATH}/css/modules/estimate.css`,
        dest: `${RESOURCES_PATH}/css/modules`,
      },
      {
        src: `${RESOURCES_PATH}/css/modules/receipt.css`,
        dest: `${RESOURCES_PATH}/css/modules`,
      },
      {
        src: `${RESOURCES_PATH}/css/modules/credit.css`,
        dest: `${RESOURCES_PATH}/css/modules`,
      },
      {
        src: `${RESOURCES_PATH}/css/modules/payment.css`,
        dest: `${RESOURCES_PATH}/css/modules`,
      },
    ],

    // Browsers you care about for auto-prefixing.
    autoprefixer: {
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 9',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6',
      ],
    },

    // SASS Configuration for all builds.
    sass: {
      errLogToConsole: true,
    //   outputStyle: 'compact',
    },

    // CSS MQ Packer configuration for all builds and style tasks.
    cssMqpacker: {},

    // CSS nano configuration for all builds.
    cssnano: {},

    // rtlcss configuration for all builds.
    rtlcss: {},
  },

  // Clean specific files.
  clean: [
    '**/.DS_Store',
    './assets/js/**/*.min.js',
    '**/*.map',
    '**/*.min.css',
    'assets/js/hypernews.js',
  ],

  // Watch related.
  watch: {
    css: ['./assets/sass/**/*'],
    js: ['assets/js/**/*.js', '!assets/js/**/*.min.js'],
    images: ['./assets/images/**/*'],
  },
};
