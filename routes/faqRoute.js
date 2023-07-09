const router = require('express').Router();
const {getAllFaqs,createFaq, updateFaq, deleteFaq} = require('../controllers/faqController');

router.get('/get-faqs', getAllFaqs)
router.post('/create-faq', createFaq )
router.put('/update-faq', updateFaq)
router.delete('/delete-faq/:faq_id', deleteFaq)


module.exports = router