const Ticket = require("../src/models/tickets.js");

const generateTicketId = async () => {
    const lastTicket = await Ticket.findOne()
        .sort({ created_at: -1 });

    let number = 1;

    if (lastTicket) {
        number = parseInt(lastTicket.ticketId.split("-")[1]) + 1;
    }

    return `TKT-${String(number).padStart(3, "0")}`;
};

module.exports = generateTicketId;