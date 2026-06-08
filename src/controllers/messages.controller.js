const { User, Post, Image, Interest, Message } = require("../models");

exports.index = async (req, res) => {
  //LISTA DE MENSAJES POR INTEREST
  try {
    const userId = req.session.user.id;
    const interest = await Interest.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Image,
          include: [
            {
              model: Post,
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "email"],
                },
              ],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    const filteredInterests = interest.filter((interest) => {
      const interestedUserId = interest.User.id;
      const authorId = interest.Image.Post.user_id;
      return interestedUserId === userId || authorId === userId; //SI  //SOY QUIEN MARCO EL INTEREST
    }); //SOY EL DUEÑO DE LA FOTO


    res.render("messages/index", {
      interests: filteredInterests
    });
    return;
  } catch (error) {
    console.error(error);
    res.render("messages/index", {
      interests: [],
      error: "no se pudieron cargar las conversaciones",
    });
    return;
  }
};
exports.conversation = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const interestId = req.params.interestId;

    const interest = await Interest.findByPk(interestId, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Image,
          include: [
            {
              model: Post,
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "email"],
                },
              ],
            },
          ],
        },
        {
          model: Message,
          include: [
            {
              model: User,
              as: "sender", //QUIEN ENVIO EL MENSAJE
              attributes: ["id", "name"],
            },
            {
              model: User,
              as: "receiver", //QUIEN RECIBIO EL MENSAJE
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [[Message, "created_at", "ASC"]],
    });
    if (!interest) {
      res.redirect("/messages");
      return;
    }
    const interestedUserId = interest.user_id;
    const authorId = interest.Image.Post.user_id;

    if (userId !== interestedUserId && authorId !== userId) {
      res.redirect("/messages");
      return;
    }
    await Message.update(
      {
        read: true,
      },
      {
        where: {
          interest_id: interest.id,
          receiver_id: userId,
          read: false,
        },
      },
    );
    res.render("messages/conversation", {
      interest,
    });
    return;
  } catch (error) {
    console.error(error);
    res.redirect("/messages");
    return;
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const interestId = req.params.interestId;
    const { content } = req.body;
    if (!content) {
      res.redirect(`/messages/interests/${interestId}`);
      return;
    }
    const interest = await Interest.findByPk(interestId, {
      include: [
        {
          model: Image,
          include: [
            {
              model: Post,
            },
          ],
        },
      ],
    });
    if (!interest) {
      res.redirect("/messages");
      return;
    }
    const interestedUserId = interest.user_id;
    const authorId = interest.Image.Post.user_id;

    if (interestedUserId !== userId && authorId !== userId) {
      res.redirect("/messages");
      return;
    }

    let receiverId; //determina a quien va dirigido el menssaje
    if (userId === interestedUserId) {
      receiverId = authorId;
    } else {
      receiverId = interestedUserId;
    }
    await Message.create({
      interest_id: interest.id,
      sender_id: userId,
      receiver_id: receiverId,
      content: content.trim(),
    });
    res.redirect(`/messages/interests/${interest.id}`);
  } catch (error) {
    console.error(error);

    res.redirect("/messages");
    return;
  }
};
