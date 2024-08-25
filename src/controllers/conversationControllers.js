const catchAsync = require('../utils/catchAsync.js');
const AppError = require("../utils/appErrors.js");
const {db} = require('../db/db_connection.js');
const { eq, arrayContains } = require('drizzle-orm');
const { message, conversations, users } = require("../db/schema/schema.js");

// Get a specific conversation by ID
exports.getConversation = catchAsync(async function (req, res, next) {
    const { conversationId } = req.params;

    // Fetch the conversation by ID
    const conversation = (await db.select().from(conversations).where(eq(conversations.id, conversationId)))[0];

    if (!conversation) {
        return next(new AppError("No conversation with the corresponding ID was found", 404));
    }

    res.status(200).json({
        data: {
            conversation
        }
    });
});

// Get all conversations for a specific user
exports.getConversationAll = catchAsync(async function (req, res, next) {
    const { userId } = req.params;

    // Check if the user exists
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];

    if (!user) {
        return next(new AppError("User does not exist in the database", 400));
    }

    // Fetch all conversations where the user is a participant
    const conversationsAll = await db.select().from(conversations).where(arrayContains(conversations.participantsId, userId));

    res.status(200).json({
        length: conversationsAll.length,
        data: {
            conversations: conversationsAll
        }
    });
});
