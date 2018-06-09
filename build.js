const metalsmith        = require('metalsmith');
const markdown          = require('metalsmith-markdown');
const drafts            = require('metalsmith-drafts');
const layouts           = require('metalsmith-layouts');
const permalinks        = require('metalsmith-permalinks');
const collections       = require('metalsmith-collections');
const handlebars        = require('handlebars');
const metallic          = require('metalsmith-metallic');
const serve             = require('metalsmith-serve');
const watch             = require('metalsmith-watch');
const redirect          = require('metalsmith-redirect');

handlebars.registerHelper('moment', require('helper-moment'));

// limit an array to a maximum of elements (from the start)
// Thanks to http://stackoverflow.com/questions/10377700/limit-results-of-each-in-handlebars-js
handlebars.registerHelper('each_upto', function(ary, max, options) {
  if(!ary || ary.length == 0)
    return options.inverse(this);

  var result = [ ];
  for(var i = 0; i < max && i < ary.length; ++i)
    result.push(options.fn(ary[i]));
  return result.join('');
});

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Neustadt.fr',
      baseurl: 'https://www.neustadt.fr',
      author: 'Parimal Satyal',
      keywords: 'Parimal Satyal, Neustadt, parimalsatyal',
      description: 'Personal website of Parimal Satyal, a designer/geek who enjoys cosmology, dark beer, the open internet, metal music and foreign languages. Essays, music and reviews.'
    }
  })
  .source('./src')
  .destination('./public')
  .use(drafts())
  .use(collections({
    publications: {
      pattern: '*/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Everything'
      }
    },
    essays: {
      pattern: 'essays/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Essays'
      }
    },
    reviews: {
      pattern: 'reviews/**/*.md',
      sortBy: 'date',
      reverse: true,
      metadata: {
        name: 'Reviews'
      }
    }
  }))
  .use(metallic())
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layout',
    pattern: ["*/*/*html","*/*html","*html"],
    default: 'essay.html',
    partials: {
      header: 'partials/header',
      footer: 'partials/footer'
    }
  }))
  // .use(serve({
  //   port: 8081,
  //   verbose: true
  // }))
  // .use(watch({
  //   paths: {
  //     "${source}/**/*": true,
  //     "layout/**/*": "**/*",
  //   }
  // }))
  .use(redirect({
    '/about': '/parimal-satyal',
  }))
  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Neustadt.fr built!');
    }
  });
