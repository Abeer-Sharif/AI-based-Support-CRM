const Ticket = require("../models/tickets.js");
const Note = require("../models/notes.js");
const User = require("../models/user.js");

const {
    triageTicket,
    FALLBACK_TRIAGE
} = require("../services/aiTriage.js");

const generateTicketId = require("../../utils/ticketId");


// ======================================================
// CREATE TICKET
// ======================================================

module.exports.createTickets = async (req, res) => {
    try {
        const ticketId = await generateTicketId();

        const {
            customer_name,
            customer_email,
            subject,
            description
        } = req.body;

        let triage = FALLBACK_TRIAGE;

        try {
            triage = await triageTicket(
                subject,
                description
            );
        } catch (err) {
            console.error(
                "AI triage failed; using fallback values:",
                err.message
            );
        }


        // Map AI category to support team
        const categoryToTeam = {
            Billing: "Billing",
            Technical: "Technical",
            Account: "Account",
            Shipping: "Shipping",
            Product: "Product",
            Other: "General"
        };


        const newTicket = new Ticket({
            ticketId,

            customerName: customer_name,
            customerEmail: customer_email,

            subject,
            description,

            // category, priority, sentiment
            ...triage,

            team:
                categoryToTeam[triage.category] ||
                "General",

            // User who created the ticket
            createdBy: req.user.userId
        });


        await newTicket.save();


        res.status(201).json({
            ticket_id: newTicket.ticketId,
            created_at: newTicket.created_at,

            category: newTicket.category,
            priority: newTicket.priority,
            sentiment: newTicket.sentiment,

            team: newTicket.team,

            assignedTo: newTicket.assignedTo,

            createdBy: newTicket.createdBy
        });

    } catch (err) {
        console.error(
            "Error creating ticket:",
            err
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};



// ======================================================
// GET ALL TICKETS
// ======================================================

module.exports.getTickets = async (req, res) => {
    try {
        const {
            status,
            search
        } = req.query;


        /*
            We use an array because we may have several
            conditions:

            1. Agent access
            2. Status filtering
            3. Search filtering

            These conditions will be combined using $and.
        */

        const conditions = [];


        // --------------------------------------------------
        // AGENT ACCESS CONTROL
        // --------------------------------------------------

        if (req.user.role === "agent") {
            conditions.push({
                $or: [
                    {
                        assignedTo:
                            req.user.userId
                    },
                    {
                        createdBy:
                            req.user.userId
                    }
                ]
            });
        }


        // --------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------

        if (status) {
            conditions.push({
                status
            });
        }


        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        if (search) {
            const searchPattern =
                new RegExp(search, "i");

            conditions.push({
                $or: [
                    {
                        ticketId:
                            searchPattern
                    },
                    {
                        customerName:
                            searchPattern
                    },
                    {
                        customerEmail:
                            searchPattern
                    },
                    {
                        subject:
                            searchPattern
                    },
                    {
                        description:
                            searchPattern
                    }
                ]
            });
        }


        // --------------------------------------------------
        // CREATE FINAL MONGODB FILTER
        // --------------------------------------------------

        const filters =
            conditions.length > 0
                ? {
                    $and: conditions
                }
                : {};


        const tickets = await Ticket.find(filters)

            .populate(
                "assignedTo",
                "name email role team"
            )

            .populate(
                "createdBy",
                "name email role team"
            )

            .sort({
                created_at: -1
            });


        // --------------------------------------------------
        // FORMAT RESPONSE
        // --------------------------------------------------

        const result = tickets.map(
            (ticket) => ({
                ticket_id:
                    ticket.ticketId,

                customer_name:
                    ticket.customerName,

                customer_email:
                    ticket.customerEmail,

                subject:
                    ticket.subject,

                description:
                    ticket.description,

                status:
                    ticket.status,

                category:
                    ticket.category,

                priority:
                    ticket.priority,

                sentiment:
                    ticket.sentiment,

                team:
                    ticket.team,


                assignedTo:
                    ticket.assignedTo
                        ? {
                            _id:
                                ticket
                                    .assignedTo
                                    ._id,

                            name:
                                ticket
                                    .assignedTo
                                    .name,

                            email:
                                ticket
                                    .assignedTo
                                    .email,

                            team:
                                ticket
                                    .assignedTo
                                    .team
                        }
                        : null,


                createdBy:
                    ticket.createdBy
                        ? {
                            _id:
                                ticket
                                    .createdBy
                                    ._id,

                            name:
                                ticket
                                    .createdBy
                                    .name,

                            email:
                                ticket
                                    .createdBy
                                    .email
                        }
                        : null,


                created_at:
                    ticket.created_at,

                updated_at:
                    ticket.updated_at
            })
        );


        res.status(200).json(result);

    } catch (err) {
        console.error(
            "Error finding tickets:",
            err
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};



// ======================================================
// GET ONE TICKET
// ======================================================

module.exports.getTicketsId = async (
    req,
    res
) => {
    try {
        const {
            ticketId
        } = req.params;


        const filter = {
            ticketId
        };


        // Agent can open tickets:
        // 1. assigned to them
        // 2. created by them

        if (req.user.role === "agent") {
            filter.$or = [
                {
                    assignedTo:
                        req.user.userId
                },
                {
                    createdBy:
                        req.user.userId
                }
            ];
        }


        const ticket =
            await Ticket.findOne(filter)

                .populate(
                    "assignedTo",
                    "name email role team"
                )

                .populate(
                    "createdBy",
                    "name email role team"
                );


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        const notes = await Note.find({
            ticketId
        }).sort({
            created_at: -1
        });


        res.status(200).json({
            ticket_id:
                ticket.ticketId,

            customer_name:
                ticket.customerName,

            customer_email:
                ticket.customerEmail,

            subject:
                ticket.subject,

            description:
                ticket.description,

            status:
                ticket.status,

            category:
                ticket.category,

            priority:
                ticket.priority,

            sentiment:
                ticket.sentiment,

            team:
                ticket.team,


            assignedTo:
                ticket.assignedTo
                    ? {
                        _id:
                            ticket
                                .assignedTo
                                ._id,

                        name:
                            ticket
                                .assignedTo
                                .name,

                        email:
                            ticket
                                .assignedTo
                                .email,

                        team:
                            ticket
                                .assignedTo
                                .team
                    }
                    : null,


            createdBy:
                ticket.createdBy
                    ? {
                        _id:
                            ticket
                                .createdBy
                                ._id,

                        name:
                            ticket
                                .createdBy
                                .name,

                        email:
                            ticket
                                .createdBy
                                .email
                    }
                    : null,


            created_at:
                ticket.created_at,

            updated_at:
                ticket.updated_at,

            notes
        });

    } catch (err) {
        console.error(
            "Error finding ticket:",
            err
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};



// ======================================================
// UPDATE TICKET
// ======================================================

module.exports.updateTicketsId = async (
    req,
    res
) => {
    try {
        const {
            ticketId
        } = req.params;


        const {
            status,
            assignedTo,
            notes
        } = req.body;


        const filter = {
            ticketId
        };


        // Agent can update tickets:
        // 1. assigned to them
        // 2. created by them

        if (req.user.role === "agent") {
            filter.$or = [
                {
                    assignedTo:
                        req.user.userId
                },
                {
                    createdBy:
                        req.user.userId
                }
            ];
        }


        const ticket =
            await Ticket.findOne(filter);


        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }


        // ==================================================
        // ASSIGN AGENT
        // ==================================================

        if (assignedTo) {

            // Only admin can assign
            if (
                req.user.role !== "admin"
            ) {
                return res
                    .status(403)
                    .json({
                        message:
                            "Only admins can assign tickets"
                    });
            }


            // Find selected agent
            const agent =
                await User.findById(
                    assignedTo
                );


            if (!agent) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Agent not found"
                    });
            }


            // Selected user must actually be an agent
            if (
                agent.role !== "agent"
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Ticket can only be assigned to an agent"
                    });
            }


            // Agent must belong to same team
            if (
                agent.team !== ticket.team
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Agent must belong to the same team as the ticket"
                    });
            }


            ticket.assignedTo =
                agent._id;
        }


        // ==================================================
        // STATUS UPDATE
        // ==================================================

        if (status) {
            ticket.status = status;
        }


        await ticket.save();


        // ==================================================
        // ADD NOTE
        // ==================================================

        if (
            notes &&
            notes.trim()
        ) {
            await Note.create({
                ticketId:
                    ticket.ticketId,

                noteText:
                    notes.trim()
            });
        }


        res.status(200).json({
            success: true,

            message:
                "Ticket updated successfully",

            updated_at:
                ticket.updated_at,

            category:
                ticket.category,

            priority:
                ticket.priority,

            sentiment:
                ticket.sentiment,

            team:
                ticket.team,

            assignedTo:
                ticket.assignedTo,

            status:
                ticket.status
        });

    } catch (err) {
        console.error(
            "Error updating ticket:",
            err
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};