const express = require("express")
const router = express.Router();
const { createTickets, getTickets, getTicketsId, updateTicketsId } = require('../controllers/ticket.js');
const { validateTicket, validateUpdateTicket, isLoggedIn, isAdmin } = require("../../middleware.js");
router.post('/',isLoggedIn,validateTicket, createTickets);
router.get('/',isLoggedIn, getTickets);
router.get('/:ticketId',isLoggedIn, getTicketsId);
router.put("/:ticketId",isLoggedIn, validateUpdateTicket, updateTicketsId);

module.exports = router;
