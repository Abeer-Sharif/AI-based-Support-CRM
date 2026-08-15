const Ticket = require("../models/tickets.js");
const Note = require("../models/notes.js");
const { triageTicket, FALLBACK_TRIAGE } = require("../services/aiTriage.js");

const generateTicketId = require("../../utils/ticketId");

module.exports.createTickets = async (req, res) => {
    try {
        const ticketId = await generateTicketId();
        const { customer_name, customer_email, subject, description } = req.body;
        let triage = FALLBACK_TRIAGE;

        try {
            triage = await triageTicket(subject, description);
        } catch (err) {
            console.error("AI triage failed; using fallback values:", err.message);
        }

        const newTicket = new Ticket({
            ticketId: ticketId,
            customerName: customer_name,
            customerEmail: customer_email,
            subject: subject,
            description: description,
            ...triage
        });
        await newTicket.save();
        res.status(201).json({
            ticket_id: newTicket.ticketId,
            created_at: newTicket.created_at,
            category: newTicket.category,
            priority: newTicket.priority,
            sentiment: newTicket.sentiment
        });

    } catch (err) {
        console.error("error creating ticket", err);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

module.exports.getTickets = async (req, res) => {
    try {
        const { status, search } = req.query;
        const filters = {};

        if (status) filters.status = status;
        if (search) {
            const searchPattern = new RegExp(search, "i");
            filters.$or = [
                { ticketId: searchPattern },
                { customerName: searchPattern },
                { customerEmail: searchPattern },
                { subject: searchPattern },
                { description: searchPattern }
            ];
        }

        const tickets = await Ticket.find(filters).sort({ created_at: -1 });
        
        const result = tickets.map(ticket => ({
            ticket_id: ticket.ticketId,
            customer_name: ticket.customerName,
            customer_email: ticket.customerEmail,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            category: ticket.category,
            priority: ticket.priority,
            sentiment: ticket.sentiment,
            created_at: ticket.created_at
        }));

        res.status(201).json(result);
    } catch (err) {
        console.error("Error finding the ticket.", err);

        res.status(500).json({
            message: "Internal server error"
        })
    }
};

module.exports.getTicketsId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findOne({ticketId})
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }
        const notes = await Note.find({ ticketId });

           res.status(200).json({
            ticket_id: ticket.ticketId,
            customer_name: ticket.customerName,
            customer_email: ticket.customerEmail,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            category: ticket.category,
            priority: ticket.priority,
            sentiment: ticket.sentiment,
            notes: notes
        });
    } catch (err) {
        console.error("Error finding the ticket.", err);

        res.status(500).json({
            message: "Internal server error"
        })
    }
};

module.exports.updateTicketsId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, notes } = req.body;
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        };
        
        if (status) {
            ticket.status = status;
        }
        await ticket.save();

        if (notes) {
            await Note.create({
                ticketId: ticketId,
                noteText: notes
            });
        }

        res.status(200).json({
            success: true,
            updatedAt: ticket.updated_at,
            category: ticket.category,
            priority: ticket.priority,
            sentiment: ticket.sentiment
        })

    } catch (err) {
        console.error("Error updating the ticket.", err);

        res.status(500).json({
            message: "Internal server error"
        })
    }
};
