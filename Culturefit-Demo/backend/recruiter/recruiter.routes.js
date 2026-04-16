const express = require('express');
const router = express.Router();
const recruiterController = require('./recruiter.controller');

router.post('/', recruiterController.createRecruiter);
router.put('/:id', recruiterController.updateBenchmarks);
router.get('/:recruiterId/candidates', recruiterController.getRecruiterCandidates);
router.get('/:recruiterId/preview', recruiterController.previewCandidates);
router.post('/:recruiterId/lock', recruiterController.lockCandidates);

module.exports = router;
