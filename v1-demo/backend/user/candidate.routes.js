const express = require('express');
const router = express.Router();
const candidateController = require('./candidate.controller');

router.post('/', candidateController.submitCandidate);
router.get('/:id', candidateController.getCandidateDetails);

module.exports = router;
