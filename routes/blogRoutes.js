const express = require('express');
const router = express.Router();

// query route
router.get('/search', (req, res) => {
    const { author, tag } = req.query;
    res.send(`<h2>Searching for posts by ${author}, tagged with ${tag}.</h2>`)
})

// search route

router.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    res.send(`<h2>Blog post: ${slug}.</h2>`)
})

module.exports = router;

