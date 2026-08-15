const express = require("express")
const router = express.Router();
const { createTickets, getTickets, getTicketsId, updateTicketsId } = require('../controllers/ticket.js');
const { validateTicket, validateUpdateTicket } = require("../../middleware.js");
router.post('/',validateTicket, createTickets);
router.get('/', getTickets);
router.get('/:ticketId', getTicketsId);
router.put("/:ticketId", validateUpdateTicket, updateTicketsId);

module.exports = router;
